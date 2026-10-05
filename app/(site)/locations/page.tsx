import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { ICON_STROKE } from "@/components/Icon";
import { PageHero } from "@/components/PageTemplates";
import { CTASection } from "@/components/Sections";
import { JsonLd } from "@/components/ui";
import { locations, locationsPage } from "@/content/locations";
import { ctas } from "@/content/site";
import { breadcrumbSchema } from "@/lib/schema";
import { getSystemHero } from "@/lib/cms/public/pages";
import { systemMetadata } from "@/lib/cms/seo";
import { locationAlternates } from "@/lib/locations";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("locations", {
    ...locationsPage.meta,
    path: "/locations/",
    alternates: locationAlternates(),
  });
}

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Locations", path: "/locations/" },
];

export default async function LocationsPage() {
  const hero = await getSystemHero("locations", { title: locationsPage.h1, intro: locationsPage.intro, cta: ctas.start });
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Markets We Serve" title={hero.title} intro={hero.intro} cta={hero.cta} />
      <section className="section">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <Link key={l.slug} href={`/locations/${l.slug}/`} className="card card-hover group flex h-full flex-col" data-reveal>
              <h2 className="text-xl font-semibold">{l.name}</h2>
              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-muted">{l.intro}</p>
              <p className="mt-4 inline-flex items-start gap-2 text-sm text-navy-800">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" strokeWidth={ICON_STROKE} aria-hidden="true" />
                {l.timezone.hours}
              </p>
              <span className="link-arrow mt-5 text-sm">
                Learn More
                <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
