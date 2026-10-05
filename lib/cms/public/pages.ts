import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PageRow, PageSectionRow } from "@/lib/cms/types";
import { cmsRead, getPreviewClient, must, TAGS } from "./core";

export type SystemPageKey =
  | "home"
  | "about"
  | "services"
  | "contact"
  | "blog"
  | "products"
  | "work"
  | "industries"
  | "locations"
  | "digital-marketing"
  | "web-development"
  | "ai-solutions";

export const SYSTEM_PAGE_PATHS: Record<SystemPageKey, string> = {
  home: "/",
  about: "/about/",
  services: "/services/",
  contact: "/contact/",
  blog: "/blog/",
  products: "/products/",
  work: "/work/",
  industries: "/industries/",
  locations: "/locations/",
  "digital-marketing": "/digital-marketing/",
  "web-development": "/web-development/",
  "ai-solutions": "/ai-solutions/",
};

export type HeroCopy = {
  title: string;
  intro: string;
  cta?: { label: string; href: string };
};

type SystemRow = Pick<
  PageRow,
  | "system_key"
  | "status"
  | "hero_heading"
  | "hero_description"
  | "hero_cta_label"
  | "hero_cta_url"
  | "seo_title"
  | "seo_description"
  | "og_image_url"
  | "canonical_url"
  | "robots_index"
  | "robots_follow"
>;

const SYSTEM_COLUMNS =
  "system_key,status,hero_heading,hero_description,hero_cta_label,hero_cta_url,seo_title,seo_description,og_image_url,canonical_url,robots_index,robots_follow";

async function systemRows(): Promise<SystemRow[]> {
  // Staff previewing see unpublished (draft) hero edits too.
  const preview = await getPreviewClient();
  if (preview) {
    const res = await preview.from("pages").select(SYSTEM_COLUMNS).not("system_key", "is", null).neq("status", "ARCHIVED");
    if (!res.error) return res.data as SystemRow[];
  }
  return cmsRead(
    ["pages", "system"],
    [TAGS.pages],
    async (sb) =>
      must(await sb.from("pages").select(SYSTEM_COLUMNS).not("system_key", "is", null).eq("status", "PUBLISHED")) as SystemRow[],
    () => [],
  );
}

/**
 * Hero copy for a built-in page: the CMS value when that page is published in the CMS,
 * otherwise the original copy from code. Layout is unchanged either way.
 */
export async function getSystemHero(key: SystemPageKey, fallback: HeroCopy): Promise<HeroCopy> {
  const row = (await systemRows()).find((r) => r.system_key === key);
  if (!row) return fallback;
  const cta =
    row.hero_cta_label && row.hero_cta_url ? { label: row.hero_cta_label, href: row.hero_cta_url } : fallback.cta;
  return {
    title: row.hero_heading.trim() || fallback.title,
    intro: row.hero_description.trim() || fallback.intro,
    cta,
  };
}

export type EntitySeo = {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
};

export async function getSystemSeo(key: SystemPageKey): Promise<EntitySeo> {
  const row = (await systemRows()).find((r) => r.system_key === key);
  if (!row) return {};
  return {
    title: row.seo_title || undefined,
    description: row.seo_description || undefined,
    ogImage: row.og_image_url || undefined,
    canonical: row.canonical_url || undefined,
    robotsIndex: row.robots_index,
    robotsFollow: row.robots_follow,
  };
}

/** Heading convention for the home hero: new lines → line breaks, [[text]] → gradient highlight. */
export function parseHeroHeading(text: string) {
  return text.split("\n").map((line) =>
    line.split(/(\[\[[^\]]+\]\])/g).filter(Boolean).map((part) =>
      part.startsWith("[[") && part.endsWith("]]") ? { text: part.slice(2, -2), highlight: true } : { text: part, highlight: false },
    ),
  );
}

// ---------------------------------------------------------------------------
// CMS-created pages (rendered at /<slug>/)
// ---------------------------------------------------------------------------
export type CmsPage = PageRow & { sections: PageSectionRow[] };

async function fetchPage(sb: SupabaseClient, slug: string, includeDrafts: boolean): Promise<CmsPage | null> {
  let q = sb.from("pages").select("*, sections:page_sections(id,page_id,type,data,sort_order)").eq("slug", slug).is("system_key", null);
  if (!includeDrafts) q = q.eq("status", "PUBLISHED");
  const row = must(await q.maybeSingle()) as CmsPage | null;
  if (row) row.sections = [...(row.sections ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return row;
}

export async function getCmsPage(slug: string): Promise<{ page: CmsPage | null; preview: boolean }> {
  const preview = await getPreviewClient();
  if (preview) {
    try {
      return { page: await fetchPage(preview, slug, true), preview: true };
    } catch {
      /* fall through */
    }
  }
  const page = await cmsRead(["pages", "slug", slug], [TAGS.pages], (sb) => fetchPage(sb, slug, false), () => null);
  return { page, preview: false };
}

export async function listCmsPages(): Promise<{ slug: string; title: string; updated_at: string; robots_index: boolean }[]> {
  return cmsRead(
    ["pages", "list"],
    [TAGS.pages],
    async (sb) =>
      must(
        await sb
          .from("pages")
          .select("slug,title,updated_at,robots_index")
          .is("system_key", null)
          .eq("status", "PUBLISHED")
          .order("title")
          .limit(500),
      ) as { slug: string; title: string; updated_at: string; robots_index: boolean }[],
    () => [],
  );
}
