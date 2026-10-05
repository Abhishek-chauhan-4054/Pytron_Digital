import type { Metadata } from "next";
import { CapabilityBadges, IdeaCard, ProductCard } from "@/components/Cards";
import { PageHero, TitledGrid } from "@/components/PageTemplates";
import { CTASection } from "@/components/Sections";
import { JsonLd, SectionHeader } from "@/components/ui";
import { productsSection } from "@/content/home";
import { products, productsPage } from "@/content/products";
import { ctas } from "@/content/site";
import { breadcrumbSchema } from "@/lib/schema";
import { getSystemHero } from "@/lib/cms/public/pages";
import { systemMetadata } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("products", { ...productsPage.meta, path: "/products/" });
}

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products/" },
];

export default async function ProductsPage() {
  const hero = await getSystemHero("products", { title: productsPage.h1, intro: productsPage.intro });
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Our Products" title={hero.title} intro={hero.intro} />

      <section className="section" aria-labelledby="list-title">
        <div className="container-x">
          <h2 id="list-title" className="sr-only">
            Product list
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
            <IdeaCard title={productsPage.invitation.heading} text={productsPage.invitation.text} cta={ctas.start} />
          </div>
          <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8" data-reveal>
            <p className="font-medium text-navy-900">{productsSection.proof}</p>
            <div className="mt-4">
              <CapabilityBadges items={productsSection.chips} />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="principles-title">
        <div className="container-x">
          <SectionHeader id="principles-title" label="Principles" title="How we build our products" />
          <div className="mt-12">
            <TitledGrid items={productsPage.principles} cols={3} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="container-x max-w-3xl" data-reveal>
          <h2 id="why-title" className="h-section">
            {productsPage.why.heading}
          </h2>
          {productsPage.why.body.map((p) => (
            <p key={p} className="prose-body mt-5 text-[1.05rem]">
              {p}
            </p>
          ))}
        </div>
      </section>

      <CTASection
        title={productsPage.invitation.heading}
        copy={productsPage.invitation.text}
        primary={{ label: ctas.start.label, href: ctas.start.href }}
        secondary={{ label: ctas.work.label, href: ctas.work.href }}
      />
    </>
  );
}
