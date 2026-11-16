
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

const palette: Record<
  StudioTheme,
  Record<string, string>
> = {
  ivory: {
    "--studio-paper": "#F4F0E8",
    "--studio-ink": "#332B27",
    "--studio-muted": "#786E64",
    "--studio-line": "rgba(51,43,39,.18)",
    "--studio-accent": "#A78C69",
    "--studio-surface": "#EAE3D8",
    "--studio-surface-raised": "#FAF7F1",
    "--studio-accent-soft": "#D9CCB8",

    "--mdh-home-bg": "#F0E9DF",
    "--mdh-home-panel": "#E7DED1",
    "--mdh-home-field": "#FAF6EF",
    "--mdh-home-ink": "#292722",
    "--mdh-home-muted": "#68645D",
    "--mdh-home-accent": "#967A55",
    "--mdh-home-accent-ink": "#FFFFFF",
    "--mdh-home-line": "rgba(41,39,34,.20)",
  },

  stone: {
    "--studio-paper": "#D9CEBE",
    "--studio-ink": "#352B24",
    "--studio-muted": "#6E6054",
    "--studio-line": "rgba(53,43,36,.20)",
    "--studio-accent": "#A98D71",
    "--studio-surface": "#CFC0AD",
    "--studio-surface-raised": "#F0E8DC",
    "--studio-accent-soft": "#BCA58C",

    "--mdh-home-bg": "#D9CEBE",
    "--mdh-home-panel": "#CFC0AD",
    "--mdh-home-field": "#F0E8DC",
    "--mdh-home-ink": "#352B24",
    "--mdh-home-muted": "#6E6054",
    "--mdh-home-accent": "#927354",
    "--mdh-home-accent-ink": "#FFFFFF",
    "--mdh-home-line": "rgba(53,43,36,.22)",
  },

  night: {
    "--studio-paper": "#141414",
    "--studio-ink": "#EDE7DE",
    "--studio-muted": "#AFA79B",
    "--studio-line": "rgba(237,231,222,.20)",
    "--studio-accent": "#C2A77D",
    "--studio-surface": "#262523",
    "--studio-surface-raised": "#302E2A",
    "--studio-accent-soft": "#665744",

    "--mdh-home-bg": "#191C19",
    "--mdh-home-panel": "#262B26",
    "--mdh-home-field": "#1D231E",
    "--mdh-home-ink": "#F5F1E9",
    "--mdh-home-muted": "#B9BCB2",
    "--mdh-home-accent": "#C9B99B",
    "--mdh-home-accent-ink": "#191C19",
    "--mdh-home-line": "rgba(255,255,255,.17)",
  },
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
  const [theme, updateTheme] =
    useState<StudioTheme>("ivory");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (isTheme(stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateTheme(stored);
        return;
      }
    } catch {
      // Local storage may be unavailable.
    }

    if (
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
    ) {
      updateTheme("night");
    }
  }, []);

  useEffect(() => {
    // Compatibility with older CSS using
    // :root[data-theme="light" | "dark"].
    document.documentElement.dataset.theme =
      theme === "night" ? "dark" : "light";

    document.documentElement.dataset.studioTheme =
      theme;

    return () => {
      delete document.documentElement.dataset.theme;
      delete document.documentElement.dataset.studioTheme;
    };
  }, [theme]);

  const setTheme = useCallback(
    (next: StudioTheme) => {
      updateTheme(next);

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Theme remains active in React state.
      }
    },
    []
  );

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
