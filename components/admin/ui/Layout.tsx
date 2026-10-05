import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export function PageHeader({ title, description, actions, back }: { title: string; description?: ReactNode; actions?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="adm-muted mb-2 inline-flex items-center gap-1 text-sm hover:text-slate-900 dark:hover:text-white">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <h1 className="truncate text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
        {description && <p className="adm-muted mt-1 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, description, children, actions, className = "", padded = true }: { title?: string; description?: string; children: ReactNode; actions?: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={`adm-card ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-white/10">
          <div>
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && <p className="adm-muted mt-0.5 text-xs">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

/** Search + filters as a plain GET form: results are filtered in the database, URLs are shareable. */
export function SearchFilters({
  q,
  placeholder = "Search…",
  children,
  resetHref,
}: {
  q?: string;
  placeholder?: string;
  children?: ReactNode;
  resetHref: string;
}) {
  return (
    <form method="get" className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center" role="search">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <input id="q" name="q" defaultValue={q} placeholder={placeholder} className="adm-input pl-9" type="search" maxLength={80} />
      </div>
      {children}
      <div className="flex gap-2">
        <button type="submit" className="adm-btn adm-btn-secondary">
          Apply
        </button>
        {(q || children) && (
          <Link href={resetHref} className="adm-btn adm-btn-ghost">
            Reset
          </Link>
        )}
      </div>
    </form>
  );
}

export function Pagination({ page, perPage, total, makeHref }: { page: number; perPage: number; total: number; makeHref: (p: number) => string }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  if (total === 0) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(total, page * perPage);
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-3 text-sm">
      <p className="adm-muted">
        {from}–{to} of {total}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={makeHref(page - 1)} className="adm-btn adm-btn-secondary adm-btn-sm" rel="prev">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
          </Link>
        ) : (
          <span className="adm-btn adm-btn-secondary adm-btn-sm opacity-50" aria-disabled="true">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
          </span>
        )}
        <span className="adm-muted hidden items-center px-1 sm:inline-flex">
          Page {page} of {pages}
        </span>
        {page < pages ? (
          <Link href={makeHref(page + 1)} className="adm-btn adm-btn-secondary adm-btn-sm" rel="next">
            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="adm-btn adm-btn-secondary adm-btn-sm opacity-50" aria-disabled="true">
            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}

/** Build list URLs that keep the current filters. */
export function listHref(base: string, params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "" && !(k === "page" && Number(v) === 1)) sp.set(k, String(v));
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}
