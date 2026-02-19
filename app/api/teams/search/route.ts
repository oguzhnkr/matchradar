export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { searchTeams } from "@/lib/api-football";
import { DEMO_TEAMS } from "@/lib/demo-data";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json(
      { error: "q parameter must be at least 3 characters" },
      { status: 400, headers: NO_CACHE }
    );
  }

  if (!process.env.API_FOOTBALL_KEY) {
    // Search in demo data
    const allTeams = Object.values(DEMO_TEAMS).flat();
    const filtered = allTeams.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase())
    );
    // Deduplicate by id
    const unique = [...new Map(filtered.map((t) => [t.id, t])).values()];
    return NextResponse.json(
      { source: "dummy", data: unique },
      { headers: NO_CACHE }
    );
  }

  try {
    const teams = await searchTeams(query);
    return NextResponse.json(
      { source: "api", data: teams },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search teams";
    // Fallback to demo search
    const allTeams = Object.values(DEMO_TEAMS).flat();
    const filtered = allTeams.filter((t) =>
      t.name.toLowerCase().includes(query.toLowerCase())
    );
    const unique = [...new Map(filtered.map((t) => [t.id, t])).values()];
    return NextResponse.json(
      { source: "dummy", data: unique, error: message },
      { headers: NO_CACHE }
    );
  }
}
