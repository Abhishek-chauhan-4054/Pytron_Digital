import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard, CategoryNav } from "@/components/BlogCard";
import { PageHero } from "@/components/PageTemplates";
import { CTASection } from "@/components/Sections";
import { JsonLd } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { listActiveCategories, listPostsByCategory } from "@/lib/cms/public/blog";
import { cmsMetadata } from "@/lib/cms/seo";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await listActiveCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = (await listActiveCategories()).find((c) => c.slug === category);
  if (!cat) return {};
  return cmsMetadata({
    title: `${cat.name} Articles | Pytron Digital Blog`,
    description: `Practical ${cat.name} articles from Pytron Digital for growing businesses — clear advice, no hype.`,
    path: `/blog/category/${category}/`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categories = await listActiveCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();
  const list = await listPostsByCategory(category);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
    { name: cat.name, path: `/blog/category/${category}/` },
  ];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Blog" title={`${cat.name} Articles`} intro={`Practical ${cat.name} advice for business owners and teams.`}>
        <CategoryNav categories={categories} active={category} />
      </PageHero>
      <section className="section" aria-labelledby="posts-title">
        <div className="container-x">
          <h2 id="posts-title" className="sr-only">
            Articles
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
