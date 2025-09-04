import { NextResponse } from "next/server";

export async function GET() {
  const botName = process.env.TELEGRAM_BOT_NAME; // e.g. my_bot
  if (!botName) {
    return NextResponse.json({ ok: false, error: "Missing TELEGRAM_BOT_NAME" }, { status: 500 });
  }

  // Placeholder: redirect to Telegram bot deep link. In production, implement Telegram Login Widget flow.
  const deepLink = `https://t.me/${botName}?start=connect`;
  return NextResponse.redirect(deepLink);
}
