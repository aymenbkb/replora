import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((auth, request) => {
  const { pathname } = request.nextUrl;

  // Define public routes
  const publicRoutes = [
    '/',
    '/api/oauth/meta',
    '/api/oauth/telegram',
    '/marketing',
    '/privacy',
    '/terms',
    '/auth/sign-in',
    '/auth/sign-up'
  ];

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, let Clerk handle it automatically
  // Clerk will redirect to sign-in if user is not authenticated
  return NextResponse.next();
});

export const config = {
    runtime: 'nodejs',
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};