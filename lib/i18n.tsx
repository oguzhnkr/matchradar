import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "tr" | "en";

const translations = {
  tr: {
    subtitle: "Futbol Karşılaştırma Platformu",
    h2hTab: "H2H Karşılaştırma",
    singleTab: "Tek Takım",
    teamA: "Takım A",
    teamB: "Takım B",
    selectTeam: "Takım Seç",
    league: "Lig",
    team: "Takım",
    selectLeague: "Lig seçin...",
    selectTeamPlaceholder: "Takım seçin...",
    selectLeagueFirst: "Önce lig seçin...",
    searchTeam: "Takım ara...",
    teamNotFound: "Takım bulunamadı",
    compare: "Karşılaştır",
    fetchMatches: "Maçları Getir",
    loading: "Yükleniyor...",
    loadingMatches: "Maçlar yükleniyor...",
    selectTwoDifferent: "Lütfen farklı iki takım seçin.",
    close: "Kapat",
    h2hEmpty: "İki takım seçin ve karşılaştırma yapın",
    singleEmpty: "Bir takım seçin ve maçlarını görüntüleyin",
    last: "Son",
    matches: "Maç",
    win: "Galibiyet",
    draw: "Beraberlik",
    loss: "Mağlubiyet",
    all: "Tümü",
    home: "İç Saha",
    away: "Deplasman",
    apiKeyMissing: "API anahtarı yapılandırılmamış. Lütfen API_FOOTBALL_KEY ortam değişkenini ayarlayın.",
  },
  en: {
    subtitle: "Football Comparison Platform",
    h2hTab: "H2H Comparison",
    singleTab: "Single Team",
    teamA: "Team A",
    teamB: "Team B",
    selectTeam: "Select Team",
    league: "League",
    team: "Team",
    selectLeague: "Select league...",
    selectTeamPlaceholder: "Select team...",
    selectLeagueFirst: "Select league first...",
    searchTeam: "Search team...",
    teamNotFound: "Team not found",
    compare: "Compare",
    fetchMatches: "Get Matches",
    loading: "Loading...",
    loadingMatches: "Loading matches...",
    selectTwoDifferent: "Please select two different teams.",
    close: "Close",
    h2hEmpty: "Select two teams and compare",
    singleEmpty: "Select a team to view matches",
    last: "Last",
    matches: "Matches",
    win: "Win",
    draw: "Draw",
    loss: "Loss",
    all: "All",
    home: "Home",
    away: "Away",
    apiKeyMissing: "API key is not configured. Please set the API_FOOTBALL_KEY environment variable.",
  },
} as const;

export type Translations = { [K in keyof typeof translations.tr]: string };

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({
  lang: "tr",
  setLang: () => {},
  t: translations.tr,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "tr" || saved === "en") setLang(saved);
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
