import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const API_KEY = process.env.API_FOOTBALL_KEY;
  const API_HOST = process.env.API_FOOTBALL_HOST;

  const hasKey = !!API_KEY;
  const host = API_HOST || null;
  const mode = hasKey ? "api" : "dummy";

  return NextResponse.json(
    { hasKey, host, mode },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
