import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, RelatedLinks } from "@/components/PageTemplates";
import { CTASection, FAQ } from "@/components/Sections";
import { CheckList, JsonLd } from "@/components/ui";
import { locations, locationServices } from "@/content/locations";
import { ctas } from "@/content/site";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { cmsMetadata } from "@/lib/cms/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locationServices.map((s) => ({ country: s.country, service: s.slug }));
}

function find(country: string, service: string) {
  return locationServices.find((s) => s.country === country && s.slug === service);
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; service: string }> }): Promise<Metadata> {
  const { country, service } = await params;
  const page = find(country, service);
  if (!page) return {};
  return cmsMetadata({ ...page.meta, path: `/locations/${country}/${service}/` });
}

export default async function LocationServicePage({ params }: { params: Promise<{ country: string; service: string }> }) {
  const { country, service } = await params;
  const page = find(country, service);
  const loc = locations.find((l) => l.slug === country);
  if (!page || !loc) notFound();
  const path = `/locations/${country}/${service}/`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations/" },
    { name: loc.name, path: `/locations/${country}/` },
    { name: page.label, path },
  ];
  const cta = ctas[page.cta];

  return (
    <>
      <JsonLd
        data={[
          { ...serviceSchema({ name: page.label, description: page.meta.description, path }), areaServed: loc.name },
          breadcrumbSchema(crumbs),
          faqSchema(page.faqs),
        ]}
      />
      <PageHero crumbs={crumbs} eyebrow={loc.name} title={page.h1} intro={page.intro} cta={cta} secondary={ctas.work} />

      <section className="section">
        <div className="container-x max-w-3xl space-y-14">
          {page.sections.map((s) => (
            <div key={s.heading} data-reveal>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="prose-body mt-4 text-[1.05rem]">
                  {p}
                </p>
              ))}
              {s.points && <CheckList items={s.points} className="mt-6" />}
            </div>
          ))}
        </div>
      </section>

      <FAQ items={page.faqs} title={`${page.label}: FAQs`} tone="surface" />

      <RelatedLinks
        title="Keep exploring"
        links={[
          { label: `Working with us from ${loc.name}`, href: `/locations/${country}/` },
          { label: "Service details", href: page.serviceHref },
          { label: "Our Work", href: "/work/" },
          { label: "All markets", href: "/locations/" },
        ]}
      />

      <CTASection primary={{ label: cta.label, href: cta.href }} />
    </>
  );
}
