import { json, type FnContext } from "./_shared";
import { getTeamMatches } from "../../lib/api-football";
import { generateDemoTeamMatches } from "../../lib/demo-data";

export async function onRequestGet({ request, env }: FnContext) {
  const API_KEY = env.API_FOOTBALL_KEY;
  const API_HOST = env.API_FOOTBALL_HOST;

  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team");

  if (!team) {
    return json({ error: "team parameter is required" }, 400);
  }

  if (!API_KEY) {
    const matches = generateDemoTeamMatches(Number(team));
    return json({ source: "dummy", data: matches });
  }

  try {
    const matches = await getTeamMatches(Number(team), API_KEY, API_HOST);
    return json({ source: "api", data: matches });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch matches";
    const matches = generateDemoTeamMatches(Number(team));
    return json({ source: "dummy", data: matches, error: message });
  }
}
