import type { MediaBucket } from "./types";

/** Upload rules — mirrored by the Storage bucket limits in supabase/migrations. */
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;
export const DOCUMENT_TYPES = [
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
] as const;

export const BUCKETS: { key: MediaBucket; label: string; public: boolean; maxBytes: number; types: readonly string[] }[] = [
  { key: "website-images", label: "Website images", public: true, maxBytes: 5 * 1024 * 1024, types: IMAGE_TYPES },
  { key: "blog-images", label: "Blog images", public: true, maxBytes: 5 * 1024 * 1024, types: IMAGE_TYPES },
  { key: "service-images", label: "Service images", public: true, maxBytes: 5 * 1024 * 1024, types: IMAGE_TYPES },
  { key: "documents", label: "Documents (private)", public: false, maxBytes: 10 * 1024 * 1024, types: DOCUMENT_TYPES },
];

export const bucketRule = (b: MediaBucket) => BUCKETS.find((x) => x.key === b)!;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
  "text/plain": "txt",
  "text/csv": "csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
};
export const extensionFor = (mime: string) => EXT[mime] ?? "bin";

/**
 * Detect the real file type from its first bytes. The browser-reported MIME type and
 * the file name are never trusted on their own.
 */
export function sniffMime(bytes: Uint8Array, claimed: string): string | null {
  const b = bytes;
  const ascii = (start: number, len: number) => String.fromCharCode(...b.slice(start, start + len));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && ascii(1, 3) === "PNG") return "image/png";
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return "image/gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") return "image/webp";
  if (ascii(4, 4) === "ftyp" && /^(avif|avis)/.test(ascii(8, 4))) return "image/avif";
  if (ascii(0, 5) === "%PDF-") return "application/pdf";
  // Office Open XML files are ZIP containers; accept the claimed OOXML type for PK.. files.
  if (b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04) {
    return claimed.startsWith("application/vnd.openxmlformats-officedocument.") ? claimed : null;
  }
  if (claimed === "text/plain" || claimed === "text/csv") {
    // Plain text: no NUL bytes and valid UTF-8
    if (b.includes(0)) return null;
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(b);
      return claimed;
    } catch {
      return null;
    }
  }
  return null;
}

/** "My Photo (1).JPG" → "my-photo-1" (never used as-is in a storage path; see safeObjectPath). */
export function cleanBaseName(name: string) {
  const base = name.replace(/\.[^.]*$/, "");
  return (
    base
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file"
  );
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
