import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get("platform") || "instagram"; // instagram | facebook

  const clientId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI; // e.g. https://yourdomain.com/api/oauth/meta/callback

  if (!clientId || !redirectUri) {
    return NextResponse.json({ ok: false, error: "Missing META_APP_ID or META_REDIRECT_URI" }, { status: 500 });
  }

  const scopes = [
    "pages_show_list",
    "pages_manage_metadata",
    "pages_read_engagement",
    "pages_messaging",
    "instagram_basic",
    "instagram_manage_messages",
    "instagram_manage_comments",
  ].join(",");

  const state = platform; // simple state to carry chosen platform

  const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
