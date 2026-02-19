export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getTeams } from "@/lib/api-football";
import { DEMO_TEAMS } from "@/lib/demo-data";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const league = searchParams.get("league");

  if (!league) {
    return NextResponse.json(
      { error: "league parameter is required" },
      { status: 400, headers: NO_CACHE }
    );
  }

  if (!process.env.API_FOOTBALL_KEY) {
    const teams = DEMO_TEAMS[Number(league)] || [];
    return NextResponse.json(
      { source: "dummy", data: teams },
      { headers: NO_CACHE }
    );
  }

  const season = searchParams.get("season") || "2024";

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
