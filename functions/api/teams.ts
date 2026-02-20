import { json, type FnContext } from "./_shared";
import { getTeams, getAllTeams } from "../../lib/api-football";
import { DEMO_TEAMS, getAllDemoTeams } from "../../lib/demo-data";

export async function onRequestGet({ request, env }: FnContext) {
  const API_KEY = env.API_FOOTBALL_KEY;
  const API_HOST = env.API_FOOTBALL_HOST;

  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");
  const season = searchParams.get("season") || "2024";

  // No league → return ALL teams from every supported league
  if (!league) {
    if (!API_KEY) {
      return json({ source: "dummy", data: getAllDemoTeams() });
    }

    try {
      const teams = await getAllTeams(Number(season), API_KEY, API_HOST);
      return json({ source: "api", data: teams });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch teams";
      return json({ source: "dummy", data: getAllDemoTeams(), error: message });
    }
  }

  // With league → return that league's teams
  if (!API_KEY) {
    const teams = DEMO_TEAMS[Number(league)] || [];
    return json({ source: "dummy", data: teams });
  }

  try {
    const teams = await getTeams(Number(league), Number(season), API_KEY, API_HOST);
    return json({ source: "api", data: teams });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch teams";
    const teams = DEMO_TEAMS[Number(league)] || [];
    return json({ source: "dummy", data: teams, error: message });
  }
}
