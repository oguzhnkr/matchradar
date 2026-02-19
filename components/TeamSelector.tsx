"use client";

import { useState, useRef, useEffect } from "react";
import { Team } from "@/types";
import Image from "next/image";

interface TeamSelectorProps {
  teams: Team[];
  selectedTeam: number | null;
  onSelect: (teamId: number) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function TeamSelector({
  teams,
  selectedTeam,
  onSelect,
  loading,
  disabled,
}: TeamSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const selected = teams.find((t) => t.id === selectedTeam);
  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-400">Takım</label>
        <div className="h-11 bg-surface-light rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2" ref={ref}>
      <label className="block text-sm font-medium text-gray-400">Takım</label>
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => {
            if (!disabled && teams.length > 0) {
              setOpen(!open);
              setSearch("");
            }
          }}
          disabled={disabled || teams.length === 0}
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
              {disabled ? "Önce lig seçin..." : "Takım seçin..."}
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Takım ara..."
                className="w-full bg-surface border border-surface-lighter rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            {/* List */}
            <ul className="max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  Takım bulunamadı
                </li>
              ) : (
                filtered.map((team) => (
                  <li key={team.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(team.id);
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
