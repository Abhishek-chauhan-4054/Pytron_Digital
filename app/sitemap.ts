import type { MetadataRoute } from "next";
import { allRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import { noindexPaths } from "@/lib/cms/seo";

/** Regenerated when CMS content changes (tag revalidation) and at least hourly. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [routes, hidden] = await Promise.all([allRoutes(), noindexPaths()]);
  return routes
    .filter((r) => !hidden.has(r.path))
    .map((r) => ({
      url: absoluteUrl(r.path),
      ...(r.lastModified ? { lastModified: r.lastModified } : {}),
      changeFrequency: r.path === "/" || r.path === "/blog/" ? "weekly" : "monthly",
      priority: r.path === "/" ? 1 : r.group === "Legal" ? 0.3 : r.path.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
    }));
}
