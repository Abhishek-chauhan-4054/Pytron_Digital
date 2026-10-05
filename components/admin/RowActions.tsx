"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Archive, Copy, Eye, EyeOff, Pencil, Rocket, Trash2 } from "lucide-react";
import { deletePage, duplicatePage, setPageStatus } from "@/lib/admin/actions/pages";
import { deleteService, duplicateService, setServiceStatus } from "@/lib/admin/actions/services";
import { deleteBlog, duplicateBlog, setBlogStatus } from "@/lib/admin/actions/blogs";
import type { ContentStatus } from "@/lib/cms/types";
import { ConfirmDialog } from "./ui/Dialog";
import { useToast } from "./ui/Toast";

type Kind = "page" | "service" | "blog";

const ops = {
  page: { status: setPageStatus, duplicate: duplicatePage, remove: deletePage, base: "/admin/pages/", noun: "page" },
  service: { status: setServiceStatus, duplicate: duplicateService, remove: deleteService, base: "/admin/services/", noun: "service" },
  blog: { status: setBlogStatus, duplicate: duplicateBlog, remove: deleteBlog, base: "/admin/blog/", noun: "blog post" },
} as const;

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white";

/** Edit / preview / publish / duplicate / delete for one list row. Permissions are enforced server-side too. */
export function RowActions({
  kind,
  id,
  title,
  status,
  canPublish,
  canDelete,
  canDuplicate = true,
}: {
  kind: Kind;
  id: string;
  title: string;
  status: ContentStatus;
  canPublish: boolean;
  canDelete: boolean;
  canDuplicate?: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState<null | "delete" | "unpublish" | "archive">(null);
  const op = ops[kind];

  const run = (fn: () => Promise<{ ok: boolean; error?: string; message?: string; data?: { id: string } }>, after?: (id?: string) => void) =>
    start(async () => {
      const res = await fn();
      if (!res.ok) toast.error(res.error ?? "Something went wrong.");
      else {
        if (res.message) toast.success(res.message);
        after?.(res.data?.id);
        router.refresh();
      }
    });

  return (
    <div className="flex items-center justify-end gap-0.5">
      <Link href={`${op.base}${id}/`} className={iconBtn} aria-label={`Edit ${title}`} title="Edit">
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </Link>
      <a href={`/api/preview/?type=${kind}&id=${id}`} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label={`Preview ${title} (opens a new tab)`} title="Preview">
        <Eye className="h-4 w-4" aria-hidden="true" />
      </a>
      {canPublish &&
        (status === "PUBLISHED" ? (
          <button type="button" className={iconBtn} disabled={pending} onClick={() => setConfirm("unpublish")} aria-label={`Unpublish ${title}`} title="Unpublish">
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className={iconBtn} disabled={pending} onClick={() => run(() => op.status(id, "PUBLISHED"))} aria-label={`Publish ${title}`} title="Publish">
            <Rocket className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      {canPublish && status !== "ARCHIVED" && (
        <button type="button" className={iconBtn} disabled={pending} onClick={() => setConfirm("archive")} aria-label={`Archive ${title}`} title="Archive">
          <Archive className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {canDuplicate && (
        <button
          type="button"
          className={iconBtn}
          disabled={pending}
          onClick={() => run(() => op.duplicate(id), (newId) => newId && router.push(`${op.base}${newId}/`))}
          aria-label={`Duplicate ${title}`}
          title="Duplicate"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {canDelete && (
        <button type="button" className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`} disabled={pending} onClick={() => setConfirm("delete")} aria-label={`Delete ${title}`} title="Delete">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <ConfirmDialog
        open={confirm === "delete"}
        title={`Delete this ${op.noun}?`}
        description={`“${title}” will be permanently deleted. This cannot be undone.`}
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          const res = await op.remove(id);
          setConfirm(null);
          if (!res.ok) toast.error(res.error);
          else {
            toast.success(res.message ?? "Deleted.");
            router.refresh();
          }
        }}
      />
      <ConfirmDialog
        open={confirm === "unpublish" || confirm === "archive"}
        title={confirm === "archive" ? `Archive this ${op.noun}?` : `Unpublish this ${op.noun}?`}
        description={`“${title}” will be removed from the public website${confirm === "archive" ? " and moved to the archive" : " and become a draft"}.`}
        confirmLabel={confirm === "archive" ? "Archive" : "Unpublish"}
        tone="primary"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          const res = await op.status(id, confirm === "archive" ? "ARCHIVED" : "DRAFT");
          setConfirm(null);
          if (!res.ok) toast.error(res.error);
          else {
            toast.success(res.message ?? "Updated.");
            router.refresh();
          }
        }}
      />
    </div>
  );
}
