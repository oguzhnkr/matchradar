import { json, type FnContext } from "./_shared";

export async function onRequestGet({ env }: FnContext) {
  const hasKey = !!env.API_FOOTBALL_KEY;
  const host = env.API_FOOTBALL_HOST || null;
  const mode = hasKey ? "api" : "dummy";

  return json({ hasKey, host, mode });
}
