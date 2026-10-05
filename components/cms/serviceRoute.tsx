import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CmsServiceView, ServicePageView } from "@/components/PageTemplates";
import { PILLARS, type Pillar } from "@/lib/cms/types";
import { builtInServices, getService, listServices } from "@/lib/cms/public/services";
import { findRedirect } from "@/lib/cms/public/site";
import { cmsMetadata } from "@/lib/cms/seo";

const base = (pillar: Pillar) => PILLARS.find((p) => p.key === pillar)!.path;

/** Pre-render every published service; new CMS services render on first request (ISR). */
export async function serviceStaticParams(pillar: Pillar) {
  const slugs = new Set([...(await listServices(pillar)).map((s) => s.slug)]);
  if (!slugs.size) builtInServices[pillar].forEach((s) => slugs.add(s.slug));
  return [...slugs].map((slug) => ({ slug }));
}

export async function serviceMetadata(pillar: Pillar, slug: string): Promise<Metadata> {
  const { service } = await getService(pillar, slug);
  if (!service) return {};
  return cmsMetadata({ ...service.page.meta, path: `${base(pillar)}${slug}/` }, { ogImage: service.ogImage || undefined });
}

export async function ServiceRoute({ pillar, slug }: { pillar: Pillar; slug: string }) {
  const { service } = await getService(pillar, slug);
  if (!service) {
    const r = await findRedirect(`${base(pillar)}${slug}/`);
    if (r) permanentRedirect(r.to);
    notFound();
  }
  if (!service.builtIn) {
    return <CmsServiceView page={service.page} pillar={pillar} description={service.fullDescription} image={service.image} heroCta={service.cta} />;
  }
  return <ServicePageView page={service.page} pillar={pillar} overview={service.fullDescription} heroCta={service.cta} />;
}
