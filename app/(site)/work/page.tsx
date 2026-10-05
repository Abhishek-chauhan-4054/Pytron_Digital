import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/Cards";
import { PageHero } from "@/components/PageTemplates";
import { CTASection, TestimonialsOrPartnership } from "@/components/Sections";
import { JsonLd } from "@/components/ui";
import { brand, ctas } from "@/content/site";
import { caseStudies, workPage } from "@/content/work";
import { breadcrumbSchema } from "@/lib/schema";
import { getSystemHero } from "@/lib/cms/public/pages";
import { systemMetadata } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("work", { ...workPage.meta, path: "/work/" });
}

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Our Work", path: "/work/" },
];

export default async function WorkPage() {
  const hero = await getSystemHero("work", { title: workPage.h1, intro: workPage.intro, cta: ctas.start });
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Our Work" title={hero.title} intro={hero.intro} cta={hero.cta}>
        <p className="mt-6 text-sm font-semibold text-white">{brand.proof}</p>
      </PageHero>
      <section className="section" aria-labelledby="projects-title">
        <div className="container-x">
          <h2 id="projects-title" className="sr-only">
            Projects
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {caseStudies.map((c) => (
              <CaseStudyCard key={c.project} study={c} />
            ))}
          </div>
        </div>
      </section>
      <TestimonialsOrPartnership />
      <CTASection />
    </>
  );
}
