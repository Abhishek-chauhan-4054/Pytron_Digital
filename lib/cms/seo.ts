import "server-only";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getSystemSeo, type EntitySeo, type SystemPageKey } from "@/lib/cms/public/pages";
import { getSeoOverrides, getSettings } from "@/lib/cms/public/site";

type Input = Parameters<typeof buildMetadata>[0];

/**
 * Metadata with CMS control. Precedence (highest first):
 *   1. CMS → SEO override for this exact path
 *   2. The entity's own SEO fields (blog post, service, page)
 *   3. The defaults written in code
 * plus the default OG image from CMS → Settings.
 */
export async function cmsMetadata(input: Input, entity: EntitySeo = {}): Promise<Metadata> {
  const [overrides, settings] = await Promise.all([getSeoOverrides(), getSettings()]);
  const o = overrides.get(input.path);
  return buildMetadata({
    ...input,
    title: o?.title || entity.title || input.title,
    description: o?.description || entity.description || input.description,
    canonical: o?.canonical_url || entity.canonical || input.canonical,
    ogTitle: o?.og_title || input.ogTitle,
    ogDescription: o?.og_description || input.ogDescription,
    ogImage: o?.og_image_url || entity.ogImage || input.ogImage || settings.defaultOgImage || undefined,
    robotsIndex: o ? o.robots_index : (entity.robotsIndex ?? input.robotsIndex),
    robotsFollow: o ? o.robots_follow : (entity.robotsFollow ?? input.robotsFollow),
  });
}

/** For built-in pages: their CMS page record supplies title/description/OG/robots. */
export async function systemMetadata(key: SystemPageKey, input: Input): Promise<Metadata> {
  return cmsMetadata(input, await getSystemSeo(key));
}

/** Paths that must not appear in sitemap.xml (noindex overrides). */
export async function noindexPaths(): Promise<Set<string>> {
  const overrides = await getSeoOverrides();
  return new Set([...overrides.values()].filter((o) => !o.robots_index).map((o) => o.path));
}
