import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/products', '/cart', '/orders', '/profile'];

const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const accessToken = request.cookies.get('access_token')?.value;
  const hasToken = !!accessToken;
  
  if (pathname === '/') {
    if (!hasToken) {
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
    return NextResponse.redirect(new URL('/products', request.url));
  }
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (hasToken) {
      const redirect = request.nextUrl.searchParams.get('redirect');
      if (redirect) {
        return NextResponse.redirect(new URL(redirect, request.url));
      }
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
};

