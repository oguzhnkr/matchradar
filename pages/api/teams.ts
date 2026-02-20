import type { NextApiRequest, NextApiResponse } from "next";
import { getTeams, getAllTeams } from "@/lib/api-football";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  const API_KEY = process.env.API_FOOTBALL_KEY;
  const API_HOST = process.env.API_FOOTBALL_HOST;

  const league = req.query.league as string | undefined;
  const season = (req.query.season as string) || "2024";

  if (!API_KEY) {
    return res.status(503).json({
      error: "API key is not configured. Please set the API_FOOTBALL_KEY environment variable.",
      code: "API_KEY_MISSING",
    });
  }

  // No league → return ALL teams from every supported league
  if (!league) {
    try {
      const teams = await getAllTeams(Number(season), API_KEY, API_HOST || "");
      return res.status(200).json({ source: "api", data: teams });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch teams";
      return res.status(500).json({ error: message });
    }
  }

  // With league → return that league's teams
  try {
    const teams = await getTeams(
      Number(league),
      Number(season),
      API_KEY,
      API_HOST || ""
    );
    return res.status(200).json({ source: "api", data: teams });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch teams";
    return res.status(500).json({ error: message });
  }
}
