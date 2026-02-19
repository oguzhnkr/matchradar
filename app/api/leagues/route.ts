import { NextResponse } from "next/server";
import { getLeagues } from "@/lib/api-football";
import { DEMO_LEAGUES } from "@/lib/demo-data";

export async function GET() {
  if (process.env.DEMO_MODE === "true") {
    return NextResponse.json(DEMO_LEAGUES);
  }

  try {
    const leagues = await getLeagues();
    return NextResponse.json(leagues);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leagues";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
