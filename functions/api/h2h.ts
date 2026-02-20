import { json, type FnContext } from "./_shared";
import { getHeadToHead } from "../../lib/api-football";
import { generateDemoH2H } from "../../lib/demo-data";

export async function onRequestGet({ request, env }: FnContext) {
  const API_KEY = env.API_FOOTBALL_KEY;
  const API_HOST = env.API_FOOTBALL_HOST;

  const { searchParams } = new URL(request.url);
  const team1 = searchParams.get("team1");
  const team2 = searchParams.get("team2");

  if (!team1 || !team2) {
    return json({ error: "team1 and team2 parameters are required" }, 400);
  }

  if (!API_KEY) {
    const matches = generateDemoH2H(Number(team1), Number(team2));
    return json({ source: "dummy", data: matches });
  }

  try {
    const matches = await getHeadToHead(
      Number(team1),
      Number(team2),
      API_KEY,
      API_HOST
    );
    return json({ source: "api", data: matches });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch head-to-head";
    const matches = generateDemoH2H(Number(team1), Number(team2));
    return json({ source: "dummy", data: matches, error: message });
  }
}
