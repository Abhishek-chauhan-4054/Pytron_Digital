"use client";

import { useId, useRef, type ReactNode } from "react";

/** Accessible tabs (arrow keys move between tabs). Panels stay mounted so form state is kept. */
export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: ReactNode; badge?: ReactNode; content: ReactNode }[]; active: string; onChange: (k: string) => void }) {
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div>
      <div role="tablist" aria-orientation="horizontal" className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-white/10">
        {tabs.map((t, i) => {
          const selected = t.key === active;
          return (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${base}-tab-${t.key}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${t.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(t.key)}
              onKeyDown={(e) => {
                const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                if (!dir) return;
                e.preventDefault();
                const next = (i + dir + tabs.length) % tabs.length;
                onChange(tabs[next].key);
                refs.current[next]?.focus();
              }}
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                selected
                  ? "border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-200"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.label}
              {t.badge}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div key={t.key} role="tabpanel" id={`${base}-panel-${t.key}`} aria-labelledby={`${base}-tab-${t.key}`} hidden={t.key !== active} className="pt-5">
          {t.content}
        </div>
      ))}
    </div>
  );
}
