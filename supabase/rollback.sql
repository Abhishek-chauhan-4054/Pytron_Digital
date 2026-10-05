-- =====================================================================
--  Pytron Digital CMS — ROLLBACK (removes the CMS from the database)
--  ⚠ Deletes all CMS content, users' CMS roles and the audit log.
--  The public website keeps working: without CMS data it serves its
--  built-in content (remove the Supabase env vars in Vercel as well).
--
--  Storage buckets are not touched here (Supabase blocks deleting storage rows
--  with SQL). Delete them in Supabase → Storage if you want: website-images,
--  blog-images, service-images, documents.
--  Auth users are NOT deleted (remove them in Authentication → Users if wanted).
-- =====================================================================
begin;

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_updated on auth.users;

drop policy if exists "cms staff read cms buckets" on storage.objects;
drop policy if exists "cms staff upload" on storage.objects;
drop policy if exists "cms staff update" on storage.objects;
drop policy if exists "cms admin delete" on storage.objects;

drop table if exists
  public.audit_logs, public.redirects, public.seo_metadata, public.site_settings,
  public.navigation_items, public.media, public.blog_post_tags, public.blogs,
  public.blog_tags, public.blog_categories, public.page_sections, public.pages,
  public.services, public.profiles, public.roles
  cascade;

drop function if exists
  public.current_user_role(), public.has_min_role(text), public.is_staff(), public.set_updated_at(),
  public.handle_new_user(), public.sync_profile_from_auth(), public.protect_profile(),
  public.enforce_content_workflow(), public.enforce_section_workflow(), public.protect_system_pages(),
  public.content_path(text, jsonb), public.redirect_on_slug_change(), public.audit_row_change(),
  public.log_auth_event(text), public.bootstrap_super_admin(text), public.replace_page_sections(uuid, jsonb),
  public.set_blog_tags(uuid, text[]), public.swap_service_order(uuid, uuid)
  cascade;

drop type if exists public.content_status;

commit;
