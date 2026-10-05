"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { deleteRedirect, deleteSeoOverride, saveSeoOverride } from "@/lib/admin/actions/site";
import { seoOverrideSchema } from "@/lib/schemas/site";
import type { SeoMetadataRow } from "@/lib/cms/types";
import { formatDay } from "@/lib/admin/format";
import { Button } from "./ui/Button";
import { ConfirmDialog, Dialog } from "./ui/Dialog";
import { Badge, EmptyState } from "./ui/Feedback";
import { describedBy, Field, Input, Textarea } from "./ui/Field";
import { Card } from "./ui/Layout";
import { useToast } from "./ui/Toast";
import { SeoFields } from "./forms/SeoFields";

type Row = { path: string; label: string; group: string; override: SeoMetadataRow | null };
type Redirect = { id: string; from_path: string; to_path: string; status_code: number; created_at: string };

const empty = (path: string) => ({
  path,
  title: "",
  description: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  robots_index: true,
  robots_follow: true,
});

export function SeoManager({ rows, redirects }: { rows: Row[]; redirects: Redirect[] }) {
  const router = useRouter();
  const toast = useToast();
  const [edit, setEdit] = useState<ReturnType<typeof empty> | null>(null);
  const [label, setLabel] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [removePath, setRemovePath] = useState<string | null>(null);
  const [removeRedirect, setRemoveRedirect] = useState<Redirect | null>(null);

  return (
    <div className="space-y-6">
      <div className="adm-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.02]">
            <tr>
              <th scope="col" className="adm-th">Page</th>
              <th scope="col" className="adm-th hidden md:table-cell">Section</th>
              <th scope="col" className="adm-th">Override</th>
              <th scope="col" className="adm-th"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {rows.map((r) => (
              <tr key={r.path}>
                <td className="adm-td">
                  <p className="font-medium text-slate-900 dark:text-white">{r.label}</p>
                  <p className="adm-muted font-mono text-xs">{r.path}</p>
                </td>
                <td className="adm-td adm-muted hidden text-sm md:table-cell">{r.group}</td>
                <td className="adm-td">
                  {r.override ? (
                    <div className="flex flex-wrap gap-1">
                      <Badge tone="brand">Custom</Badge>
                      {!r.override.robots_index && <Badge tone="red">noindex</Badge>}
                    </div>
                  ) : (
                    <span className="adm-muted text-xs">Default</span>
                  )}
                </td>
                <td className="adm-td text-right whitespace-nowrap">
                  <button
                    type="button"
                    className="adm-btn adm-btn-ghost adm-btn-sm px-1.5"
                    aria-label={`Edit SEO for ${r.path}`}
                    onClick={() => {
                      setErrors({});
                      setLabel(r.label);
                      setEdit(r.override ? { ...empty(r.path), ...pick(r.override) } : empty(r.path));
                    }}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {r.override && (
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5 text-red-600" aria-label={`Remove SEO override for ${r.path}`} onClick={() => setRemovePath(r.path)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <EmptyState title="No pages match" />}
      </div>

      <Card title="Redirects" description="Created automatically when the slug of published content changes (308 permanent)." padded={false}>
        {redirects.length === 0 ? (
          <p className="adm-muted px-5 py-6 text-sm">No redirects yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {redirects.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 px-5 py-2.5 font-mono text-xs">
                <span>{r.from_path}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-label="redirects to" />
                <span>{r.to_path}</span>
                <span className="adm-muted ml-auto font-sans">{formatDay(r.created_at)}</span>
                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5 text-red-600" aria-label={`Remove redirect from ${r.from_path}`} onClick={() => setRemoveRedirect(r)}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog
        open={edit !== null}
        onClose={() => setEdit(null)}
        title={`SEO — ${label}`}
        description={edit?.path}
        size="lg"
        footer={
          <>
            <Button onClick={() => setEdit(null)}>Cancel</Button>
            <Button
              variant="primary"
              loading={saving}
              onClick={async () => {
                if (!edit) return;
                const parsed = seoOverrideSchema.safeParse(edit);
                if (!parsed.success) {
                  const errs: Record<string, string> = {};
                  for (const i of parsed.error.issues) errs[i.path.join(".")] ??= i.message;
                  return setErrors(errs);
                }
                setSaving(true);
                const res = await saveSeoOverride(edit);
                setSaving(false);
                if (!res.ok) {
                  setErrors(res.fieldErrors ?? {});
                  return toast.error(res.error);
                }
                toast.success(res.message ?? "Saved.");
                setEdit(null);
                router.refresh();
              }}
            >
              Save override
            </Button>
          </>
        }
      >
        {edit && (
          <div className="space-y-5">
            <SeoFields
              value={{ seo_title: edit.title, seo_description: edit.description, og_image_url: edit.og_image_url, canonical_url: edit.canonical_url, robots_index: edit.robots_index, robots_follow: edit.robots_follow }}
              onChange={(p) =>
                setEdit({
                  ...edit,
                  ...(p.seo_title !== undefined ? { title: p.seo_title } : {}),
                  ...(p.seo_description !== undefined ? { description: p.seo_description } : {}),
                  ...(p.og_image_url !== undefined ? { og_image_url: p.og_image_url } : {}),
                  ...(p.canonical_url !== undefined ? { canonical_url: p.canonical_url } : {}),
                  ...(p.robots_index !== undefined ? { robots_index: p.robots_index } : {}),
                  ...(p.robots_follow !== undefined ? { robots_follow: p.robots_follow } : {}),
                })
              }
              errors={{ seo_title: errors.title, seo_description: errors.description, og_image_url: errors.og_image_url, canonical_url: errors.canonical_url }}
              fallbackTitle="(page default)"
              fallbackDescription="(page default)"
              url={`digital.pytron.in${edit.path}`}
            />
            <Field label="Social title (optional)" htmlFor="og_title" error={errors.og_title} help="Shown when the page is shared. Empty = the SEO title.">
              <Input id="og_title" value={edit.og_title} onChange={(e) => setEdit({ ...edit, og_title: e.target.value })} {...describedBy("og_title", errors.og_title, true)} />
            </Field>
            <Field label="Social description (optional)" htmlFor="og_description" error={errors.og_description}>
              <Textarea id="og_description" value={edit.og_description} onChange={(e) => setEdit({ ...edit, og_description: e.target.value })} />
            </Field>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={removePath !== null}
        title="Remove this SEO override?"
        description={`${removePath} will use its default title and description again.`}
        confirmLabel="Remove"
        onCancel={() => setRemovePath(null)}
        onConfirm={async () => {
          if (!removePath) return;
          const res = await deleteSeoOverride(removePath);
          setRemovePath(null);
          if (!res.ok) return toast.error(res.error);
          toast.success(res.message ?? "Removed.");
          router.refresh();
        }}
      />
      <ConfirmDialog
        open={removeRedirect !== null}
        title="Remove this redirect?"
        description={`Visitors to ${removeRedirect?.from_path} will get a “page not found” instead of being redirected.`}
        confirmLabel="Remove"
        onCancel={() => setRemoveRedirect(null)}
        onConfirm={async () => {
          if (!removeRedirect) return;
          const res = await deleteRedirect(removeRedirect.id);
          setRemoveRedirect(null);
          if (!res.ok) return toast.error(res.error);
          toast.success(res.message ?? "Removed.");
          router.refresh();
        }}
      />
    </div>
  );
}

function pick(o: SeoMetadataRow) {
  return {
    title: o.title,
    description: o.description,
    canonical_url: o.canonical_url,
    og_title: o.og_title,
    og_description: o.og_description,
    og_image_url: o.og_image_url,
    robots_index: o.robots_index,
    robots_follow: o.robots_follow,
  };
}
