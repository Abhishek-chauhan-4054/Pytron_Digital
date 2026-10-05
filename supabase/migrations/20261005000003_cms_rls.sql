-- =====================================================================
--  Pytron Digital CMS — 3/5 — Row Level Security
--  Public (anon) can read PUBLISHED content only. Drafts are visible to staff only.
--  Role hierarchy: SUPER_ADMIN > ADMIN > EDITOR.
-- =====================================================================

alter table public.roles            enable row level security;
alter table public.profiles         enable row level security;
alter table public.pages            enable row level security;
alter table public.page_sections    enable row level security;
alter table public.services         enable row level security;
alter table public.blog_categories  enable row level security;
alter table public.blog_tags        enable row level security;
alter table public.blogs            enable row level security;
alter table public.blog_post_tags   enable row level security;
alter table public.media            enable row level security;
alter table public.navigation_items enable row level security;
alter table public.site_settings    enable row level security;
alter table public.seo_metadata     enable row level security;
alter table public.redirects        enable row level security;
alter table public.audit_logs       enable row level security;

-- Defense in depth: the anonymous role has no business touching these at all.
revoke all on public.roles, public.profiles, public.media, public.audit_logs from anon;
-- Nobody edits the audit log through the API.
revoke update, delete, truncate on public.audit_logs from authenticated, anon;

-- Helper to (re)create a policy idempotently
create or replace function pg_temp.policy(p_name text, p_table text, p_sql text)
returns void language plpgsql as $$
begin
  execute format('drop policy if exists %I on public.%I', p_name, p_table);
  execute p_sql;
end $$;

-- ---------------------------------------------------------------------
-- roles: staff can read (to show role names); nobody writes via API
-- ---------------------------------------------------------------------
select pg_temp.policy('roles_staff_read', 'roles',
  $p$ create policy roles_staff_read on public.roles for select to authenticated
      using ((select public.is_staff())) $p$);

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
select pg_temp.policy('profiles_read', 'profiles',
  $p$ create policy profiles_read on public.profiles for select to authenticated
      using (id = (select auth.uid()) or (select public.has_min_role('SUPER_ADMIN'))) $p$);
select pg_temp.policy('profiles_update', 'profiles',
  $p$ create policy profiles_update on public.profiles for update to authenticated
      using (id = (select auth.uid()) or (select public.has_min_role('SUPER_ADMIN')))
      with check (id = (select auth.uid()) or (select public.has_min_role('SUPER_ADMIN'))) $p$);
-- (column-level rules — who may change role/is_active — are enforced by the protect_profile trigger)

-- ---------------------------------------------------------------------
-- Content with a status: pages, services, blogs
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['pages', 'services', 'blogs'] loop
    perform pg_temp.policy(t || '_public_read', t, format(
      'create policy %I on public.%I for select to anon, authenticated using (status = ''PUBLISHED'')',
      t || '_public_read', t));
    perform pg_temp.policy(t || '_staff_read', t, format(
      'create policy %I on public.%I for select to authenticated using ((select public.is_staff()))',
      t || '_staff_read', t));
    perform pg_temp.policy(t || '_staff_insert', t, format(
      'create policy %I on public.%I for insert to authenticated with check ((select public.is_staff()))',
      t || '_staff_insert', t));
    perform pg_temp.policy(t || '_staff_update', t, format(
      'create policy %I on public.%I for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()))',
      t || '_staff_update', t));
    perform pg_temp.policy(t || '_admin_delete', t, format(
      'create policy %I on public.%I for delete to authenticated using ((select public.has_min_role(''ADMIN'')))',
      t || '_admin_delete', t));
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- page_sections: visible when the parent page is published (or to staff)
-- ---------------------------------------------------------------------
select pg_temp.policy('page_sections_public_read', 'page_sections',
  $p$ create policy page_sections_public_read on public.page_sections for select to anon, authenticated
      using (exists (select 1 from public.pages p where p.id = page_id and p.status = 'PUBLISHED')) $p$);
select pg_temp.policy('page_sections_staff_read', 'page_sections',
  $p$ create policy page_sections_staff_read on public.page_sections for select to authenticated
      using ((select public.is_staff())) $p$);
select pg_temp.policy('page_sections_staff_write', 'page_sections',
  $p$ create policy page_sections_staff_write on public.page_sections for all to authenticated
      using ((select public.is_staff())) with check ((select public.is_staff())) $p$);

