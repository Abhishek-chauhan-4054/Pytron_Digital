import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import { BlogCard, formatDate } from "@/components/BlogCard";
import { ICON_STROKE } from "@/components/Icon";
import { Breadcrumbs } from "@/components/Sections";
import { ButtonLink, JsonLd } from "@/components/ui";
import { categorySlug, getPost, posts, readingMinutes } from "@/content/blog";
import { ctas } from "@/content/site";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: `${post.title} | Pytron Digital`,
    description: post.description,
    path: `/blog/${slug}/`,
    type: "article",
    publishedTime: post.date,
  });
}

const ctaCopy = {
  marketing: "Want a marketing plan tied to real business goals? Tell us where you are and we'll show you the fastest path to more customers.",
  web: "Need a website that turns visitors into inquiries? We design, build and market it — one team.",
  ai: "Spending hours on repetitive work? We'll help you find what to automate first and build it properly.",
} as const;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const path = `/blog/${slug}/`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
    { name: post.title, path },
  ];
  const related = [
    ...posts.filter((p) => p.slug !== slug && p.category === post.category),
    ...posts.filter((p) => p.slug !== slug && p.category !== post.category),
  ].slice(0, 3);
  const ctaKey = post.cta === "marketing" || post.cta === "web" || post.cta === "ai" ? post.cta : "marketing";
  const cta = ctas[ctaKey];

  return (
    <>
      <JsonLd data={[articleSchema(post), breadcrumbSchema(crumbs)]} />
      <article>
        <header className="on-dark hero-dark relative overflow-hidden">
          <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
          <div className="container-x relative pt-8 pb-14 sm:pb-16">
            <Breadcrumbs items={crumbs} dark />
            <div className="mt-10 max-w-3xl">
              <Link
                href={`/blog/category/${categorySlug(post.category)}/`}
                className="inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-electric-300 ring-1 ring-white/15 hover:bg-white/15"
              >
                {post.category}
              </Link>
              <h1 className="mt-4 text-[2rem] leading-[1.12] font-semibold tracking-[-0.03em] text-white sm:text-[2.75rem]">{post.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">{post.description}</p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-1.5">
                  <UserRound className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  {post.author}
                </li>
                <li className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </li>
                <li className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  {readingMinutes(post)} min read
                </li>
              </ul>
            </div>
          </div>
        </header>

        <div className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:order-none">
            <nav aria-labelledby="toc-title" className="rounded-[var(--radius-card)] border border-line bg-surface p-5 lg:sticky lg:top-24">
              <h2 id="toc-title" className="text-sm font-semibold text-navy-900">
                On this page
              </h2>
              <ol className="mt-3 space-y-2 text-sm">
                {post.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-muted hover:text-brand-700">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="max-w-[720px] min-w-0">
            <p className="text-lg leading-[1.8] text-navy-800">{post.intro}</p>
            {post.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id} className="mt-10">
                <h2 id={s.id} className="text-2xl font-semibold tracking-[-0.02em]">
                  {s.heading}
                </h2>
                {s.paragraphs.map((p) => (
                  <p key={p} className="mt-4 text-[1.05rem] leading-[1.8] text-muted">
                    {p}
                  </p>
                ))}
                {s.list &&
                  (s.ordered ? (
                    <ol className="mt-4 list-decimal space-y-2 pl-6 text-[1.05rem] leading-[1.7] text-muted marker:font-semibold marker:text-brand-700">
                      {s.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-[1.05rem] leading-[1.7] text-muted marker:text-brand-600">
                      {s.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  ))}
              </section>
            ))}

            {/* CTA block */}
            <aside className="mt-14 rounded-[var(--radius-card)] border border-brand-100 bg-brand-50/60 p-6 sm:p-8" aria-label="Work with Pytron Digital">
              <p className="text-lg font-semibold text-navy-900">{ctaCopy[ctaKey]}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={cta.href} className="w-full sm:w-auto">
                  {cta.label}
                </ButtonLink>
                <ButtonLink href={ctas.consult.href} variant="secondary" className="w-full sm:w-auto">
                  {ctas.consult.label}
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <section className="section border-t border-line bg-surface" aria-labelledby="related-title">
        <div className="container-x">
          <h2 id="related-title" className="h-section">
            Related articles
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
