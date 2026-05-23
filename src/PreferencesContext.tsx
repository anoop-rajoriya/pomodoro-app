import React, { createContext, useContext, useState, useEffect } from "react";

type ColorTheme = "coral" | "cyan" | "purple";
type FontTheme = "sans" | "mono";

interface PreferencesContextType {
  color: ColorTheme;
  setColor: (color: ColorTheme) => void;
  font: FontTheme;
  setFont: (font: FontTheme) => void;
  presets: [number, number, number];
  setPresets: (presets: [number, number, number]) => void;
  accentHex: string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [color, setColor] = useState<ColorTheme>("coral");
  const [font, setFont] = useState<FontTheme>("sans");
  // Default presets: 15min, 25min, 50min
  const [presets, setPresets] = useState<[number, number, number]>([
    15, 25, 50,
  ]);

  const accentHex =
    color === "coral" ? "#f87070" : color === "cyan" ? "#70f3f8" : "#d881f8";

  // Apply font class to body dynamically
  useEffect(() => {
    document.body.style.fontFamily =
      font === "sans" ? "var(--font-sans)" : "var(--font-timer)";
  }, [font]);

  return (
    <PreferencesContext.Provider
      value={{ color, setColor, font, setFont, presets, setPresets, accentHex }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context)
    throw new Error("usePreferences must be used within a Provider");
  return context;
};
