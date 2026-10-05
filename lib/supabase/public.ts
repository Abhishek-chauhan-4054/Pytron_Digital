import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Abort slow requests so a paused/unreachable project never hangs the public site. */
const timeoutFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(8000) });

/**
 * Anonymous client for the public website. Has no session: Row Level Security only
 * lets it read PUBLISHED content. Results are cached with unstable_cache (see lib/cms/public).
 */
export function createPublicSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: timeoutFetch },
  });
}
