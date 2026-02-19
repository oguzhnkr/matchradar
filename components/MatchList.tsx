"use client";

import { Match } from "@/types";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: Match[];
  loading: boolean;
  mode: "h2h" | "single";
  team1Id: number;
  team2Id: number;
  team1Name: string;
  team2Name: string;
}

export default function MatchList({
  matches,
  loading,
  mode,
  team1Id,
  team2Id,
  team1Name,
  team2Name,
}: MatchListProps) {
  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Maçlar yükleniyor...
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-surface-lighter rounded-xl p-4 animate-pulse"
          >
            <div className="h-4 bg-surface-light rounded w-1/3 mb-3" />
            <div className="flex items-center justify-between">
              <div className="h-8 bg-surface-light rounded w-1/4" />
              <div className="h-8 bg-surface-light rounded w-16" />
              <div className="h-8 bg-surface-light rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  if (mode === "single") {
    // W / D / L stats for the selected team
    const wins = matches.filter(
      (m) =>
        (m.home.id === team1Id && m.home.winner === true) ||
        (m.away.id === team1Id && m.away.winner === true)
    ).length;
    const draws = matches.filter(
      (m) => m.home.winner === null && m.goals.home !== null
    ).length;
    const losses = matches.length - wins - draws;

    return (
      <div className="mt-8">
        {/* Summary */}
        <div className="bg-surface border border-surface-lighter rounded-xl p-6 mb-6">
          <h2 className="text-center text-sm font-medium text-gray-400 mb-4">
            {team1Name} - Son {matches.length} Maç
          </h2>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{wins}</div>
              <div className="text-xs text-gray-500 mt-1">Galibiyet</div>
              <div className="text-xs text-accent/70 mt-0.5">%{matches.length ? Math.round((wins / matches.length) * 100) : 0}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{draws}</div>
              <div className="text-xs text-gray-500 mt-1">Beraberlik</div>
              <div className="text-xs text-yellow-400/70 mt-0.5">%{matches.length ? Math.round((draws / matches.length) * 100) : 0}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{losses}</div>
              <div className="text-xs text-gray-500 mt-1">Mağlubiyet</div>
              <div className="text-xs text-red-400/70 mt-0.5">%{matches.length ? Math.round((losses / matches.length) * 100) : 0}</div>
            </div>
          </div>
        </div>

        {/* Match Cards */}
        <div className="space-y-3">
          {matches.map((match, index) => (
            <div
              key={match.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // H2H mode
  const team1Wins = matches.filter(
    (m) =>
      (m.home.id === team1Id && m.home.winner) ||
      (m.away.id === team1Id && m.away.winner)
  ).length;
  const team2Wins = matches.filter(
    (m) =>
      (m.home.id === team2Id && m.home.winner) ||
      (m.away.id === team2Id && m.away.winner)
  ).length;
  const draws = matches.filter(
    (m) => m.home.winner === null && m.goals.home !== null
  ).length;

  return (
    <div className="mt-8">
      {/* Summary */}
      <div className="bg-surface border border-surface-lighter rounded-xl p-6 mb-6">
        <h2 className="text-center text-sm font-medium text-gray-400 mb-4">
          Son {matches.length} Maç
        </h2>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{team1Wins}</div>
            <div className="text-xs text-gray-500 mt-1 truncate max-w-24">
              {team1Name}
            </div>
            <div className="text-xs text-accent/70 mt-0.5">%{matches.length ? Math.round((team1Wins / matches.length) * 100) : 0}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{draws}</div>
            <div className="text-xs text-gray-500 mt-1">Beraberlik</div>
            <div className="text-xs text-yellow-400/70 mt-0.5">%{matches.length ? Math.round((draws / matches.length) * 100) : 0}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{team2Wins}</div>
            <div className="text-xs text-gray-500 mt-1 truncate max-w-24">
              {team2Name}
            </div>
            <div className="text-xs text-accent/70 mt-0.5">%{matches.length ? Math.round((team2Wins / matches.length) * 100) : 0}</div>
          </div>
        </div>
      </div>

      {/* Match Cards */}
      <div className="space-y-3">
        {matches.map((match, index) => (
          <div
            key={match.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MatchCard match={match} />
          </div>
        ))}
      </div>
    </div>
  );
}
