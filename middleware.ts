import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // ✅ Allow OAuth callback routes without auth
  if (
    pathname.startsWith("/api/oauth/meta") ||
    pathname.startsWith("/api/oauth/telegram") ||
    pathname.startsWith("/marketing") ||
    pathname === "/privacy" ||
    pathname === "/terms"
  ) {
    return NextResponse.next();
  }

  // ✅ Protect dashboard
  if (pathname.startsWith("/dashboard") && !userId) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/|_static/|_vercel|[\\w-]+\\..*).*)",
  ],
};
