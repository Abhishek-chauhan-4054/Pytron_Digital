import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlockRenderer } from "@/components/cms/BlockRenderer";
import { RichText } from "@/components/cms/RichText";
import { PageHero } from "@/components/PageTemplates";
import { JsonLd } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { getCmsPage, listCmsPages } from "@/lib/cms/public/pages";
import { findRedirect, getSettings } from "@/lib/cms/public/site";
import { cmsMetadata } from "@/lib/cms/seo";
import { isEmptyDoc } from "@/lib/rich-text/text";

/**
 * Pages created in the CMS, served at /<slug>/. Built-in routes (about, blog, …) always
 * take precedence because they are static segments; the database also rejects those slugs.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await listCmsPages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await getCmsPage(slug);
  if (!page) return {};
  return cmsMetadata(
    {
      title: page.seo_title || `${page.title} | Pytron Digital`,
      description: page.seo_description || page.hero_description || page.title,
      path: `/${slug}/`,
    },
    {
      ogImage: page.og_image_url || page.featured_image_url || undefined,
      canonical: page.canonical_url || undefined,
      robotsIndex: page.robots_index,
      robotsFollow: page.robots_follow,
    },
  );
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ page }, settings] = await Promise.all([getCmsPage(slug), getSettings()]);
  if (!page) {
    const r = await findRedirect(`/${slug}/`);
    if (r) permanentRedirect(r.to);
    notFound();
  }
  const crumbs = [
    { name: "Home", path: "/" },
    { name: page.title, path: `/${slug}/` },
  ];
  const cta = page.hero_cta_label && page.hero_cta_url ? { label: page.hero_cta_label, href: page.hero_cta_url } : undefined;
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero
        crumbs={crumbs}
        title={page.hero_heading || page.title}
        intro={page.hero_description || undefined}
        cta={cta}
        aside={
          page.hero_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.hero_image_url} alt="" className="w-full rounded-2xl border border-white/10" />
          ) : undefined
        }
      />
      {page.featured_image_url && (
        <div className="container-x pt-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.featured_image_url} alt="" loading="lazy" className="w-full rounded-[var(--radius-card)] border border-line" />
        </div>
      )}
      {!isEmptyDoc(page.content) && (
        <section className="section">
          <div className="container-x max-w-3xl">
            <RichText doc={page.content} variant="page" />
          </div>
        </section>
      )}
      <BlockRenderer sections={page.sections} settings={settings} />
    </>
  );
}
