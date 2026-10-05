import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { formatDateTime, searchTerm, timeAgo } from "@/lib/admin/format";
import { PageHeader, SearchFilters } from "@/components/admin/ui/Layout";
import { Alert, EmptyState, StatusBadge } from "@/components/admin/ui/Feedback";
import { LinkButton } from "@/components/admin/ui/Button";
import { RowActions } from "@/components/admin/RowActions";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { Icon, ICON_NAMES } from "@/components/Icon";
import type { IconName } from "@/content/types";
import { PILLARS, type ContentStatus, type Pillar, type ServiceRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Services" };

type SP = { q?: string; status?: string; pillar?: string };

export default async function ServicesList({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = await requirePageRole("EDITOR");
  const term = searchTerm(sp.q);
  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(sp.status ?? "") ? (sp.status as ContentStatus) : undefined;
  const pillar = PILLARS.some((p) => p.key === sp.pillar) ? (sp.pillar as Pillar) : undefined;

  // Services are a short, ordered list (grouped by area), so all matches are shown without paging.
  let q = s.supabase.from("services").select("id,pillar,name,slug,icon,status,sort_order,updated_at").order("sort_order").order("name").limit(500);
  if (term) q = q.or(`name.ilike.%${term}%,slug.ilike.%${term}%`);
  if (status) q = q.eq("status", status);
  if (pillar) q = q.eq("pillar", pillar);
  const { data, error } = await q;
  const rows = (data ?? []) as Pick<ServiceRow, "id" | "pillar" | "name" | "slug" | "icon" | "status" | "sort_order" | "updated_at">[];
  const canPublish = roleAtLeast(s.profile.role, "ADMIN");
  const filtered = Boolean(term || status);

  return (
    <>
      <PageHeader
        title="Services"
        description="Services shown on the hub pages, the services overview and each service page. Use the arrows to reorder."
        actions={
          <LinkButton href="/admin/services/new/" variant="primary" icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
            New service
          </LinkButton>
        }
      />
      <SearchFilters q={sp.q} placeholder="Search services" resetHref="/admin/services/">
        <label htmlFor="pillar" className="sr-only">
          Area
        </label>
        <select id="pillar" name="pillar" defaultValue={pillar ?? ""} className="adm-input sm:w-48">
          <option value="">All areas</option>
          {PILLARS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select id="status" name="status" defaultValue={status ?? ""} className="adm-input sm:w-40">
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </SearchFilters>

      {error ? (
        <Alert tone="error" title="Could not load services">
          Please refresh the page.
        </Alert>
      ) : rows.length === 0 ? (
        <div className="adm-card">
          <EmptyState title={filtered || pillar ? "No services match your filters" : "No services yet"} action={<LinkButton href="/admin/services/new/" variant="primary">New service</LinkButton>} />
        </div>
      ) : (
        <div className="space-y-6">
          {PILLARS.filter((p) => !pillar || p.key === pillar).map((p) => {
            const list = rows.filter((r) => r.pillar === p.key);
            if (!list.length) return null;
            return (
              <section key={p.key} className="adm-card overflow-hidden" aria-labelledby={`pillar-${p.key}`}>
                <h2 id={`pillar-${p.key}`} className="border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 text-sm font-semibold dark:border-white/10 dark:bg-white/[0.02]">
                  {p.label} <span className="adm-muted font-normal">· {list.length}</span>
                </h2>
                <table className="w-full">
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">Order</th>
                      <th scope="col">Service</th>
                      <th scope="col">Status</th>
                      <th scope="col">Updated</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {list.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                        <td className="adm-td w-20">
                          {canPublish && !filtered ? <ReorderButtons kind="service" id={r.id} first={i === 0} last={i === list.length - 1} label={r.name} /> : <span className="adm-muted text-xs">{i + 1}</span>}
                        </td>
                        <td className="adm-td">
                          <div className="flex items-center gap-3">
                            <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 sm:flex dark:bg-brand-400/10 dark:text-brand-200">
                              <Icon name={(ICON_NAMES as string[]).includes(r.icon) ? (r.icon as IconName) : "sparkles"} className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <Link href={`/admin/services/${r.id}/`} className="font-medium text-slate-900 hover:text-brand-700 dark:text-white dark:hover:text-brand-200">
                                {r.name}
                              </Link>
                              <p className="adm-muted truncate font-mono text-xs">
                                {p.path}
                                {r.slug}/
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="adm-td hidden sm:table-cell">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="adm-td adm-muted hidden text-xs whitespace-nowrap md:table-cell" title={formatDateTime(r.updated_at)}>
                          {timeAgo(r.updated_at)}
                        </td>
                        <td className="adm-td">
                          <RowActions kind="service" id={r.id} title={r.name} status={r.status} canPublish={canPublish} canDelete={canPublish} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
