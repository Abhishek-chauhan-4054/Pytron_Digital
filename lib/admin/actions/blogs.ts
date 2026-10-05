"use server";

import { blogSchema, categorySchema, tagSchema, type BlogInput } from "@/lib/schemas/blog";
import { action, check, UserFacingError, type ActionResult } from "@/lib/admin/result";
import { requireActionRole } from "@/lib/admin/session";
import { revalidatePublic } from "@/lib/admin/revalidate";
import { publishedAtFrom } from "@/lib/admin/dates";
import type { BlogRow, ContentStatus } from "@/lib/cms/types";
import { nodeText, readingMinutesFor } from "@/lib/rich-text/text";
import { uuid } from "@/lib/schemas/common";
import type { z } from "zod";

const pathFor = (slug: string) => `/blog/${slug}/`;

export async function saveBlog(id: string | null, input: BlogInput): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const v = blogSchema.parse(input);
    const existing = id ? (check(await s.supabase.from("blogs").select("*").eq("id", uuid.parse(id)).single()) as BlogRow) : null;
    const row = {
      title: v.title,
      slug: v.slug,
      status: s.profile.role === "EDITOR" ? ("DRAFT" as const) : v.status,
      excerpt: v.excerpt,
      intro: v.intro,
      content: v.content,
      featured_image_url: v.featured_image_url,
      author_name: v.author_name,
      category_id: v.category_id || null,
      published_at: publishedAtFrom(v.published_date, existing?.published_at ?? null),
      seo_title: v.seo_title,
      seo_description: v.seo_description,
      og_image_url: v.og_image_url,
      canonical_url: v.canonical_url,
      robots_index: v.robots_index,
      cta: v.cta,
      reading_minutes: readingMinutesFor(v.intro, nodeText(v.content)),
    };
    let blogId = id;
    if (existing) {
      check(await s.supabase.from("blogs").update(row).eq("id", existing.id).select("id").single());
    } else {
      blogId = (check(await s.supabase.from("blogs").insert(row).select("id").single()) as { id: string }).id;
    }
    check(await s.supabase.rpc("set_blog_tags", { p_blog_id: blogId, p_tags: v.tags }));
    revalidatePublic("blogs", ["/blog/", pathFor(row.slug), ...(existing ? [pathFor(existing.slug)] : [])]);
    return { ok: true, data: { id: blogId! }, message: existing ? "Post saved." : "Post created." };
  });
}

export async function setBlogStatus(id: string, status: ContentStatus): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const row = check(await s.supabase.from("blogs").update({ status }).eq("id", uuid.parse(id)).select("slug").single()) as { slug: string };
    revalidatePublic("blogs", ["/blog/", pathFor(row.slug)]);
    return { ok: true, message: status === "PUBLISHED" ? "Post published." : status === "ARCHIVED" ? "Post archived." : "Post unpublished." };
  });
}

export async function duplicateBlog(id: string): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const src = check(await s.supabase.from("blogs").select("*, blog_post_tags(tag:blog_tags(name))").eq("id", uuid.parse(id)).single()) as BlogRow & {
      blog_post_tags: { tag: { name: string } | null }[];
    };
    let slug = `${src.slug}-copy`.slice(0, 110);
    for (let i = 2; i < 50; i++) {
      const { count } = await s.supabase.from("blogs").select("id", { count: "exact", head: true }).eq("slug", slug);
      if (!count) break;
      slug = `${src.slug}-copy-${i}`.slice(0, 115);
    }
    const copy = check(
      await s.supabase
        .from("blogs")
        .insert({
          title: `${src.title} (copy)`.slice(0, 200),
          slug,
          status: "DRAFT",
          excerpt: src.excerpt,
          intro: src.intro,
          content: src.content,
          featured_image_url: src.featured_image_url,
          author_name: src.author_name,
          category_id: src.category_id,
          seo_title: src.seo_title,
          seo_description: src.seo_description,
          og_image_url: src.og_image_url,
          robots_index: src.robots_index,
          reading_minutes: src.reading_minutes,
          cta: src.cta,
        })
        .select("id")
        .single(),
    ) as { id: string };
    const tags = src.blog_post_tags.flatMap((t) => (t.tag ? [t.tag.name] : []));
    check(await s.supabase.rpc("set_blog_tags", { p_blog_id: copy.id, p_tags: tags }));
    return { ok: true, data: { id: copy.id }, message: "Draft copy created." };
  });
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const res = await s.supabase.from("blogs").delete().eq("id", uuid.parse(id)).select("slug");
    if (res.error) throw res.error;
    if (!res.data?.length) throw new UserFacingError("You don't have permission to delete this post.");
    revalidatePublic("blogs", ["/blog/", pathFor((res.data[0] as { slug: string }).slug)]);
    return { ok: true, message: "Post deleted." };
  });
}

// ---------------------------------------------------------------------------
// Categories & tags
// ---------------------------------------------------------------------------
export async function saveCategory(id: string | null, input: z.input<typeof categorySchema>): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const v = categorySchema.parse(input);
    if (id) check(await s.supabase.from("blog_categories").update(v).eq("id", uuid.parse(id)).select("id").single());
    else {
      const { data: last } = await s.supabase.from("blog_categories").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
      check(await s.supabase.from("blog_categories").insert({ ...v, sort_order: ((last as { sort_order: number } | null)?.sort_order ?? 0) + 1 }).select("id").single());
    }
    revalidatePublic("blogs", ["/blog/"]);
    return { ok: true, message: id ? "Category saved." : "Category created." };
  });
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const { count } = await s.supabase.from("blogs").select("id", { count: "exact", head: true }).eq("category_id", uuid.parse(id));
    if (count) throw new UserFacingError(`This category is used by ${count} post${count === 1 ? "" : "s"}. Move them to another category first.`);
    const res = await s.supabase.from("blog_categories").delete().eq("id", id).select("id");
    if (res.error) throw res.error;
    if (!res.data?.length) throw new UserFacingError("You don't have permission to delete this category.");
    revalidatePublic("blogs", ["/blog/"]);
    return { ok: true, message: "Category deleted." };
  });
}

export async function saveTag(id: string, input: z.input<typeof tagSchema>): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("EDITOR");
    const v = tagSchema.parse(input);
    check(await s.supabase.from("blog_tags").update(v).eq("id", uuid.parse(id)).select("id").single());
    revalidatePublic("blogs", ["/blog/"]);
    return { ok: true, message: "Tag saved." };
  });
}

export async function deleteTag(id: string): Promise<ActionResult> {
  return action(async () => {
    const s = await requireActionRole("ADMIN");
    const res = await s.supabase.from("blog_tags").delete().eq("id", uuid.parse(id)).select("id");
    if (res.error) throw res.error;
    if (!res.data?.length) throw new UserFacingError("You don't have permission to delete this tag.");
    revalidatePublic("blogs", ["/blog/"]);
    return { ok: true, message: "Tag deleted." };
  });
}
