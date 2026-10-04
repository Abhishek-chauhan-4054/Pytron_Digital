import { aiPages } from "@/content/ai";
import { activeCategories, posts } from "@/content/blog";
import { developmentPages } from "@/content/development";
import { industries } from "@/content/industries";
import { locations, locationServices } from "@/content/locations";
import { marketingPages } from "@/content/marketing";
import { legalDocs } from "@/content/pages";

export type RouteEntry = { path: string; label: string; group: string };

/** Single source of truth for every indexable route (sitemap.xml and HTML sitemap). */
export function allRoutes(): RouteEntry[] {
  return [
    { path: "/", label: "Home", group: "Main" },
    { path: "/services/", label: "Services", group: "Main" },
    { path: "/products/", label: "Products", group: "Main" },
    { path: "/work/", label: "Our Work", group: "Main" },
    { path: "/about/", label: "About", group: "Main" },
    { path: "/contact/", label: "Contact", group: "Main" },
    { path: "/digital-marketing/", label: "Digital Marketing", group: "Digital Marketing" },
    ...marketingPages.map((p) => ({ path: `/digital-marketing/${p.slug}/`, label: p.label, group: "Digital Marketing" })),
    { path: "/web-development/", label: "Web Development", group: "Web Development" },
    ...developmentPages.map((p) => ({ path: `/web-development/${p.slug}/`, label: p.label, group: "Web Development" })),
    { path: "/ai-solutions/", label: "AI Solutions", group: "AI & Automation" },
    ...aiPages.map((p) => ({ path: `/ai-solutions/${p.slug}/`, label: p.label, group: "AI & Automation" })),
    { path: "/industries/", label: "Industries", group: "Industries" },
    ...industries.map((i) => ({ path: `/industries/${i.slug}/`, label: i.name, group: "Industries" })),
    { path: "/locations/", label: "Markets We Serve", group: "Locations" },
    ...locations.map((l) => ({ path: `/locations/${l.slug}/`, label: l.name, group: "Locations" })),
    ...locationServices.map((s) => ({ path: `/locations/${s.country}/${s.slug}/`, label: s.label, group: "Locations" })),
    { path: "/blog/", label: "Blog", group: "Blog" },
    ...activeCategories().map((c) => ({ path: `/blog/category/${c.slug}/`, label: `${c.name} articles`, group: "Blog" })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}/`, label: p.title, group: "Blog" })),
    ...legalDocs.map((d) => ({ path: `/${d.slug}/`, label: d.title, group: "Legal" })),
    { path: "/site-map/", label: "Sitemap", group: "Legal" },
  ];
}
