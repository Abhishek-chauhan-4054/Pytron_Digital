import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard, CategoryNav } from "@/components/BlogCard";
import { PageHero } from "@/components/PageTemplates";
import { CTASection } from "@/components/Sections";
import { JsonLd } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { listActiveCategories, listPostsByTag } from "@/lib/cms/public/blog";
import { cmsMetadata } from "@/lib/cms/seo";

// Tag pages exist only for CMS tags with published posts; rendered on demand and cached.
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const res = await listPostsByTag(tag);
  if (!res.tag || !res.posts.length) return {};
  return cmsMetadata({
    title: `Articles tagged “${res.tag.name}” | Pytron Digital Blog`,
    description: `Pytron Digital articles about ${res.tag.name}.`,
    path: `/blog/tag/${tag}/`,
    // Thin archive pages: let search engines follow links but not index them
    robotsIndex: false,
  });
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const [{ tag: t, posts }, categories] = await Promise.all([listPostsByTag(tag), listActiveCategories()]);
  if (!t || !posts.length) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
    { name: `#${t.name}`, path: `/blog/tag/${tag}/` },
  ];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Blog" title={`Articles tagged “${t.name}”`} intro={`Everything we've written about ${t.name}.`}>
        <CategoryNav categories={categories} />
      </PageHero>
      <section className="section" aria-labelledby="posts-title">
        <div className="container-x">
          <h2 id="posts-title" className="sr-only">
            Articles
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
