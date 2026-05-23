import React, { useState } from "react";
import { usePreferences } from "./PreferencesContext";

export default function Settings({ onClose }: { onClose: () => void }) {
  const { color, setColor, font, setFont, presets, setPresets, accentHex } =
    usePreferences();
  const [localPresets, setLocalPresets] = useState([...presets]);

  const handleApply = () => {
    setPresets(localPresets as [number, number, number]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6">
      {/* Container - constrained widths so it doesn't touch edges on phones */}
      <div className="bg-white rounded-[1.5rem] md:rounded-3xl w-full max-w-[90%] sm:max-w-md relative pb-8 md:pb-10 text-[#161932] shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 transition p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-6 md:space-y-8">
          {/* Time Minutes Grid */}
          <div>
            <h3 className="text-xs md:text-sm font-bold tracking-[0.2em] mb-4 md:mb-5 uppercase text-center md:text-left">
              Time (Minutes)
            </h3>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {["Preset 1", "Preset 2", "Preset 3"].map((label, idx) => (
                <div
                  key={label}
                  className="flex flex-col items-center md:items-start"
                >
                  <label className="text-[10px] md:text-xs text-gray-400 font-bold mb-2">
                    {label}
                  </label>
                  <input
                    type="number"
                    value={localPresets[idx]}
                    onChange={(e) => {
                      const newArr = [...localPresets];
                      newArr[idx] = Number(e.target.value) || 0;
                      setLocalPresets(newArr);
                    }}
                    className="bg-[#e3e8fc] rounded-xl p-3 md:p-4 font-bold text-sm md:text-base w-full outline-none focus:ring-2 transition-shadow text-center md:text-left"
                    style={
                      { "--tw-ring-color": accentHex } as React.CSSProperties
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Font Selection */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <h3 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
              Font
            </h3>
            <div className="flex space-x-4">
              {(["sans", "mono"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFont(f)}
                  className={`size-10 md:size-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition ${
                    font === f
                      ? "bg-[#161932] text-white"
                      : "bg-[#e3e8fc] text-[#161932] hover:ring-2 ring-gray-200 ring-offset-2"
                  } ${f === "sans" ? "font-sans" : "font-mono"}`}
                >
                  Aa
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Color Selection */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <h3 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
              Color
            </h3>
            <div className="flex space-x-4">
              {(["coral", "cyan", "purple"] as const).map((c) => {
                const hex =
                  c === "coral"
                    ? "#f87070"
                    : c === "cyan"
                      ? "#70f3f8"
                      : "#d881f8";
                return (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: hex }}
                    className="size-10 md:size-12 rounded-full flex items-center justify-center transition hover:ring-4 ring-offset-2 ring-gray-100"
                  >
                    {color === c && (
                      <svg
                        width="15"
                        height="11"
                        viewBox="0 0 15 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5.5L4.95263 9.45263L13.4053 1"
                          stroke="#161932"
                          strokeWidth="2.5"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Apply Button */}
        <div className="absolute left-1/2 -bottom-5 md:-bottom-7 -translate-x-1/2">
          <button
            onClick={handleApply}
            style={{ backgroundColor: accentHex }}
            className="text-white px-10 md:px-12 py-4 rounded-full font-bold md:text-lg hover:brightness-110 transition shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
