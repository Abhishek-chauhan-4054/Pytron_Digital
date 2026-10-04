import type { Metadata } from "next";
import { BlogCard, CategoryNav } from "@/components/BlogCard";
import { PageHero } from "@/components/PageTemplates";
import { CTASection } from "@/components/Sections";
import { JsonLd } from "@/components/ui";
import { blogPage, posts } from "@/content/blog";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ ...blogPage.meta, path: "/blog/" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog/" },
];

export default function BlogIndex() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Blog" title={blogPage.h1} intro={blogPage.intro}>
        <CategoryNav />
      </PageHero>
      <section className="section" aria-labelledby="posts-title">
        <div className="container-x">
          <h2 id="posts-title" className="sr-only">
            Latest articles
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
