"use client";

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "../ui/Button";

/** Editable list of short strings (e.g. service features). */
export function ListInput({ id, value, onChange, itemLabel, errors = {} }: { id: string; value: string[]; onChange: (v: string[]) => void; itemLabel: string; errors?: Record<number, string> }) {
  const swap = (i: number, j: number) => {
    const n = [...value];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div>
      <ol className="space-y-2" id={id}>
        {value.map((item, i) => (
          <li key={i}>
            <div className="flex items-center gap-1">
              <label htmlFor={`${id}-${i}`} className="sr-only">
                {itemLabel} {i + 1}
              </label>
              <input id={`${id}-${i}`} className="adm-input" value={item} aria-invalid={errors[i] ? true : undefined} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5" disabled={i === 0} onClick={() => swap(i, i - 1)} aria-label={`Move ${itemLabel} ${i + 1} up`}>
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5" disabled={i === value.length - 1} onClick={() => swap(i, i + 1)} aria-label={`Move ${itemLabel} ${i + 1} down`}>
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5 text-red-600" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove ${itemLabel} ${i + 1}`}>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            {errors[i] && <p className="mt-1 text-xs font-medium text-red-600">{errors[i]}</p>}
          </li>
        ))}
      </ol>
      <Button size="sm" className="mt-2" onClick={() => onChange([...value, ""])} icon={<Plus className="h-3.5 w-3.5" aria-hidden="true" />}>
        Add {itemLabel.toLowerCase()}
      </Button>
    </div>
  );
}
