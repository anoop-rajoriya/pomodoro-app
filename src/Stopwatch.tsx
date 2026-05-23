import { useState, useRef, useEffect } from "react";
import { usePreferences } from "./PreferencesContext";

const formatTime = (timeInMs: number) => {
  const minutes = String(Math.floor(timeInMs / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((timeInMs % 60000) / 1000)).padStart(
    2,
    "0",
  );
  const hundredths = String(Math.floor((timeInMs % 1000) / 10)).padStart(
    2,
    "0",
  );
  return `${minutes}:${seconds}.${hundredths}`;
};

export default function Stopwatch() {
  const { accentHex } = usePreferences();
  const [time, setTime] = useState(0);
  const [action, setAction] = useState<"ideal" | "start" | "pause">("ideal");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    setAction("start");
    const startTime = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTime);
    }, 10);
  };

  const pause = () => {
    setAction("pause");
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const restart = () => {
    setAction("ideal");
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
  };

  // 1. Calculate how far we are into the current minute (0 to 1)
  const progressPercentage = (time % 60000) / 60000;

  // 2. Map that to our 100-based offset system
  // 100 is completely empty, 0 is completely full.
  const strokeDashoffset = 100 - progressPercentage * 100;

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
                // Note: We remove the CSS 'transition' property here.
                // Because our interval runs every 10ms, the animation is naturally smooth.
                // If we kept the CSS transition, the circle would visually "rewind" backwards when hitting 60 seconds!
              }}
            />
          </svg>

          {/* Time & Controls */}
          <div className="relative z-10 flex flex-col items-center space-y-2 md:space-y-4 pt-4 md:pt-6">
            <h2 className="font-bold text-6xl md:text-[6.5rem] tracking-tighter text-primary">
              {formatTime(time)}
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
                <button
                  onClick={pause}
                  className="hover:text-primary transition py-2"
                >
                  Pause
                </button>
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
    </div>
  );
}
