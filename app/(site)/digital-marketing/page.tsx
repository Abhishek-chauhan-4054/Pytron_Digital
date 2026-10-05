import type { Metadata } from "next";
import { ServiceHubView } from "@/components/PageTemplates";
import { marketingHub } from "@/content/marketing";
import { ctas } from "@/content/site";
import { getSystemHero } from "@/lib/cms/public/pages";
import { listServices } from "@/lib/cms/public/services";
import { systemMetadata } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("digital-marketing", { ...marketingHub.meta, path: "/digital-marketing/" });
}

export default async function Page() {
  const [hero, pages] = await Promise.all([
    getSystemHero("digital-marketing", { title: marketingHub.h1, intro: marketingHub.intro, cta: ctas.marketing }),
    listServices("marketing"),
  ]);
  return <ServiceHubView hub={marketingHub} pages={pages} hero={hero} />;
}
