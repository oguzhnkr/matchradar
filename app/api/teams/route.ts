import { NextRequest, NextResponse } from "next/server";
import { getTeams, getAllTeams } from "@/lib/api-football";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  const season = searchParams.get("season") || "2024";

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

  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };

  // No league → return ALL teams from every supported league
  if (!league) {
    try {
      const teams = await getAllTeams(Number(season), API_KEY, API_HOST || "");
      return NextResponse.json({ source: "api", data: teams }, { headers });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch teams";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // With league → return that league's teams
  try {
    const teams = await getTeams(
      Number(league),
      Number(season),
      API_KEY,
      API_HOST || ""
    );
    return NextResponse.json({ source: "api", data: teams }, { headers });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch teams";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
