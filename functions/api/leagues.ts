import { json, type FnContext } from "./_shared";
import { getLeagues } from "../../lib/api-football";
import { DEMO_LEAGUES } from "../../lib/demo-data";

export async function onRequestGet({ env }: FnContext) {
  if (!env.API_FOOTBALL_KEY) {
    return json({ source: "dummy", data: DEMO_LEAGUES });
  }

  try {
    const leagues = await getLeagues();
    return json({ source: "api", data: leagues });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leagues";
    return json({ source: "dummy", data: DEMO_LEAGUES, error: message });
  }
}
