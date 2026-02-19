import { NextRequest, NextResponse } from "next/server";
import { getTeams, getAllTeams } from "@/lib/api-football";
import { DEMO_TEAMS, getAllDemoTeams } from "@/lib/demo-data";

export const runtime = "edge";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const league = searchParams.get("league");
  const season = searchParams.get("season") || "2024";

  // No league → return ALL teams from every supported league
  if (!league) {
    if (!process.env.API_FOOTBALL_KEY) {
      return NextResponse.json(
        { source: "dummy", data: getAllDemoTeams() },
        { headers: NO_CACHE }
      );
    }

    try {
      const teams = await getAllTeams(Number(season));
      return NextResponse.json(
        { source: "api", data: teams },
        { headers: NO_CACHE }
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch teams";
      return NextResponse.json(
        { source: "dummy", data: getAllDemoTeams(), error: message },
        { headers: NO_CACHE }
      );
    }
  }

  // With league → return that league's teams
  if (!process.env.API_FOOTBALL_KEY) {
    const teams = DEMO_TEAMS[Number(league)] || [];
    return NextResponse.json(
      { source: "dummy", data: teams },
      { headers: NO_CACHE }
    );
  }

  try {
    const teams = await getTeams(Number(league), Number(season));
    return NextResponse.json(
      { source: "api", data: teams },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch teams";
    const teams = DEMO_TEAMS[Number(league)] || [];
    return NextResponse.json(
      { source: "dummy", data: teams, error: message },
      { headers: NO_CACHE }
    );
  }
}
