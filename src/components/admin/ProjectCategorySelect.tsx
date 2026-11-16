"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { PROJECT_CATEGORIES } from "@/lib/projects";

type Props = {
  value: string[];
  onChange: (categories: string[]) => void;
  disabled?: boolean;
};

export default function ProjectCategorySelect({
  value,
  onChange,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selected = PROJECT_CATEGORIES.filter((category) =>
    value.includes(category.id)
  );
  const filtered = PROJECT_CATEGORIES.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase().trim())
  );

  function toggle(id: string) {
    if (disabled) return;
    onChange(
      value.includes(id)
        ? value.filter((item) => item !== id)
        : [...value, id]
    );
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#d8d5c9] bg-white px-4 py-3 text-left text-sm text-[#343a2e] transition hover:border-[#7c8467] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#69765a] disabled:opacity-60"
      >
        <span>
          {value.length === 0
            ? "Select project categories"
            : `${value.length} ${value.length === 1 ? "category" : "categories"} selected`}
        </span>
        <ChevronDown size={18} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((category) => (
            <span
              key={category.id}
              className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#d8ddcc] bg-[#eef0e7] px-3 py-2 text-xs font-medium text-[#4b5a3e]"
            >
              <span>{category.title}</span>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Remove ${category.title}`}
                onClick={() => toggle(category.id)}
                className="rounded p-0.5 transition hover:bg-[#dce3d1]"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-xl border border-[#d8d5c9] bg-[#fffefa] shadow-xl">
          <div className="border-b border-[#e8e5dc] p-3">
            <div className="flex items-center gap-2 rounded-lg border border-[#e3e0d7] bg-white px-3">
              <Search size={16} className="text-[#7b8172]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                aria-label="Search project categories"
                className="w-full border-0 bg-transparent py-3 text-sm text-[#343a2e] outline-none"
              />
            </div>
          </div>

          <div
            role="listbox"
            aria-label="Project categories"
            aria-multiselectable="true"
            className="max-h-64 overflow-y-auto p-2"
          >
            {filtered.length === 0 ? (
              <p className="px-3 py-5 text-center text-sm text-[#777b71]">
                No matching categories.
              </p>
            ) : (
              filtered.map((category) => {
                const checked = value.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggle(category.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${checked ? "bg-[#edf0e7] text-[#425337]" : "text-[#343a2e] hover:bg-[#f5f3ec]"}`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-[#647653] bg-[#647653] text-white" : "border-[#b7bdb0] bg-white"}`}
                    >
                      {checked && <Check size={13} />}
                    </span>
                    <span className="flex-1">{category.title}</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#e8e5dc] px-3 py-3">
            <button type="button" onClick={() => onChange([])} className="text-xs font-medium text-[#777b71] hover:text-[#343a2e]">
              Clear all
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-[#4c5940] px-4 py-2 text-xs font-semibold text-white hover:bg-[#394531]">
              Done
            </button>
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <p className="mt-3 text-xs leading-6 text-[#777b71]">
          <strong>Selected:</strong>{" "}
          {selected.map((category) => category.title).join(", ")}
        </p>
      )}
    </div>
  );
}
