import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie?.value) {
    return NextResponse.json({ user: null });
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyToken(sessionCookie.value, secret);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    },
  });
}
