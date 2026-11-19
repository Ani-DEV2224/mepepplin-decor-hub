
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

export type StudioTheme = "ivory" | "stone" | "night";

type ThemeContextValue = {
  theme: StudioTheme;
  setTheme: (theme: StudioTheme) => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "mepepplin-studio-theme";

const palette: Record<StudioTheme, Record<string,string>> = {
  ivory: {
    "--studio-paper":"#FFFFF0", "--studio-ink":"#111111", "--studio-muted":"#474149", "--studio-line":"rgba(17,17,17,.18)", "--studio-accent":"#5B2488", "--studio-surface":"#F6F2E6", "--studio-surface-raised":"#FFFFF0", "--studio-accent-soft":"#F8F517",
    "--mdh-home-bg":"#FFFFF0", "--mdh-home-panel":"#F6F2E6", "--mdh-home-field":"#FFFFF0", "--mdh-home-ink":"#111111", "--mdh-home-muted":"#474149", "--mdh-home-accent":"#5B2488", "--mdh-home-accent-ink":"#FFFFF0", "--mdh-home-line":"rgba(17,17,17,.18)"
  },
  stone: {}, night: {}
};

function isTheme(
  value: string | null
): value is StudioTheme {
  return (
    value === "ivory" ||
    value === "stone" ||
    value === "night"
  );
}

export function StudioThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const theme: StudioTheme = "ivory";
  const setTheme = useCallback((_next: StudioTheme) => {}, []);

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="studio-theme-root"
        data-studio-theme={theme}
        style={
          {
            ...palette[theme],
            colorScheme:
              theme === "night" ? "dark" : "light",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useStudioTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useStudioTheme must be used inside StudioThemeProvider"
    );
  }

  return context;
}
