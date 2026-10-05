/**
 * Published date from the form (yyyy-mm-dd). Keeps the stored timestamp when the day is
 * unchanged (so ordering within a day is preserved) and keeps it when the field is left empty.
 * A null value is stamped with the current time by the database on first publish.
 */
export function publishedAtFrom(date: string, existing: string | null): string | null {
  if (!date) return existing;
  if (existing && existing.slice(0, 10) === date) return existing;
  return `${date}T09:00:00Z`;
}
