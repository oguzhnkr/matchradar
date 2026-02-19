"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Team } from "@/types";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

interface TeamSelectorProps {
  teams: Team[];
  selectedTeam: number | null;
  onSelect: (teamId: number, team: Team) => void;
  loading?: boolean;
  disabled?: boolean;
  hasLeague?: boolean;
}

export default function TeamSelector({
  teams,
  selectedTeam,
  onSelect,
  loading,
  disabled,
  hasLeague,
}: TeamSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [searching, setSearching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Track selected team locally for display when no league is set
  const [selectedTeamObj, setSelectedTeamObj] = useState<Team | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Debounced search when no league is selected
  const doSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 3) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/teams/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setSearchResults(json.data ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (!hasLeague) {
      doSearch(value);
    }
  };

  const { t } = useLang();
  const selected = teams.find((tm) => tm.id === selectedTeam) || selectedTeamObj;

  // When in league mode, filter local teams
  const filteredLocal = teams.filter((tm) =>
    tm.name.toLowerCase().includes(search.toLowerCase())
  );

  // Which list to show
  const isSearchMode = !hasLeague;
  const displayList = isSearchMode ? searchResults : filteredLocal;
  const showMinCharsHint = isSearchMode && search.length > 0 && search.length < 3;

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-400">{t.team}</label>
        <div className="h-11 bg-surface-light rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2" ref={ref}>
      <label className="block text-sm font-medium text-gray-400">{t.team}</label>
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => {
            if (!disabled) {
              setOpen(!open);
              setSearch("");
              if (!hasLeague) setSearchResults([]);
            }
          }}
          disabled={disabled}
          className="w-full flex items-center gap-2 bg-surface-light border border-surface-lighter rounded-lg px-4 py-2.5 pr-10 text-sm text-left focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {selected ? (
            <div className="flex items-center gap-2">
              {selected.logo && (
                <Image src={selected.logo} alt="" width={20} height={20} />
              )}
              <span className="text-white">{selected.name}</span>
            </div>
          ) : (
            <span className="text-gray-500">
              {isSearchMode ? t.searchTeamByName : t.selectTeamPlaceholder}
            </span>
          )}
        </button>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 mt-1 w-full bg-surface-light border border-surface-lighter rounded-lg shadow-xl overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-surface-lighter">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={isSearchMode ? t.searchTeamByName : t.searchTeam}
                className="w-full bg-surface border border-surface-lighter rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            {/* List */}
            <ul className="max-h-56 overflow-y-auto">
              {showMinCharsHint ? (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  {t.minThreeChars}
                </li>
              ) : searching ? (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  {t.searching}
                </li>
              ) : isSearchMode && search.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  {t.typeToSearch}
                </li>
              ) : displayList.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  {t.teamNotFound}
                </li>
              ) : (
                displayList.map((team) => (
                  <li key={team.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTeamObj(team);
                        onSelect(team.id, team);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-lighter transition-colors ${
                        team.id === selectedTeam
                          ? "bg-accent/10 text-accent"
                          : "text-gray-300"
                      }`}
                    >
                      {team.logo && (
                        <Image src={team.logo} alt="" width={24} height={24} />
                      )}
                      {team.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
