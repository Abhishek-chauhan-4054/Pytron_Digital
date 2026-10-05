import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Megaphone, Scale, Search } from "lucide-react";
import { ICON_STROKE } from "@/components/Icon";
import { PageHero } from "@/components/PageTemplates";
import { CTASection, FAQ } from "@/components/Sections";
import { CheckList, JsonLd } from "@/components/ui";
import { locations } from "@/content/locations";
import { ctas } from "@/content/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { cmsMetadata } from "@/lib/cms/seo";
import { locationAlternates } from "@/lib/locations";

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((l) => ({ country: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const loc = locations.find((l) => l.slug === country);
  if (!loc) return {};
  return cmsMetadata({ ...loc.meta, path: `/locations/${country}/`, alternates: locationAlternates() });
}

export default async function LocationPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const loc = locations.find((l) => l.slug === country);
  if (!loc) notFound();
  const path = `/locations/${country}/`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations/" },
    { name: loc.name, path },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(loc.faqs)]} />
      <PageHero crumbs={crumbs} eyebrow={loc.name} title={loc.h1} intro={loc.intro} cta={ctas.consult} secondary={ctas.work}>
        <p className="mt-6 text-sm text-slate-300">
          {loc.slug === "india"
            ? "Based in Sitapur, India."
            : "Remote-first delivery from Sitapur, India, with meeting hours that overlap your working day."}
        </p>
      </PageHero>

      <section className="section" aria-label={`Search and advertising in ${loc.name}`}>
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <article className="card" data-reveal>
            <span className="icon-tile">
              <Search className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">{loc.search.heading}</h2>
            <CheckList items={loc.search.points} className="mt-5" />
          </article>
          <article className="card" data-reveal>
            <span className="icon-tile">
              <Megaphone className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">{loc.ads.heading}</h2>
            <CheckList items={loc.ads.points} className="mt-5" />
          </article>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="compliance-title">
        <div className="container-x">
          <div className="flex items-center gap-3">
            <span className="icon-tile">
              <Scale className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </span>
            <h2 id="compliance-title" className="h-section">
              {loc.compliance.heading}
            </h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm text-muted">General context for planning — not legal advice. We build with these rules in mind and work alongside your legal advisors.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {loc.compliance.items.map((c) => (
              <article key={c.title} className="card h-full" data-reveal>
                <h3 className="h-card">{c.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tz-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div data-reveal>
            <p className="eyebrow eyebrow-dot">Working Model</p>
            <h2 id="tz-title" className="h-section mt-3">
              {loc.timezone.heading}
            </h2>
            <p className="prose-body mt-4 text-[1.05rem]">{loc.timezone.text}</p>
          </div>
          <div className="card flex items-start gap-4" data-reveal>
            <span className="icon-tile">
              <Clock className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-navy-900">{loc.timezone.hours}</p>
              <p className="mt-1 text-sm text-muted">Written weekly updates, shared dashboards and a single point of contact for every project.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="loc-services-title">
        <div className="container-x">
          <h2 id="loc-services-title" className="h-section">Services for {loc.audience}</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {loc.services.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="card card-hover group flex h-full flex-col">
                  <span className="text-lg font-semibold text-navy-900">{s.label}</span>
                  <span className="mt-1.5 flex-1 text-[0.95rem] text-muted">{s.text}</span>
                  <span className="link-arrow mt-4 text-sm">
                    Learn More
                    <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQ items={loc.faqs} title={`Working with Pytron Digital from ${loc.name}`} />
      <CTASection />
    </>
  );
}
