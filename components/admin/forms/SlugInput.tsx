"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { slugify } from "@/lib/slug";
import { describedBy, Field } from "../ui/Field";

/**
 * Slug that follows the title automatically until the editor changes it by hand.
 * Changing the slug of published content creates a redirect from the old URL automatically.
 */
export function SlugInput({
  value,
  onChange,
  title,
  prefix,
  error,
  disabled,
  published,
}: {
  value: string;
  onChange: (v: string) => void;
  title: string;
  prefix: string;
  error?: string;
  disabled?: boolean;
  published?: boolean;
}) {
  const [touched, setTouched] = useState(Boolean(value));
  const auto = slugify(title);
  const shown = touched ? value : auto;
  useEffect(() => {
    if (!touched && !disabled && auto !== value) onChange(auto);
  }, [touched, disabled, auto, value, onChange]);
  return (
    <Field
      label="Slug"
      htmlFor="slug"
      error={error}
      help={published ? "This is live. Changing it adds an automatic redirect from the old URL." : "Lowercase letters, numbers and hyphens."}
    >
      <div className="flex rounded-lg shadow-[inset_0_1px_1px_rgb(15_23_42/0.04)]">
        <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 font-mono text-xs text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
          {prefix}
        </span>
        <input
          id="slug"
          className="adm-input rounded-none font-mono"
          value={shown}
          disabled={disabled}
          onChange={(e) => {
            setTouched(true);
            onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-"));
          }}
          {...describedBy("slug", error, true)}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setTouched(false);
            onChange(auto);
          }}
          className="inline-flex items-center rounded-r-lg border border-l-0 border-slate-300 px-3 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/5"
          aria-label="Regenerate slug from title"
          title="Regenerate from title"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </Field>
  );
}
