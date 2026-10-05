import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Images, LayoutGrid, Newspaper, Plus } from "lucide-react";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { formatDateTime, timeAgo } from "@/lib/admin/format";
import { Card, PageHeader } from "@/components/admin/ui/Layout";
import { Alert, EmptyState, StatusBadge } from "@/components/admin/ui/Feedback";
import { LinkButton } from "@/components/admin/ui/Button";
import { describeAudit } from "@/lib/admin/audit";
import type { AuditLogRow, ContentStatus } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Dashboard" };

type Recent = { kind: "Page" | "Post" | "Service"; title: string; status: ContentStatus; updated_at: string; href: string };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { denied } = await searchParams;
  const s = await requirePageRole("EDITOR");
  const sb = s.supabase;
  const count = (table: string, status?: ContentStatus) => {
    let q = sb.from(table).select("id", { count: "exact", head: true });
    if (status) q = q.eq("status", status);
    return q.then((r) => r.count ?? 0);
  };

  const canSeeAudit = roleAtLeast(s.profile.role, "ADMIN");
  const [pagesTotal, pagesPublished, pagesDraft, services, blogs, blogsPublished, media, recentPages, recentBlogs, recentServices, activity] = await Promise.all([
    count("pages"),
    count("pages", "PUBLISHED"),
    count("pages", "DRAFT"),
    count("services"),
    count("blogs"),
    count("blogs", "PUBLISHED"),
    count("media"),
    sb.from("pages").select("id,title,status,updated_at").order("updated_at", { ascending: false }).limit(5),
    sb.from("blogs").select("id,title,status,updated_at").order("updated_at", { ascending: false }).limit(5),
    sb.from("services").select("id,name,status,updated_at").order("updated_at", { ascending: false }).limit(5),
    canSeeAudit ? sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(8) : Promise.resolve({ data: [] as AuditLogRow[] }),
  ]);

  const recent: Recent[] = [
    ...((recentPages.data ?? []) as { id: string; title: string; status: ContentStatus; updated_at: string }[]).map((r) => ({ kind: "Page" as const, title: r.title, status: r.status, updated_at: r.updated_at, href: `/admin/pages/${r.id}/` })),
    ...((recentBlogs.data ?? []) as { id: string; title: string; status: ContentStatus; updated_at: string }[]).map((r) => ({ kind: "Post" as const, title: r.title, status: r.status, updated_at: r.updated_at, href: `/admin/blog/${r.id}/` })),
    ...((recentServices.data ?? []) as { id: string; name: string; status: ContentStatus; updated_at: string }[]).map((r) => ({ kind: "Service" as const, title: r.name, status: r.status, updated_at: r.updated_at, href: `/admin/services/${r.id}/` })),
  ]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 8);

  const stats = [
    { label: "Total pages", value: pagesTotal, sub: `${pagesPublished} published · ${pagesDraft} draft`, icon: FileText, href: "/admin/pages/" },
    { label: "Services", value: services, sub: "Across all three service areas", icon: LayoutGrid, href: "/admin/services/" },
    { label: "Blog posts", value: blogs, sub: `${blogsPublished} published`, icon: Newspaper, href: "/admin/blog/" },
    { label: "Media files", value: media, sub: "In Supabase Storage", icon: Images, href: "/admin/media/" },
  ];
  const activityRows = (activity.data ?? []) as AuditLogRow[];

  return (
    <>
      <PageHeader
        title={`Welcome${s.profile.full_name ? `, ${s.profile.full_name.split(" ")[0]}` : ""}`}
        description="An overview of your website content."
        actions={
          <>
            <LinkButton href="/admin/blog/new/" variant="primary" icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
              New post
            </LinkButton>
            <LinkButton href="/admin/pages/new/" icon={<Plus className="h-4 w-4" aria-hidden="true" />}>
              New page
            </LinkButton>
          </>
        }
      />
      {denied && (
        <div className="mb-6">
          <Alert tone="warning">That area needs a higher role than yours.</Alert>
        </div>
      )}

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((st) => (
          <Link key={st.label} href={st.href} className="adm-card group p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <dt className="adm-muted text-sm font-medium">{st.label}</dt>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">
                <st.icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
            </div>
            <dd className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 tabular-nums dark:text-white">{st.value}</dd>
            <p className="adm-muted mt-1 text-xs">{st.sub}</p>
          </Link>
        ))}
      </dl>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card title="Recent updates" description="Latest edited pages, posts and services" padded={false}>
          {recent.length ? (
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {recent.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                    <span className="w-16 shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">{r.kind}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 dark:text-white">{r.title}</span>
                    <StatusBadge status={r.status} />
                    <time className="adm-muted hidden w-24 shrink-0 text-right text-xs sm:block" dateTime={r.updated_at} title={formatDateTime(r.updated_at)}>
                      {timeAgo(r.updated_at)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No content yet" text="Create your first page or blog post to see it here." />
          )}
        </Card>

        <Card title="Recent admin activity" description={canSeeAudit ? "From the audit log" : "Visible to Admins"} padded={false}>
          {!canSeeAudit ? (
            <p className="adm-muted px-5 py-6 text-sm">Your role doesn&apos;t include the audit log.</p>
          ) : activityRows.length ? (
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {activityRows.map((a) => (
                <li key={a.id} className="px-5 py-3 text-sm">
                  <p className="text-slate-800 dark:text-slate-100">{describeAudit(a)}</p>
                  <p className="adm-muted mt-0.5 text-xs">
                    {a.user_email || "system"} · <time dateTime={a.created_at}>{timeAgo(a.created_at)}</time>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No activity yet" text="Logins and content changes will appear here." />
          )}
          {canSeeAudit && activityRows.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-3 text-right dark:border-white/10">
              <Link href="/admin/audit-logs/" className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">
                View all activity →
              </Link>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
