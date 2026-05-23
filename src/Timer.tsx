import React, { useState, useRef, useEffect } from "react";
import { usePreferences } from "./PreferencesContext";

const formatTime = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function Timer() {
  const { presets, accentHex } = usePreferences();
  const [totalTimeMs, setTotalTimeMs] = useState(presets[1] * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(presets[1] * 60 * 1000);
  const [action, setAction] = useState<"ideal" | "start" | "pause">("ideal");
  const [laps, setLaps] = useState<string[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (action === "ideal") {
      setTotalTimeMs(presets[1] * 60 * 1000);
      setTimeLeft(presets[1] * 60 * 1000);
    }
  }, [presets, action]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    if (timeLeft <= 0) return;
    setAction("start");
    const endTime = Date.now() + timeLeft;
    intervalRef.current = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        setAction("ideal");
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setTimeLeft(remaining);
      }
    }, 50);
  };

  const pause = () => {
    setAction("pause");
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const restart = () => {
    setAction("ideal");
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(totalTimeMs);
    setLaps([]);
  };

  const recordLap = () => setLaps((prev) => [...prev, formatTime(timeLeft)]);

  const applyPreset = (minutes: number) => {
    if (action === "start") return;
    const ms = minutes * 60 * 1000;
    setTotalTimeMs(ms);
    setTimeLeft(ms);
    setLaps([]);
  };

  // SVG Configuration - Scaling dynamically via CSS instead of hardcoded radius
  const strokeDashoffset = 100 - (timeLeft / totalTimeMs) * 100;

  return (
    <div className="flex flex-col items-center w-full">
      {/* The Dial */}
      <div className="relative size-72 md:size-100 rounded-full flex items-center justify-center bg-linear-to-tl from-[#1e213f] to-[#161932] shadow-[-20px_-20px_50px_#272c5a,20px_20px_50px_#121530] border-none">
        {/* Inner Surface */}
        <div className="absolute size-[88%] rounded-full bg-surface flex flex-col items-center justify-center shadow-[inset_0px_0px_20px_rgba(0,0,0,0.5)]">
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 size-full transform -rotate-90 overflow-visible">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              stroke="transparent"
              strokeWidth="3%"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              stroke={accentHex}
              strokeWidth="3%"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: "289%", // Approx circumference for r=46%
                strokeDashoffset: `${(strokeDashoffset / 100) * 289}%`,
                transition: "stroke-dashoffset 0.1s linear",
              }}
            />
          </svg>

          {/* Time & Controls */}
          <div className="relative z-10 flex flex-col items-center space-y-2 md:space-y-4 pt-4 md:pt-6">
            <h2 className="font-bold text-6xl md:text-[6.5rem] tracking-tighter text-primary">
              {formatTime(timeLeft)}
            </h2>

            <div className="flex space-x-4 md:space-x-6 text-xs md:text-sm font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-muted ml-2">
              {action === "ideal" && (
                <button
                  onClick={start}
                  className="hover:text-primary transition py-2"
                >
                  Start
                </button>
              )}

              {action === "start" && (
                <>
                  <button
                    onClick={pause}
                    className="hover:text-primary transition py-2"
                  >
                    Pause
                  </button>
                  <button
                    onClick={recordLap}
                    className="hover:text-primary transition py-2"
                  >
                    Lap
                  </button>
                </>
              )}

              {action === "pause" && (
                <>
                  <button
                    onClick={start}
                    className="hover:text-primary transition py-2"
                  >
                    Resume
                  </button>
                  <button
                    onClick={restart}
                    className="hover:text-primary transition py-2"
                  >
                    Restart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-10 md:mt-14 w-full max-w-70 md:max-w-[320px]">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(preset)}
            disabled={action === "start"}
            style={{
              borderColor:
                totalTimeMs === preset * 60 * 1000 ? accentHex : "transparent",
              color: totalTimeMs === preset * 60 * 1000 ? accentHex : "inherit",
            }}
            className={`py-2 px-1 rounded-xl border-2 bg-surface font-bold text-sm md:text-base transition-all disabled:opacity-40
              ${totalTimeMs !== preset * 60 * 1000 ? "text-muted hover:text-primary" : ""}`}
          >
            {preset}m
          </button>
        ))}
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="w-full max-w-70 md:max-w-[320px] mt-6 flex flex-col space-y-2 max-h-32 md:max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {laps.map((lap, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-surface/50 px-4 py-2.5 rounded-lg text-muted text-sm border border-muted/10"
            >
              <span>Lap {i + 1}</span>
              <span className="font-bold text-primary">{lap}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
