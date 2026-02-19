"use client";

import { useState, useEffect, useCallback } from "react";
import { League, Team, Match } from "@/types";
import Header from "@/components/Header";
import LeagueSelector from "@/components/LeagueSelector";
import TeamSelector from "@/components/TeamSelector";
import MatchList from "@/components/MatchList";

type Mode = "h2h" | "single";

export default function Home() {
  const [mode, setMode] = useState<Mode>("h2h");

  // Leagues
  const [leagues, setLeagues] = useState<League[]>([]);
  const [leaguesLoading, setLeaguesLoading] = useState(true);

  // Team A
  const [leagueA, setLeagueA] = useState<number | null>(null);
  const [teamsA, setTeamsA] = useState<Team[]>([]);
  const [teamsALoading, setTeamsALoading] = useState(false);
  const [teamA, setTeamA] = useState<number | null>(null);

  // Team B
  const [leagueB, setLeagueB] = useState<number | null>(null);
  const [teamsB, setTeamsB] = useState<Team[]>([]);
  const [teamsBLoading, setTeamsBLoading] = useState(false);
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
  };

  // Fetch leagues on mount
  useEffect(() => {
    fetch("/api/leagues")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setLeagues(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLeaguesLoading(false));
  }, []);

  // Fetch teams when league A changes
  const fetchTeamsA = useCallback(async (leagueId: number) => {
    setLeagueA(leagueId);
    setTeamA(null);
    setTeamsALoading(true);
    setMatches([]);
    try {
      const res = await fetch(`/api/teams?league=${leagueId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTeamsA(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch teams");
    } finally {
      setTeamsALoading(false);
    }
  }, []);

  // Fetch teams when league B changes
  const fetchTeamsB = useCallback(async (leagueId: number) => {
    setLeagueB(leagueId);
    setTeamB(null);
    setTeamsBLoading(true);
    setMatches([]);
    try {
      const res = await fetch(`/api/teams?league=${leagueId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTeamsB(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch teams");
    } finally {
      setTeamsBLoading(false);
    }
  }, []);

  // Fetch H2H matches
  const fetchH2H = useCallback(async () => {
    if (!teamA || !teamB) return;
    setMatchesLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/h2h?team1=${teamA}&team2=${teamB}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMatches(data);
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
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMatches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches");
    } finally {
      setMatchesLoading(false);
    }
  }, [teamA]);

  const canCompare = teamA !== null && teamB !== null && teamA !== teamB;
  const canFetchSingle = teamA !== null;

  const teamAName =
    teamsA.find((t) => t.id === teamA)?.name ||
    teamsB.find((t) => t.id === teamA)?.name ||
    "";
  const teamBName =
    teamsB.find((t) => t.id === teamB)?.name ||
    teamsA.find((t) => t.id === teamB)?.name ||
    "";

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
              H2H Karşılaştırma
            </button>
            <button
              onClick={() => switchMode("single")}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all ${
                mode === "single"
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tek Takım
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
                  Takım A
                </h3>
                <LeagueSelector
                  leagues={leagues}
                  selectedLeague={leagueA}
                  onSelect={fetchTeamsA}
                  loading={leaguesLoading}
                />
                <TeamSelector
                  teams={teamsA}
                  selectedTeam={teamA}
                  onSelect={(id) => {
                    setTeamA(id);
                    setMatches([]);
                  }}
                  loading={teamsALoading}
                  disabled={!leagueA}
                />
              </div>

              {/* Team B */}
              <div className="bg-surface border border-surface-lighter rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wider">
                  Takım B
                </h3>
                <LeagueSelector
                  leagues={leagues}
                  selectedLeague={leagueB}
                  onSelect={fetchTeamsB}
                  loading={leaguesLoading}
                />
                <TeamSelector
                  teams={teamsB}
                  selectedTeam={teamB}
                  onSelect={(id) => {
                    setTeamB(id);
                    setMatches([]);
                  }}
                  loading={teamsBLoading}
                  disabled={!leagueB}
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
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Karşılaştır
                  </>
                )}
              </button>
              {teamA && teamB && teamA === teamB && (
                <p className="text-xs text-red-400 mt-2">
                  Lütfen farklı iki takım seçin.
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
                  Takım Seç
                </h3>
                <LeagueSelector
                  leagues={leagues}
                  selectedLeague={leagueA}
                  onSelect={fetchTeamsA}
                  loading={leaguesLoading}
                />
                <TeamSelector
                  teams={teamsA}
                  selectedTeam={teamA}
                  onSelect={(id) => {
                    setTeamA(id);
                    setMatches([]);
                  }}
                  loading={teamsALoading}
                  disabled={!leagueA}
                />
              </div>
            </div>

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
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Maçları Getir
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
              Kapat
            </button>
          </div>
        )}

        {/* Match Results */}
        <MatchList
          matches={matches}
          loading={matchesLoading}
          mode={mode}
          team1Id={teamA || 0}
          team2Id={teamB || 0}
          team1Name={teamAName}
          team2Name={mode === "single" ? "" : teamBName}
        />

        {/* Empty state */}
        {!matchesLoading && matches.length === 0 && !error && (
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
              {mode === "h2h"
                ? "İki takım seçin ve karşılaştırma yapın"
                : "Bir takım seçin ve maçlarını görüntüleyin"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
