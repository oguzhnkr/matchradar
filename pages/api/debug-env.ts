import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.API_FOOTBALL_KEY;
  const API_HOST = process.env.API_FOOTBALL_HOST;

  const hasKey = !!API_KEY;
  const host = API_HOST || null;
  const mode = hasKey ? "api" : "dummy";

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  return res.status(200).json({ hasKey, host, mode });
}
