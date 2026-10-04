import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView } from "@/components/PageTemplates";
import { marketingPages } from "@/content/marketing";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return marketingPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = marketingPages.find((p) => p.slug === slug);
  if (!page) return {};
  return buildMetadata({ ...page.meta, path: `/digital-marketing/${slug}/` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = marketingPages.find((p) => p.slug === slug);
  if (!page) notFound();
  return <ServicePageView page={page} pillar="marketing" />;
}
