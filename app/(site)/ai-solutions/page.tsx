import type { Metadata } from "next";
import { ServiceHubView } from "@/components/PageTemplates";
import { aiHub } from "@/content/ai";
import { ctas } from "@/content/site";
import { getSystemHero } from "@/lib/cms/public/pages";
import { listServices } from "@/lib/cms/public/services";
import { systemMetadata } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("ai-solutions", { ...aiHub.meta, path: "/ai-solutions/" });
}

export default async function Page() {
  const [hero, pages] = await Promise.all([
    getSystemHero("ai-solutions", { title: aiHub.h1, intro: aiHub.intro, cta: ctas.ai }),
    listServices("ai"),
  ]);
  return <ServiceHubView hub={aiHub} pages={pages} hero={hero} />;
}
