import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hashPassword } from "@/lib/auth/password";
import { createToken } from "@/lib/auth/token";

const ADMIN_EMAIL = "oguzhnkr@gmail.com";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre gerekli" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext();
    const db = env.DB;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(normalizedEmail)
      .first();

    if (existing) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const role = normalizedEmail === ADMIN_EMAIL ? "admin" : "user";

    await db
      .prepare(
        "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)"
      )
      .bind(id, normalizedEmail, passwordHash, role)
      .run();

    const token = await createToken(
      { sub: id, email: normalizedEmail, role },
      env.AUTH_SECRET
    );

    const response = NextResponse.json({ ok: true, role });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
