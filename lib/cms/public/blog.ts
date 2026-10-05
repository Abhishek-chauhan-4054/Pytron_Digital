import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { blogCategories, posts as staticPosts, readingMinutes as staticReadingMinutes } from "@/content/blog";
import type { BlogPost, BlogSection, CtaKey } from "@/content/types";
import type { RichDoc } from "@/lib/cms/types";
import { headingIds } from "@/lib/rich-text/text";
import { cmsRead, getPreviewClient, must, TAGS } from "./core";

/** One shape for blog posts, whether they come from the CMS or the built-in content. */
export type PublicPost = {
  slug: string;
  title: string;
  description: string;
  category: { name: string; slug: string };
  /** yyyy-mm-dd */
  date: string;
  updated?: string;
  author: string;
  intro: string;
  readingMinutes: number;
  cta: CtaKey;
  featuredImage: string;
  ogImage: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  robotsIndex: boolean;
  tags: { name: string; slug: string }[];
  toc: { id: string; heading: string }[];
  body: { kind: "static"; sections: BlogSection[] } | { kind: "rich"; doc: RichDoc };
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export type PublicCategory = { name: string; slug: string };

const POST_COLUMNS =
  "slug,title,excerpt,intro,content,featured_image_url,author_name,status,published_at,updated_at,seo_title,seo_description,og_image_url,canonical_url,robots_index,reading_minutes,cta,category:blog_categories(name,slug),blog_post_tags(tag:blog_tags(name,slug))";
const CARD_COLUMNS = "slug,title,excerpt,published_at,updated_at,reading_minutes,robots_index,category:blog_categories(name,slug)";

type Row = {
  slug: string;
  title: string;
  excerpt: string;
  intro?: string;
  content?: RichDoc | null;
  featured_image_url?: string;
  author_name?: string;
  status?: PublicPost["status"];
  published_at: string | null;
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  robots_index?: boolean;
  reading_minutes: number;
  cta?: "marketing" | "web" | "ai";
  category: { name: string; slug: string } | null;
  blog_post_tags?: { tag: { name: string; slug: string } | null }[];
};

const day = (iso: string | null | undefined) => (iso ?? new Date().toISOString()).slice(0, 10);

function fromRow(r: Row): PublicPost {
  const doc: RichDoc = r.content && r.content.type === "doc" ? r.content : { type: "doc", content: [] };
  return {
    slug: r.slug,
    title: r.title,
    description: r.excerpt,
    category: r.category ?? { name: "Business Growth", slug: "business-growth" },
    date: day(r.published_at),
    updated: day(r.updated_at),
    author: r.author_name ?? "Pytron Digital Team",
    intro: r.intro ?? "",
    readingMinutes: r.reading_minutes,
    cta: r.cta ?? "marketing",
    featuredImage: r.featured_image_url ?? "",
    ogImage: r.og_image_url ?? "",
    seoTitle: r.seo_title ?? "",
    seoDescription: r.seo_description ?? "",
    canonical: r.canonical_url ?? "",
    robotsIndex: r.robots_index ?? true,
    tags: (r.blog_post_tags ?? []).flatMap((t) => (t.tag ? [t.tag] : [])),
    toc: headingIds(doc)
      .filter((h) => h.level <= 2)
      .map((h) => ({ id: h.id, heading: h.text })),
    body: { kind: "rich", doc },
    status: r.status ?? "PUBLISHED",
  };
}

function fromStatic(p: BlogPost): PublicPost {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: { name: p.category, slug: blogCategories.find((c) => c.name === p.category)?.slug ?? "business-growth" },
    date: p.date,
    author: p.author,
    intro: p.intro,
    readingMinutes: staticReadingMinutes(p),
    cta: p.cta,
    featuredImage: "",
    ogImage: "",
    seoTitle: `${p.title} | Pytron Digital`,
    seoDescription: p.description,
    canonical: "",
    robotsIndex: true,
    tags: [],
    toc: p.sections.map((s) => ({ id: s.id, heading: s.heading })),
    body: { kind: "static", sections: p.sections },
    status: "PUBLISHED",
  };
}

const staticAll = () => staticPosts.map(fromStatic);

/** All published posts, newest first (card fields only for CMS posts — no article bodies). */
export async function listPosts(): Promise<PublicPost[]> {
  return cmsRead(
    ["blogs", "list"],
    [TAGS.blogs],
    async (sb) => {
      const rows = must(
        await sb.from("blogs").select(CARD_COLUMNS).eq("status", "PUBLISHED").order("published_at", { ascending: false }).limit(500),
      ) as unknown as Row[];
      return rows.map(fromRow);
    },
    staticAll,
  );
}

export async function listPostsByCategory(slug: string) {
  return (await listPosts()).filter((p) => p.category.slug === slug);
}

export async function listPostsByTag(slug: string): Promise<{ tag: PublicCategory | null; posts: PublicPost[] }> {
  return cmsRead(
    ["blogs", "tag", slug],
    [TAGS.blogs],
    async (sb) => {
      const tag = must(await sb.from("blog_tags").select("id,name,slug").eq("slug", slug).maybeSingle()) as {
        id: string;
        name: string;
        slug: string;
      } | null;
      if (!tag) return { tag: null, posts: [] };
      const rows = must(
        await sb
          .from("blogs")
          .select(`${CARD_COLUMNS},blog_post_tags!inner(tag_id)`)
          .eq("status", "PUBLISHED")
          .eq("blog_post_tags.tag_id", tag.id)
          .order("published_at", { ascending: false })
          .limit(200),
      ) as unknown as Row[];
      return { tag: { name: tag.name, slug: tag.slug }, posts: rows.map(fromRow) };
    },
    () => ({ tag: null, posts: [] }),
  );
}

async function fetchPost(sb: SupabaseClient, slug: string, includeDrafts: boolean) {
  let q = sb.from("blogs").select(POST_COLUMNS).eq("slug", slug);
  if (!includeDrafts) q = q.eq("status", "PUBLISHED");
  const row = must(await q.maybeSingle()) as unknown as Row | null;
  return row ? fromRow(row) : null;
}

/** A single post. In preview mode (signed-in staff), drafts are returned too. */
export async function getPost(slug: string): Promise<{ post: PublicPost | null; preview: boolean }> {
  const preview = await getPreviewClient();
  if (preview) {
    try {
      return { post: await fetchPost(preview, slug, true), preview: true };
    } catch {
      /* fall through to the public read */
    }
  }
  const post = await cmsRead(
    ["blogs", "post", slug],
    [TAGS.blogs],
    (sb) => fetchPost(sb, slug, false),
    () => {
      const p = staticPosts.find((x) => x.slug === slug);
      return p ? fromStatic(p) : null;
    },
  );
  return { post, preview: false };
}

/** Categories that have at least one published post (avoids thin, empty category pages). */
export async function listActiveCategories(): Promise<PublicCategory[]> {
  const all = await cmsRead(
    ["blogs", "categories"],
    [TAGS.blogs],
    async (sb) => must(await sb.from("blog_categories").select("name,slug").order("sort_order")) as PublicCategory[],
    () => blogCategories.map((c) => ({ name: c.name, slug: c.slug })),
  );
  const used = new Set((await listPosts()).map((p) => p.category.slug));
  return all.filter((c) => used.has(c.slug));
}
