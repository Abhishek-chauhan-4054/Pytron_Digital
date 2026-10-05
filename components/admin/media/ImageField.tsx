"use client";

import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import type { MediaBucket } from "@/lib/cms/types";
import { Button } from "../ui/Button";
import { MediaPicker } from "./MediaPicker";

/** Image URL field with preview, library picker and upload. */
export function ImageField({
  id,
  value,
  onChange,
  bucket,
  folder,
  error,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  bucket?: MediaBucket;
  folder?: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 dark:border-white/15 dark:bg-white/5">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-slate-400" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            className="adm-input"
            placeholder="Choose an image, or paste an https:// URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setOpen(true)}>
              {value ? "Change" : "Choose image"}
            </Button>
            {value && (
              <Button size="sm" variant="ghost" onClick={() => onChange("")} icon={<X className="h-3.5 w-3.5" aria-hidden="true" />}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onSelect={(m) => onChange(m.url)} bucket={bucket} folder={folder} />
    </div>
  );
}
