"use client";

import { League } from "@/types";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: number | null;
  onSelect: (leagueId: number) => void;
  onClear?: () => void;
  loading?: boolean;
}

export default function LeagueSelector({
  leagues,
  selectedLeague,
  onSelect,
  onClear,
  loading,
}: LeagueSelectorProps) {
  const { t } = useLang();

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-400">{t.league}</label>
        <div className="h-11 bg-surface-light rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400">{t.league}</label>
      <div className="relative">
        <select
          value={selectedLeague ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              onClear?.();
            } else {
              onSelect(Number(val));
            }
          }}
          className="w-full appearance-none bg-surface-light border border-surface-lighter rounded-lg px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer"
        >
          <option value="">
            {t.selectLeague}
          </option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.flag ? `${league.country} - ` : ""}
              {league.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {selectedLeague && (
        <div className="flex items-center gap-2 mt-1">
          {leagues.find((l) => l.id === selectedLeague)?.logo && (
            <Image
              src={leagues.find((l) => l.id === selectedLeague)!.logo}
              alt=""
              width={20}
              height={20}
              className="opacity-60"
            />
          )}
          <span className="text-xs text-gray-500">
            {leagues.find((l) => l.id === selectedLeague)?.name}
          </span>
        </div>
      )}
    </div>
  );
}
