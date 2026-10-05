import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { aiPages } from "@/content/ai";
import { developmentPages } from "@/content/development";
import { marketingPages } from "@/content/marketing";
import type { IconName, ServicePage } from "@/content/types";
import { ICON_NAMES } from "@/components/Icon";
import type { Pillar, RichDoc, ServiceRow } from "@/lib/cms/types";
import { cmsRead, getPreviewClient, must, TAGS } from "./core";

export type ServiceSummary = { pillar: Pillar; slug: string; label: string; summary: string; icon: IconName; image: string };

/** Built-in detail pages (problem / solution / process / FAQ…) that live in code. */
export const builtInServices: Record<Pillar, ServicePage[]> = {
  marketing: marketingPages,
  web: developmentPages,
  ai: aiPages,
};

const asIcon = (v: string): IconName => ((ICON_NAMES as string[]).includes(v) ? (v as IconName) : "sparkles");

const staticSummaries = (pillar?: Pillar): ServiceSummary[] =>
  (Object.keys(builtInServices) as Pillar[])
    .filter((p) => !pillar || p === pillar)
    .flatMap((p) =>
      builtInServices[p].map((s) => ({ pillar: p, slug: s.slug, label: s.label, summary: s.summary, icon: s.icon, image: "" })),
    );

/** Published services for cards and hub pages, in CMS sort order. */
export async function listServices(pillar?: Pillar): Promise<ServiceSummary[]> {
  const all = await cmsRead(
    ["services", "list"],
    [TAGS.services],
    async (sb) => {
      const rows = must(
        await sb
          .from("services")
          .select("pillar,slug,name,short_description,icon,image_url,sort_order")
          .eq("status", "PUBLISHED")
          .order("pillar")
          .order("sort_order")
          .order("name"),
      ) as Pick<ServiceRow, "pillar" | "slug" | "name" | "short_description" | "icon" | "image_url">[];
      return rows.map((r) => ({
        pillar: r.pillar,
        slug: r.slug,
        label: r.name,
        summary: r.short_description,
        icon: asIcon(r.icon),
        image: r.image_url,
      }));
    },
    () => staticSummaries(),
  );
  return pillar ? all.filter((s) => s.pillar === pillar) : all;
}

export type ResolvedService = {
  /** Built-in page content merged with CMS edits (hero, summary, features, SEO). */
  page: ServicePage;
  /** True when the detail sections exist in code; false for services created in the CMS. */
  builtIn: boolean;
  fullDescription: RichDoc | null;
  image: string;
  cta: { label: string; href: string } | null;
  ogImage: string;
  status: ServiceRow["status"];
};

function merge(pillar: Pillar, slug: string, row: ServiceRow | null): ResolvedService | null {
  const base = builtInServices[pillar].find((s) => s.slug === slug) ?? null;
  if (!row) {
    return base
      ? { page: base, builtIn: true, fullDescription: null, image: "", cta: null, ogImage: "", status: "PUBLISHED" }
      : null;
  }
  const page: ServicePage = {
    ...(base ?? {
      problem: { heading: "", body: [] },
      solution: { heading: "", body: [] },
      benefits: [],
      process: [],
      industries: [],
      faqs: [],
      related: [],
    }),
    slug: row.slug,
    label: row.name,
    icon: asIcon(row.icon),
    summary: row.short_description,
    meta: {
      title: row.seo_title || base?.meta.title || `${row.name} | Pytron Digital`,
      description: row.seo_description || base?.meta.description || row.short_description,
    },
    h1: row.hero_heading || base?.h1 || row.name,
    intro: row.intro || base?.intro || row.short_description,
    included: row.features.length ? row.features : (base?.included ?? []),
  };
  return {
    page,
    builtIn: Boolean(base),
    fullDescription: row.full_description,
    image: row.image_url,
    cta: row.cta_label && row.cta_url ? { label: row.cta_label, href: row.cta_url } : null,
    ogImage: row.og_image_url,
    status: row.status,
  };
}

async function fetchRow(sb: SupabaseClient, pillar: Pillar, slug: string, includeDrafts: boolean) {
  let q = sb.from("services").select("*").eq("pillar", pillar).eq("slug", slug);
  if (!includeDrafts) q = q.eq("status", "PUBLISHED");
  return must(await q.maybeSingle()) as ServiceRow | null;
}

/**
 * Resolve a service detail page. When the CMS is connected it is the source of truth:
 * an unpublished service returns null (→ 404) even if a built-in page exists.
 */
export async function getService(pillar: Pillar, slug: string): Promise<{ service: ResolvedService | null; preview: boolean }> {
  const preview = await getPreviewClient();
  if (preview) {
    try {
      const row = await fetchRow(preview, pillar, slug, true);
      return { service: merge(pillar, slug, row), preview: true };
    } catch {
      /* fall through */
    }
  }
  const service = await cmsRead(
    ["services", pillar, slug],
    [TAGS.services],
    async (sb) => {
      const row = await fetchRow(sb, pillar, slug, false);
      return row ? merge(pillar, slug, row) : null;
    },
    () => merge(pillar, slug, null),
  );
  return { service, preview: false };
}
