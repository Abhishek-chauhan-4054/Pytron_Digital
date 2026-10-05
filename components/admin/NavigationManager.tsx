"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteNavItem, saveNavItem } from "@/lib/admin/actions/site";
import { NAV_LOCATIONS, type NavigationItemRow, type NavLocation } from "@/lib/cms/types";
import { Button } from "./ui/Button";
import { ConfirmDialog, Dialog } from "./ui/Dialog";
import { Badge } from "./ui/Feedback";
import { Checkbox, Field, Input, Select } from "./ui/Field";
import { Card } from "./ui/Layout";
import { useToast } from "./ui/Toast";
import { ReorderButtons } from "./ReorderButtons";

type Draft = { id: string | null; location: NavLocation; label: string; href: string; is_external: boolean; is_active: boolean };

export function NavigationManager({ items }: { items: NavigationItemRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState<NavigationItemRow | null>(null);

  async function save() {
    if (!draft) return;
    setSaving(true);
    const { id, ...input } = draft;
    const res = await saveNavItem(id, input);
    setSaving(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? { label: res.error });
      return;
    }
    toast.success(res.message ?? "Saved.");
    setDraft(null);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {NAV_LOCATIONS.map((loc) => {
        const list = items.filter((i) => i.location === loc.key);
        return (
          <Card
            key={loc.key}
            title={loc.label}
            padded={false}
            actions={
              <Button
                size="sm"
                icon={<Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                onClick={() => {
                  setErrors({});
                  setDraft({ id: null, location: loc.key, label: "", href: "/", is_external: false, is_active: true });
                }}
              >
                Add link
              </Button>
            }
          >
            {list.length === 0 ? (
              <p className="adm-muted px-5 py-6 text-sm">No links in this column.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-white/5">
                {list.map((it, i) => (
                  <li key={it.id} className="flex items-center gap-2 px-4 py-2.5">
                    <ReorderButtons kind="nav" id={it.id} first={i === 0} last={i === list.length - 1} label={it.label} />
                    <div className="min-w-0 flex-1">
                      <p className={`flex items-center gap-1.5 text-sm font-medium ${it.is_active ? "" : "text-slate-400 line-through"}`}>
                        {it.label}
                        {it.is_external && <ExternalLink className="h-3 w-3" aria-label="opens in a new tab" />}
                      </p>
                      <p className="adm-muted truncate font-mono text-xs">{it.href}</p>
                    </div>
                    {!it.is_active && (
                      <Badge>
                        <EyeOff className="h-3 w-3" aria-hidden="true" /> Hidden
                      </Badge>
                    )}
                    <button
                      type="button"
                      className="adm-btn adm-btn-ghost adm-btn-sm px-1.5"
                      aria-label={`Edit ${it.label}`}
                      onClick={() => {
                        setErrors({});
                        setDraft({ id: it.id, location: it.location, label: it.label, href: it.href, is_external: it.is_external, is_active: it.is_active });
                      }}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5 text-red-600" aria-label={`Delete ${it.label}`} onClick={() => setDel(it)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        );
      })}

      <Dialog
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit link" : "Add link"}
        footer={
          <>
            <Button onClick={() => setDraft(null)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={save}>
              Save
            </Button>
          </>
        }
      >
        {draft && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <Field label="Column" htmlFor="nav-loc">
              <Select id="nav-loc" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value as NavLocation })}>
                {NAV_LOCATIONS.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Label" htmlFor="nav-label" error={errors.label}>
              <Input id="nav-label" value={draft.label} autoFocus onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
            </Field>
            <Field label="Link" htmlFor="nav-href" error={errors.href} help="A path like /about/ or a full https:// address.">
              <Input id="nav-href" className="font-mono" value={draft.href} onChange={(e) => setDraft({ ...draft, href: e.target.value, is_external: /^https?:\/\//.test(e.target.value) })} />
            </Field>
            <Checkbox id="nav-ext" label="Open in a new tab" checked={draft.is_external} onChange={(e) => setDraft({ ...draft, is_external: e.target.checked })} />
            <Checkbox id="nav-active" label="Visible on the site" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} />
            <button type="submit" hidden />
          </form>
        )}
      </Dialog>

      <ConfirmDialog
        open={del !== null}
        title={`Delete “${del?.label}”?`}
        description="The link is removed from the footer."
        onCancel={() => setDel(null)}
        onConfirm={async () => {
          if (!del) return;
          const res = await deleteNavItem(del.id);
          setDel(null);
          if (!res.ok) return toast.error(res.error);
          toast.success(res.message ?? "Deleted.");
          router.refresh();
        }}
      />
    </div>
  );
}
