import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'drelix-admin-session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes, but allow /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verify JWT
      const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD ?? '');
      await jwtVerify(sessionCookie.value, secret);
      return NextResponse.next();
    } catch (error) {
      console.error('Admin session verification failed:', error);
      // Invalid or expired session
      const response = NextResponse.redirect(
        new URL('/admin/login', request.url)
      );
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

// Match all admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
