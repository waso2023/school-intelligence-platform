import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "./lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionToken ? await verifySessionToken(sessionToken) : null;

  // 1. If visiting /login while already authenticated, redirect to /dashboard
  if (pathname === "/login" || pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. Protect authenticated SaaS routes
  const protectedPaths = [
    "/dashboard",
    "/students",
    "/finance",
    "/communication",
    "/administration",
    "/intelligence",
    "/settings",
  ];

  const isProtected = protectedPaths.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (isProtected) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Set request headers for downstream server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.userId);
    requestHeaders.set("x-user-role", session.role);
    requestHeaders.set("x-school-id", session.schoolId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/students/:path*",
    "/finance/:path*",
    "/communication/:path*",
    "/administration/:path*",
    "/intelligence/:path*",
    "/settings/:path*",
  ],
};
