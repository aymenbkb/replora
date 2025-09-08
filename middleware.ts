import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  // get auth session
  const session = await auth();
  const { userId } = session;

  const url = req.nextUrl;
  const pathname = url.pathname;

  // Protect /dashboard and sub-routes
  if (pathname.startsWith("/dashboard") && !userId) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Redirect authenticated users away from auth routes to approval flow first
  if (
    userId &&
    (pathname.startsWith("/auth/sign-in") ||
      pathname.startsWith("/auth/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/auth/approval", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all paths except for:
    // 1. /api routes
    // 2. /_next (Next.js internals)
    // 3. /_static (inside /public)
    // 4. /_vercel (Vercel internals)
    // 5. Static files
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\..*).*)",
  ],
};
