"use server";

import { z } from "zod";
import { createUserSchema, passwordSchema, type CreateUserInput } from "@/lib/schemas/site";
import { action, check, UserFacingError, type ActionResult } from "@/lib/admin/result";
import { requireActionRole } from "@/lib/admin/session";
import { createAdminSupabase, hasServiceRoleKey } from "@/lib/supabase/admin";
import { uuid } from "@/lib/schemas/common";
import type { RoleKey } from "@/lib/cms/types";

async function roleId(sb: Awaited<ReturnType<typeof requireActionRole>>["supabase"], key: RoleKey) {
  return (check(await sb.from("roles").select("id").eq("key", key).single()) as { id: string }).id;
}

function needServiceKey() {
  if (!hasServiceRoleKey()) throw new UserFacingError("Add SUPABASE_SERVICE_ROLE_KEY to the server environment to manage users.");
}

/**
 * Creates a confirmed account with a temporary password (no email needed — Supabase's free
 * built-in email service only delivers to your own team's addresses). Share the password
 * securely; the user changes it under "My account".
 */
export async function createUser(input: CreateUserInput): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("SUPER_ADMIN");
    needServiceKey();
    const v = createUserSchema.parse(input);
    const admin = createAdminSupabase();
    const created = await admin.auth.admin.createUser({
      email: v.email,
      password: v.password,
      email_confirm: true,
      user_metadata: { full_name: v.full_name },
    });
    if (created.error || !created.data.user) {
      if (/already/i.test(created.error?.message ?? "")) throw new UserFacingError("A user with that email already exists.");
      console.error("[users] create", created.error);
      throw new UserFacingError("Could not create the user.");
    }
    // Assign the role as the Super Admin (so the audit log records who did it).
    check(
      await s.supabase
        .from("profiles")
        .update({ role_id: await roleId(s.supabase, v.role), full_name: v.full_name })
        .eq("id", created.data.user.id)
        .select("id")
        .single(),
    );
    return { ok: true, message: `${v.email} can now sign in with the temporary password.` };
  });
}

export async function setUserRole(id: string, role: RoleKey | "NONE"): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("SUPER_ADMIN");
    const target = uuid.parse(id);
    const r = z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "NONE"]).parse(role);
    check(
      await s.supabase
        .from("profiles")
        .update({ role_id: r === "NONE" ? null : await roleId(s.supabase, r) })
        .eq("id", target)
        .select("id")
        .single(),
    );
    return { ok: true, message: "Role updated." };
  });
}

export async function setUserActive(id: string, active: boolean): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("SUPER_ADMIN");
    const target = uuid.parse(id);
    if (target === s.user.id && !active) throw new UserFacingError("You can't deactivate your own account.");
    check(await s.supabase.from("profiles").update({ is_active: active }).eq("id", target).select("id").single());
    if (hasServiceRoleKey()) {
      // Also block sign-in at the Auth level for deactivated users
      await createAdminSupabase().auth.admin.updateUserById(target, { ban_duration: active ? "none" : "876000h" });
    }
    return { ok: true, message: active ? "User reactivated." : "User deactivated and signed out of the CMS." };
  });
}

export async function resetUserPassword(id: string, password: string): Promise<ActionResult> {
  return action(async () => {
    await requireActionRole("SUPER_ADMIN");
    needServiceKey();
    const target = uuid.parse(id);
    const pw = passwordSchema.parse(password);
    const res = await createAdminSupabase().auth.admin.updateUserById(target, { password: pw });
    if (res.error) throw new UserFacingError("Could not reset the password.");
    return { ok: true, message: "Password reset. Share the new temporary password securely." };
  });
}

export async function deleteUser(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("SUPER_ADMIN");
    needServiceKey();
    const target = uuid.parse(id);
    if (target === s.user.id) throw new UserFacingError("You can't delete your own account.");
    // Remove the role first: the database refuses if this is the last active Super Admin.
    check(await s.supabase.from("profiles").update({ role_id: null, is_active: false }).eq("id", target).select("id").single());
    const res = await createAdminSupabase().auth.admin.deleteUser(target);
    if (res.error) throw new UserFacingError("Could not delete the user.");
    return { ok: true, message: "User deleted." };
  });
}

// ---------------------------------------------------------------------------
// My account (any signed-in user)
// ---------------------------------------------------------------------------
export async function updateMyName(fullName: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const name = z.string().trim().min(1, "Enter your name").max(120).parse(fullName);
    check(await s.supabase.from("profiles").update({ full_name: name }).eq("id", s.user.id).select("id").single());
    return { ok: true, message: "Name updated." };
  });
}

export async function changeMyPassword(current: string, next: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const pw = passwordSchema.parse(next);
    // Re-verify the current password before changing it
    const verify = await s.supabase.auth.signInWithPassword({ email: s.user.email ?? "", password: current });
    if (verify.error) return { ok: false, error: "Your current password is incorrect.", fieldErrors: { current: "Incorrect password" } };
    const res = await s.supabase.auth.updateUser({ password: pw });
    if (res.error) throw new UserFacingError(res.error.message.includes("different") ? "Choose a password you haven't used before." : "Could not change the password.");
    return { ok: true, message: "Password changed." };
  });
}
