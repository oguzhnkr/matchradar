// API-Football league IDs
const SUPPORTED_LEAGUES = [
  { id: 203, name: "Süper Lig" },
  { id: 204, name: "TFF 1. Lig" },
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
  { id: 88, name: "Eredivisie" },
  { id: 94, name: "Primeira Liga" },
];

async function apiFetch(
  endpoint: string,
  params: Record<string, string>,
  apiKey: string,
  apiHost: string
) {
  const apiBase = `https://${apiHost || "v3.football.api-sports.io"}`;
  const url = new URL(`${apiBase}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": apiKey,
    },
  });

  if (res.status === 429) {
    throw new Error("Rate limit exceeded. Please wait and try again.");
  }

  const text = await res.text();

  if (!res.ok || !text) {
    throw new Error(`API error: ${res.status} - ${text || "empty response"}`);
  }

  const data = JSON.parse(text);
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API error: ${JSON.stringify(data.errors)}`);
  }
  return data;
}

export async function getLeagues() {
  return SUPPORTED_LEAGUES.map((l) => ({
    id: l.id,
    name: l.name,
    country: "",
    logo: "",
    flag: "",
  }));
}

export async function getTeams(
  leagueId: number,
  season: number,
  apiKey: string,
  apiHost: string
) {
  const data = await apiFetch(
    "/teams",
    { league: String(leagueId), season: String(season) },
    apiKey,
    apiHost
  );

  return data.response
    .map((item: any) => ({
      id: item.team.id,
      name: item.team.name,
      logo: item.team.logo,
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));
}

export async function getAllTeams(
  season: number,
  apiKey: string,
  apiHost: string
) {
  const results = await Promise.allSettled(
    SUPPORTED_LEAGUES.map((l) => getTeams(l.id, season, apiKey, apiHost))
  );

  const all: { id: number; name: string; logo: string }[] = [];
  const seen = new Set<number>();

  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const team of r.value) {
        if (!seen.has(team.id)) {
          seen.add(team.id);
          all.push(team);
        }
      }
    }
  }

  return all.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTeamMatches(
  teamId: number,
  apiKey: string,
  apiHost: string
) {
  const data = await apiFetch(
    "/fixtures",
    { team: String(teamId), last: "10" },
    apiKey,
    apiHost
  );

  return (data.response || []).map((item: any) => ({
    id: item.fixture.id,
    date: item.fixture.date,
    venue: item.fixture.venue?.name || "Unknown",
    league: {
      id: item.league.id,
      name: item.league.name,
      logo: item.league.logo,
      round: item.league.round || "",
    },
    home: {
      id: item.teams.home.id,
      name: item.teams.home.name,
      logo: item.teams.home.logo,
      winner: item.teams.home.winner,
    },
    away: {
      id: item.teams.away.id,
      name: item.teams.away.name,
      logo: item.teams.away.logo,
      winner: item.teams.away.winner,
    },
    goals: {
      home: item.goals.home,
      away: item.goals.away,
    },
    score: {
      halftime: {
        home: item.score.halftime.home,
        away: item.score.halftime.away,
      },
      fulltime: {
        home: item.score.fulltime.home,
        away: item.score.fulltime.away,
      },
    },
  }));
}

export async function getHeadToHead(
  team1Id: number,
  team2Id: number,
  apiKey: string,
  apiHost: string
) {
  const data = await apiFetch(
    "/fixtures/headtohead",
    { h2h: `${team1Id}-${team2Id}`, last: "10" },
    apiKey,
    apiHost
  );

  return (data.response || []).map((item: any) => ({
    id: item.fixture.id,
    date: item.fixture.date,
    venue: item.fixture.venue?.name || "Unknown",
    league: {
      id: item.league.id,
      name: item.league.name,
      logo: item.league.logo,
      round: item.league.round || "",
    },
    home: {
      id: item.teams.home.id,
      name: item.teams.home.name,
      logo: item.teams.home.logo,
      winner: item.teams.home.winner,
    },
    away: {
      id: item.teams.away.id,
      name: item.teams.away.name,
      logo: item.teams.away.logo,
      winner: item.teams.away.winner,
    },
    goals: {
      home: item.goals.home,
      away: item.goals.away,
    },
    score: {
      halftime: {
        home: item.score.halftime.home,
        away: item.score.halftime.away,
      },
      fulltime: {
        home: item.score.fulltime.home,
        away: item.score.fulltime.away,
      },
    },
  }));
}
