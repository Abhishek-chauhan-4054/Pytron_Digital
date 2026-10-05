import type { Metadata } from "next";
import Image from "next/image";
import { User } from "lucide-react";
import { ICON_STROKE } from "@/components/Icon";
import { ProductCard } from "@/components/Cards";
import { PageHero, TitledGrid } from "@/components/PageTemplates";
import { CTASection, ProcessTimeline } from "@/components/Sections";
import { ButtonLink, JsonLd, SectionHeader } from "@/components/ui";
import { processSection } from "@/content/home";
import { aboutPage } from "@/content/pages";
import { products } from "@/content/products";
import { brand, ctas, site } from "@/content/site";
import { breadcrumbSchema } from "@/lib/schema";
import { getSystemHero } from "@/lib/cms/public/pages";
import { systemMetadata } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("about", { ...aboutPage.meta, path: "/about/" });
}

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about/" },
];

export default async function AboutPage() {
  const hero = await getSystemHero("about", { title: aboutPage.h1, intro: aboutPage.intro, cta: ctas.start });
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: site.founder.name,
            jobTitle: "Founder",
            worksFor: { "@type": "Organization", name: brand.name, url: site.url },
          },
        ]}
      />
      <PageHero crumbs={crumbs} eyebrow="About" title={hero.title} intro={hero.intro} cta={hero.cta} />

      <section className="section" aria-labelledby="story-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="story-title" className="h-section">
            {aboutPage.story.heading}
          </h2>
          <div>
            {aboutPage.story.body.map((p) => (
              <p key={p} className="prose-body mb-5 text-[1.05rem]">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="beliefs-title">
        <div className="container-x">
          <SectionHeader id="beliefs-title" label="Values" title={aboutPage.beliefs.heading} copy={brand.proof} />
          <div className="mt-12">
            <TitledGrid items={aboutPage.beliefs.items} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container-x">
          <SectionHeader id="how-title" label={processSection.label} title={aboutPage.howWeWork.heading} copy={aboutPage.howWeWork.body[0]} />
          <ProcessTimeline />
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="our-products-title">
        <div className="container-x">
          <SectionHeader id="our-products-title" label="Our Products" title="We build our own products, too" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-semibold text-navy-900">{aboutPage.invitation}</p>
            <ButtonLink href={ctas.start.href}>{ctas.start.label}</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="lead-title">
        <div className="container-x">
          <h2 id="lead-title" className="h-section">
            {aboutPage.leadership.heading}
          </h2>
          <article className="card mt-10 flex max-w-2xl flex-col gap-5 sm:flex-row sm:items-center" data-reveal>
            {site.founder.photo ? (
              <Image
                src={site.founder.photo}
                alt={`${aboutPage.leadership.name}, ${aboutPage.leadership.role}`}
                width={96}
                height={96}
                className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-line"
              />
            ) : (
              <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <User className="h-9 w-9" strokeWidth={ICON_STROKE} aria-hidden="true" />
              </span>
            )}
            <div>
              <h3 className="text-xl font-semibold">{aboutPage.leadership.name}</h3>
              <p className="text-sm font-medium text-brand-700">{aboutPage.leadership.role}</p>
              <p className="mt-2 text-muted">{aboutPage.leadership.text}</p>
            </div>
          </article>
        </div>
      </section>

      <CTASection />
    </>
  );
}
