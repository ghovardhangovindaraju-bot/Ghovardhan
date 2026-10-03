import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'erp_session';
const PUBLIC_PATHS = ['/login', '/favicon.ico'];
const PROTECTED_PREFIXES = ['/procurement', '/pricing', '/stock', '/payables', '/bank', '/gl', '/compliance', '/omj', '/mail'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api/login') || pathname.startsWith('/api/logout')) {
    return NextResponse.next();
  }

  if (pathname === '/login') {
    if (request.cookies.get(SESSION_COOKIE)?.value === 'active') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isProtectedAppRoute = pathname === '/' || PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === 'active';

  if (!isPublicPath && isProtectedAppRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/procurement/:path*',
    '/pricing',
    '/stock',
    '/payables/:path*',
    '/bank',
    '/gl',
    '/compliance',
    '/omj',
    '/mail',
  ],
};