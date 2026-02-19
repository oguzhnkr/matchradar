"use client";

import { useState, useEffect, useCallback } from "react";
import { League, Team, Match } from "@/types";
import Header from "@/components/Header";
import LeagueSelector from "@/components/LeagueSelector";
import TeamSelector from "@/components/TeamSelector";
import MatchList from "@/components/MatchList";
import { useLang, LangProvider } from "@/lib/i18n";

type Mode = "h2h" | "single";
type VenueFilter = "all" | "home" | "away";

function HomeContent() {
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>("h2h");
  const [venueFilter, setVenueFilter] = useState<VenueFilter>("all");

  // Leagues
  const [leagues, setLeagues] = useState<League[]>([]);
  const [leaguesLoading, setLeaguesLoading] = useState(true);

  // All teams (loaded once on mount)
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allTeamsLoading, setAllTeamsLoading] = useState(true);

  // Team A
  const [leagueA, setLeagueA] = useState<number | null>(null);
  const [leagueTeamsA, setLeagueTeamsA] = useState<Team[]>([]);
  const [leagueTeamsALoading, setLeagueTeamsALoading] = useState(false);
  const [teamA, setTeamA] = useState<number | null>(null);

  // Team B
  const [leagueB, setLeagueB] = useState<number | null>(null);
  const [leagueTeamsB, setLeagueTeamsB] = useState<Team[]>([]);
  const [leagueTeamsBLoading, setLeagueTeamsBLoading] = useState(false);
  const [teamB, setTeamB] = useState<number | null>(null);

  // Matches
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear matches on mode switch
  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setMatches([]);
    setError(null);
    setVenueFilter("all");
  };

  // Fetch leagues + all teams on mount
  useEffect(() => {
    fetch("/api/leagues")
      .then((res) => res.json())
      .then((json) => {
        if (json.error && !json.data) throw new Error(json.error);
        setLeagues(json.data ?? json);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLeaguesLoading(false));

    fetch("/api/teams")
      .then((res) => res.json())
      .then((json) => {
        if (json.error && !json.data) throw new Error(json.error);
        setAllTeams(json.data ?? json);
      })
      .catch((err) => setError(err.message))
      .finally(() => setAllTeamsLoading(false));
  }, []);

  // Fetch league-specific teams when league A changes
  const fetchLeagueTeamsA = useCallback(async (leagueId: number) => {
    setLeagueA(leagueId);
    setTeamA(null);
    setLeagueTeamsALoading(true);
    setMatches([]);
    try {
      const res = await fetch(`/api/teams?league=${leagueId}`);
      const json = await res.json();
      if (json.error && !json.data) throw new Error(json.error);
      setLeagueTeamsA(json.data ?? json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch teams");
    } finally {
      setLeagueTeamsALoading(false);
    }
  }, []);

  // Fetch league-specific teams when league B changes
  const fetchLeagueTeamsB = useCallback(async (leagueId: number) => {
    setLeagueB(leagueId);
    setTeamB(null);
    setLeagueTeamsBLoading(true);
    setMatches([]);
    try {
      const res = await fetch(`/api/teams?league=${leagueId}`);
      const json = await res.json();
      if (json.error && !json.data) throw new Error(json.error);
      setLeagueTeamsB(json.data ?? json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch teams");
    } finally {
      setLeagueTeamsBLoading(false);
    }
  }, []);

  // Clear league → revert to allTeams
  const clearLeagueA = useCallback(() => {
    setLeagueA(null);
    setLeagueTeamsA([]);
    setTeamA(null);
    setMatches([]);
  }, []);

  const clearLeagueB = useCallback(() => {
    setLeagueB(null);
    setLeagueTeamsB([]);
    setTeamB(null);
    setMatches([]);
  }, []);

  // Resolved team lists: league selected → league teams, else → allTeams
  const teamsA = leagueA ? leagueTeamsA : allTeams;
  const teamsALoading = leagueA ? leagueTeamsALoading : allTeamsLoading;
  const teamsB = leagueB ? leagueTeamsB : allTeams;
  const teamsBLoading = leagueB ? leagueTeamsBLoading : allTeamsLoading;

  // Fetch H2H matches
  const fetchH2H = useCallback(async () => {
    if (!teamA || !teamB) return;
    setMatchesLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/h2h?team1=${teamA}&team2=${teamB}`);
      const json = await res.json();
      if (json.error && !json.data) throw new Error(json.error);
      setMatches(json.data ?? json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches");
    } finally {
      setMatchesLoading(false);
    }
  }, [teamA, teamB]);

  // Fetch single team matches
  const fetchSingleMatches = useCallback(async () => {
    if (!teamA) return;
    setMatchesLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches?team=${teamA}`);
      const json = await res.json();
      if (json.error && !json.data) throw new Error(json.error);
      setMatches(json.data ?? json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches");
    } finally {
      setMatchesLoading(false);
    }
  }, [teamA]);

  const canCompare = teamA !== null && teamB !== null && teamA !== teamB;
  const canFetchSingle = teamA !== null;

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
                  onSelect={fetchLeagueTeamsA}
                  onClear={clearLeagueA}
                  loading={leaguesLoading}
                />
                <TeamSelector
                  teams={teamsA}
                  selectedTeam={teamA}
                  onSelect={(id) => { setTeamA(id); setMatches([]); }}
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
                  onSelect={fetchLeagueTeamsB}
                  onClear={clearLeagueB}
                  loading={leaguesLoading}
                />
                <TeamSelector
                  teams={teamsB}
                  selectedTeam={teamB}
                  onSelect={(id) => { setTeamB(id); setMatches([]); }}
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
                  onSelect={fetchLeagueTeamsA}
                  onClear={clearLeagueA}
                  loading={leaguesLoading}
                />
                <TeamSelector
                  teams={teamsA}
                  selectedTeam={teamA}
                  onSelect={(id) => { setTeamA(id); setMatches([]); }}
                  loading={teamsALoading}
                />
              </div>
            </div>

            {/* Venue Filter */}
            {matches.length > 0 && (
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

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-500 hover:text-red-300 underline"
            >
              {t.close}
            </button>
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
        {!matchesLoading && filteredMatches.length === 0 && !error && (
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
