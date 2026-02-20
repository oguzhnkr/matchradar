export interface Env {
  API_FOOTBALL_KEY: string;
  API_FOOTBALL_HOST: string;
}

export interface FnContext {
  request: Request;
  env: Env;
}

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: HEADERS });
}
