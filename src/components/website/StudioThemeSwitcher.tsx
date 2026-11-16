
"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Check,
  ChevronDown,
  Palette,
} from "lucide-react";

import {
  useStudioTheme,
  type StudioTheme,
} from "./StudioThemeProvider";

const themes: {
  id: StudioTheme;
  label: string;
  color: string;
}[] = [
  {
    id: "ivory",
    label: "Ivory",
    color: "#F4F0E8",
  },
  {
    id: "stone",
    label: "Stone",
    color: "#D9CEBE",
  },
  {
    id: "night",
    label: "Night",
    color: "#141414",
  },
];

export default function StudioThemeSwitcher() {
  const { theme, setTheme } = useStudioTheme();

  const [open, setOpen] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener(
        "pointerdown",
        onPointer
      );
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="studio-atmosphere" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="studio-theme-trigger studio-atmosphere-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Current theme: ${theme}. Choose website theme`}
      >
        <Palette size={16} strokeWidth={1.5} />

        <span className="studio-atmosphere-trigger-label">
          THEME
        </span>

        <ChevronDown
          size={12}
          className={open ? "is-open" : ""}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            className="studio-atmosphere-panel"
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: reducedMotion ? 0 : -5,
            }}
            transition={{
              duration: reducedMotion ? 0.1 : 0.18,
            }}
          >
            <span className="studio-atmosphere-compact-heading">
              COLOUR THEME
            </span>

            {themes.map((option) => {
              const selected = theme === option.id;

              return (
                <button
                  type="button"
                  key={option.id}
                  className={`studio-atmosphere-option ${
                    selected ? "is-selected" : ""
                  }`}
                  aria-pressed={selected}
                  onClick={() => {
                    setTheme(option.id);
                    setOpen(false);
                  }}
                >
                  <span
                    className="studio-atmosphere-swatch"
                    style={{
                      backgroundColor: option.color,
                    }}
                  />

                  <span>{option.label}</span>

                  {selected && (
                    <Check
                      size={15}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
