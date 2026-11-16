
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion() === true;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light"
          ? "Switch to dark theme"
          : "Switch to light theme"
      }
      title={
        theme === "light"
          ? "Dark mode"
          : "Light mode"
      }
      className="mdh-theme-toggle relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border transition-colors"
    >
      <motion.span
        key={theme}
        initial={{
          opacity: reducedMotion ? 1 : 0,
          rotate: reducedMotion ? 0 : -35,
          scale: reducedMotion ? 1 : 0.8,
        }}
        animate={{
          opacity: 1,
          rotate: 0,
          scale: 1,
        }}
        transition={{ duration: reducedMotion ? 0 : 0.25 }}
      >
        {theme === "light" ? (
          <Moon size={18} strokeWidth={1.6} />
        ) : (
          <Sun size={18} strokeWidth={1.6} />
        )}
      </motion.span>
    </button>
  );
}
