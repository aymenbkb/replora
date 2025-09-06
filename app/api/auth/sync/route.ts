import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  // Do something with body...
  return NextResponse.json({ ok: true, data: body });
}

