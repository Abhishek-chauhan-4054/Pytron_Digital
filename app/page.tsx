import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { MarketingPanel, SolutionsPanel } from "@/components/CorePanels";
import { CapabilityBadges, IdeaCard, CaseStudyCard, ProductCard, ServiceCard } from "@/components/Cards";
import {
  CTASection,
  Differentiator,
  GlobalStrip,
  ProcessSection,
  TestimonialsOrPartnership,
  WhyPytron,
} from "@/components/Sections";
import { Icon } from "@/components/Icon";
import { ButtonLink, SectionHeader } from "@/components/ui";
import { productsSection, servicesSection, trustSection, workSection } from "@/content/home";
import { products } from "@/content/products";
import { caseStudies } from "@/content/work";
import { brand, ctas } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pytron Digital — Digital Marketing, Web Development & AI Automation",
  description:
    "Pytron Digital is a growth and technology partner: SEO, Google Ads, websites, web apps and AI automation from one team, for businesses in the USA, UK, Canada, Australia, UAE and India.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Two core business areas */}
      <section className="relative z-10 -mt-10 pb-16 sm:-mt-12 sm:pb-20 lg:pb-24" aria-label="Core business areas">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <MarketingPanel />
          <SolutionsPanel />
        </div>
      </section>

      {/* Services */}
      <section className="section bg-surface" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeader id="services-title" label={servicesSection.label} title={servicesSection.h2} copy={servicesSection.copy} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicesSection.cards.map((c) => (
              <ServiceCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </section>

      <Differentiator />

      {/* Products */}
      <section className="section bg-surface" aria-labelledby="products-title">
        <div className="container-x">
          <SectionHeader id="products-title" label={productsSection.label} title={productsSection.h2} copy={productsSection.copy} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
            <IdeaCard title={productsSection.idea.title} text={productsSection.idea.text} cta={ctas.start} />
          </div>

          {/* Products as proof of capability */}
          <div className="mt-10 flex flex-col gap-6 rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between" data-reveal>
            <div className="max-w-2xl">
              <p className="font-medium text-navy-900">{productsSection.proof}</p>
              <div className="mt-4">
                <CapabilityBadges items={productsSection.chips} />
              </div>
            </div>
            <ButtonLink href={ctas.products.href} className="w-full shrink-0 lg:w-auto">
              {ctas.products.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <ProcessSection />

      <WhyPytron />

      {/* Trust — no fake stats */}
      <section className="section" aria-labelledby="trust-title">
        <div className="container-x">
          <SectionHeader id="trust-title" title={trustSection.h2} copy={trustSection.copy} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustSection.badges.map((b) => (
              <article key={b.title} className="card h-full text-center" data-reveal>
                <span className="icon-tile mx-auto">
                  <Icon name={b.icon} />
                </span>
                <h3 className="h-card mt-4">{b.title}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{b.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted">{trustSection.founderLine}</p>
          <p className="mt-1 text-center text-sm font-semibold text-navy-900">{brand.proof}</p>
        </div>
      </section>

      {/* Selected work */}
      <section className="section bg-surface" aria-labelledby="work-title">
        <div className="container-x">
          <SectionHeader id="work-title" label={workSection.label} title={workSection.h2} />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {caseStudies.map((c) => (
              <CaseStudyCard key={c.project} study={c} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href={ctas.work.href} variant="secondary">
              {ctas.work.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <TestimonialsOrPartnership />

      <GlobalStrip />

      <CTASection />
    </>
  );
}
