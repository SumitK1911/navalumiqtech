import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the admin login page through — no token required
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: authSecret,
    secureCookie: false,
  });

  // Not logged in → go to admin login
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Logged in but not an admin → go to admin login
  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
