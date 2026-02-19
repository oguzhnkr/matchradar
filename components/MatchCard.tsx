import { Match } from "@/types";
import Image from "next/image";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const date = new Date(match.date);
  const formattedDate = date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isHomeWinner = match.home.winner === true;
  const isAwayWinner = match.away.winner === true;
  const isDraw = match.home.winner === null && match.goals.home !== null;

  return (
    <div className="group bg-surface border border-surface-lighter rounded-xl p-3 sm:p-4 hover:border-accent/30 transition-all duration-300">
      {/* League & Date */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {match.league.logo && (
            <Image
              src={match.league.logo}
              alt={match.league.name}
              width={16}
              height={16}
              className="opacity-60 shrink-0"
            />
          )}
          <span className="text-[10px] sm:text-xs text-gray-500 truncate">
            {match.league.name}
          </span>
        </div>
        <span className="text-[10px] sm:text-xs text-gray-500 shrink-0 ml-2">
          {formattedDate}
        </span>
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Home Team */}
        <div
          className={`flex items-center gap-2 sm:gap-3 flex-1 min-w-0 ${
            isHomeWinner ? "opacity-100" : "opacity-60"
          }`}
        >
          <Image
            src={match.home.logo}
            alt={match.home.name}
            width={28}
            height={28}
            className="shrink-0 w-6 h-6 sm:w-8 sm:h-8"
          />
          <span
            className={`text-xs sm:text-sm font-medium truncate ${
              isHomeWinner ? "text-white" : "text-gray-400"
            }`}
          >
            {match.home.name}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span
            className={`text-lg sm:text-xl font-bold w-6 sm:w-8 text-center ${
              isHomeWinner
                ? "text-accent"
                : isDraw
                  ? "text-yellow-400"
                  : "text-gray-400"
            }`}
          >
            {match.goals.home ?? "-"}
          </span>
          <span className="text-gray-600 text-xs sm:text-sm">:</span>
          <span
            className={`text-lg sm:text-xl font-bold w-6 sm:w-8 text-center ${
              isAwayWinner
                ? "text-accent"
                : isDraw
                  ? "text-yellow-400"
                  : "text-gray-400"
            }`}
          >
            {match.goals.away ?? "-"}
          </span>
        </div>

        {/* Away Team */}
        <div
          className={`flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0 ${
            isAwayWinner ? "opacity-100" : "opacity-60"
          }`}
        >
          <span
            className={`text-xs sm:text-sm font-medium truncate text-right ${
              isAwayWinner ? "text-white" : "text-gray-400"
            }`}
          >
            {match.away.name}
          </span>
          <Image
            src={match.away.logo}
            alt={match.away.name}
            width={28}
            height={28}
            className="shrink-0 w-6 h-6 sm:w-8 sm:h-8"
          />
        </div>
      </div>

      {/* Venue & Halftime */}
      <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-surface-lighter">
        <span className="text-[10px] sm:text-xs text-gray-600 truncate">
          {match.venue}
        </span>
        {match.score.halftime.home !== null && (
          <span className="text-[10px] sm:text-xs text-gray-600 shrink-0 ml-2">
            HT: {match.score.halftime.home} - {match.score.halftime.away}
          </span>
        )}
      </div>
    </div>
  );
}
