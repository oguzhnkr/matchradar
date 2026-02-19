export const runtime = "edge";

import { getTeams, getAllTeams } from "@/lib/api-football";
import { DEMO_TEAMS, getAllDemoTeams } from "@/lib/demo-data";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(
  request: Request,
  { env }: { env: any }
) {
  const API_KEY = env.API_FOOTBALL_KEY;
  const API_HOST = env.API_FOOTBALL_HOST;

  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  const season = searchParams.get("season") || "2024";

  // No league → return ALL teams from every supported league
  if (!league) {
    if (!API_KEY) {
      return Response.json(
        { source: "dummy", data: getAllDemoTeams() },
        { headers: NO_CACHE }
      );
    }

    try {
      const teams = await getAllTeams(Number(season), API_KEY, API_HOST);
      return Response.json(
        { source: "api", data: teams },
        { headers: NO_CACHE }
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch teams";
      return Response.json(
        { source: "dummy", data: getAllDemoTeams(), error: message },
        { headers: NO_CACHE }
      );
    }
  }

  // With league → return that league's teams
  if (!API_KEY) {
    const teams = DEMO_TEAMS[Number(league)] || [];
    return Response.json(
      { source: "dummy", data: teams },
      { headers: NO_CACHE }
    );
  }

  try {
    const teams = await getTeams(Number(league), Number(season), API_KEY, API_HOST);
    return Response.json(
      { source: "api", data: teams },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch teams";
    const teams = DEMO_TEAMS[Number(league)] || [];
    return Response.json(
      { source: "dummy", data: teams, error: message },
      { headers: NO_CACHE }
    );
  }
}
