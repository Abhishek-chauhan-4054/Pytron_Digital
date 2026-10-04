import Link from "next/link";
import type { BlogPost } from "@/content/types";
import { activeCategories, categorySlug, readingMinutes } from "@/content/blog";

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="card card-hover group relative flex h-full flex-col" data-reveal>
      <Link
        href={`/blog/category/${categorySlug(post.category)}/`}
        className="relative z-[1] self-start rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-800 hover:bg-brand-100"
      >
        {post.category}
      </Link>
      <h3 className="h-card mt-4">
        <Link href={`/blog/${post.slug}/`} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-muted">{post.description}</p>
      <p className="mt-5 text-xs text-subtle">
        <time dateTime={post.date}>{formatDate(post.date)}</time> · {readingMinutes(post)} min read
      </p>
    </article>
  );
}

export function CategoryNav({ active }: { active?: string }) {
  return (
    <nav aria-label="Blog categories" className="mt-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href="/blog/" aria-current={!active ? "page" : undefined} className="inline-flex min-h-9 items-center rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-sm font-medium text-white transition-colors hover:bg-white/10 aria-[current=page]:border-white aria-[current=page]:bg-white aria-[current=page]:text-navy-900">
            All
          </Link>
        </li>
        {activeCategories().map((c) => (
          <li key={c.slug}>
            <Link
              href={`/blog/category/${c.slug}/`}
              aria-current={active === c.slug ? "page" : undefined}
              className="inline-flex min-h-9 items-center rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-sm font-medium text-white transition-colors hover:bg-white/10 aria-[current=page]:border-white aria-[current=page]:bg-white aria-[current=page]:text-navy-900"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

