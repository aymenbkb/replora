import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.pathname;
  const { userId } = await auth();

  // Protect /dashboard and sub-routes
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Redirect authenticated users away from auth routes to approval flow first
  if (userId && (url.startsWith("/auth/sign-in") || url.startsWith("/auth/sign-up"))) {
    return NextResponse.redirect(new URL("/auth/approval", req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};