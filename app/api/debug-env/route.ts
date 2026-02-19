export const runtime = "edge";

export async function GET() {
  const hasKey = !!process.env.API_FOOTBALL_KEY;
  const host = process.env.API_FOOTBALL_HOST || null;
  const mode = hasKey ? "api" : "dummy";

  return Response.json(
    { hasKey, host, mode },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}
