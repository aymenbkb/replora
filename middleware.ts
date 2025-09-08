import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !userId) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  runtime: 'nodejs',
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\..*).*)",
  ],
};