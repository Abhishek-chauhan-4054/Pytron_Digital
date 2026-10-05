/**
 * Supabase connection settings. The public URL and anon (publishable) key are safe
 * to expose; the service-role key is read only in lib/supabase/admin.ts (server-only).
 */
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the CMS database is configured. When false, the site serves its built-in content. */
export function isCmsConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/** Public URL of a file in a public Storage bucket. */
export function storagePublicUrl(bucket: string, path: string) {
  const safe = path.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${safe}`;
}
