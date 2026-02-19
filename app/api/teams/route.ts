export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getTeams } from "@/lib/api-football";
import { DEMO_TEAMS } from "@/lib/demo-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const league = searchParams.get("league");

  if (!league) {
    return NextResponse.json(
      { error: "league parameter is required" },
      { status: 400 }
    );
  }

  if (process.env.DEMO_MODE === "true" || !process.env.RAPIDAPI_KEY) {
    const teams = DEMO_TEAMS[Number(league)] || [];
    return NextResponse.json(teams);
  }

  const season = searchParams.get("season") || "2024";

  try {
    const teams = await getTeams(Number(league), Number(season));
    return NextResponse.json(teams);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch teams";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
