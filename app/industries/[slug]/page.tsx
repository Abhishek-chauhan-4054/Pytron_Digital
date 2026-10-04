import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { IndustryCard } from "@/components/Cards";
import { ICON_STROKE } from "@/components/Icon";
import { PageHero, TitledGrid, WorkflowExamples } from "@/components/PageTemplates";
import { CTASection, FAQ } from "@/components/Sections";
import { JsonLd, SectionHeader } from "@/components/ui";
import { industries } from "@/content/industries";
import { ctas } from "@/content/site";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return {};
  return buildMetadata({ ...ind.meta, path: `/industries/${slug}/` });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();
  const path = `/industries/${slug}/`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
    { name: ind.name, path },
  ];
  const others = industries.filter((i) => i.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({ name: `Digital marketing and technology for ${ind.name}`, description: ind.meta.description, path }),
          breadcrumbSchema(crumbs),
          faqSchema(ind.faqs),
        ]}
      />
      <PageHero crumbs={crumbs} eyebrow={ind.name} title={ind.h1} intro={ind.intro} cta={ctas.start} secondary={ctas.work} />

      <section className="section" aria-labelledby="problems-title">
        <div className="container-x">
          <SectionHeader id="problems-title" label="Common Challenges" title={`Challenges we solve in ${ind.name}`} />
          <div className="mt-12">
            <TitledGrid items={ind.problems} cols={ind.problems.length === 3 ? 3 : 4} />
          </div>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeader id="services-title" label="Relevant Services" title="How we help" />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {ind.services.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="card card-hover group flex h-full items-start justify-between gap-4">
                  <span>
                    <span className="block text-lg font-semibold text-navy-900">{s.label}</span>
                    <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-muted">{s.why}</span>
                  </span>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-brand-700 transition-transform group-hover:translate-x-1" strokeWidth={ICON_STROKE} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WorkflowExamples items={ind.workflows} heading={`Example workflows: ${ind.name}`} tone="white" />

      <FAQ items={ind.faqs} title={`${ind.name} FAQs`} tone="surface" />

      <section className="section" aria-labelledby="more-ind-title">
        <div className="container-x">
          <h2 id="more-ind-title" className="text-xl font-semibold">Other industries we help</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((i) => (
              <IndustryCard key={i.slug} name={i.name} summary={i.summary} href={`/industries/${i.slug}/`} icon={i.icon} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
