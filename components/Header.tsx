import { useLang } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="py-6 sm:py-8">
      <div className="flex items-center justify-between">
        <div className="w-16" />
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-accent"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="2"
                  y1="12"
                  x2="22"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Match<span className="text-accent">Radar</span>
          </h1>
        </div>
        <div className="flex items-center gap-1 bg-surface border border-surface-lighter rounded-lg p-0.5">
          <button
            onClick={() => setLang("tr")}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
              lang === "tr" ? "bg-accent text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            TR
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
              lang === "en" ? "bg-accent text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-400 text-center">
        {t.subtitle}
      </p>
    </header>
  );
}
