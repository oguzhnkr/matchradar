import { League, Team, Match } from "@/types";

export const DEMO_LEAGUES: League[] = [
  { id: 203, name: "Süper Lig", country: "Turkey", logo: "https://media.api-sports.io/football/leagues/203.png", flag: "" },
  { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "" },
  { id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", flag: "" },
  { id: 135, name: "Serie A", country: "Italy", logo: "https://media.api-sports.io/football/leagues/135.png", flag: "" },
  { id: 78, name: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png", flag: "" },
  { id: 61, name: "Ligue 1", country: "France", logo: "https://media.api-sports.io/football/leagues/61.png", flag: "" },
  { id: 88, name: "Eredivisie", country: "Netherlands", logo: "https://media.api-sports.io/football/leagues/88.png", flag: "" },
  { id: 94, name: "Primeira Liga", country: "Portugal", logo: "https://media.api-sports.io/football/leagues/94.png", flag: "" },
];

export const DEMO_TEAMS: Record<number, Team[]> = {
  // Süper Lig (19 takım)
  203: [
    { id: 645, name: "Galatasaray", logo: "https://media.api-sports.io/football/teams/645.png" },
    { id: 611, name: "Fenerbahçe", logo: "https://media.api-sports.io/football/teams/611.png" },
    { id: 549, name: "Beşiktaş", logo: "https://media.api-sports.io/football/teams/549.png" },
    { id: 3563, name: "Trabzonspor", logo: "https://media.api-sports.io/football/teams/3563.png" },
    { id: 3573, name: "Başakşehir", logo: "https://media.api-sports.io/football/teams/3573.png" },
    { id: 3564, name: "Sivasspor", logo: "https://media.api-sports.io/football/teams/3564.png" },
    { id: 3569, name: "Antalyaspor", logo: "https://media.api-sports.io/football/teams/3569.png" },
    { id: 607, name: "Konyaspor", logo: "https://media.api-sports.io/football/teams/607.png" },
    { id: 3574, name: "Adana Demirspor", logo: "https://media.api-sports.io/football/teams/3574.png" },
    { id: 3561, name: "Alanyaspor", logo: "https://media.api-sports.io/football/teams/3561.png" },
    { id: 3606, name: "Kasımpaşa", logo: "https://media.api-sports.io/football/teams/3606.png" },
    { id: 3589, name: "Kayserispor", logo: "https://media.api-sports.io/football/teams/3589.png" },
    { id: 3570, name: "Gaziantep FK", logo: "https://media.api-sports.io/football/teams/3570.png" },
    { id: 3562, name: "Hatayspor", logo: "https://media.api-sports.io/football/teams/3562.png" },
    { id: 3591, name: "Pendikspor", logo: "https://media.api-sports.io/football/teams/3591.png" },
    { id: 3575, name: "Samsunspor", logo: "https://media.api-sports.io/football/teams/3575.png" },
    { id: 3567, name: "Rizespor", logo: "https://media.api-sports.io/football/teams/3567.png" },
    { id: 3566, name: "Bodrum FK", logo: "https://media.api-sports.io/football/teams/3566.png" },
    { id: 3605, name: "Eyüpspor", logo: "https://media.api-sports.io/football/teams/3605.png" },
  ],
  // Premier League (20 takım)
  39: [
    { id: 33, name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png" },
    { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" },
    { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" },
    { id: 42, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" },
    { id: 49, name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png" },
    { id: 47, name: "Tottenham", logo: "https://media.api-sports.io/football/teams/47.png" },
    { id: 34, name: "Newcastle", logo: "https://media.api-sports.io/football/teams/34.png" },
    { id: 66, name: "Aston Villa", logo: "https://media.api-sports.io/football/teams/66.png" },
    { id: 48, name: "West Ham", logo: "https://media.api-sports.io/football/teams/48.png" },
    { id: 51, name: "Brighton", logo: "https://media.api-sports.io/football/teams/51.png" },
    { id: 52, name: "Crystal Palace", logo: "https://media.api-sports.io/football/teams/52.png" },
    { id: 55, name: "Brentford", logo: "https://media.api-sports.io/football/teams/55.png" },
    { id: 36, name: "Fulham", logo: "https://media.api-sports.io/football/teams/36.png" },
    { id: 39, name: "Wolves", logo: "https://media.api-sports.io/football/teams/39.png" },
    { id: 45, name: "Everton", logo: "https://media.api-sports.io/football/teams/45.png" },
    { id: 65, name: "Nottingham Forest", logo: "https://media.api-sports.io/football/teams/65.png" },
    { id: 35, name: "Bournemouth", logo: "https://media.api-sports.io/football/teams/35.png" },
    { id: 46, name: "Leicester City", logo: "https://media.api-sports.io/football/teams/46.png" },
    { id: 57, name: "Ipswich Town", logo: "https://media.api-sports.io/football/teams/57.png" },
    { id: 41, name: "Southampton", logo: "https://media.api-sports.io/football/teams/41.png" },
  ],
  // La Liga (20 takım)
  140: [
    { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
    { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" },
    { id: 530, name: "Atletico Madrid", logo: "https://media.api-sports.io/football/teams/530.png" },
    { id: 536, name: "Sevilla", logo: "https://media.api-sports.io/football/teams/536.png" },
    { id: 548, name: "Real Sociedad", logo: "https://media.api-sports.io/football/teams/548.png" },
    { id: 533, name: "Villarreal", logo: "https://media.api-sports.io/football/teams/533.png" },
    { id: 543, name: "Real Betis", logo: "https://media.api-sports.io/football/teams/543.png" },
    { id: 531, name: "Athletic Bilbao", logo: "https://media.api-sports.io/football/teams/531.png" },
    { id: 532, name: "Valencia", logo: "https://media.api-sports.io/football/teams/532.png" },
    { id: 546, name: "Celta Vigo", logo: "https://media.api-sports.io/football/teams/546.png" },
    { id: 727, name: "Osasuna", logo: "https://media.api-sports.io/football/teams/727.png" },
    { id: 537, name: "Getafe", logo: "https://media.api-sports.io/football/teams/537.png" },
    { id: 542, name: "Rayo Vallecano", logo: "https://media.api-sports.io/football/teams/542.png" },
    { id: 798, name: "Mallorca", logo: "https://media.api-sports.io/football/teams/798.png" },
    { id: 534, name: "Las Palmas", logo: "https://media.api-sports.io/football/teams/534.png" },
    { id: 540, name: "Espanyol", logo: "https://media.api-sports.io/football/teams/540.png" },
    { id: 547, name: "Girona", logo: "https://media.api-sports.io/football/teams/547.png" },
    { id: 539, name: "Leganes", logo: "https://media.api-sports.io/football/teams/539.png" },
    { id: 535, name: "Deportivo Alaves", logo: "https://media.api-sports.io/football/teams/535.png" },
    { id: 538, name: "Real Valladolid", logo: "https://media.api-sports.io/football/teams/538.png" },
  ],
  // Serie A (20 takım)
  135: [
    { id: 489, name: "AC Milan", logo: "https://media.api-sports.io/football/teams/489.png" },
    { id: 505, name: "Inter", logo: "https://media.api-sports.io/football/teams/505.png" },
    { id: 496, name: "Juventus", logo: "https://media.api-sports.io/football/teams/496.png" },
    { id: 492, name: "Napoli", logo: "https://media.api-sports.io/football/teams/492.png" },
    { id: 497, name: "Roma", logo: "https://media.api-sports.io/football/teams/497.png" },
    { id: 487, name: "Lazio", logo: "https://media.api-sports.io/football/teams/487.png" },
    { id: 499, name: "Atalanta", logo: "https://media.api-sports.io/football/teams/499.png" },
    { id: 502, name: "Fiorentina", logo: "https://media.api-sports.io/football/teams/502.png" },
    { id: 500, name: "Bologna", logo: "https://media.api-sports.io/football/teams/500.png" },
    { id: 503, name: "Torino", logo: "https://media.api-sports.io/football/teams/503.png" },
    { id: 495, name: "Genoa", logo: "https://media.api-sports.io/football/teams/495.png" },
    { id: 504, name: "Verona", logo: "https://media.api-sports.io/football/teams/504.png" },
    { id: 488, name: "Sassuolo", logo: "https://media.api-sports.io/football/teams/488.png" },
    { id: 494, name: "Udinese", logo: "https://media.api-sports.io/football/teams/494.png" },
    { id: 490, name: "Cagliari", logo: "https://media.api-sports.io/football/teams/490.png" },
    { id: 491, name: "Empoli", logo: "https://media.api-sports.io/football/teams/491.png" },
    { id: 867, name: "Lecce", logo: "https://media.api-sports.io/football/teams/867.png" },
    { id: 511, name: "Monza", logo: "https://media.api-sports.io/football/teams/511.png" },
    { id: 498, name: "Sampdoria", logo: "https://media.api-sports.io/football/teams/498.png" },
    { id: 501, name: "Parma", logo: "https://media.api-sports.io/football/teams/501.png" },
  ],
  // Bundesliga (18 takım)
  78: [
    { id: 157, name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png" },
    { id: 165, name: "Borussia Dortmund", logo: "https://media.api-sports.io/football/teams/165.png" },
    { id: 173, name: "RB Leipzig", logo: "https://media.api-sports.io/football/teams/173.png" },
    { id: 168, name: "Bayer Leverkusen", logo: "https://media.api-sports.io/football/teams/168.png" },
    { id: 169, name: "Eintracht Frankfurt", logo: "https://media.api-sports.io/football/teams/169.png" },
    { id: 163, name: "Borussia M'gladbach", logo: "https://media.api-sports.io/football/teams/163.png" },
    { id: 161, name: "VfL Wolfsburg", logo: "https://media.api-sports.io/football/teams/161.png" },
    { id: 160, name: "SC Freiburg", logo: "https://media.api-sports.io/football/teams/160.png" },
    { id: 172, name: "VfB Stuttgart", logo: "https://media.api-sports.io/football/teams/172.png" },
    { id: 162, name: "Werder Bremen", logo: "https://media.api-sports.io/football/teams/162.png" },
    { id: 167, name: "1. FC Union Berlin", logo: "https://media.api-sports.io/football/teams/167.png" },
    { id: 170, name: "FC Augsburg", logo: "https://media.api-sports.io/football/teams/170.png" },
    { id: 176, name: "VfL Bochum", logo: "https://media.api-sports.io/football/teams/176.png" },
    { id: 164, name: "FSV Mainz 05", logo: "https://media.api-sports.io/football/teams/164.png" },
    { id: 159, name: "Hertha Berlin", logo: "https://media.api-sports.io/football/teams/159.png" },
    { id: 174, name: "FC Köln", logo: "https://media.api-sports.io/football/teams/174.png" },
    { id: 166, name: "1899 Hoffenheim", logo: "https://media.api-sports.io/football/teams/166.png" },
    { id: 171, name: "FC Heidenheim", logo: "https://media.api-sports.io/football/teams/171.png" },
  ],
  // Ligue 1 (18 takım)
  61: [
    { id: 85, name: "Paris Saint-Germain", logo: "https://media.api-sports.io/football/teams/85.png" },
    { id: 81, name: "Marseille", logo: "https://media.api-sports.io/football/teams/81.png" },
    { id: 80, name: "Lyon", logo: "https://media.api-sports.io/football/teams/80.png" },
    { id: 91, name: "Monaco", logo: "https://media.api-sports.io/football/teams/91.png" },
    { id: 79, name: "Lille", logo: "https://media.api-sports.io/football/teams/79.png" },
    { id: 93, name: "Rennes", logo: "https://media.api-sports.io/football/teams/93.png" },
    { id: 84, name: "Nice", logo: "https://media.api-sports.io/football/teams/84.png" },
    { id: 95, name: "Strasbourg", logo: "https://media.api-sports.io/football/teams/95.png" },
    { id: 82, name: "Montpellier", logo: "https://media.api-sports.io/football/teams/82.png" },
    { id: 83, name: "Nantes", logo: "https://media.api-sports.io/football/teams/83.png" },
    { id: 94, name: "Stade de Reims", logo: "https://media.api-sports.io/football/teams/94.png" },
    { id: 78, name: "Bordeaux", logo: "https://media.api-sports.io/football/teams/78.png" },
    { id: 92, name: "RC Lens", logo: "https://media.api-sports.io/football/teams/92.png" },
    { id: 96, name: "Toulouse", logo: "https://media.api-sports.io/football/teams/96.png" },
    { id: 97, name: "Lorient", logo: "https://media.api-sports.io/football/teams/97.png" },
    { id: 99, name: "Brest", logo: "https://media.api-sports.io/football/teams/99.png" },
    { id: 98, name: "Auxerre", logo: "https://media.api-sports.io/football/teams/98.png" },
    { id: 77, name: "Angers", logo: "https://media.api-sports.io/football/teams/77.png" },
  ],
  // Eredivisie (18 takım)
  88: [
    { id: 194, name: "Ajax", logo: "https://media.api-sports.io/football/teams/194.png" },
    { id: 197, name: "PSV", logo: "https://media.api-sports.io/football/teams/197.png" },
    { id: 196, name: "Feyenoord", logo: "https://media.api-sports.io/football/teams/196.png" },
    { id: 198, name: "AZ Alkmaar", logo: "https://media.api-sports.io/football/teams/198.png" },
    { id: 199, name: "FC Twente", logo: "https://media.api-sports.io/football/teams/199.png" },
    { id: 201, name: "FC Utrecht", logo: "https://media.api-sports.io/football/teams/201.png" },
    { id: 200, name: "Vitesse", logo: "https://media.api-sports.io/football/teams/200.png" },
    { id: 202, name: "SC Heerenveen", logo: "https://media.api-sports.io/football/teams/202.png" },
    { id: 203, name: "FC Groningen", logo: "https://media.api-sports.io/football/teams/203.png" },
    { id: 205, name: "Go Ahead Eagles", logo: "https://media.api-sports.io/football/teams/205.png" },
    { id: 206, name: "Sparta Rotterdam", logo: "https://media.api-sports.io/football/teams/206.png" },
    { id: 207, name: "NEC Nijmegen", logo: "https://media.api-sports.io/football/teams/207.png" },
    { id: 208, name: "Fortuna Sittard", logo: "https://media.api-sports.io/football/teams/208.png" },
    { id: 209, name: "PEC Zwolle", logo: "https://media.api-sports.io/football/teams/209.png" },
    { id: 210, name: "RKC Waalwijk", logo: "https://media.api-sports.io/football/teams/210.png" },
    { id: 204, name: "Willem II", logo: "https://media.api-sports.io/football/teams/204.png" },
    { id: 1909, name: "Heracles Almelo", logo: "https://media.api-sports.io/football/teams/1909.png" },
    { id: 1910, name: "NAC Breda", logo: "https://media.api-sports.io/football/teams/1910.png" },
  ],
  // Primeira Liga (18 takım)
  94: [
    { id: 211, name: "Benfica", logo: "https://media.api-sports.io/football/teams/211.png" },
    { id: 212, name: "Porto", logo: "https://media.api-sports.io/football/teams/212.png" },
    { id: 228, name: "Sporting CP", logo: "https://media.api-sports.io/football/teams/228.png" },
    { id: 217, name: "SC Braga", logo: "https://media.api-sports.io/football/teams/217.png" },
    { id: 222, name: "Vitória SC", logo: "https://media.api-sports.io/football/teams/222.png" },
    { id: 226, name: "Gil Vicente", logo: "https://media.api-sports.io/football/teams/226.png" },
    { id: 215, name: "Boavista", logo: "https://media.api-sports.io/football/teams/215.png" },
    { id: 223, name: "Marítimo", logo: "https://media.api-sports.io/football/teams/223.png" },
    { id: 224, name: "Rio Ave", logo: "https://media.api-sports.io/football/teams/224.png" },
    { id: 225, name: "Famalicão", logo: "https://media.api-sports.io/football/teams/225.png" },
    { id: 219, name: "Moreirense", logo: "https://media.api-sports.io/football/teams/219.png" },
    { id: 229, name: "Santa Clara", logo: "https://media.api-sports.io/football/teams/229.png" },
    { id: 218, name: "Casa Pia", logo: "https://media.api-sports.io/football/teams/218.png" },
    { id: 231, name: "Arouca", logo: "https://media.api-sports.io/football/teams/231.png" },
    { id: 220, name: "Estoril", logo: "https://media.api-sports.io/football/teams/220.png" },
    { id: 230, name: "Estrela Amadora", logo: "https://media.api-sports.io/football/teams/230.png" },
    { id: 216, name: "AVS", logo: "https://media.api-sports.io/football/teams/216.png" },
    { id: 221, name: "Nacional", logo: "https://media.api-sports.io/football/teams/221.png" },
  ],
};

// Generate demo matches for a single team against random opponents
export function generateDemoTeamMatches(teamId: number): Match[] {
  const allTeams = Object.values(DEMO_TEAMS).flat();
  const team = allTeams.find((t) => t.id === teamId);
  if (!team) return [];

  // Find league
  const leagueId = Object.entries(DEMO_TEAMS).find(([, teams]) =>
    teams.some((t) => t.id === teamId)
  )?.[0];
  const league = DEMO_LEAGUES.find((l) => l.id === Number(leagueId));
  const leagueName = league?.name || "Friendly";

  // Get opponents from same league
  const leagueTeams = DEMO_TEAMS[Number(leagueId)] || allTeams;
  const opponents = leagueTeams.filter((t) => t.id !== teamId);

  const scores = [
    [3, 1], [0, 2], [1, 1], [2, 0], [1, 3],
    [4, 2], [0, 0], [2, 1], [1, 2], [3, 0],
  ];

  const venues = [
    "Ali Sami Yen Stadium", "Şükrü Saracoğlu Stadium", "Vodafone Park",
    "Old Trafford", "Anfield", "Santiago Bernabeu", "Camp Nou",
    "San Siro", "Allianz Arena", "Signal Iduna Park",
  ];

  const matches: Match[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 12 + 3));

    const opponent = opponents[i % opponents.length];
    const isHome = i % 2 === 0;
    const [s1, s2] = scores[i];
    const homeGoals = isHome ? s1 : s2;
    const awayGoals = isHome ? s2 : s1;
    const homeWinner = homeGoals > awayGoals ? true : homeGoals === awayGoals ? null : false;
    const awayWinner = awayGoals > homeGoals ? true : homeGoals === awayGoals ? null : false;

    const htHome = Math.min(homeGoals, Math.floor(Math.random() * (homeGoals + 1)));
    const htAway = Math.min(awayGoals, Math.floor(Math.random() * (awayGoals + 1)));

    matches.push({
      id: 200000 + i,
      date: date.toISOString(),
      venue: venues[i % venues.length],
      league: {
        id: Number(leagueId) || 0,
        name: leagueName,
        logo: `https://media.api-sports.io/football/leagues/${Number(leagueId) || 0}.png`,
        round: `Matchday ${34 - i}`,
      },
      home: {
        id: isHome ? team.id : opponent.id,
        name: isHome ? team.name : opponent.name,
        logo: isHome ? team.logo : opponent.logo,
        winner: homeWinner,
      },
      away: {
        id: isHome ? opponent.id : team.id,
        name: isHome ? opponent.name : team.name,
        logo: isHome ? opponent.logo : team.logo,
        winner: awayWinner,
      },
      goals: { home: homeGoals, away: awayGoals },
      score: {
        halftime: { home: htHome, away: htAway },
        fulltime: { home: homeGoals, away: awayGoals },
      },
    });
  }

  return matches;
}

// Generate realistic H2H demo matches between any two teams
export function generateDemoH2H(team1Id: number, team2Id: number): Match[] {
  // Find teams from all leagues
  const allTeams = Object.values(DEMO_TEAMS).flat();
  const team1 = allTeams.find((t) => t.id === team1Id);
  const team2 = allTeams.find((t) => t.id === team2Id);

  if (!team1 || !team2) return [];

  // Find which league these teams belong to
  const leagueId = Object.entries(DEMO_TEAMS).find(([, teams]) =>
    teams.some((t) => t.id === team1Id)
  )?.[0];
  const league = DEMO_LEAGUES.find((l) => l.id === Number(leagueId));
  const leagueName = league?.name || "Friendly";

  const scores = [
    [2, 1], [1, 0], [3, 2], [0, 0], [1, 1],
    [2, 0], [1, 3], [2, 2], [0, 1], [4, 1],
  ];

  const venues = [
    "Ali Sami Yen Stadium", "Şükrü Saracoğlu Stadium", "Vodafone Park",
    "Old Trafford", "Anfield", "Santiago Bernabeu", "Camp Nou",
    "San Siro", "Allianz Arena", "Signal Iduna Park",
  ];

  const matches: Match[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - (i * 3 + 1));

    const isHome = i % 2 === 0;
    const [s1, s2] = scores[i];
    const homeGoals = isHome ? s1 : s2;
    const awayGoals = isHome ? s2 : s1;
    const homeWinner = homeGoals > awayGoals ? true : homeGoals === awayGoals ? null : false;
    const awayWinner = awayGoals > homeGoals ? true : homeGoals === awayGoals ? null : false;

    const htHome = Math.min(homeGoals, Math.floor(Math.random() * (homeGoals + 1)));
    const htAway = Math.min(awayGoals, Math.floor(Math.random() * (awayGoals + 1)));

    matches.push({
      id: 100000 + i,
      date: date.toISOString(),
      venue: venues[i % venues.length],
      league: {
        id: Number(leagueId) || 0,
        name: leagueName,
        logo: `https://media.api-sports.io/football/leagues/${Number(leagueId) || 0}.png`,
        round: `Matchday ${Math.floor(Math.random() * 34) + 1}`,
      },
      home: {
        id: isHome ? team1.id : team2.id,
        name: isHome ? team1.name : team2.name,
        logo: isHome ? team1.logo : team2.logo,
        winner: homeWinner,
      },
      away: {
        id: isHome ? team2.id : team1.id,
        name: isHome ? team2.name : team1.name,
        logo: isHome ? team2.logo : team1.logo,
        winner: awayWinner,
      },
      goals: { home: homeGoals, away: awayGoals },
      score: {
        halftime: { home: htHome, away: htAway },
        fulltime: { home: homeGoals, away: awayGoals },
      },
    });
  }

  return matches;
}
