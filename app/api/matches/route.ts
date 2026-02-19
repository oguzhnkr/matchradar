export const runtime = "edge";

import { getTeamMatches } from "@/lib/api-football";
import { generateDemoTeamMatches } from "@/lib/demo-data";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(
  request: Request,
  { env }: { env: any }
) {
  const API_KEY = env.API_FOOTBALL_KEY;
  const API_HOST = env.API_FOOTBALL_HOST;

  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team");

  if (!team) {
    return Response.json(
      { error: "team parameter is required" },
      { status: 400, headers: NO_CACHE }
    );
  }

  if (!API_KEY) {
    const matches = generateDemoTeamMatches(Number(team));
    return Response.json(
      { source: "dummy", data: matches },
      { headers: NO_CACHE }
    );
  }

  try {
    const matches = await getTeamMatches(Number(team), API_KEY, API_HOST);
    return Response.json(
      { source: "api", data: matches },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch matches";
    const matches = generateDemoTeamMatches(Number(team));
    return Response.json(
      { source: "dummy", data: matches, error: message },
      { headers: NO_CACHE }
    );
  }
}
