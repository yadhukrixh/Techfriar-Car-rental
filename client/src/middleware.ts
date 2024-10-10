// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Get the current path
  const { pathname } = req.nextUrl;

  // Check if the user is trying to access the admin dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    // Check if the adminToken is present in cookies
    const adminToken = req.cookies.get('adminToken');

    // If no token, redirect to the login page
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // If everything is okay, allow the request to continue
  return NextResponse.next();
}

// Specify which paths should trigger the middleware 
export const config = {
  matcher: ['/admin/dashboard/:path*'], // Protects the /admin/dashboard route
};
