import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { League, Team, Match } from "@/types";
import Header from "@/components/Header";
import LeagueSelector from "@/components/LeagueSelector";
import TeamSelector from "@/components/TeamSelector";
import MatchList from "@/components/MatchList";
import { useLang, LangProvider } from "@/lib/i18n";

type Mode = "h2h" | "single";
type VenueFilter = "all" | "home" | "away";

// API fetcher that detects API_KEY_MISSING
class ApiKeyMissingError extends Error {
  constructor() {
    super("API_KEY_MISSING");
    this.name = "ApiKeyMissingError";
  }
}

async function apiFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = await res.json();
  if (json.code === "API_KEY_MISSING") {
    throw new ApiKeyMissingError();
  }
  if (json.error && !json.data) {
    throw new Error(json.error);
  }
  return json.data ?? json;
}

function HomeContent() {
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>("h2h");
  const [venueFilter, setVenueFilter] = useState<VenueFilter>("all");

  // Team A
  const [leagueA, setLeagueA] = useState<number | null>(null);
  const [teamA, setTeamA] = useState<number | null>(null);

  // Team B
  const [leagueB, setLeagueB] = useState<number | null>(null);
  const [teamB, setTeamB] = useState<number | null>(null);

  // H2H / Single fetch triggers
  const [h2hEnabled, setH2hEnabled] = useState(false);
  const [singleEnabled, setSingleEnabled] = useState(false);

  // --- Queries ---

  // Leagues
  const leaguesQuery = useQuery<League[]>({
    queryKey: ["leagues"],
    queryFn: () => apiFetcher<League[]>("/api/leagues"),
  });

  // All teams (loaded once)
  const allTeamsQuery = useQuery<Team[]>({
    queryKey: ["allTeams"],
    queryFn: () => apiFetcher<Team[]>("/api/teams"),
  });

  // League-specific teams A
  const leagueTeamsAQuery = useQuery<Team[]>({
    queryKey: ["leagueTeams", leagueA],
    queryFn: () => apiFetcher<Team[]>(`/api/teams?league=${leagueA}`),
    enabled: leagueA !== null,
  });

  // League-specific teams B
  const leagueTeamsBQuery = useQuery<Team[]>({
    queryKey: ["leagueTeams", leagueB],
    queryFn: () => apiFetcher<Team[]>(`/api/teams?league=${leagueB}`),
    enabled: leagueB !== null,
  });

  // H2H matches
  const h2hQuery = useQuery<Match[]>({
    queryKey: ["h2h", teamA, teamB],
    queryFn: () => apiFetcher<Match[]>(`/api/h2h?team1=${teamA}&team2=${teamB}`),
    enabled: h2hEnabled && teamA !== null && teamB !== null && teamA !== teamB,
  });

  // Single team matches
  const singleQuery = useQuery<Match[]>({
    queryKey: ["matches", teamA],
    queryFn: () => apiFetcher<Match[]>(`/api/matches?team=${teamA}`),
    enabled: singleEnabled && teamA !== null,
  });

  // --- Derived state ---

  const leagues = leaguesQuery.data ?? [];
  const allTeams = allTeamsQuery.data ?? [];

  const teamsA = leagueA ? (leagueTeamsAQuery.data ?? []) : allTeams;
  const teamsALoading = leagueA ? leagueTeamsAQuery.isLoading : allTeamsQuery.isLoading;
  const teamsB = leagueB ? (leagueTeamsBQuery.data ?? []) : allTeams;
  const teamsBLoading = leagueB ? leagueTeamsBQuery.isLoading : allTeamsQuery.isLoading;

  const matchesQuery = mode === "h2h" ? h2hQuery : singleQuery;
  const matches = matchesQuery.data ?? [];
  const matchesLoading = matchesQuery.isFetching;

  // Check if any query has API_KEY_MISSING error
  const isApiKeyMissing = [leaguesQuery, allTeamsQuery, leagueTeamsAQuery, leagueTeamsBQuery, h2hQuery, singleQuery]
    .some((q) => q.error instanceof ApiKeyMissingError);

  // Get first non-API-key error
  const errorQuery = [leaguesQuery, allTeamsQuery, leagueTeamsAQuery, leagueTeamsBQuery, matchesQuery]
    .find((q) => q.error && !(q.error instanceof ApiKeyMissingError));
  const error = errorQuery?.error instanceof Error ? errorQuery.error.message : null;

  // Filter matches by venue for single team mode
  const filteredMatches = mode === "single" && teamA
    ? matches.filter((m) => {
        if (venueFilter === "home") return m.home.id === teamA;
        if (venueFilter === "away") return m.away.id === teamA;
        return true;
      })
    : matches;

  const teamAName = teamsA.find((t) => t.id === teamA)?.name || allTeams.find((t) => t.id === teamA)?.name || "";
  const teamBName = teamsB.find((t) => t.id === teamB)?.name || allTeams.find((t) => t.id === teamB)?.name || "";

  const canCompare = teamA !== null && teamB !== null && teamA !== teamB;
  const canFetchSingle = teamA !== null;

  // --- Handlers ---

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setH2hEnabled(false);
    setSingleEnabled(false);
    setVenueFilter("all");
  };

  const handleLeagueASelect = (leagueId: number) => {
    setLeagueA(leagueId);
    setTeamA(null);
    setH2hEnabled(false);
    setSingleEnabled(false);
  };

  const handleLeagueBSelect = (leagueId: number) => {
    setLeagueB(leagueId);
    setTeamB(null);
    setH2hEnabled(false);
  };

  const clearLeagueA = () => {
    setLeagueA(null);
    setTeamA(null);
    setH2hEnabled(false);
    setSingleEnabled(false);
  };

  const clearLeagueB = () => {
    setLeagueB(null);
    setTeamB(null);
    setH2hEnabled(false);
  };

  const handleTeamASelect = (id: number) => {
    setTeamA(id);
    setH2hEnabled(false);
    setSingleEnabled(false);
  };

  const handleTeamBSelect = (id: number) => {
    setTeamB(id);
    setH2hEnabled(false);
  };

  const fetchH2H = () => {
    if (!canCompare) return;
    setH2hEnabled(true);
  };

  const fetchSingleMatches = () => {
    if (!canFetchSingle) return;
    setSingleEnabled(true);
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
        <Header />

        {/* Mode Toggle */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-surface border border-surface-lighter rounded-lg p-1 inline-flex w-full sm:w-auto">
            <button
              onClick={() => switchMode("h2h")}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                mode === "h2h"
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.h2hTab}
            </button>
            <button
              onClick={() => switchMode("single")}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                mode === "single"
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.singleTab}
            </button>
          </div>
        </div>

        {mode === "h2h" ? (
          <>
            {/* H2H: Two column team selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Team A */}
              <div className="bg-surface border border-surface-lighter rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wider">
                  {t.teamA}
                </h3>
                <LeagueSelector
                  leagues={leagues}
                  selectedLeague={leagueA}
                  onSelect={handleLeagueASelect}
                  onClear={clearLeagueA}
                  loading={leaguesQuery.isLoading}
                />
                <TeamSelector
                  teams={teamsA}
                  selectedTeam={teamA}
                  onSelect={handleTeamASelect}
                  loading={teamsALoading}
                />
              </div>

              {/* Team B */}
              <div className="bg-surface border border-surface-lighter rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wider">
                  {t.teamB}
                </h3>
                <LeagueSelector
                  leagues={leagues}
                  selectedLeague={leagueB}
                  onSelect={handleLeagueBSelect}
                  onClear={clearLeagueB}
                  loading={leaguesQuery.isLoading}
                />
                <TeamSelector
                  teams={teamsB}
                  selectedTeam={teamB}
                  onSelect={handleTeamBSelect}
                  loading={teamsBLoading}
                />
              </div>
            </div>

            {/* Compare Button */}
            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={fetchH2H}
                disabled={!canCompare || matchesLoading}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-accent hover:bg-accent-hover text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
              >
                {matchesLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t.loading}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {t.compare}
                  </>
                )}
              </button>
              {teamA && teamB && teamA === teamB && (
                <p className="text-xs text-red-400 mt-2">
                  {t.selectTwoDifferent}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Single Team selection */}
            <div className="max-w-md mx-auto">
              <div className="bg-surface border border-surface-lighter rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wider">
                  {t.selectTeam}
                </h3>
                <LeagueSelector
                  leagues={leagues}
                  selectedLeague={leagueA}
                  onSelect={handleLeagueASelect}
                  onClear={clearLeagueA}
                  loading={leaguesQuery.isLoading}
                />
                <TeamSelector
                  teams={teamsA}
                  selectedTeam={teamA}
                  onSelect={handleTeamASelect}
                  loading={teamsALoading}
                />
              </div>
            </div>

            {/* Venue Filter */}
            {filteredMatches.length > 0 && (
              <div className="flex justify-center mt-3 sm:mt-4">
                <div className="bg-surface border border-surface-lighter rounded-lg p-1 inline-flex">
                  {([["all", t.all], ["home", t.home], ["away", t.away]] as [VenueFilter, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setVenueFilter(value)}
                      className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                        venueFilter === value
                          ? "bg-accent text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fetch Button */}
            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={fetchSingleMatches}
                disabled={!canFetchSingle || matchesLoading}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-accent hover:bg-accent-hover text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
              >
                {matchesLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t.loading}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t.fetchMatches}
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* API Key Missing Error */}
        {isApiKeyMissing && (
          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
            <p className="text-yellow-400 text-sm">{t.apiKeyMissing}</p>
          </div>
        )}

        {/* Error */}
        {error && !isApiKeyMissing && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Match Results */}
        <MatchList
          matches={filteredMatches}
          loading={matchesLoading}
          mode={mode}
          team1Id={teamA || 0}
          team2Id={teamB || 0}
          team1Name={teamAName}
          team2Name={mode === "single" ? "" : teamBName}
        />

        {/* Empty state */}
        {!matchesLoading && filteredMatches.length === 0 && !error && !isApiKeyMissing && (
          <div className="mt-12 text-center text-gray-600">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <p className="text-sm">
              {mode === "h2h" ? t.h2hEmpty : t.singleEmpty}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <LangProvider>
      <HomeContent />
    </LangProvider>
  );
}
