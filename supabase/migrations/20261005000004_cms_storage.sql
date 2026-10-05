-- =====================================================================
--  Pytron Digital CMS — 4/5 — Supabase Storage buckets & policies
--  Size limits and MIME types are enforced by Storage itself (per bucket),
--  in addition to the checks the admin app performs before upload.
--  SVG is intentionally NOT allowed (it can carry scripts).
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('website-images', 'website-images', true,  5242880,
     array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
  ('blog-images',    'blog-images',    true,  5242880,
     array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
  ('service-images', 'service-images', true,  5242880,
     array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
  ('documents',      'documents',      false, 10485760,
     array['application/pdf', 'text/plain', 'text/csv',
           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
           'application/vnd.openxmlformats-officedocument.presentationml.presentation'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Files in public buckets are readable by URL without any policy.
-- The API-level policies below only govern listing / uploading / deleting.

drop policy if exists "cms staff read cms buckets" on storage.objects;
create policy "cms staff read cms buckets" on storage.objects
  for select to authenticated
  using (bucket_id in ('website-images', 'blog-images', 'service-images', 'documents')
         and (select public.is_staff()));

drop policy if exists "cms staff upload" on storage.objects;
create policy "cms staff upload" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('website-images', 'blog-images', 'service-images', 'documents')
              and (select public.is_staff()));

drop policy if exists "cms staff update" on storage.objects;
create policy "cms staff update" on storage.objects
  for update to authenticated
  using (bucket_id in ('website-images', 'blog-images', 'service-images', 'documents')
         and (select public.is_staff()))
  with check (bucket_id in ('website-images', 'blog-images', 'service-images', 'documents')
              and (select public.is_staff()));

drop policy if exists "cms admin delete" on storage.objects;
create policy "cms admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('website-images', 'blog-images', 'service-images', 'documents')
         and (select public.has_min_role('ADMIN')));
