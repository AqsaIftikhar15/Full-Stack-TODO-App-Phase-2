import { NextRequest, NextResponse } from 'next/server';

// Middleware to protect authenticated routes
export function middleware(request: NextRequest) {
  // Define protected routes that require authentication
  const protectedPaths = ['/tasks', '/profile'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Check if user is authenticated by looking for auth token
  // In a real implementation, this would validate the JWT token
  const token = request.cookies.get('auth_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and tries to access auth pages, redirect to tasks
  const authPaths = ['/login', '/signup'];
  const isAuthPath = authPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPath && token) {
    // Don't redirect during API calls to avoid infinite loops
    if (!request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/tasks', request.url));
    }
  }

  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};