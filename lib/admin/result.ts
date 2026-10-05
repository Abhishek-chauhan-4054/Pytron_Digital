import "server-only";
import { z } from "zod";
import { ActionAuthError } from "./session";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

type PgError = { code?: string; message?: string; details?: string | null };

export class UserFacingError extends Error {}

/** Turn database / PostgREST errors into messages an editor can act on (no internals leaked). */
export function friendlyDbError(e: PgError): string {
  const msg = e.message ?? "";
  switch (e.code) {
    case "42501":
      // Our triggers raise readable permission messages; RLS violations are generic.
      return /row-level security|permission denied/i.test(msg) ? "You don't have permission to do that." : msg;
    case "23505":
      if (/slug/i.test(msg) || /slug/i.test(e.details ?? "")) return "That slug is already in use. Choose a different one.";
      if (/path/i.test(msg)) return "An entry for that path already exists.";
      if (/name/i.test(msg)) return "That name is already in use.";
      return "That value is already in use.";
    case "23514":
      if (/reserved_slug/i.test(msg)) return "That URL is used by a built-in page. Choose a different slug.";
      return "One of the values isn't allowed. Check the highlighted fields.";
    case "23503":
      return "This item is linked to other content, so it can't be changed that way.";
    case "PGRST116":
      return "That item no longer exists.";
    default:
      return "";
  }
}

export function fieldErrorsFrom(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Wraps a server action: validates nothing by itself, but guarantees the client always
 * receives a structured result (never an unhandled exception or a raw database error).
 */
export async function action<T>(fn: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ActionAuthError || err instanceof UserFacingError) return { ok: false, error: err.message };
    if (err instanceof z.ZodError) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(err) };
    const pg = err as PgError;
    const friendly = pg && typeof pg === "object" ? friendlyDbError(pg) : "";
    if (friendly) return { ok: false, error: friendly };
    console.error("[admin action]", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/** Throw the Supabase error (handled by `action()`) or return data. */
export function check<T>(res: { data: T; error: PgError | null }): T {
  if (res.error) throw res.error;
  return res.data;
}
