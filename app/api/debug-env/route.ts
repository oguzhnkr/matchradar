export const runtime = "edge";

export async function GET(
  request: Request,
  { env }: { env: any }
) {
  const API_KEY = env.API_FOOTBALL_KEY;
  const API_HOST = env.API_FOOTBALL_HOST;

  const hasKey = !!API_KEY;
  const host = API_HOST || null;
  const mode = hasKey ? "api" : "dummy";

  return Response.json(
    { hasKey, host, mode },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}
