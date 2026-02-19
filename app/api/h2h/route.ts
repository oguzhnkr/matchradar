import { NextRequest, NextResponse } from "next/server";
import { getHeadToHead } from "@/lib/api-football";
import { generateDemoH2H } from "@/lib/demo-data";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const team1 = searchParams.get("team1");
  const team2 = searchParams.get("team2");

  if (!team1 || !team2) {
    return NextResponse.json(
      { error: "team1 and team2 parameters are required" },
      { status: 400, headers: NO_CACHE }
    );
  }

  if (!process.env.API_FOOTBALL_KEY) {
    const matches = generateDemoH2H(Number(team1), Number(team2));
    return NextResponse.json(
      { source: "dummy", data: matches },
      { headers: NO_CACHE }
    );
  }

  try {
    const matches = await getHeadToHead(Number(team1), Number(team2));
    return NextResponse.json(
      { source: "api", data: matches },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch head-to-head";
    const matches = generateDemoH2H(Number(team1), Number(team2));
    return NextResponse.json(
      { source: "dummy", data: matches, error: message },
      { headers: NO_CACHE }
    );
  }
}
