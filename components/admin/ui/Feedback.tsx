import type { ReactNode } from "react";
import { CircleAlert, Inbox, Info, TriangleAlert } from "lucide-react";
import type { ContentStatus } from "@/lib/cms/types";

const STATUS_STYLE: Record<ContentStatus, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25",
  DRAFT: "bg-amber-50 text-amber-800 ring-amber-600/25 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/25",
  ARCHIVED: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-white/5 dark:text-slate-400 dark:ring-white/15",
};
const STATUS_LABEL: Record<ContentStatus, string> = { PUBLISHED: "Published", DRAFT: "Draft", ARCHIVED: "Archived" };

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`adm-badge ${STATUS_STYLE[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "brand" | "violet" | "green" | "red" }) {
  const cls = {
    slate: "bg-slate-100 text-slate-700 ring-slate-500/15 dark:bg-white/5 dark:text-slate-300 dark:ring-white/15",
    brand: "bg-brand-50 text-brand-700 ring-brand-600/20 dark:bg-brand-400/10 dark:text-brand-200 dark:ring-brand-300/25",
    violet: "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-200 dark:ring-violet-300/25",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25",
    red: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/25",
  }[tone];
  return <span className={`adm-badge ${cls}`}>{children}</span>;
}

export function EmptyState({ title, text, action, icon }: { title: string; text?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden="true" />}
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {text && <p className="adm-muted mt-1.5 max-w-sm text-sm">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Alert({ tone = "info", title, children }: { tone?: "info" | "warning" | "error"; title?: string; children?: ReactNode }) {
  const map = {
    info: { cls: "border-brand-200 bg-brand-50/70 text-brand-900 dark:border-brand-400/25 dark:bg-brand-400/10 dark:text-brand-100", Icon: Info },
    warning: { cls: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-100", Icon: TriangleAlert },
    error: { cls: "border-red-200 bg-red-50 text-red-900 dark:border-red-400/25 dark:bg-red-400/10 dark:text-red-100", Icon: CircleAlert },
  }[tone];
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${map.cls}`} role={tone === "error" ? "alert" : "status"}>
      <map.Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-0.5" : ""}>{children}</div>}
      </div>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`adm-skeleton ${className}`} aria-hidden="true" />;
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="adm-card divide-y divide-slate-100 dark:divide-white/5" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="ml-auto h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
