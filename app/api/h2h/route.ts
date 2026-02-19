export const runtime = "edge";

import { getHeadToHead } from "@/lib/api-football";
import { generateDemoH2H } from "@/lib/demo-data";

const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET(
  request: Request,
  { env }: { env: any }
) {
  const API_KEY = env.API_FOOTBALL_KEY;
  const API_HOST = env.API_FOOTBALL_HOST;

  const { searchParams } = new URL(request.url);
  const team1 = searchParams.get("team1");
  const team2 = searchParams.get("team2");

  if (!team1 || !team2) {
    return Response.json(
      { error: "team1 and team2 parameters are required" },
      { status: 400, headers: NO_CACHE }
    );
  }

  if (!API_KEY) {
    const matches = generateDemoH2H(Number(team1), Number(team2));
    return Response.json(
      { source: "dummy", data: matches },
      { headers: NO_CACHE }
    );
  }

  try {
    const matches = await getHeadToHead(Number(team1), Number(team2), API_KEY, API_HOST);
    return Response.json(
      { source: "api", data: matches },
      { headers: NO_CACHE }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch head-to-head";
    const matches = generateDemoH2H(Number(team1), Number(team2));
    return Response.json(
      { source: "dummy", data: matches, error: message },
      { headers: NO_CACHE }
    );
  }
}