-- ---------------------------------------------------------------------
-- Blog taxonomy (category and tag names are public information)
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['blog_categories', 'blog_tags'] loop
    perform pg_temp.policy(t || '_public_read', t, format(
      'create policy %I on public.%I for select to anon, authenticated using (true)', t || '_public_read', t));
    perform pg_temp.policy(t || '_staff_insert', t, format(
      'create policy %I on public.%I for insert to authenticated with check ((select public.is_staff()))', t || '_staff_insert', t));
    perform pg_temp.policy(t || '_staff_update', t, format(
      'create policy %I on public.%I for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()))', t || '_staff_update', t));
    perform pg_temp.policy(t || '_admin_delete', t, format(
      'create policy %I on public.%I for delete to authenticated using ((select public.has_min_role(''ADMIN'')))', t || '_admin_delete', t));
  end loop;
end $$;

-- Tag links are only visible for published posts (drafts stay private)
select pg_temp.policy('blog_post_tags_public_read', 'blog_post_tags',
  $p$ create policy blog_post_tags_public_read on public.blog_post_tags for select to anon, authenticated
      using (exists (select 1 from public.blogs b where b.id = blog_id and b.status = 'PUBLISHED')) $p$);
select pg_temp.policy('blog_post_tags_staff_all', 'blog_post_tags',
  $p$ create policy blog_post_tags_staff_all on public.blog_post_tags for all to authenticated
      using ((select public.is_staff())) with check ((select public.is_staff())) $p$);

-- ---------------------------------------------------------------------
-- media metadata: staff only (files in public buckets are served by URL)
-- ---------------------------------------------------------------------
select pg_temp.policy('media_staff_read', 'media',
  $p$ create policy media_staff_read on public.media for select to authenticated using ((select public.is_staff())) $p$);
select pg_temp.policy('media_staff_insert', 'media',
  $p$ create policy media_staff_insert on public.media for insert to authenticated
      with check ((select public.is_staff()) and uploaded_by = (select auth.uid())) $p$);
select pg_temp.policy('media_staff_update', 'media',
  $p$ create policy media_staff_update on public.media for update to authenticated
      using ((select public.is_staff())) with check ((select public.is_staff())) $p$);
select pg_temp.policy('media_admin_delete', 'media',
  $p$ create policy media_admin_delete on public.media for delete to authenticated
      using ((select public.has_min_role('ADMIN'))) $p$);

-- ---------------------------------------------------------------------
-- navigation_items, seo_metadata, redirects: public read, ADMIN+ write
-- ---------------------------------------------------------------------
select pg_temp.policy('navigation_public_read', 'navigation_items',
  $p$ create policy navigation_public_read on public.navigation_items for select to anon, authenticated
      using (is_active) $p$);
select pg_temp.policy('navigation_staff_read', 'navigation_items',
  $p$ create policy navigation_staff_read on public.navigation_items for select to authenticated
      using ((select public.is_staff())) $p$);

do $$
declare t text;
begin
  foreach t in array array['navigation_items', 'seo_metadata', 'redirects'] loop
    perform pg_temp.policy(t || '_admin_write', t, format(
      'create policy %I on public.%I for all to authenticated using ((select public.has_min_role(''ADMIN''))) with check ((select public.has_min_role(''ADMIN'')))',
      t || '_admin_write', t));
  end loop;
end $$;

select pg_temp.policy('seo_metadata_public_read', 'seo_metadata',
  $p$ create policy seo_metadata_public_read on public.seo_metadata for select to anon, authenticated using (true) $p$);
select pg_temp.policy('redirects_public_read', 'redirects',
  $p$ create policy redirects_public_read on public.redirects for select to anon, authenticated using (true) $p$);

-- ---------------------------------------------------------------------
-- site_settings: public contact info; SUPER_ADMIN writes
-- ---------------------------------------------------------------------
select pg_temp.policy('site_settings_public_read', 'site_settings',
  $p$ create policy site_settings_public_read on public.site_settings for select to anon, authenticated using (true) $p$);
select pg_temp.policy('site_settings_super_update', 'site_settings',
  $p$ create policy site_settings_super_update on public.site_settings for update to authenticated
      using ((select public.has_min_role('SUPER_ADMIN'))) with check ((select public.has_min_role('SUPER_ADMIN'))) $p$);

-- ---------------------------------------------------------------------
-- audit_logs: ADMIN+ can read. Inserts happen only through SECURITY DEFINER
-- triggers / log_auth_event(). No update or delete for anyone.
-- ---------------------------------------------------------------------
select pg_temp.policy('audit_logs_admin_read', 'audit_logs',
  $p$ create policy audit_logs_admin_read on public.audit_logs for select to authenticated
      using ((select public.has_min_role('ADMIN'))) $p$);

-- Helper functions are safe to call but useless to anon
revoke execute on function public.current_user_role() from public, anon;
revoke execute on function public.has_min_role(text) from public, anon;
revoke execute on function public.is_staff() from public, anon;
grant execute on function public.current_user_role() to authenticated, service_role;
grant execute on function public.has_min_role(text) to authenticated, service_role;
grant execute on function public.is_staff() to authenticated, service_role;
