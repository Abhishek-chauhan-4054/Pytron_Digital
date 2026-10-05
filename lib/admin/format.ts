export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";
}

export function formatDay(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function timeAgo(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  return formatDay(iso);
}

/** Safe text for PostgREST ilike filters (removes wildcard / syntax characters). */
export function searchTerm(q: string | undefined) {
  return (q ?? "").trim().slice(0, 80).replace(/[%_,()*\\]/g, " ").trim();
}

export function pageNumber(p: string | undefined) {
  const n = Number(p);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export const PER_PAGE = 20;
