// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Swal from 'sweetalert2';

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

  // Check if the user is trying to access a car detail page
  if (pathname.startsWith('/cars/')) {
    // Check if the userId cookie is present
    const userId = req.cookies.get('userId');

    // If no userId, redirect to the appropriate page
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Login to Rent a Car"
      });
      return NextResponse.redirect(new URL('/login', req.url)); // Adjust the URL as necessary
    }
  }

  // If everything is okay, allow the request to continue
  return NextResponse.next();
}

// Specify which paths should trigger the middleware 
export const config = {
  matcher: ['/admin/dashboard/:path*', '/cars/:path*'], // Protects both /admin/dashboard and /cars routes
};
