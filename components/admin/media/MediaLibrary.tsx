"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Copy, FileText, Trash2, UploadCloud } from "lucide-react";
import { deleteMedia, signedDocumentUrl, updateMedia } from "@/lib/admin/actions/media";
import { BUCKETS, formatBytes } from "@/lib/cms/media";
import type { MediaBucket, MediaRow } from "@/lib/cms/types";
import { formatDateTime } from "@/lib/admin/format";
import { Button } from "../ui/Button";
import { ConfirmDialog, Dialog } from "../ui/Dialog";
import { EmptyState } from "../ui/Feedback";
import { Field, Input, Select } from "../ui/Field";
import { useToast } from "../ui/Toast";
import { precheck, uploadFile } from "./upload";

type Item = MediaRow & { url: string };
type Job = { name: string; progress: number; error?: string; done?: boolean };

export function MediaLibrary({ items, canDelete, filtered }: { items: Item[]; canDelete: boolean; filtered: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [bucket, setBucket] = useState<MediaBucket>("website-images");
  const [folder, setFolder] = useState("general");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [drag, setDrag] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);
  const [alt, setAlt] = useState("");
  const [itemFolder, setItemFolder] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const rule = BUCKETS.find((b) => b.key === bucket)!;

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).slice(0, 20);
    if (!/^[a-z0-9-]{1,40}$/.test(folder)) {
      toast.error("Folder: use lowercase letters, numbers and hyphens.");
      return;
    }
    setJobs(list.map((f) => ({ name: f.name, progress: 0, error: precheck(f, bucket) ?? undefined })));
    let ok = 0;
    for (const [i, file] of list.entries()) {
      if (precheck(file, bucket)) continue;
      try {
        await uploadFile(file, { bucket, folder, onProgress: (p) => setJobs((j) => j.map((x, k) => (k === i ? { ...x, progress: p } : x))) });
        ok++;
        setJobs((j) => j.map((x, k) => (k === i ? { ...x, progress: 100, done: true } : x)));
      } catch (err) {
        setJobs((j) => j.map((x, k) => (k === i ? { ...x, error: err instanceof Error ? err.message : "Upload failed." } : x)));
      }
    }
    if (ok) {
      toast.success(`${ok} file${ok === 1 ? "" : "s"} uploaded.`);
      router.refresh();
    }
  }

  async function copyUrl(item: Item) {
    let url = item.url;
    if (!url) {
      const res = await signedDocumentUrl(item.id);
      if (!res.ok || !res.data) return toast.error(res.ok ? "Could not create a link." : res.error);
      url = res.data.url;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(item.url ? "URL copied." : "Private link copied (valid for 1 hour).");
    } catch {
      toast.error("Copy failed — select the URL and copy it manually.");
    }
  }

  return (
    <>
      <section
        aria-label="Upload files"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`adm-card mb-6 border-dashed p-5 transition-colors ${drag ? "border-brand-500 bg-brand-50/50 dark:bg-brand-400/10" : ""}`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex flex-1 items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Drop files here or choose files</p>
              <p className="adm-muted text-xs">
                {rule.public ? "JPG, PNG, WebP, GIF or AVIF" : "PDF, Word, Excel, PowerPoint, TXT or CSV"} · up to {formatBytes(rule.maxBytes)} each
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[34rem]">
            <div>
              <label htmlFor="up-bucket" className="adm-label">
                Bucket
              </label>
              <Select id="up-bucket" value={bucket} onChange={(e) => setBucket(e.target.value as MediaBucket)}>
                {BUCKETS.map((b) => (
                  <option key={b.key} value={b.key}>
                    {b.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="up-folder" className="adm-label">
                Folder
              </label>
              <Input id="up-folder" value={folder} onChange={(e) => setFolder(e.target.value.toLowerCase())} />
            </div>
            <div className="flex items-end">
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={rule.types.join(",")}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(e) => {
                  if (e.target.files) void handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <Button variant="primary" className="w-full" onClick={() => inputRef.current?.click()}>
                Choose files
              </Button>
            </div>
          </div>
        </div>
        {jobs.length > 0 && (
          <ul className="mt-4 space-y-2" aria-live="polite">
            {jobs.map((j, i) => (
              <li key={i} className="text-sm">
                <div className="flex justify-between gap-3">
                  <span className="truncate">{j.name}</span>
                  <span className={`shrink-0 text-xs ${j.error ? "text-red-600" : "adm-muted"}`}>{j.error ? "Failed" : j.done ? "Done" : `${j.progress}%`}</span>
                </div>
                {j.error ? (
                  <p className="text-xs text-red-600">{j.error}</p>
                ) : (
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-valuenow={j.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Uploading ${j.name}`}>
                    <div className={`h-full transition-[width] ${j.done ? "bg-emerald-500" : "bg-brand-600"}`} style={{ width: `${j.progress}%` }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {items.length === 0 ? (
        <div className="adm-card">
          <EmptyState title={filtered ? "No files match your filters" : "Your library is empty"} text={filtered ? undefined : "Upload images and documents to use them across the site."} />
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(m);
                  setAlt(m.alt_text);
                  setItemFolder(m.folder);
                }}
                className="adm-card group block w-full overflow-hidden text-left transition-shadow hover:shadow-md"
              >
                {m.mime_type.startsWith("image/") && m.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" loading="lazy" className="aspect-square w-full bg-slate-100 object-cover dark:bg-white/5" />
                ) : (
                  <span className="flex aspect-square w-full items-center justify-center bg-slate-50 text-slate-400 dark:bg-white/5">
                    <FileText className="h-10 w-10" aria-hidden="true" />
                  </span>
                )}
                <span className="block px-2.5 py-2">
                  <span className="block truncate text-xs font-medium text-slate-800 dark:text-slate-100">{m.file_name}</span>
                  <span className="adm-muted block text-[0.7rem]">
                    {formatBytes(m.size_bytes)} · {m.folder}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.file_name ?? "File"}
        size="lg"
        footer={
          selected && (
            <>
              {canDelete && (
                <Button variant="danger" className="sm:mr-auto" onClick={() => setConfirmDelete(true)} icon={<Trash2 className="h-4 w-4" aria-hidden="true" />}>
                  Delete
                </Button>
              )}
              <Button onClick={() => copyUrl(selected)} icon={<Copy className="h-4 w-4" aria-hidden="true" />}>
                Copy URL
              </Button>
              <Button
                variant="primary"
                loading={saving}
                onClick={async () => {
                  setSaving(true);
                  const res = await updateMedia(selected.id, { alt_text: alt, folder: itemFolder });
                  setSaving(false);
                  if (!res.ok) return toast.error(res.error);
                  toast.success(res.message ?? "Saved.");
                  setSelected(null);
                  router.refresh();
                }}
              >
                Save details
              </Button>
            </>
          )
        }
      >
        {selected && (
          <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
            <div className="flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
              {selected.mime_type.startsWith("image/") && selected.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.url} alt={selected.alt_text} className="max-h-80 w-full object-contain" />
              ) : (
                <FileText className="h-16 w-16 text-slate-400" aria-hidden="true" />
              )}
            </div>
            <div className="space-y-4">
              {selected.mime_type.startsWith("image/") && (
                <Field label="Alt text" htmlFor="m-alt" help="Describe the image for people using screen readers.">
                  <Input id="m-alt" value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={250} />
                </Field>
              )}
              <Field label="Folder" htmlFor="m-folder">
                <Input id="m-folder" value={itemFolder} onChange={(e) => setItemFolder(e.target.value.toLowerCase())} />
              </Field>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
                <dt className="adm-muted">Type</dt>
                <dd>{selected.mime_type}</dd>
                <dt className="adm-muted">Size</dt>
                <dd>{formatBytes(selected.size_bytes)}</dd>
                {selected.width && (
                  <>
                    <dt className="adm-muted">Dimensions</dt>
                    <dd>
                      {selected.width} × {selected.height}
                    </dd>
                  </>
                )}
                <dt className="adm-muted">Bucket</dt>
                <dd>{BUCKETS.find((b) => b.key === selected.bucket)?.label}</dd>
                <dt className="adm-muted">Uploaded</dt>
                <dd>{formatDateTime(selected.created_at)}</dd>
              </dl>
              {selected.url && <Input readOnly value={selected.url} aria-label="Public URL" className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />}
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this file?"
        description="The file is removed from storage. Any page still using its URL will show a broken image."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          if (!selected) return;
          const res = await deleteMedia(selected.id);
          setConfirmDelete(false);
          if (!res.ok) return toast.error(res.error);
          toast.success(res.message ?? "Deleted.");
          setSelected(null);
          router.refresh();
        }}
      />
    </>
  );
}
