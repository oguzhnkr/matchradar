import { NextResponse } from "next/server";
import { getLeagues } from "@/lib/api-football";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return NextResponse.json(
      {
        error: "API key is not configured. Please set the API_FOOTBALL_KEY environment variable.",
        code: "API_KEY_MISSING",
      },
      { status: 503 }
    );
  }

  try {
    const leagues = await getLeagues();
    return NextResponse.json(
      { source: "api", data: leagues },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leagues";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
