"use server";

import { navItemSchema, seoOverrideSchema, settingsSchema, type NavItemInput, type SeoOverrideInput, type SettingsInput } from "@/lib/schemas/site";
import { action, check, UserFacingError, type ActionResult } from "@/lib/admin/result";
import { requireActionRole } from "@/lib/admin/session";
import { revalidatePublic } from "@/lib/admin/revalidate";
import { uuid } from "@/lib/schemas/common";

// ---------------------------------------------------------------------------
// Settings (SUPER_ADMIN)
// ---------------------------------------------------------------------------
export async function saveSettings(input: SettingsInput): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("SUPER_ADMIN");
    const v = settingsSchema.parse(input);
    check(await s.supabase.from("site_settings").update({ ...v, updated_by: s.user.id }).eq("id", 1).select("id").single());
    revalidatePublic("settings");
    return { ok: true, message: "Settings saved. The website is updated." };
  });
}

// ---------------------------------------------------------------------------
// Navigation (ADMIN+)
// ---------------------------------------------------------------------------
export async function saveNavItem(id: string | null, input: NavItemInput): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const v = navItemSchema.parse(input);
    if (id) {
      check(await s.supabase.from("navigation_items").update(v).eq("id", uuid.parse(id)).select("id").single());
    } else {
      const { data: last } = await s.supabase
        .from("navigation_items")
        .select("sort_order")
        .eq("location", v.location)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      check(
        await s.supabase
          .from("navigation_items")
          .insert({ ...v, sort_order: ((last as { sort_order: number } | null)?.sort_order ?? 0) + 10 })
          .select("id")
          .single(),
      );
    }
    revalidatePublic("navigation");
    return { ok: true, message: id ? "Link saved." : "Link added." };
  });
}

export async function moveNavItem(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const row = check(await s.supabase.from("navigation_items").select("id,location,sort_order").eq("id", uuid.parse(id)).single()) as {
      id: string;
      location: string;
      sort_order: number;
    };
    let q = s.supabase.from("navigation_items").select("id,sort_order").eq("location", row.location).neq("id", row.id);
    q = direction === "up" ? q.lte("sort_order", row.sort_order).order("sort_order", { ascending: false }) : q.gte("sort_order", row.sort_order).order("sort_order");
    const { data } = await q.limit(1).maybeSingle();
    const n = data as { id: string; sort_order: number } | null;
    if (!n) return { ok: true };
    const a = n.sort_order === row.sort_order ? row.sort_order + (direction === "up" ? -1 : 1) : n.sort_order;
    check(await s.supabase.from("navigation_items").update({ sort_order: a }).eq("id", row.id).select("id").single());
    check(await s.supabase.from("navigation_items").update({ sort_order: row.sort_order }).eq("id", n.id).select("id").single());
    revalidatePublic("navigation");
    return { ok: true };
  });
}

export async function deleteNavItem(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const res = await s.supabase.from("navigation_items").delete().eq("id", uuid.parse(id)).select("id");
    if (res.error) throw res.error;
    if (!res.data?.length) throw new UserFacingError("You don't have permission to delete this link.");
    revalidatePublic("navigation");
    return { ok: true, message: "Link deleted." };
  });
}

// ---------------------------------------------------------------------------
// SEO overrides (ADMIN+)
// ---------------------------------------------------------------------------
export async function saveSeoOverride(input: SeoOverrideInput): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const v = seoOverrideSchema.parse(input);
    check(await s.supabase.from("seo_metadata").upsert({ ...v, updated_by: s.user.id }, { onConflict: "path" }).select("id").single());
    revalidatePublic("seo", [v.path]);
    return { ok: true, message: "SEO saved for " + v.path };
  });
}

export async function deleteSeoOverride(path: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const p = seoOverrideSchema.shape.path.parse(path);
    const res = await s.supabase.from("seo_metadata").delete().eq("path", p).select("id");
    if (res.error) throw res.error;
    revalidatePublic("seo", [p]);
    return { ok: true, message: "Override removed — the page uses its default SEO again." };
  });
}

export async function deleteRedirect(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const res = await s.supabase.from("redirects").delete().eq("id", uuid.parse(id)).select("from_path");
    if (res.error) throw res.error;
    revalidatePublic("redirects", res.data?.map((r) => (r as { from_path: string }).from_path) ?? []);
    return { ok: true, message: "Redirect removed." };
  });
}
