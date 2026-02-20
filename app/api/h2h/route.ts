import { NextRequest, NextResponse } from "next/server";
import { getHeadToHead } from "@/lib/api-football";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const team1 = searchParams.get("team1");
  const team2 = searchParams.get("team2");

  if (!team1 || !team2) {
    return NextResponse.json(
      { error: "team1 and team2 parameters are required" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.API_FOOTBALL_KEY;
  const API_HOST = process.env.API_FOOTBALL_HOST;

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
    const matches = await getHeadToHead(
      Number(team1),
      Number(team2),
      API_KEY,
      API_HOST || ""
    );
    return NextResponse.json(
      { source: "api", data: matches },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch head-to-head";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
