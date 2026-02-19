import { NextRequest, NextResponse } from "next/server";
import { getTeamMatches } from "@/lib/api-football";
import { generateDemoTeamMatches } from "@/lib/demo-data";

export const runtime = "edge";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const team = searchParams.get("team");

  if (!team) {
    return NextResponse.json(
      { error: "team parameter is required" },
      { status: 400, headers: NO_CACHE }
    );
  }

  if (!process.env.API_FOOTBALL_KEY) {
    const matches = generateDemoTeamMatches(Number(team));
    return NextResponse.json(
      { source: "dummy", data: matches },
      { headers: NO_CACHE }
    );
  }

  try {
    const matches = await getTeamMatches(Number(team));
    return NextResponse.json(
      { source: "api", data: matches },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch matches";
    const matches = generateDemoTeamMatches(Number(team));
    return NextResponse.json(
      { source: "dummy", data: matches, error: message },
      { headers: NO_CACHE }
    );
  }
}
