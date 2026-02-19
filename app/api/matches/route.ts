import { NextRequest, NextResponse } from "next/server";
import { getTeamMatches } from "@/lib/api-football";
import { generateDemoTeamMatches } from "@/lib/demo-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const team = searchParams.get("team");

  if (!team) {
    return NextResponse.json(
      { error: "team parameter is required" },
      { status: 400 }
    );
  }

  if (process.env.DEMO_MODE === "true" || !process.env.API_FOOTBALL_KEY) {
    const matches = generateDemoTeamMatches(Number(team));
    return NextResponse.json(matches);
  }

  try {
    const matches = await getTeamMatches(Number(team));
    return NextResponse.json(matches);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch matches";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
