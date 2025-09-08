import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/oauth/meta',
    '/api/oauth/telegram',
    '/marketing',
    '/privacy',
    '/terms',
    '/auth/sign-in(.*)',
    '/auth/sign-up(.*)'
  ],
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/auth/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // If user is signed in and the route is /, redirect to /dashboard
    if (auth.userId && req.nextUrl.pathname === '/') {
      const dashboardUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(dashboardUrl);
    }
    
    return NextResponse.next();
  }
});

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};