import type { Metadata } from "next";
import { ServiceCard, IndustryCard } from "@/components/Cards";
import { PageHero } from "@/components/PageTemplates";
import { CTASection, Differentiator } from "@/components/Sections";
import { ArrowLink, JsonLd, SectionHeader } from "@/components/ui";
import { aiHub } from "@/content/ai";
import { developmentHub } from "@/content/development";
import { industries } from "@/content/industries";
import { marketingHub } from "@/content/marketing";
import { listServices } from "@/lib/cms/public/services";
import { servicesOverview } from "@/content/pages";
import { ctas } from "@/content/site";
import { breadcrumbSchema } from "@/lib/schema";
import { getSystemHero } from "@/lib/cms/public/pages";
import { systemMetadata } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("services", { ...servicesOverview.meta, path: "/services/" });
}

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services/" },
];

export default async function ServicesPage() {
  const services = await listServices();
  const marketingPages = services.filter((s) => s.pillar === "marketing");
  const developmentPages = services.filter((s) => s.pillar === "web");
  const aiPages = services.filter((s) => s.pillar === "ai");
  const hero = await getSystemHero("services", { title: servicesOverview.h1, intro: servicesOverview.intro, cta: ctas.start });
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Our Services" title={hero.title} intro={hero.intro} cta={hero.cta} secondary={ctas.work} />

      <section id="marketing" className="section" aria-labelledby="mk-title">
        <div className="container-x">
          <SectionHeader id="mk-title" label="Digital Marketing" title="Turn Attention Into Customers." copy={marketingHub.intro} align="left" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {marketingPages.map((p) => (
              <ServiceCard key={p.slug} title={p.label} text={p.summary} href={`/digital-marketing/${p.slug}/`} icon={p.icon} />
            ))}
            <ServiceCard title="Growth Strategy" text="Tie every marketing rupee and dollar to a business goal." href="/digital-marketing/#growth-strategy" icon="compass" />
          </div>
          <ArrowLink href="/digital-marketing/" className="mt-8">
            Explore Digital Marketing
          </ArrowLink>
        </div>
      </section>

      <section id="solutions" className="section bg-surface" aria-labelledby="sol-title">
        <div className="container-x">
          <SectionHeader id="sol-title" label="Digital Solutions" title="Got a Business Problem? We'll Build the Solution." copy="Websites, web apps, AI tools and automations designed around how your business actually runs — not a template." align="left" />

          <h3 id="web" className="mt-12 text-xl font-semibold">Web Development</h3>
          <p className="mt-2 max-w-2xl text-muted">{developmentHub.intro}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {developmentPages.map((p) => (
              <ServiceCard key={p.slug} title={p.label} text={p.summary} href={`/web-development/${p.slug}/`} icon={p.icon} />
            ))}
          </div>

          <h3 id="ai" className="mt-14 text-xl font-semibold">AI &amp; Automation</h3>
          <p className="mt-2 max-w-2xl text-muted">{aiHub.intro}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aiPages.map((p) => (
              <ServiceCard key={p.slug} title={p.label} text={p.summary} href={`/ai-solutions/${p.slug}/`} icon={p.icon} />
            ))}
          </div>
        </div>
      </section>

      <Differentiator />

      <section className="section" aria-labelledby="ind-title">
        <div className="container-x">
          <SectionHeader id="ind-title" label="Industries" title="Industries we help" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => (
              <IndustryCard key={i.slug} name={i.name} summary={i.summary} href={`/industries/${i.slug}/`} icon={i.icon} />
            ))}
          </div>
        </div>
      </section>

      <CTASection secondary={{ label: "See Our Work", href: "/work/" }} />
    </>
  );
}
