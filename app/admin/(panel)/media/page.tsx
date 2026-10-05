import type { Metadata } from "next";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { pageNumber, searchTerm } from "@/lib/admin/format";
import { listHref, PageHeader, Pagination, SearchFilters } from "@/components/admin/ui/Layout";
import { Alert } from "@/components/admin/ui/Feedback";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { BUCKETS } from "@/lib/cms/media";
import type { MediaBucket, MediaRow } from "@/lib/cms/types";
import { storagePublicUrl } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Media library" };

const PER = 24;
type SP = { q?: string; bucket?: string; folder?: string; page?: string };

export default async function MediaPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const s = await requirePageRole("EDITOR");
  const page = pageNumber(sp.page);
  const term = searchTerm(sp.q);
  const bucket = BUCKETS.some((b) => b.key === sp.bucket) ? (sp.bucket as MediaBucket) : undefined;
  const folder = /^[a-z0-9-]{1,40}$/.test(sp.folder ?? "") ? sp.folder : undefined;

  let q = s.supabase
    .from("media")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PER, page * PER - 1);
  if (term) q = q.or(`file_name.ilike.%${term}%,alt_text.ilike.%${term}%`);
  if (bucket) q = q.eq("bucket", bucket);
  if (folder) q = q.eq("folder", folder);
  const [{ data, count, error }, { data: folderRows }] = await Promise.all([q, s.supabase.from("media").select("folder").limit(1000)]);
  const folders = [...new Set(((folderRows ?? []) as { folder: string }[]).map((f) => f.folder))].sort();
  const items = ((data ?? []) as MediaRow[]).map((m) => ({ ...m, url: BUCKETS.find((b) => b.key === m.bucket)!.public ? storagePublicUrl(m.bucket, m.path) : "" }));

  return (
    <>
      <PageHeader title="Media library" description="Images and documents stored in Supabase Storage." />
      <SearchFilters q={sp.q} placeholder="Search file name or alt text" resetHref="/admin/media/">
        <label htmlFor="bucket" className="sr-only">
          Bucket
        </label>
        <select id="bucket" name="bucket" defaultValue={bucket ?? ""} className="adm-input sm:w-48">
          <option value="">All buckets</option>
          {BUCKETS.map((b) => (
            <option key={b.key} value={b.key}>
              {b.label}
            </option>
          ))}
        </select>
        <label htmlFor="folder" className="sr-only">
          Folder
        </label>
        <select id="folder" name="folder" defaultValue={folder ?? ""} className="adm-input sm:w-40">
          <option value="">All folders</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </SearchFilters>
      {error ? (
        <Alert tone="error" title="Could not load media">
          Please refresh the page.
        </Alert>
      ) : (
        <MediaLibrary items={items} canDelete={roleAtLeast(s.profile.role, "ADMIN")} filtered={Boolean(term || bucket || folder)} />
      )}
      <Pagination page={page} perPage={PER} total={count ?? 0} makeHref={(p) => listHref("/admin/media/", { q: sp.q, bucket, folder, page: p })} />
    </>
  );
}
