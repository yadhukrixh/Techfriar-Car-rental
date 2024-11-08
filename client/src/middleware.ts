// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the user is trying to access the admin dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    const adminToken = req.cookies.get('adminToken');
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // Check if the user is trying to access a car detail page
  if (pathname.startsWith('/cars/') || pathname.startsWith('/dashboard')) {
    const userId = req.cookies.get('userId');
    if (!userId) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('loginRequired', 'true'); // Add alert flag
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/cars/:path*','/dashboard/:path*'],
};
