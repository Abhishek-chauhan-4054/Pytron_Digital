import type { Metadata } from "next";
import { requirePageRole } from "@/lib/admin/session";
import { formatDateTime, pageNumber, searchTerm } from "@/lib/admin/format";
import { listHref, PageHeader, Pagination, SearchFilters } from "@/components/admin/ui/Layout";
import { Alert, Badge, EmptyState } from "@/components/admin/ui/Feedback";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, describeAudit, entityLabel } from "@/lib/admin/audit";
import type { AuditLogRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Audit logs" };

const PER = 50;
type SP = { q?: string; action?: string; entity?: string; page?: string };

const tone = (a: string) =>
  a === "delete" || a === "media_delete" ? "red" : a === "publish" ? "green" : a === "role_change" || a === "unpublish" || a === "archive" ? "violet" : a === "login" || a === "logout" ? "slate" : "brand";

export default async function AuditLogs({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = await requirePageRole("ADMIN");
  const page = pageNumber(sp.page);
  const term = searchTerm(sp.q);
  const action = AUDIT_ACTIONS.includes(sp.action ?? "") ? sp.action : undefined;
  const entity = AUDIT_ENTITIES.includes(sp.entity ?? "") ? sp.entity : undefined;

  let q = s.supabase.from("audit_logs").select("*", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * PER, page * PER - 1);
  if (term) q = q.ilike("user_email", `%${term}%`);
  if (action) q = q.eq("action", action);
  if (entity) q = q.eq("entity", entity);
  const { data, count, error } = await q;
  const rows = (data ?? []) as AuditLogRow[];

  return (
    <>
      <PageHeader title="Audit logs" description="Every sign-in and change, recorded by the database. Entries can't be edited or deleted." />
      <SearchFilters q={sp.q} placeholder="Filter by user email" resetHref="/admin/audit-logs/">
        <label htmlFor="action" className="sr-only">
          Action
        </label>
        <select id="action" name="action" defaultValue={action ?? ""} className="adm-input sm:w-40">
          <option value="">All actions</option>
          {AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a.replace("_", " ")}
            </option>
          ))}
        </select>
        <label htmlFor="entity" className="sr-only">
          Type
        </label>
        <select id="entity" name="entity" defaultValue={entity ?? ""} className="adm-input sm:w-44">
          <option value="">All types</option>
          {AUDIT_ENTITIES.map((e) => (
            <option key={e} value={e}>
              {entityLabel(e)}
            </option>
          ))}
        </select>
      </SearchFilters>
      {error ? (
        <Alert tone="error">Could not load the audit log.</Alert>
      ) : rows.length === 0 ? (
        <div className="adm-card">
          <EmptyState title="No entries" />
        </div>
      ) : (
        <div className="adm-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.02]">
              <tr>
                <th scope="col" className="adm-th">When</th>
                <th scope="col" className="adm-th">Event</th>
                <th scope="col" className="adm-th hidden md:table-cell">User</th>
                <th scope="col" className="adm-th hidden lg:table-cell">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {rows.map((r) => {
                const changed = Array.isArray(r.metadata?.changed) ? (r.metadata.changed as string[]) : [];
                return (
                  <tr key={r.id}>
                    <td className="adm-td adm-muted text-xs whitespace-nowrap">{formatDateTime(r.created_at)}</td>
                    <td className="adm-td">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={tone(r.action)}>{r.action.replace("_", " ")}</Badge>
                        <span className="text-sm">{describeAudit(r)}</span>
                      </div>
                      <p className="adm-muted mt-0.5 text-xs md:hidden">{r.user_email}</p>
                    </td>
                    <td className="adm-td adm-muted hidden text-xs md:table-cell">{r.user_email || "system"}</td>
                    <td className="adm-td adm-muted hidden max-w-xs truncate text-xs lg:table-cell" title={changed.join(", ")}>
                      {changed.length ? `Changed: ${changed.join(", ")}` : r.entity_id ? `ID ${r.entity_id.slice(0, 8)}…` : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} perPage={PER} total={count ?? 0} makeHref={(p) => listHref("/admin/audit-logs/", { q: sp.q, action, entity, page: p })} />
    </>
  );
}
