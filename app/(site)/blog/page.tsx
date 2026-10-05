import type { Metadata } from "next";
import { BlogCard, CategoryNav } from "@/components/BlogCard";
import { PageHero } from "@/components/PageTemplates";
import { CTASection } from "@/components/Sections";
import { JsonLd } from "@/components/ui";
import { blogPage } from "@/content/blog";
import { breadcrumbSchema } from "@/lib/schema";
import { listActiveCategories, listPosts } from "@/lib/cms/public/blog";
import { getSystemHero } from "@/lib/cms/public/pages";
import { systemMetadata } from "@/lib/cms/seo";

export async function generateMetadata(): Promise<Metadata> {
  return systemMetadata("blog", { ...blogPage.meta, path: "/blog/" });
}

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog/" },
];

export default async function BlogIndex() {
  const [hero, posts, categories] = await Promise.all([
    getSystemHero("blog", { title: blogPage.h1, intro: blogPage.intro }),
    listPosts(),
    listActiveCategories(),
  ]);
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Blog" title={hero.title} intro={hero.intro}>
        <CategoryNav categories={categories} />
      </PageHero>
      <section className="section" aria-labelledby="posts-title">
        <div className="container-x">
          <h2 id="posts-title" className="sr-only">
            Latest articles
          </h2>
          {posts.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          ) : (
            <p className="lead text-center">New articles are on the way. Check back soon.</p>
          )}
        </div>
      </section>
      <CTASection />
    </>
  );
}
