import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin'];
// Routes that require admin/executive role
const adminRoutes = ['/admin'];
// Routes accessible only when NOT logged in
const authRoutes = ['/login', '/register', '/verify-email'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('auth-token')?.value;
  const role = request.cookies.get('auth-role')?.value;
  const isAuthenticated = !!token;

  // Auth routes (login, register) — redirect to appropriate dashboard if already logged in
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      if (role === 'ADMIN' || role === 'EXECUTIVE') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Admin routes — require auth + ADMIN/EXECUTIVE role
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'ADMIN' && role !== 'EXECUTIVE') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Dashboard routes — require auth; redirect admin/executive to /admin
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Admin/Executive users accessing /dashboard should go to /admin
    if (pathname.startsWith('/dashboard') && (role === 'ADMIN' || role === 'EXECUTIVE')) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/verify-email',
  ],
};
