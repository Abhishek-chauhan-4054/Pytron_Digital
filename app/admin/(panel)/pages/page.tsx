import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { formatDateTime, pageNumber, PER_PAGE, searchTerm, timeAgo } from "@/lib/admin/format";
import { listHref, PageHeader, Pagination, SearchFilters } from "@/components/admin/ui/Layout";
import { Alert, Badge, EmptyState, StatusBadge } from "@/components/admin/ui/Feedback";
import { LinkButton } from "@/components/admin/ui/Button";
import { RowActions } from "@/components/admin/RowActions";
import { SYSTEM_PAGE_PATHS, type SystemPageKey } from "@/lib/cms/public/pages";
import type { ContentStatus, PageRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Pages" };

type SP = { q?: string; status?: string; type?: string; page?: string };

export default async function PagesList({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = await requirePageRole("EDITOR");
  const page = pageNumber(sp.page);
  const term = searchTerm(sp.q);
  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(sp.status ?? "") ? (sp.status as ContentStatus) : undefined;

  let q = s.supabase
    .from("pages")
    .select("id,title,slug,system_key,status,updated_at", { count: "exact" })
    .order("system_key", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  if (term) q = q.or(`title.ilike.%${term}%,slug.ilike.%${term}%`);
  if (status) q = q.eq("status", status);
  if (sp.type === "built-in") q = q.not("system_key", "is", null);
  if (sp.type === "custom") q = q.is("system_key", null);
  const { data, count, error } = await q;
  const rows = (data ?? []) as Pick<PageRow, "id" | "title" | "slug" | "system_key" | "status" | "updated_at">[];
  const canPublish = roleAtLeast(s.profile.role, "ADMIN");

  return (
    <>
      <PageHeader
        title="Pages"
        description="Built-in pages (hero copy and SEO) and new pages built from content blocks."
        actions={
          <LinkButton href="/admin/pages/new/" variant="primary" icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
            New page
          </LinkButton>
        }
      />
      <SearchFilters q={sp.q} placeholder="Search pages by title or slug" resetHref="/admin/pages/">
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select id="status" name="status" defaultValue={status ?? ""} className="adm-input sm:w-40">
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <label htmlFor="type" className="sr-only">
          Type
        </label>
        <select id="type" name="type" defaultValue={sp.type ?? ""} className="adm-input sm:w-40">
          <option value="">All pages</option>
          <option value="built-in">Built-in</option>
          <option value="custom">Custom</option>
        </select>
      </SearchFilters>

      {error ? (
        <Alert tone="error" title="Could not load pages">
          Please refresh. If this continues, check the Supabase connection.
        </Alert>
      ) : rows.length === 0 ? (
        <div className="adm-card">
          <EmptyState
            title={term || status || sp.type ? "No pages match your filters" : "No pages yet"}
            text={term || status ? "Try a different search or reset the filters." : "Create a page and build it from content blocks."}
            action={<LinkButton href="/admin/pages/new/" variant="primary">New page</LinkButton>}
          />
        </div>
      ) : (
        <div className="adm-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.02]">
              <tr>
                <th scope="col" className="adm-th">Title</th>
                <th scope="col" className="adm-th hidden md:table-cell">Status</th>
                <th scope="col" className="adm-th hidden lg:table-cell">URL</th>
                <th scope="col" className="adm-th hidden sm:table-cell">Updated</th>
                <th scope="col" className="adm-th text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {rows.map((r) => {
                const url = r.system_key ? SYSTEM_PAGE_PATHS[r.system_key as SystemPageKey] : `/${r.slug}/`;
                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                    <td className="adm-td">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/pages/${r.id}/`} className="font-medium text-slate-900 hover:text-brand-700 dark:text-white dark:hover:text-brand-200">
                          {r.title}
                        </Link>
                        {r.system_key && <Badge tone="violet">Built-in</Badge>}
                        <span className="md:hidden">
                          <StatusBadge status={r.status} />
                        </span>
                      </div>
                      <p className="adm-muted mt-0.5 text-xs lg:hidden">{url}</p>
                    </td>
                    <td className="adm-td hidden md:table-cell">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="adm-td adm-muted hidden font-mono text-xs lg:table-cell">{url}</td>
                    <td className="adm-td adm-muted hidden text-xs whitespace-nowrap sm:table-cell" title={formatDateTime(r.updated_at)}>
                      {timeAgo(r.updated_at)}
                    </td>
                    <td className="adm-td">
                      <RowActions kind="page" id={r.id} title={r.title} status={r.status} canPublish={canPublish} canDelete={canPublish && !r.system_key} canDuplicate={!r.system_key} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} perPage={PER_PAGE} total={count ?? 0} makeHref={(p) => listHref("/admin/pages/", { q: sp.q, status, type: sp.type, page: p })} />
    </>
  );
}
