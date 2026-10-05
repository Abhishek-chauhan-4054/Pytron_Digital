"use client";

import { finalizeUpload, prepareUpload } from "@/lib/admin/actions/media";
import { bucketRule, formatBytes } from "@/lib/cms/media";
import type { MediaBucket, MediaRow } from "@/lib/cms/types";

export type UploadedMedia = MediaRow & { url: string };

async function imageSize(file: File): Promise<{ width: number | null; height: number | null }> {
  if (!file.type.startsWith("image/")) return { width: null, height: null };
  try {
    const bmp = await createImageBitmap(file);
    const out = { width: bmp.width, height: bmp.height };
    bmp.close();
    return out;
  } catch {
    return { width: null, height: null };
  }
}

/** Client-side pre-check (the server and Storage enforce the same rules again). */
export function precheck(file: File, bucket: MediaBucket): string | null {
  const rule = bucketRule(bucket);
  if (!rule.types.includes(file.type)) return `${file.name}: this file type isn't allowed in ${rule.label}.`;
  if (file.size > rule.maxBytes) return `${file.name} is ${formatBytes(file.size)} — the limit is ${formatBytes(rule.maxBytes)}.`;
  if (file.size === 0) return `${file.name} is empty.`;
  return null;
}

function putWithProgress(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("cacheControl", "31536000");
    form.append("", file);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    // The signed token in the URL authorizes the upload; the apikey identifies the project.
    xhr.setRequestHeader("apikey", anon);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else {
        let msg = `Upload failed (${xhr.status}).`;
        try {
          const body = JSON.parse(xhr.responseText) as { message?: string };
          if (body.message) msg = body.message;
        } catch {
          /* not JSON */
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(form);
  });
}

/** prepare (server) → upload straight to Supabase Storage (browser, with progress) → verify & record (server) */
export async function uploadFile(
  file: File,
  opts: { bucket: MediaBucket; folder: string; alt?: string; onProgress?: (pct: number) => void },
): Promise<UploadedMedia> {
  const pre = precheck(file, opts.bucket);
  if (pre) throw new Error(pre);
  const prep = await prepareUpload({ bucket: opts.bucket, folder: opts.folder, fileName: file.name, size: file.size, mimeType: file.type });
  if (!prep.ok || !prep.data) throw new Error(prep.ok ? "Upload could not start." : prep.error);
  await putWithProgress(prep.data.signedUrl, file, opts.onProgress ?? (() => {}));
  const dims = await imageSize(file);
  const fin = await finalizeUpload({
    bucket: opts.bucket,
    path: prep.data.path,
    fileName: file.name,
    folder: opts.folder,
    alt_text: opts.alt ?? "",
    ...dims,
  });
  if (!fin.ok || !fin.data) throw new Error(fin.ok ? "Upload could not be saved." : fin.error);
  return fin.data;
}
