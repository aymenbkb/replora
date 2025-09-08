import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/oauth/meta(.*)',
  '/api/oauth/telegram(.*)',
  '/marketing(.*)',
  '/privacy',
  '/terms',
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes to pass through
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // For protected routes, check auth manually
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};