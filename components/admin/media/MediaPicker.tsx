"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Search } from "lucide-react";
import { listPickerImages, type PickerItem } from "@/lib/admin/actions/media";
import type { MediaBucket } from "@/lib/cms/types";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/Feedback";
import { uploadFile } from "./upload";

/** Choose an image from the library, or upload a new one. */
export function MediaPicker({
  open,
  onClose,
  onSelect,
  bucket = "website-images",
  folder = "general",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: { url: string; alt: string }) => void;
  bucket?: MediaBucket;
  folder?: string;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<PickerItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (term: string, p: number) => {
    setLoading(true);
    setError("");
    const res = await listPickerImages({ q: term, page: p });
    setLoading(false);
    if (!res.ok || !res.data) {
      setError(res.ok ? "Could not load images." : res.error);
      return;
    }
    setItems((prev) => (p === 1 ? res.data!.items : [...prev, ...res.data!.items]));
    setTotal(res.data.total);
    setPage(p);
  }, []);

  useEffect(() => {
    // Load the first page whenever the picker opens
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) void load("", 1);
  }, [open, load]);

  return (
    <Dialog open={open} onClose={onClose} title="Choose an image" description="Pick from the media library or upload a new image (JPG, PNG, WebP, GIF or AVIF, up to 5 MB)." size="xl">
      <div className="flex flex-col gap-2 sm:flex-row">
        <form
          className="relative flex-1"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            void load(q, 1);
          }}
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <label htmlFor="picker-q" className="sr-only">
            Search images
          </label>
          <input id="picker-q" className="adm-input pl-9" placeholder="Search by file name or alt text" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setError("");
            setProgress(0);
            try {
              const up = await uploadFile(file, { bucket, folder, onProgress: setProgress });
              onSelect({ url: up.url, alt: up.alt_text });
              onClose();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed.");
            } finally {
              setProgress(null);
            }
          }}
        />
        <Button variant="primary" onClick={() => fileRef.current?.click()} loading={progress !== null} icon={<ImagePlus className="h-4 w-4" aria-hidden="true" />}>
          {progress !== null ? `Uploading ${progress}%` : "Upload new"}
        </Button>
      </div>
      {progress !== null && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
          <div className="h-full bg-brand-600 transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
      <div className="mt-4">
        {loading && items.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Loading images" role="status">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="adm-skeleton aspect-[4/3]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="No images yet" text="Upload an image to start your library." />
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {items.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect({ url: m.url, alt: m.alt_text });
                      onClose();
                    }}
                    className="group block w-full overflow-hidden rounded-lg border border-slate-200 text-left hover:border-brand-500 focus-visible:border-brand-500 dark:border-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt="" loading="lazy" className="aspect-[4/3] w-full bg-slate-100 object-cover dark:bg-white/5" />
                    <span className="block truncate px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300">{m.alt_text || m.file_name}</span>
                  </button>
                </li>
              ))}
            </ul>
            {items.length < total && (
              <div className="mt-4 text-center">
                <Button onClick={() => load(q, page + 1)} loading={loading}>
                  {loading ? "Loading" : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
        {loading && items.length > 0 && <LoaderCircle className="mx-auto mt-3 h-5 w-5 animate-spin text-slate-400" aria-label="Loading" />}
      </div>
    </Dialog>
  );
}
