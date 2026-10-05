import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { isCmsConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { ROLE_RANK, type RoleKey } from "@/lib/cms/types";

export type StaffSession = {
  supabase: SupabaseClient;
  user: User;
  profile: { id: string; email: string; full_name: string; role: RoleKey | null; is_active: boolean };
};

export function roleAtLeast(role: RoleKey | null | undefined, min: RoleKey) {
  return Boolean(role && ROLE_RANK[role] >= ROLE_RANK[min]);
}

/**
 * The signed-in user and their CMS profile, validated with Supabase Auth on the server
 * (getUser() verifies the JWT with Supabase — cookies alone are never trusted).
 * Cached per request.
 */
export const getSession = cache(async (): Promise<StaffSession | null> => {
  if (!isCmsConfigured()) return null;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id,email,full_name,is_active,role:roles(key)")
    .eq("id", user.id)
    .maybeSingle();
  const row = data as { id: string; email: string; full_name: string; is_active: boolean; role: { key: RoleKey } | null } | null;
  return {
    supabase,
    user,
    profile: {
      id: user.id,
      email: row?.email ?? user.email ?? "",
      full_name: row?.full_name ?? "",
      role: row?.is_active ? (row.role?.key ?? null) : null,
      is_active: row?.is_active ?? false,
    },
  };
});

/** For admin pages: redirect to login when signed out, or to the dashboard when the role is too low. */
export async function requirePageRole(min: RoleKey = "EDITOR"): Promise<StaffSession & { profile: { role: RoleKey } }> {
  const s = await getSession();
  if (!s) redirect("/admin/login/");
  if (!roleAtLeast(s.profile.role, min)) redirect("/admin/dashboard/?denied=1");
  return s as StaffSession & { profile: { role: RoleKey } };
}

export class ActionAuthError extends Error {}

/** For server actions: throws (caught by `action()`) when not allowed. */
export async function requireActionRole(min: RoleKey = "EDITOR"): Promise<StaffSession & { profile: { role: RoleKey } }> {
  const s = await getSession();
  if (!s) throw new ActionAuthError("Your session has expired. Please sign in again.");
  if (!roleAtLeast(s.profile.role, min)) throw new ActionAuthError("You don't have permission to do that.");
  return s as StaffSession & { profile: { role: RoleKey } };
}
