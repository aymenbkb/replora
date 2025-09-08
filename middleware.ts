import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware
export default clerkMiddleware(async (auth, req) => {
    const session = await auth();
    const { userId } = session;
  
    const url = req.nextUrl;
    const pathname = url.pathname;
  
    if (pathname.startsWith("/dashboard") && !userId) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
  
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
