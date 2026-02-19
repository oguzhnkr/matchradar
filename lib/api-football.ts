const API_BASE = "https://api-football-v1.p.rapidapi.com/v3";

// API-Football league IDs
const SUPPORTED_LEAGUES = [
  { id: 203, name: "Süper Lig" },
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
  { id: 88, name: "Eredivisie" },
  { id: 94, name: "Primeira Liga" },
];

async function apiFetch(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not configured");
  }

  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    },
    next: { revalidate: 3600 },
  });

  if (res.status === 429) {
    throw new Error("İstek limiti aşıldı. Lütfen 1 dakika bekleyip tekrar deneyin.");
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error: ${res.status} - ${body}`);
  }

  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API error: ${JSON.stringify(data.errors)}`);
  }
  return data;
}

export async function getLeagues() {
  // Return static list to save API calls
  return SUPPORTED_LEAGUES.map((l) => ({
    id: l.id,
    name: l.name,
    country: "",
    logo: "",
    flag: "",
  }));
}

export async function getTeams(leagueId: number, season: number) {
  const data = await apiFetch("/teams", {
    league: String(leagueId),
    season: String(season),
  });

  return data.response
    .map((item: any) => ({
      id: item.team.id,
      name: item.team.name,
      logo: item.team.logo,
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));
}

export async function getTeamMatches(teamId: number) {
  const data = await apiFetch("/fixtures", {
    team: String(teamId),
    last: "10",
  });

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

export async function getHeadToHead(team1Id: number, team2Id: number) {
  const data = await apiFetch("/fixtures/headtoheads", {
    h2h: `${team1Id}-${team2Id}`,
    last: "10",
  });

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
