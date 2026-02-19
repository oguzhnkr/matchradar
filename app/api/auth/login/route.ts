import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyPassword } from "@/lib/auth/password";
import { createToken } from "@/lib/auth/token";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre gerekli" },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext();
    const db = env.DB;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await db
      .prepare(
        "SELECT id, email, password_hash, role FROM users WHERE email = ?"
      )
      .bind(normalizedEmail)
      .first<{
        id: string;
        email: string;
        password_hash: string;
        role: string;
      }>();

    if (!user) {
      return NextResponse.json(
        { error: "Email veya şifre hatalı" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Email veya şifre hatalı" },
        { status: 401 }
      );
    }

    const token = await createToken(
      { sub: user.id, email: user.email, role: user.role },
      env.AUTH_SECRET
    );

    const response = NextResponse.json({ ok: true, role: user.role });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Giriş sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
