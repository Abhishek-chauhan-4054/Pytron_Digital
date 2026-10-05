import type { Metadata } from "next";
import { requirePageRole } from "@/lib/admin/session";
import { searchTerm } from "@/lib/admin/format";
import { PageHeader, SearchFilters } from "@/components/admin/ui/Layout";
import { Alert } from "@/components/admin/ui/Feedback";
import { SeoManager } from "@/components/admin/SeoManager";
import { allRoutes } from "@/lib/routes";
import type { SeoMetadataRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "SEO" };

export default async function SeoPage({ searchParams }: { searchParams: Promise<{ q?: string; only?: string }> }) {
  const sp = await searchParams;
  const s = await requirePageRole("ADMIN");
  const [routes, { data: overrides, error }, { data: redirects }] = await Promise.all([
    allRoutes(),
    s.supabase.from("seo_metadata").select("*").order("path"),
    s.supabase.from("redirects").select("id,from_path,to_path,status_code,created_at").order("created_at", { ascending: false }).limit(200),
  ]);
  const map = new Map(((overrides ?? []) as SeoMetadataRow[]).map((o) => [o.path, o]));
  // Include overrides for paths that are not in the route list (e.g. tag pages)
  const all = [...routes.map((r) => ({ path: r.path, label: r.label, group: r.group })), ...[...map.keys()].filter((p) => !routes.some((r) => r.path === p)).map((p) => ({ path: p, label: p, group: "Other" }))];
  const term = searchTerm(sp.q).toLowerCase();
  const rows = all
    .filter((r) => !term || r.path.includes(term) || r.label.toLowerCase().includes(term))
    .filter((r) => sp.only !== "overridden" || map.has(r.path))
    .map((r) => ({ ...r, override: map.get(r.path) ?? null }));

  return (
    <>
      <PageHeader title="SEO" description="Override the title, description, social image, canonical URL and indexing for any page. sitemap.xml and robots.txt update automatically." />
      <div className="mb-4">
        <Alert tone="info">Blog posts, services and CMS pages also have their own SEO tab. An override here takes priority over everything else for that URL.</Alert>
      </div>
      <SearchFilters q={sp.q} placeholder="Search by URL or page name" resetHref="/admin/seo/">
        <label htmlFor="only" className="sr-only">
          Show
        </label>
        <select id="only" name="only" defaultValue={sp.only ?? ""} className="adm-input sm:w-48">
          <option value="">All pages</option>
          <option value="overridden">With overrides only</option>
        </select>
      </SearchFilters>
      {error ? (
        <Alert tone="error">Could not load SEO settings.</Alert>
      ) : (
        <SeoManager rows={rows} redirects={(redirects ?? []) as { id: string; from_path: string; to_path: string; status_code: number; created_at: string }[]} />
      )}
    </>
  );
}
