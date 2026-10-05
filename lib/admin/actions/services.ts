"use server";

import { serviceSchema, type ServiceInput } from "@/lib/schemas/service";
import { action, check, UserFacingError, type ActionResult } from "@/lib/admin/result";
import { requireActionRole } from "@/lib/admin/session";
import { revalidatePublic } from "@/lib/admin/revalidate";
import { pillarPath, type ContentStatus, type ServiceRow } from "@/lib/cms/types";
import { uuid } from "@/lib/schemas/common";

const pathFor = (s: Pick<ServiceRow, "pillar" | "slug">) => `${pillarPath(s.pillar)}${s.slug}/`;

function paths(...rows: (Pick<ServiceRow, "pillar" | "slug"> | null)[]) {
  const out = new Set<string>(["/services/"]);
  for (const r of rows) {
    if (!r) continue;
    out.add(pathFor(r));
    out.add(pillarPath(r.pillar));
  }
  return [...out];
}

export async function saveService(id: string | null, input: ServiceInput): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const v = serviceSchema.parse(input);
    const existing = id
      ? (check(await s.supabase.from("services").select("*").eq("id", uuid.parse(id)).single()) as ServiceRow)
      : null;
    const row = {
      pillar: v.pillar,
      name: v.name,
      slug: v.slug,
      status: s.profile.role === "EDITOR" ? ("DRAFT" as const) : v.status,
      short_description: v.short_description,
      hero_heading: v.hero_heading,
      intro: v.intro,
      full_description: v.full_description,
      icon: v.icon,
      image_url: v.image_url,
      features: v.features,
      cta_label: v.cta_label,
      cta_url: v.cta_url,
      seo_title: v.seo_title,
      seo_description: v.seo_description,
      og_image_url: v.og_image_url,
    };
    let serviceId = id;
    if (existing) {
      check(await s.supabase.from("services").update(row).eq("id", existing.id).select("id").single());
    } else {
      // New services go to the end of their pillar
      const { data: last } = await s.supabase
        .from("services")
        .select("sort_order")
        .eq("pillar", v.pillar)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      const created = check(
        await s.supabase
          .from("services")
          .insert({ ...row, sort_order: ((last as { sort_order: number } | null)?.sort_order ?? 0) + 10 })
          .select("id")
          .single(),
      ) as { id: string };
      serviceId = created.id;
    }
    revalidatePublic("services", paths(existing, row));
    return { ok: true, data: { id: serviceId! }, message: existing ? "Service saved." : "Service created." };
  });
}

export async function setServiceStatus(id: string, status: ContentStatus): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const row = check(
      await s.supabase.from("services").update({ status }).eq("id", uuid.parse(id)).select("pillar,slug").single(),
    ) as Pick<ServiceRow, "pillar" | "slug">;
    revalidatePublic("services", paths(row));
    return { ok: true, message: status === "PUBLISHED" ? "Service published." : status === "ARCHIVED" ? "Service archived." : "Service unpublished." };
  });
}

export async function moveService(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const row = check(await s.supabase.from("services").select("id,pillar,sort_order").eq("id", uuid.parse(id)).single()) as {
      id: string;
      pillar: string;
      sort_order: number;
    };
    let q = s.supabase.from("services").select("id").eq("pillar", row.pillar).neq("id", row.id);
    q =
      direction === "up"
        ? q.lte("sort_order", row.sort_order).order("sort_order", { ascending: false })
        : q.gte("sort_order", row.sort_order).order("sort_order", { ascending: true });
    const { data: neighbour } = await q.limit(1).maybeSingle();
    if (!neighbour) return { ok: true, message: "Already at the " + (direction === "up" ? "top." : "bottom.") };
    check(await s.supabase.rpc("swap_service_order", { p_a: row.id, p_b: (neighbour as { id: string }).id }));
    revalidatePublic("services", ["/services/", pillarPath(row.pillar as ServiceRow["pillar"])]);
    return { ok: true };
  });
}

export async function duplicateService(id: string): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const src = check(await s.supabase.from("services").select("*").eq("id", uuid.parse(id)).single()) as ServiceRow;
    let slug = `${src.slug}-copy`.slice(0, 110);
    for (let i = 2; i < 50; i++) {
      const { count } = await s.supabase.from("services").select("id", { count: "exact", head: true }).eq("pillar", src.pillar).eq("slug", slug);
      if (!count) break;
      slug = `${src.slug}-copy-${i}`.slice(0, 115);
    }
    const { id: _id, created_at: _c, updated_at: _u, published_at: _p, ...rest } = src;
    void _id;
    void _c;
    void _u;
    void _p;
    const copy = check(
      await s.supabase
        .from("services")
        .insert({ ...rest, name: `${src.name} (copy)`.slice(0, 120), slug, status: "DRAFT", sort_order: src.sort_order + 1 })
        .select("id")
        .single(),
    ) as { id: string };
    return { ok: true, data: { id: copy.id }, message: "Draft copy created." };
  });
}

export async function deleteService(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const res = await s.supabase.from("services").delete().eq("id", uuid.parse(id)).select("pillar,slug");
    if (res.error) throw res.error;
    if (!res.data?.length) throw new UserFacingError("You don't have permission to delete this service.");
    revalidatePublic("services", paths(res.data[0] as Pick<ServiceRow, "pillar" | "slug">));
    return { ok: true, message: "Service deleted." };
  });
}
