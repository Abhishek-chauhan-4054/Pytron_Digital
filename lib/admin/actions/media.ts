"use server";

import { randomUUID } from "node:crypto";
import { mediaUpdateSchema, mediaUploadSchema } from "@/lib/schemas/site";
import { action, check, UserFacingError, type ActionResult } from "@/lib/admin/result";
import { requireActionRole } from "@/lib/admin/session";
import { bucketRule, cleanBaseName, extensionFor, sniffMime } from "@/lib/cms/media";
import type { MediaBucket, MediaRow } from "@/lib/cms/types";
import { storagePublicUrl, supabaseUrl } from "@/lib/supabase/env";
import { uuid } from "@/lib/schemas/common";
import { z } from "zod";

/**
 * Step 1 of an upload: validate the request and hand back a one-time signed upload URL.
 * The browser then sends the file straight to Supabase Storage (with progress, and without
 * passing through Vercel's request-size limit). The object path is generated here — the
 * user's file name is never used as a path (no traversal, no collisions).
 */
export async function prepareUpload(input: z.input<typeof mediaUploadSchema>): Promise<ActionResult<{ path: string; signedUrl: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const v = mediaUploadSchema.parse(input);
    const rule = bucketRule(v.bucket);
    if (!rule.types.includes(v.mimeType)) throw new UserFacingError(`That file type isn't allowed in ${rule.label}.`);
    if (v.size > rule.maxBytes) throw new UserFacingError(`Files in ${rule.label} must be ${rule.maxBytes / 1024 / 1024} MB or smaller.`);
    const now = new Date();
    const path = `${v.folder}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}-${cleanBaseName(v.fileName)}.${extensionFor(v.mimeType)}`;
    const res = await s.supabase.storage.from(v.bucket).createSignedUploadUrl(path);
    if (res.error || !res.data) {
      console.error("[media] signed upload url", res.error);
      throw new UserFacingError("Could not start the upload. Check that you have upload permission.");
    }
    // Some Supabase versions return a relative URL
    const signedUrl = res.data.signedUrl.startsWith("http") ? res.data.signedUrl : `${supabaseUrl}/storage/v1${res.data.signedUrl}`;
    return { ok: true, data: { path, signedUrl } };
  });
}

const finalizeSchema = z.object({
  bucket: mediaUploadSchema.shape.bucket,
  path: z.string().regex(/^[a-z0-9-]{1,40}\/\d{4}\/\d{2}\/[0-9a-f-]{36}-[a-z0-9-]{1,60}\.[a-z]{2,5}$/, "Invalid path"),
  fileName: z.string().min(1).max(200),
  folder: mediaUploadSchema.shape.folder,
  alt_text: z.string().trim().max(250).default(""),
  width: z.number().int().positive().max(20000).nullable(),
  height: z.number().int().positive().max(20000).nullable(),
});

/**
 * Step 2: verify what actually landed in Storage (real size + magic bytes), then record it.
 * Anything that doesn't match the allowed types is deleted.
 */
export async function finalizeUpload(input: z.input<typeof finalizeSchema>): Promise<ActionResult<MediaRow & { url: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const v = finalizeSchema.parse(input);
    const rule = bucketRule(v.bucket);
    const dl = await s.supabase.storage.from(v.bucket).download(v.path);
    if (dl.error || !dl.data) throw new UserFacingError("The upload didn't complete. Please try again.");
    const bytes = new Uint8Array(await dl.data.arrayBuffer());
    const claimed = dl.data.type || "";
    const real = sniffMime(bytes, claimed);
    if (!real || !rule.types.includes(real) || bytes.byteLength > rule.maxBytes) {
      await s.supabase.storage.from(v.bucket).remove([v.path]);
      throw new UserFacingError("That file's contents don't match an allowed type, so it was removed.");
    }
    const row = check(
      await s.supabase
        .from("media")
        .insert({
          bucket: v.bucket,
          path: v.path,
          file_name: v.fileName.slice(0, 200),
          mime_type: real,
          size_bytes: bytes.byteLength,
          width: real.startsWith("image/") ? v.width : null,
          height: real.startsWith("image/") ? v.height : null,
          alt_text: v.alt_text,
          folder: v.folder,
          uploaded_by: s.user.id,
        })
        .select("*")
        .single(),
    ) as MediaRow;
    return { ok: true, data: { ...row, url: rule.public ? storagePublicUrl(v.bucket, v.path) : "" }, message: "Uploaded." };
  });
}

export async function updateMedia(id: string, input: z.input<typeof mediaUpdateSchema>): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const v = mediaUpdateSchema.parse(input);
    check(await s.supabase.from("media").update(v).eq("id", uuid.parse(id)).select("id").single());
    return { ok: true, message: "Details saved." };
  });
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const m = check(await s.supabase.from("media").select("bucket,path").eq("id", uuid.parse(id)).single()) as { bucket: MediaBucket; path: string };
    const rm = await s.supabase.storage.from(m.bucket).remove([m.path]);
    if (rm.error) throw new UserFacingError("Could not delete the file from storage.");
    const res = await s.supabase.from("media").delete().eq("id", id).select("id");
    if (res.error) throw res.error;
    return { ok: true, message: "File deleted." };
  });
}

/** Temporary link for a private document (1 hour). */
export async function signedDocumentUrl(id: string): Promise<ActionResult<{ url: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const m = check(await s.supabase.from("media").select("bucket,path").eq("id", uuid.parse(id)).single()) as { bucket: MediaBucket; path: string };
    if (bucketRule(m.bucket).public) return { ok: true, data: { url: storagePublicUrl(m.bucket, m.path) } };
    const res = await s.supabase.storage.from(m.bucket).createSignedUrl(m.path, 3600);
    if (res.error || !res.data) throw new UserFacingError("Could not create a link.");
    const url = res.data.signedUrl.startsWith("http") ? res.data.signedUrl : `${supabaseUrl}/storage/v1${res.data.signedUrl}`;
    return { ok: true, data: { url } };
  });
}

export type PickerItem = { id: string; url: string; file_name: string; alt_text: string; width: number | null; height: number | null };

/** Images for the media picker (search + pagination in the database). */
export async function listPickerImages(input: { q?: string; page?: number }): Promise<ActionResult<{ items: PickerItem[]; total: number }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const page = Math.max(1, Math.floor(input.page ?? 1));
    const per = 24;
    let q = s.supabase
      .from("media")
      .select("id,bucket,path,file_name,alt_text,width,height", { count: "exact" })
      .neq("bucket", "documents")
      .order("created_at", { ascending: false })
      .range((page - 1) * per, page * per - 1);
    const term = (input.q ?? "").trim().slice(0, 80).replace(/[%_,()]/g, " ");
    if (term) q = q.or(`file_name.ilike.%${term}%,alt_text.ilike.%${term}%`);
    const res = await q;
    if (res.error) throw res.error;
    const items = (res.data as (Pick<MediaRow, "id" | "bucket" | "path" | "file_name" | "alt_text" | "width" | "height">)[]).map((m) => ({
      id: m.id,
      url: storagePublicUrl(m.bucket, m.path),
      file_name: m.file_name,
      alt_text: m.alt_text,
      width: m.width,
      height: m.height,
    }));
    return { ok: true, data: { items, total: res.count ?? 0 } };
  });
}
