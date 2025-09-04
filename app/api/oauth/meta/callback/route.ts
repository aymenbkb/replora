import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const FB_API = "https://graph.facebook.com/v19.0";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "instagram";

  const clientId = process.env.META_APP_ID;
  const clientSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { ok: false, error: "Missing META_APP_ID/META_APP_SECRET/META_REDIRECT_URI" },
      { status: 500 }
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/auth/approval?error=missing_code`, request.url));
  }

  try {
    // 1) Exchange code for short-lived user access token
    const tokenRes = await fetch(
      `${FB_API}/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&client_secret=${clientSecret}&code=${encodeURIComponent(code)}`
    );
    const tokenJson: any = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(tokenJson.error?.message || "Token exchange failed");

    const userAccessToken = tokenJson.access_token as string;

    // 2) Exchange for long-lived token
    const longTokenRes = await fetch(
      `${FB_API}/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${userAccessToken}`
    );
    const longTokenJson: any = await longTokenRes.json();
    const longUserToken = longTokenJson.access_token || userAccessToken;
    const expiresIn = longTokenJson.expires_in; // in seconds

    // Compute expiry date
    const tokenExpiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

    // 3) Get Pages the user manages
    const pagesRes = await fetch(
      `${FB_API}/me/accounts?access_token=${encodeURIComponent(longUserToken)}`
    );
    const pagesJson: any = await pagesRes.json();
    if (!pagesRes.ok) throw new Error(pagesJson.error?.message || "Failed to fetch pages");

    const pages: Array<{ id: string; name: string; access_token?: string }> = pagesJson.data || [];

    // Ensure user exists in DB
    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId },
    });

    // 4) Store Facebook Pages + Instagram Accounts
    for (const p of pages) {
      if (!p.access_token) continue;

      // Exchange page token for long-lived token as well
      const longPageTokenRes = await fetch(
        `${FB_API}/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${p.access_token}`
      );
      const longPageTokenJson: any = await longPageTokenRes.json();
      const pageToken = longPageTokenJson.access_token || p.access_token;
      const pageExpiresIn = longPageTokenJson.expires_in;
      const pageTokenExpiresAt = pageExpiresIn
        ? new Date(Date.now() + pageExpiresIn * 1000)
        : null;

      // Save Facebook Page
      await db.page.upsert({
        where: { pageExternalId: p.id },
        update: {
          userId: user.id,
          platform: "facebook",
          pageName: p.name,
          accessToken: pageToken,
          tokenExpiresAt: pageTokenExpiresAt,
        },
        create: {
          userId: user.id,
          platform: "facebook",
          pageName: p.name,
          pageExternalId: p.id,
          accessToken: pageToken,
          tokenExpiresAt: pageTokenExpiresAt,
        },
      });

      // Try to link Instagram business account
      try {
        const igRes = await fetch(
          `${FB_API}/${p.id}?fields=instagram_business_account&access_token=${encodeURIComponent(
            pageToken
          )}`
        );
        const igJson: any = await igRes.json();
        const igId: string | undefined = igJson?.instagram_business_account?.id;
        if (igId) {
          const igUserRes = await fetch(
            `${FB_API}/${igId}?fields=username,name&access_token=${encodeURIComponent(pageToken)}`
          );
          const igUserJson: any = await igUserRes.json();
          const igName = igUserJson?.username || igUserJson?.name || "Instagram Account";

          await db.page.upsert({
            where: { pageExternalId: igId },
            update: {
              userId: user.id,
              platform: "instagram",
              pageName: igName,
              accessToken: pageToken,
              tokenExpiresAt: pageTokenExpiresAt,
            },
            create: {
              userId: user.id,
              platform: "instagram",
              pageName: igName,
              pageExternalId: igId,
              accessToken: pageToken,
              tokenExpiresAt: pageTokenExpiresAt,
            },
          });
        }
      } catch (e) {
        console.warn("IG lookup failed for page", p.id, e);
      }
    }

    // Done — redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("/api/oauth/meta/callback error", msg);
    return NextResponse.redirect(
      new URL(`/auth/approval?error=${encodeURIComponent(msg)}`, request.url)
    );
  }
}
