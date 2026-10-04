import type { Metadata } from "next";
import { IndustryCard } from "@/components/Cards";
import { PageHero } from "@/components/PageTemplates";
import { CTASection } from "@/components/Sections";
import { JsonLd } from "@/components/ui";
import { industries, industriesPage } from "@/content/industries";
import { ctas } from "@/content/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ ...industriesPage.meta, path: "/industries/" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Industries", path: "/industries/" },
];

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Industries" title={industriesPage.h1} intro={industriesPage.intro} cta={ctas.start} />
      <section className="section">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <IndustryCard key={i.slug} name={i.name} summary={i.summary} href={`/industries/${i.slug}/`} icon={i.icon} />
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
