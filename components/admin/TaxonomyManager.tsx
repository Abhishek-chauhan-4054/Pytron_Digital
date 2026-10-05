"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteCategory, deleteTag, saveCategory, saveTag } from "@/lib/admin/actions/blogs";
import { slugify } from "@/lib/slug";
import { Button } from "./ui/Button";
import { ConfirmDialog, Dialog } from "./ui/Dialog";
import { EmptyState } from "./ui/Feedback";
import { Field, Input, Textarea } from "./ui/Field";
import { Card } from "./ui/Layout";
import { useToast } from "./ui/Toast";

type Cat = { id: string; name: string; slug: string; description: string; count: number };
type Tag = { id: string; name: string; slug: string; count: number };

export function TaxonomyManager({ categories, tags, canDelete }: { categories: Cat[]; tags: Tag[]; canDelete: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [edit, setEdit] = useState<null | { kind: "category" | "tag"; id: string | null; name: string; slug: string; description: string }>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [del, setDel] = useState<null | { kind: "category" | "tag"; id: string; name: string; count: number }>(null);

  async function save() {
    if (!edit) return;
    setSaving(true);
    const res =
      edit.kind === "category"
        ? await saveCategory(edit.id, { name: edit.name, slug: edit.slug, description: edit.description })
        : await saveTag(edit.id!, { name: edit.name, slug: edit.slug });
    setSaving(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? { name: res.error });
      return;
    }
    toast.success(res.message ?? "Saved.");
    setEdit(null);
    router.refresh();
  }

  const iconBtn = "adm-btn adm-btn-ghost adm-btn-sm px-1.5";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
      <Card
        title="Categories"
        description="Each post belongs to one category."
        padded={false}
        actions={
          <Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" aria-hidden="true" />} onClick={() => (setErrors({}), setEdit({ kind: "category", id: null, name: "", slug: "", description: "" }))}>
            Add
          </Button>
        }
      >
        {categories.length === 0 ? (
          <EmptyState title="No categories" />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                  <p className="adm-muted font-mono text-xs">/blog/category/{c.slug}/</p>
                </div>
                <span className="adm-muted text-xs whitespace-nowrap">
                  {c.count} post{c.count === 1 ? "" : "s"}
                </span>
                <button type="button" className={iconBtn} onClick={() => (setErrors({}), setEdit({ kind: "category", id: c.id, name: c.name, slug: c.slug, description: c.description }))} aria-label={`Edit ${c.name}`}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                {canDelete && (
                  <button type="button" className={`${iconBtn} text-red-600`} onClick={() => setDel({ kind: "category", id: c.id, name: c.name, count: c.count })} aria-label={`Delete ${c.name}`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Tags" description="Added from the post editor. Rename or remove them here." padded={false}>
        {tags.length === 0 ? (
          <EmptyState title="No tags yet" text="Add tags while editing a post." />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {tags.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-2.5">
                <p className="min-w-0 flex-1 truncate text-sm font-medium">#{t.name}</p>
                <span className="adm-muted text-xs">{t.count}</span>
                <button type="button" className={iconBtn} onClick={() => (setErrors({}), setEdit({ kind: "tag", id: t.id, name: t.name, slug: t.slug, description: "" }))} aria-label={`Edit tag ${t.name}`}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                {canDelete && (
                  <button type="button" className={`${iconBtn} text-red-600`} onClick={() => setDel({ kind: "tag", id: t.id, name: t.name, count: t.count })} aria-label={`Delete tag ${t.name}`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog
        open={edit !== null}
        onClose={() => setEdit(null)}
        title={edit?.id ? `Edit ${edit.kind}` : `New ${edit?.kind ?? "category"}`}
        footer={
          <>
            <Button onClick={() => setEdit(null)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={save}>
              Save
            </Button>
          </>
        }
      >
        {edit && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <Field label="Name" htmlFor="tx-name" error={errors.name}>
              <Input
                id="tx-name"
                value={edit.name}
                autoFocus
                onChange={(e) => setEdit({ ...edit, name: e.target.value, slug: edit.id ? edit.slug : slugify(e.target.value) })}
              />
            </Field>
            <Field label="Slug" htmlFor="tx-slug" error={errors.slug} help={edit.id ? "Changing a slug changes the archive URL." : undefined}>
              <Input id="tx-slug" className="font-mono" value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value.toLowerCase() })} />
            </Field>
            {edit.kind === "category" && (
              <Field label="Description" htmlFor="tx-desc" error={errors.description}>
                <Textarea id="tx-desc" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
              </Field>
            )}
            <button type="submit" hidden />
          </form>
        )}
      </Dialog>

      <ConfirmDialog
        open={del !== null}
        title={`Delete ${del?.kind} “${del?.name}”?`}
        description={
          del?.kind === "category"
            ? del.count
              ? `It is used by ${del.count} post(s); move them to another category first.`
              : "This category has no posts and will be removed."
            : `The tag will be removed from ${del?.count ?? 0} post(s).`
        }
        onCancel={() => setDel(null)}
        onConfirm={async () => {
          if (!del) return;
          const res = del.kind === "category" ? await deleteCategory(del.id) : await deleteTag(del.id);
          setDel(null);
          if (!res.ok) toast.error(res.error);
          else {
            toast.success(res.message ?? "Deleted.");
            router.refresh();
          }
        }}
      />
    </div>
  );
}
