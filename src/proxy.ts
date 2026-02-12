import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyAdminSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const session = await verifyAdminSession(sessionCookie.value);
    if (!session) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url),
      );
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    return NextResponse.next();
  }

  // Protect /api/image (admin-only upload)
  if (pathname === "/api/image") {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await verifyAdminSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/image"],
};
