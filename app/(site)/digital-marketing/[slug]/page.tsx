import type { Metadata } from "next";
import { ServiceRoute, serviceMetadata, serviceStaticParams } from "@/components/cms/serviceRoute";

// Services added in the CMS after deployment are rendered on demand, then cached.
export const dynamicParams = true;

export function generateStaticParams() {
  return serviceStaticParams("marketing");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return serviceMetadata("marketing", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceRoute pillar="marketing" slug={slug} />;
}
