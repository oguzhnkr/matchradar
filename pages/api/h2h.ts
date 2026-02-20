import type { NextApiRequest, NextApiResponse } from "next";
import { getHeadToHead } from "@/lib/api-football";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  const API_KEY = process.env.API_FOOTBALL_KEY;
  const API_HOST = process.env.API_FOOTBALL_HOST;

  const team1 = req.query.team1 as string | undefined;
  const team2 = req.query.team2 as string | undefined;

  if (!team1 || !team2) {
    return res
      .status(400)
      .json({ error: "team1 and team2 parameters are required" });
  }

  if (!API_KEY) {
    return res.status(503).json({
      error: "API key is not configured. Please set the API_FOOTBALL_KEY environment variable.",
      code: "API_KEY_MISSING",
    });
  }

  try {
    const matches = await getHeadToHead(
      Number(team1),
      Number(team2),
      API_KEY,
      API_HOST || ""
    );
    return res.status(200).json({ source: "api", data: matches });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch head-to-head";
    return res.status(500).json({ error: message });
  }
}
