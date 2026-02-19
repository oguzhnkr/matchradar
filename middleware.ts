import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/token";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");

  if (!sessionCookie?.value) {
    return redirectToLogin(request);
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return redirectToLogin(request);
  }

  const payload = await verifyToken(sessionCookie.value, secret);
  if (!payload) {
    return redirectToLogin(request);
  }

  if (payload.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
