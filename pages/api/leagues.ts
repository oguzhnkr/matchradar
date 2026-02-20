import type { NextApiRequest, NextApiResponse } from "next";
import { getLeagues } from "@/lib/api-football";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return res.status(503).json({
      error: "API key is not configured. Please set the API_FOOTBALL_KEY environment variable.",
      code: "API_KEY_MISSING",
    });
  }

  try {
    const leagues = await getLeagues();
    return res.status(200).json({ source: "api", data: leagues });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leagues";
    return res.status(500).json({ error: message });
  }
}
