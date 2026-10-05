import "server-only";
import { industries } from "@/content/industries";
import { locations, locationServices } from "@/content/locations";
import { legalDocs } from "@/content/pages";
import { listActiveCategories, listPosts } from "@/lib/cms/public/blog";
import { listCmsPages } from "@/lib/cms/public/pages";
import { listServices } from "@/lib/cms/public/services";

export type RouteEntry = { path: string; label: string; group: string; lastModified?: string };

/**
 * Single source of truth for every indexable route (sitemap.xml and the HTML sitemap).
 * Blog posts, services and CMS pages come from the CMS when it is connected
 * (published items only), otherwise from the built-in content.
 */
export async function allRoutes(): Promise<RouteEntry[]> {
  const [services, posts, categories, pages] = await Promise.all([
    listServices(),
    listPosts(),
    listActiveCategories(),
    listCmsPages(),
  ]);
  const svc = (pillar: "marketing" | "web" | "ai", base: string, group: string) =>
    services.filter((s) => s.pillar === pillar).map((s) => ({ path: `${base}${s.slug}/`, label: s.label, group }));

  return [
    { path: "/", label: "Home", group: "Main" },
    { path: "/services/", label: "Services", group: "Main" },
    { path: "/products/", label: "Products", group: "Main" },
    { path: "/work/", label: "Our Work", group: "Main" },
    { path: "/about/", label: "About", group: "Main" },
    { path: "/contact/", label: "Contact", group: "Main" },
    ...pages.filter((p) => p.robots_index).map((p) => ({ path: `/${p.slug}/`, label: p.title, group: "Main", lastModified: p.updated_at })),
    { path: "/digital-marketing/", label: "Digital Marketing", group: "Digital Marketing" },
    ...svc("marketing", "/digital-marketing/", "Digital Marketing"),
    { path: "/web-development/", label: "Web Development", group: "Web Development" },
    ...svc("web", "/web-development/", "Web Development"),
    { path: "/ai-solutions/", label: "AI Solutions", group: "AI & Automation" },
    ...svc("ai", "/ai-solutions/", "AI & Automation"),
    { path: "/industries/", label: "Industries", group: "Industries" },
    ...industries.map((i) => ({ path: `/industries/${i.slug}/`, label: i.name, group: "Industries" })),
    { path: "/locations/", label: "Markets We Serve", group: "Locations" },
    ...locations.map((l) => ({ path: `/locations/${l.slug}/`, label: l.name, group: "Locations" })),
    ...locationServices.map((s) => ({ path: `/locations/${s.country}/${s.slug}/`, label: s.label, group: "Locations" })),
    { path: "/blog/", label: "Blog", group: "Blog" },
    ...categories.map((c) => ({ path: `/blog/category/${c.slug}/`, label: `${c.name} articles`, group: "Blog" })),
    ...posts
      .filter((p) => p.robotsIndex)
      .map((p) => ({ path: `/blog/${p.slug}/`, label: p.title, group: "Blog", lastModified: p.updated ?? p.date })),
    ...legalDocs.map((d) => ({ path: `/${d.slug}/`, label: d.title, group: "Legal" })),
    { path: "/site-map/", label: "Sitemap", group: "Legal" },
  ];
}
