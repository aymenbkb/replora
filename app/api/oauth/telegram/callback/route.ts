import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// Placeholder callback for Telegram. In a real flow, you'd verify a login payload
// or complete a bot authentication/setup and then store credentials.
export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect(new URL("/auth/sign-in", request.url));

  const botName = process.env.TELEGRAM_BOT_NAME;
  const botToken = process.env.TELEGRAM_BOT_TOKEN; // Keep this safe; consider storing encrypted

  if (!botName || !botToken) {
    return NextResponse.redirect(new URL(`/auth/approval?error=${encodeURIComponent("Missing TELEGRAM_BOT_NAME/TELEGRAM_BOT_TOKEN")}`, request.url));
  }

  // Upsert User and Page with Telegram bot as a "page"
  try {
    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId },
    });

    await db.page.upsert({
      where: { pageExternalId: botName },
      update: {
        userId: user.id,
        platform: "telegram",
        pageName: botName,
        accessToken: botToken,
      },
      create: {
        userId: user.id,
        platform: "telegram",
        pageName: botName,
        pageExternalId: botName,
        accessToken: botToken,
      },
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("/api/oauth/telegram/callback error", msg);
    return NextResponse.redirect(new URL(`/auth/approval?error=${encodeURIComponent(msg)}`, request.url));
  }
}
