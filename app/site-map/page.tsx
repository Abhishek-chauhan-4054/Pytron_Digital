import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageTemplates";
import { allRoutes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sitemap | Pytron Digital",
  description: "Every page on the Pytron Digital website, grouped by section.",
  path: "/site-map/",
});

export default function SiteMapPage() {
  const routes = allRoutes();
  const groups = Array.from(new Set(routes.map((r) => r.group)));
  return (
    <>
      <PageHero crumbs={[{ name: "Home", path: "/" }, { name: "Sitemap", path: "/site-map/" }]} title="Sitemap" intro="Every page on this site, grouped by section." />
      <section className="section">
        <div className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g}>
              <h2 className="text-lg font-semibold">{g}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {routes
                  .filter((r) => r.group === g)
                  .map((r) => (
                    <li key={r.path}>
                      <Link href={r.path} className="text-muted hover:text-brand-700">
                        {r.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
