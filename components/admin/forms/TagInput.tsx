"use client";

import { useState } from "react";
import { X } from "lucide-react";

/** Tags as removable chips; Enter or comma adds one. New tags are created on save. */
export function TagInput({ id, value, onChange, suggestions }: { id: string; value: string[]; onChange: (v: string[]) => void; suggestions: string[] }) {
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const t = raw.trim().replace(/^#/, "").slice(0, 60);
    if (!t || value.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    onChange([...value, t]);
  };
  return (
    <div>
      <div className="adm-input flex min-h-10 flex-wrap items-center gap-1.5 py-1.5">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-0.5 pr-1 pl-2 text-xs font-medium text-brand-800 dark:bg-brand-400/10 dark:text-brand-200">
            #{t}
            <button type="button" className="rounded-full p-0.5 hover:bg-brand-100 dark:hover:bg-white/10" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove tag ${t}`}>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          list={`${id}-suggestions`}
          className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none"
          value={draft}
          placeholder={value.length ? "" : "Type a tag and press Enter"}
          onChange={(e) => {
            const val = e.target.value;
            if (val.endsWith(",")) {
              add(val.slice(0, -1));
              setDraft("");
            } else setDraft(val);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
              setDraft("");
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => {
            if (draft) {
              add(draft);
              setDraft("");
            }
          }}
        />
      </div>
      <datalist id={`${id}-suggestions`}>
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}
