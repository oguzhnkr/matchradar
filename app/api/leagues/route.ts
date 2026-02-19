export const runtime = "edge";

import { getLeagues } from "@/lib/api-football";
import { DEMO_LEAGUES } from "@/lib/demo-data";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(
  request: Request,
  { env }: { env: any }
) {
  const API_KEY = env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return Response.json(
      { source: "dummy", data: DEMO_LEAGUES },
      { headers: NO_CACHE }
    );
  }

  try {
    const leagues = await getLeagues();
    return Response.json(
      { source: "api", data: leagues },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leagues";
    return Response.json(
      { source: "dummy", data: DEMO_LEAGUES, error: message },
      { headers: NO_CACHE }
    );
  }
}
