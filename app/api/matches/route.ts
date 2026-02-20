import { NextRequest, NextResponse } from "next/server";
import { getTeamMatches } from "@/lib/api-football";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team");

  if (!team) {
    return NextResponse.json(
      { error: "team parameter is required" },
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
    const matches = await getTeamMatches(
      Number(team),
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
      error instanceof Error ? error.message : "Failed to fetch matches";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
