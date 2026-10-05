import type { Metadata } from "next";
import { ServiceHubView } from "@/components/PageTemplates";
import { developmentHub } from "@/content/development";
import { ctas } from "@/content/site";
import { getSystemHero } from "@/lib/cms/public/pages";
import { listServices } from "@/lib/cms/public/services";
import { systemMetadata } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("web-development", { ...developmentHub.meta, path: "/web-development/" });
}

export default async function Page() {
  const [hero, pages] = await Promise.all([
    getSystemHero("web-development", { title: developmentHub.h1, intro: developmentHub.intro, cta: ctas.web }),
    listServices("web"),
  ]);
  return <ServiceHubView hub={developmentHub} pages={pages} hero={hero} />;
}
