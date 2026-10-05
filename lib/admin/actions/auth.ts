"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isCmsConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/admin/result";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password").max(200),
});

// Simple in-memory throttle per email (per server instance). Supabase Auth also rate-limits sign-ins.
const attempts = new Map<string, { count: number; until: number }>();

export async function signIn(input: { email: string; password: string }): Promise<ActionResult> {
  if (!isCmsConfigured()) return { ok: false, error: "The CMS is not configured yet. Add the Supabase environment variables." };
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { email, password } = parsed.data;

  const now = Date.now();
  if (attempts.size > 5000) attempts.clear();
  const a = attempts.get(email);
  if (a && a.until > now) return { ok: false, error: "Too many attempts. Please wait a minute and try again." };

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const count = (a?.count ?? 0) + 1;
    attempts.set(email, { count, until: count >= 5 ? now + 60_000 : 0 });
    // Same message for unknown email and wrong password (no account enumeration)
    return { ok: false, error: "Incorrect email or password." };
  }
  attempts.delete(email);
  await supabase.rpc("log_auth_event", { p_action: "login" });
  return { ok: true };
}

export async function signOut() {
  if (isCmsConfigured()) {
    const supabase = await createServerSupabase();
    await supabase.rpc("log_auth_event", { p_action: "logout" });
    await supabase.auth.signOut();
  }
  redirect("/admin/login/");
}
