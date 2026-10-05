"use server";

import { pageSchema, RESERVED_SLUGS, type PageInput } from "@/lib/schemas/page";
import { action, check, UserFacingError, type ActionResult } from "@/lib/admin/result";
import { requireActionRole } from "@/lib/admin/session";
import { revalidatePublic } from "@/lib/admin/revalidate";
import { SYSTEM_PAGE_PATHS, type SystemPageKey } from "@/lib/cms/public/pages";
import type { ContentStatus, PageRow } from "@/lib/cms/types";
import { publishedAtFrom } from "@/lib/admin/dates";
import { uuid } from "@/lib/schemas/common";

const pathFor = (p: Pick<PageRow, "slug" | "system_key">) =>
  p.system_key ? (SYSTEM_PAGE_PATHS[p.system_key as SystemPageKey] ?? "/") : `/${p.slug}/`;

export async function savePage(id: string | null, input: PageInput): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const v = pageSchema.parse(input);
    const existing = id
      ? (check(await s.supabase.from("pages").select("*").eq("id", uuid.parse(id)).single()) as PageRow)
      : null;

    if (!existing?.system_key && RESERVED_SLUGS.includes(v.slug)) {
      return { ok: false, error: "That URL is used by a built-in page.", fieldErrors: { slug: "Reserved by the website — choose another slug." } };
    }
    // Editors may only work on drafts (also enforced by the database).
    const statusValue: ContentStatus = s.profile.role === "EDITOR" ? "DRAFT" : v.status;

    const row = {
      title: v.title,
      // Built-in pages keep their slug (their URL lives in code)
      slug: existing?.system_key ? existing.slug : v.slug,
      status: statusValue,
      hero_heading: v.hero_heading,
      hero_description: v.hero_description,
      hero_cta_label: v.hero_cta_label,
      hero_cta_url: v.hero_cta_url,
      hero_image_url: v.hero_image_url,
      content: existing?.system_key ? existing.content : v.content,
      featured_image_url: v.featured_image_url,
      seo_title: v.seo_title,
      seo_description: v.seo_description,
      og_image_url: v.og_image_url,
      canonical_url: v.canonical_url,
      robots_index: v.robots_index,
      robots_follow: v.robots_follow,
      published_at: publishedAtFrom(v.published_date, existing?.published_at ?? null),
    };

    let pageId = id;
    if (existing) {
      check(await s.supabase.from("pages").update(row).eq("id", existing.id).select("id").single());
    } else {
      const created = check(await s.supabase.from("pages").insert(row).select("id").single()) as { id: string };
      pageId = created.id;
    }
    if (!existing?.system_key) {
      check(await s.supabase.rpc("replace_page_sections", { p_page_id: pageId, p_sections: v.sections }));
    }

    revalidatePublic("pages", [existing ? pathFor(existing) : "/", pathFor({ slug: row.slug, system_key: existing?.system_key ?? null })]);
    return { ok: true, data: { id: pageId! }, message: existing ? "Page saved." : "Page created." };
  });
}

export async function setPageStatus(id: string, status: ContentStatus): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const page = check(
      await s.supabase.from("pages").update({ status }).eq("id", uuid.parse(id)).select("slug,system_key").single(),
    ) as Pick<PageRow, "slug" | "system_key">;
    revalidatePublic("pages", [pathFor(page)]);
    const msg = status === "PUBLISHED" ? "Page published." : status === "ARCHIVED" ? "Page archived." : "Page unpublished.";
    return { ok: true, message: msg };
  });
}

export async function duplicatePage(id: string): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const src = check(
      await s.supabase.from("pages").select("*, sections:page_sections(type,data,sort_order)").eq("id", uuid.parse(id)).single(),
    ) as PageRow & { sections: { type: string; data: unknown; sort_order: number }[] };
    if (src.system_key) throw new UserFacingError("Built-in pages can't be duplicated.");

    let slug = `${src.slug}-copy`.slice(0, 110);
    for (let i = 2; i < 50; i++) {
      const { count } = await s.supabase.from("pages").select("id", { count: "exact", head: true }).eq("slug", slug);
      if (!count) break;
      slug = `${src.slug}-copy-${i}`.slice(0, 115);
    }
    const copy = check(
      await s.supabase
        .from("pages")
        .insert({
          title: `${src.title} (copy)`.slice(0, 200),
          slug,
          status: "DRAFT",
          hero_heading: src.hero_heading,
          hero_description: src.hero_description,
          hero_cta_label: src.hero_cta_label,
          hero_cta_url: src.hero_cta_url,
          hero_image_url: src.hero_image_url,
          content: src.content,
          featured_image_url: src.featured_image_url,
          seo_title: src.seo_title,
          seo_description: src.seo_description,
          og_image_url: src.og_image_url,
          canonical_url: "",
          robots_index: src.robots_index,
          robots_follow: src.robots_follow,
        })
        .select("id")
        .single(),
    ) as { id: string };
    const sections = [...src.sections].sort((a, b) => a.sort_order - b.sort_order).map((x) => ({ type: x.type, data: x.data }));
    check(await s.supabase.rpc("replace_page_sections", { p_page_id: copy.id, p_sections: sections }));
    return { ok: true, data: { id: copy.id }, message: "Draft copy created." };
  });
}

export async function deletePage(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const page = check(await s.supabase.from("pages").select("slug,system_key").eq("id", uuid.parse(id)).single()) as Pick<
      PageRow,
      "slug" | "system_key"
    >;
    if (page.system_key) throw new UserFacingError("Built-in pages can't be deleted. Unpublish it to use the original copy.");
    const res = await s.supabase.from("pages").delete().eq("id", id).select("id");
    if (res.error) throw res.error;
    if (!res.data?.length) throw new UserFacingError("You don't have permission to delete this page.");
    revalidatePublic("pages", [pathFor(page)]);
    return { ok: true, message: "Page deleted." };
  });
}
