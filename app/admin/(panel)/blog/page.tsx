import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { formatDay, pageNumber, PER_PAGE, searchTerm } from "@/lib/admin/format";
import { listHref, PageHeader, Pagination, SearchFilters } from "@/components/admin/ui/Layout";
import { Alert, Badge, EmptyState, StatusBadge } from "@/components/admin/ui/Feedback";
import { LinkButton } from "@/components/admin/ui/Button";
import { RowActions } from "@/components/admin/RowActions";
import type { BlogCategoryRow, ContentStatus } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Blog" };

type SP = { q?: string; status?: string; category?: string; tag?: string; page?: string };
type Row = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  published_at: string | null;
  updated_at: string;
  author_name: string;
  category: { name: string } | null;
  blog_post_tags: { tag: { name: string; slug: string } | null }[];
};

export default async function BlogList({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = await requirePageRole("EDITOR");
  const page = pageNumber(sp.page);
  const term = searchTerm(sp.q);
  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(sp.status ?? "") ? (sp.status as ContentStatus) : undefined;

  const [{ data: cats }, { data: tags }] = await Promise.all([
    s.supabase.from("blog_categories").select("id,name,slug").order("sort_order"),
    s.supabase.from("blog_tags").select("id,name,slug").order("name").limit(300),
  ]);
  const categories = (cats ?? []) as Pick<BlogCategoryRow, "id" | "name" | "slug">[];
  const tagList = (tags ?? []) as { id: string; name: string; slug: string }[];
  const category = categories.find((c) => c.slug === sp.category);
  const tag = tagList.find((t) => t.slug === sp.tag);

  let q = s.supabase
    .from("blogs")
    .select(`id,title,slug,status,published_at,updated_at,author_name,category:blog_categories(name),blog_post_tags${tag ? "!inner" : ""}(tag_id,tag:blog_tags(name,slug))`, { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("updated_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  if (term) q = q.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`);
  if (status) q = q.eq("status", status);
  if (category) q = q.eq("category_id", category.id);
  if (tag) q = q.eq("blog_post_tags.tag_id", tag.id);
  const { data, count, error } = await q;
  const rows = (data ?? []) as unknown as Row[];
  const canPublish = roleAtLeast(s.profile.role, "ADMIN");
  const filtered = Boolean(term || status || category || tag);

  return (
    <>
      <PageHeader
        title="Blog"
        description="Articles published at /blog/."
        actions={
          <LinkButton href="/admin/blog/new/" variant="primary" icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
            New post
          </LinkButton>
        }
      />
      <SearchFilters q={sp.q} placeholder="Search title or excerpt" resetHref="/admin/blog/">
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select id="status" name="status" defaultValue={status ?? ""} className="adm-input sm:w-36">
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <label htmlFor="category" className="sr-only">
          Category
        </label>
        <select id="category" name="category" defaultValue={category?.slug ?? ""} className="adm-input sm:w-44">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {tagList.length > 0 && (
          <>
            <label htmlFor="tag" className="sr-only">
              Tag
            </label>
            <select id="tag" name="tag" defaultValue={tag?.slug ?? ""} className="adm-input sm:w-36">
              <option value="">All tags</option>
              {tagList.map((t) => (
                <option key={t.id} value={t.slug}>
                  #{t.name}
                </option>
              ))}
            </select>
          </>
        )}
      </SearchFilters>

      {error ? (
        <Alert tone="error" title="Could not load posts">
          Please refresh the page.
        </Alert>
      ) : rows.length === 0 ? (
        <div className="adm-card">
          <EmptyState title={filtered ? "No posts match your filters" : "No posts yet"} action={<LinkButton href="/admin/blog/new/" variant="primary">Write a post</LinkButton>} />
        </div>
      ) : (
        <div className="adm-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.02]">
              <tr>
                <th scope="col" className="adm-th">Title</th>
                <th scope="col" className="adm-th hidden md:table-cell">Status</th>
                <th scope="col" className="adm-th hidden lg:table-cell">Category</th>
                <th scope="col" className="adm-th hidden sm:table-cell">Published</th>
                <th scope="col" className="adm-th"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                  <td className="adm-td">
                    <Link href={`/admin/blog/${r.id}/`} className="font-medium text-slate-900 hover:text-brand-700 dark:text-white dark:hover:text-brand-200">
                      {r.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="md:hidden">
                        <StatusBadge status={r.status} />
                      </span>
                      <span className="adm-muted text-xs">{r.author_name}</span>
                      {r.blog_post_tags.slice(0, 3).map((t) => t.tag && <Badge key={t.tag.slug}>#{t.tag.name}</Badge>)}
                    </div>
                  </td>
                  <td className="adm-td hidden md:table-cell">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="adm-td adm-muted hidden text-sm lg:table-cell">{r.category?.name ?? "—"}</td>
                  <td className="adm-td adm-muted hidden text-xs whitespace-nowrap sm:table-cell">{formatDay(r.published_at)}</td>
                  <td className="adm-td">
                    <RowActions kind="blog" id={r.id} title={r.title} status={r.status} canPublish={canPublish} canDelete={canPublish} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} perPage={PER_PAGE} total={count ?? 0} makeHref={(p) => listHref("/admin/blog/", { q: sp.q, status, category: category?.slug, tag: tag?.slug, page: p })} />
    </>
  );
}
