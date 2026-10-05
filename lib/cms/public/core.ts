import "server-only";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isCmsConfigured } from "@/lib/supabase/env";
import { createPublicSupabase } from "@/lib/supabase/public";
import { createServerSupabase } from "@/lib/supabase/server";

/** Cache tags. Admin mutations invalidate these (see lib/cms/revalidate.ts). */
export const TAGS = {
  blogs: "cms:blogs",
  services: "cms:services",
  pages: "cms:pages",
  navigation: "cms:navigation",
  settings: "cms:settings",
  seo: "cms:seo",
  redirects: "cms:redirects",
} as const;

/** Safety-net TTL. Normal updates are pushed instantly via tag revalidation. */
const TTL_SECONDS = 3600;

/**
 * Read published CMS data with caching.
 *  - CMS not configured → returns `fallback()` (the site's built-in content).
 *  - Query fails (project paused, network…) → logs and returns `fallback()`. Failures are
 *    never cached, so the CMS content returns as soon as the database is reachable again.
 */
export async function cmsRead<T>(
  key: string[],
  tags: string[],
  query: (sb: SupabaseClient) => Promise<T>,
  fallback: () => T,
): Promise<T> {
  if (!isCmsConfigured()) return fallback();
  const run = unstable_cache(async () => query(createPublicSupabase()), ["cms", ...key], {
    tags,
    revalidate: TTL_SECONDS,
  });
  try {
    return await run();
  } catch (err) {
    console.error(`[cms] ${key.join("/")} failed; serving built-in content.`, err instanceof Error ? err.message : err);
    return fallback();
  }
}

/** Throw on Supabase errors so failures are not cached. */
export function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/**
 * When an editor is previewing (Next.js draft mode) AND is signed in as CMS staff,
 * returns a client bound to their session so drafts are readable through RLS.
 * Otherwise null. Never cached.
 */
export async function getPreviewClient(): Promise<SupabaseClient | null> {
  const dm = await draftMode();
  if (!dm.isEnabled || !isCmsConfigured()) return null;
  try {
    const sb = await createServerSupabase();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return null;
    const { data } = await sb.rpc("is_staff");
    return data === true ? sb : null;
  } catch {
    return null;
  }
}

export async function isPreviewing() {
  return (await getPreviewClient()) !== null;
}
