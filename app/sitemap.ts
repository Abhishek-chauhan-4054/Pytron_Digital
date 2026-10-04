import type { MetadataRoute } from "next";
import { allRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    changeFrequency: r.path === "/" || r.path === "/blog/" ? "weekly" : "monthly",
    priority: r.path === "/" ? 1 : r.group === "Legal" ? 0.3 : r.path.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
  }));
}
