"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { BLOCK_META, BLOCK_TYPES, emptyBlock, type BlockType, type FieldDef } from "@/lib/cms/blocks";
import type { RichDoc } from "@/lib/cms/types";
import { ICON_NAMES } from "@/components/Icon";
import { ImageField } from "../media/ImageField";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/Dialog";
import { RichTextEditor } from "./RichTextEditor";

export type SectionValue = { key: string; type: BlockType; data: Record<string, unknown> };

let seq = 0;
export const newKey = () => `s${Date.now().toString(36)}${(seq++).toString(36)}`;

function FieldInput({ def, value, onChange, idPrefix }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void; idPrefix: string }) {
  const id = `${idPrefix}-${def.name}`;
  const label = (
    <label htmlFor={id} className="adm-label" id={`${id}-label`}>
      {def.label}
    </label>
  );
  const help = def.help ? <p className="adm-muted mt-1 text-xs">{def.help}</p> : null;

  switch (def.kind) {
    case "text":
    case "url":
      return (
        <div>
          {label}
          <input
            id={id}
            className="adm-input"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={"placeholder" in def ? def.placeholder : def.kind === "url" ? "/contact/ or https://" : undefined}
            list={def.name === "icon" ? "cms-icon-names" : undefined}
          />
          {help}
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea id={id} rows={4} className="adm-input resize-y" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          {help}
        </div>
      );
    case "image":
      return (
        <div>
          {label}
          <ImageField id={id} value={String(value ?? "")} onChange={onChange} folder="pages" />
          {help}
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select id={id} className="adm-input" value={String(value ?? def.options[0]?.value)} onChange={(e) => onChange(e.target.value)}>
            {def.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {help}
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center gap-2.5">
          <input id={id} type="checkbox" className="h-4 w-4 accent-brand-600" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <label htmlFor={id} className="text-sm font-medium">
            {def.label}
          </label>
        </div>
      );
    case "rich":
      return (
        <div>
          <p className="adm-label" id={`${id}-label`}>
            {def.label}
          </p>
          <RichTextEditor id={id} labelledBy={`${id}-label`} value={(value as RichDoc | null) ?? null} onChange={onChange} folder="pages" />
        </div>
      );
    case "list": {
      const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      const set = (next: Record<string, unknown>[]) => onChange(next);
      const blank = Object.fromEntries(def.fields.map((f) => [f.name, f.kind === "checkbox" ? false : ""]));
      return (
        <fieldset>
          <legend className="adm-label">{def.label}</legend>
          {help}
          <ol className="mt-2 space-y-3">
            {items.map((item, i) => (
              <li key={i} className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {def.itemLabel} {i + 1}
                  </span>
                  <div className="flex gap-0.5">
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" disabled={i === 0} onClick={() => set(items.map((x, j) => (j === i - 1 ? items[i] : j === i ? items[i - 1] : x)))} aria-label={`Move ${def.itemLabel} ${i + 1} up`}>
                      <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" disabled={i === items.length - 1} onClick={() => set(items.map((x, j) => (j === i + 1 ? items[i] : j === i ? items[i + 1] : x)))} aria-label={`Move ${def.itemLabel} ${i + 1} down`}>
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm text-red-600" onClick={() => set(items.filter((_, j) => j !== i))} aria-label={`Remove ${def.itemLabel} ${i + 1}`}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {def.fields.map((f) => (
                    <div key={f.name} className={f.kind === "textarea" || f.kind === "image" ? "sm:col-span-2" : ""}>
                      <FieldInput def={f} value={item[f.name]} idPrefix={`${id}-${i}`} onChange={(v) => set(items.map((x, j) => (j === i ? { ...x, [f.name]: v } : x)))} />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <Button size="sm" className="mt-3" onClick={() => set([...items, { ...blank }])} icon={<Plus className="h-3.5 w-3.5" aria-hidden="true" />}>
            Add {def.itemLabel.toLowerCase()}
          </Button>
        </fieldset>
      );
    }
  }
}

/** Page builder: ordered list of structured content blocks. */
export function SectionsEditor({ value, onChange, errors }: { value: SectionValue[]; onChange: (v: SectionValue[]) => void; errors: Record<number, string> }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState<BlockType>("text");
  const [removeKey, setRemoveKey] = useState<string | null>(null);

  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    onChange(next);
  };

  return (
    <div>
      <datalist id="cms-icon-names">
        {ICON_NAMES.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
      {value.length === 0 && (
        <p className="adm-muted rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm dark:border-white/15">
          No sections yet. Add blocks below — they appear on the page in this order, styled like the rest of the site.
        </p>
      )}
      <ol className="space-y-3">
        {value.map((sec, i) => {
          const meta = BLOCK_META[sec.type];
          const isOpen = open[sec.key] ?? false;
          const summary = String(sec.data.heading ?? sec.data.caption ?? "") || meta.description;
          return (
            <li key={sec.key} className={`adm-card ${errors[i] ? "border-red-400 dark:border-red-400/60" : ""}`}>
              <div className="flex items-center gap-2 px-3 py-2.5">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left"
                  onClick={() => setOpen((o) => ({ ...o, [sec.key]: !isOpen }))}
                  aria-expanded={isOpen}
                  aria-controls={`${sec.key}-body`}
                >
                  {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" /> : <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[0.7rem] font-semibold text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">{meta.label}</span>
                  <span className="adm-muted truncate text-sm">{summary}</span>
                </button>
                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${meta.label} section up`}>
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${meta.label} section down`}>
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm text-red-600" onClick={() => setRemoveKey(sec.key)} aria-label={`Remove ${meta.label} section`}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {errors[i] && (
                <p className="px-4 pb-2 text-xs font-medium text-red-600" role="alert">
                  {errors[i]}
                </p>
              )}
              <div id={`${sec.key}-body`} hidden={!isOpen} className="space-y-4 border-t border-slate-100 px-4 py-4 dark:border-white/10">
                {meta.fields.map((f) => (
                  <FieldInput
                    key={f.name}
                    def={f}
                    idPrefix={sec.key}
                    value={sec.data[f.name]}
                    onChange={(v) => onChange(value.map((x) => (x.key === sec.key ? { ...x, data: { ...x.data, [f.name]: v } } : x)))}
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="add-block" className="sr-only">
          Block type
        </label>
        <select id="add-block" className="adm-input sm:w-64" value={adding} onChange={(e) => setAdding(e.target.value as BlockType)}>
          {BLOCK_TYPES.map((t) => (
            <option key={t} value={t}>
              {BLOCK_META[t].label} — {BLOCK_META[t].description}
            </option>
          ))}
        </select>
        <Button
          icon={<Plus className="h-4 w-4" aria-hidden="true" />}
          onClick={() => {
            const key = newKey();
            onChange([...value, { key, type: adding, data: emptyBlock(adding) }]);
            setOpen((o) => ({ ...o, [key]: true }));
          }}
        >
          Add section
        </Button>
      </div>
      <ConfirmDialog
        open={removeKey !== null}
        title="Remove this section?"
        description="The section and its content will be removed from the page when you save."
        confirmLabel="Remove"
        onCancel={() => setRemoveKey(null)}
        onConfirm={() => {
          onChange(value.filter((x) => x.key !== removeKey));
          setRemoveKey(null);
        }}
      />
    </div>
  );
}
