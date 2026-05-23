import { useState } from "react";
import Stopwatch from "./Stopwatch";
import Timer from "./Timer";
import Settings from "./Settings";
import { usePreferences } from "./PreferencesContext";

type Mode = "stopwatch" | "timer";

function App() {
  const [activeMode, setActiveMode] = useState<Mode>("stopwatch");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { accentHex } = usePreferences();

  return (
    <div className="bg-main text-primary min-h-svh flex flex-col items-center justify-between py-8 md:py-12 relative overflow-hidden">
      {/* Top Section: Title & Navigation */}
      <div className="flex flex-col items-center w-full px-4">
        <h1 className="font-bold text-2xl md:text-3xl mb-8 tracking-wide">
          pomodoro
        </h1>

        <nav className="bg-surface z-10 flex p-1.5 rounded-full w-full max-w-[320px] md:max-w-95 relative">
          <div
            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full transition-all duration-300 ease-out"
            style={{
              backgroundColor: accentHex,
              left: activeMode === "stopwatch" ? "6px" : "calc(50% + 3px)",
            }}
          />
          {(["stopwatch", "timer"] as Mode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMode(tab)}
              className={`flex-1 relative z-10 py-3 rounded-full text-sm md:text-base font-bold transition-colors ${
                activeMode === tab
                  ? "text-main"
                  : "text-muted hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Middle Section: The Active Dial */}
      <main className="flex-1 flex flex-col justify-center items-center w-full max-w-lg px-4 my-8">
        <div
          className={`w-full ${activeMode === "stopwatch" ? "block" : "hidden"}`}
        >
          <Stopwatch />
        </div>
        <div
          className={`w-full ${activeMode === "timer" ? "block" : "hidden"}`}
        >
          <Timer />
        </div>
      </main>

      {/* Bottom Section: Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="text-muted hover:text-primary transition-colors cursor-pointer p-4"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {/* Settings Modal */}
      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}

export default App;
