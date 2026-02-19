export const runtime = "edge";

import { NextResponse } from "next/server";
import { getLeagues } from "@/lib/api-football";
import { DEMO_LEAGUES } from "@/lib/demo-data";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET() {
  if (!process.env.API_FOOTBALL_KEY) {
    return NextResponse.json(
      { source: "dummy", data: DEMO_LEAGUES },
      { headers: NO_CACHE }
    );
  }

  try {
    const leagues = await getLeagues();
    return NextResponse.json(
      { source: "api", data: leagues },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leagues";
    return NextResponse.json(
      { source: "dummy", data: DEMO_LEAGUES, error: message },
      { headers: NO_CACHE }
    );
  }
}
