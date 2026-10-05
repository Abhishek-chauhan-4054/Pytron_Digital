-- =====================================================================
--  Pytron Digital CMS — 2/5 — Workflow, permissions and audit triggers
--  Business rules are enforced in the database, not just in the UI.
-- =====================================================================

-- ---------------------------------------------------------------------
-- New auth user → profile with NO role (no CMS access until a
-- SUPER_ADMIN assigns one).
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep email / last sign-in in sync (for the Users screen).
create or replace function public.sync_profile_from_auth()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  update public.profiles
     set email = coalesce(new.email, email),
         last_sign_in_at = new.last_sign_in_at
   where id = new.id
     and (email is distinct from new.email or last_sign_in_at is distinct from new.last_sign_in_at);
  return new;
end $$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of email, last_sign_in_at on auth.users
  for each row execute function public.sync_profile_from_auth();

-- ---------------------------------------------------------------------
-- Profiles: only SUPER_ADMIN may change role / active flag / email,
-- and the last active SUPER_ADMIN can never be removed.
-- ---------------------------------------------------------------------
create or replace function public.protect_profile()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  super_id uuid := (select id from public.roles where key = 'SUPER_ADMIN');
  remaining int;
begin
  -- auth.uid() is null for the service role / SQL editor (trusted contexts)
  if auth.uid() is not null and not public.has_min_role('SUPER_ADMIN') then
    if new.role_id is distinct from old.role_id
       or new.is_active is distinct from old.is_active
       or new.email is distinct from old.email
       or new.id is distinct from old.id then
      raise exception 'Only a Super Admin can change roles or account status.' using errcode = '42501';
    end if;
  end if;

  if old.role_id = super_id and old.is_active
     and (new.role_id is distinct from super_id or not new.is_active) then
    select count(*) into remaining
      from public.profiles
     where role_id = super_id and is_active and id <> old.id;
    if remaining = 0 then
      raise exception 'At least one active Super Admin is required.' using errcode = '42501';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile
  before update on public.profiles
  for each row execute function public.protect_profile();

-- ---------------------------------------------------------------------
-- Content workflow for pages, services and blogs
--   • EDITOR: may only create and edit DRAFTs (cannot publish/unpublish/archive,
--     cannot change live content).
--   • published_at is stamped the first time something is published.
--   • created_by / updated_by are set from the session, never from the client.
-- ---------------------------------------------------------------------
create or replace function public.enforce_content_workflow()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  r text := public.current_user_role();
begin
  if auth.uid() is not null then
    if r is null then
      raise exception 'Your account has no CMS role.' using errcode = '42501';
    end if;
    if r = 'EDITOR' then
      if tg_op = 'INSERT' and new.status <> 'DRAFT' then
        raise exception 'Editors can create drafts only. Ask an Admin to publish.' using errcode = '42501';
      end if;
      if tg_op = 'UPDATE' and (old.status <> 'DRAFT' or new.status <> 'DRAFT') then
        raise exception 'Editors can edit drafts only. Ask an Admin to publish, unpublish or edit live content.' using errcode = '42501';
      end if;
    end if;
  end if;

  if new.status = 'PUBLISHED' and (tg_op = 'INSERT' or old.status <> 'PUBLISHED') then
    new.published_at := coalesce(new.published_at, now());
  end if;

  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
  else
    new.created_by := old.created_by;
  end if;
  new.updated_by := auth.uid();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['pages', 'services', 'blogs'] loop
    execute format('drop trigger if exists enforce_content_workflow on public.%I', t);
    execute format('create trigger enforce_content_workflow before insert or update on public.%I
                    for each row execute function public.enforce_content_workflow()', t);
  end loop;
end $$;

-- Sections of a live page are live content too.
create or replace function public.enforce_section_workflow()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  page_status public.content_status;
begin
  if auth.uid() is not null and public.current_user_role() = 'EDITOR' then
    select status into page_status from public.pages
     where id = coalesce(new.page_id, old.page_id);
    if page_status is distinct from 'DRAFT' then
      raise exception 'Editors can edit sections of draft pages only.' using errcode = '42501';
    end if;
  end if;
  return coalesce(new, old);
end $$;

drop trigger if exists enforce_section_workflow on public.page_sections;
create trigger enforce_section_workflow
  before insert or update or delete on public.page_sections
  for each row execute function public.enforce_section_workflow();

-- Built-in pages keep their slug and system key (their URL lives in code).
create or replace function public.protect_system_pages()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and old.system_key is not null
     and (new.slug is distinct from old.slug or new.system_key is distinct from old.system_key) then
    raise exception 'Built-in pages keep their slug.' using errcode = '42501';
  end if;
  if tg_op = 'DELETE' and old.system_key is not null and auth.uid() is not null then
    raise exception 'Built-in pages cannot be deleted. Unpublish to fall back to the original copy.' using errcode = '42501';
  end if;
  return coalesce(new, old);
end $$;

drop trigger if exists protect_system_pages on public.pages;
create trigger protect_system_pages
  before update or delete on public.pages
  for each row execute function public.protect_system_pages();

-- Top-level CMS pages must not shadow an existing route.
alter table public.pages drop constraint if exists pages_reserved_slug;
alter table public.pages add constraint pages_reserved_slug check (
  system_key is not null or slug not in (
    'admin', 'api', 'auth', 'blog', 'services', 'products', 'work', 'about', 'contact', 'home',
    'digital-marketing', 'web-development', 'ai-solutions', 'industries', 'locations',
    'privacy-policy', 'terms', 'cookie-policy', 'site-map', 'sitemap', 'robots', '_next', 'preview'));

-- ---------------------------------------------------------------------
-- Automatic redirects when a published slug changes
-- ---------------------------------------------------------------------
create or replace function public.content_path(tbl text, row_data jsonb)
returns text
language sql immutable
set search_path = ''
as $$
  select case tbl
    when 'blogs' then '/blog/' || (row_data ->> 'slug') || '/'
    when 'pages' then '/' || (row_data ->> 'slug') || '/'
    when 'services' then
      case row_data ->> 'pillar'
        when 'marketing' then '/digital-marketing/'
        when 'web' then '/web-development/'
        else '/ai-solutions/' end || (row_data ->> 'slug') || '/'
  end
$$;

create or replace function public.redirect_on_slug_change()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  old_path text := public.content_path(tg_table_name, to_jsonb(old));
  new_path text := public.content_path(tg_table_name, to_jsonb(new));
begin
  -- built-in pages (system_key set) have fixed URLs defined in code
  if old.status = 'PUBLISHED' and old_path <> new_path
     and (to_jsonb(old) ->> 'system_key') is null then
    -- the new URL must never redirect away
    delete from public.redirects where from_path = new_path;
    -- flatten chains: anything pointing at the old URL now points at the new one
    update public.redirects set to_path = new_path where to_path = old_path;
    insert into public.redirects (from_path, to_path, status_code)
    values (old_path, new_path, 308)
    on conflict (from_path) do update set to_path = excluded.to_path;
  end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['pages', 'services', 'blogs'] loop
    execute format('drop trigger if exists redirect_on_slug_change on public.%I', t);
    execute format('create trigger redirect_on_slug_change after update on public.%I
                    for each row execute function public.redirect_on_slug_change()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Audit logging (database-level, cannot be skipped by the app)
-- Stores who / what / which record and the names of changed fields —
-- never field values, passwords or secrets.
-- ---------------------------------------------------------------------
create or replace function public.audit_row_change()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_new jsonb := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
  v_old jsonb := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  v_row jsonb := coalesce(v_new, v_old);
  v_action text;
  v_changed text[];
  v_meta jsonb := '{}'::jsonb;
  v_email text;
begin
  if tg_op = 'INSERT' then
    v_action := case tg_table_name when 'media' then 'media_upload' when 'profiles' then 'user_create' else 'create' end;
  elsif tg_op = 'DELETE' then
    v_action := case tg_table_name when 'media' then 'media_delete' else 'delete' end;
  else
    select array_agg(n.key order by n.key) into v_changed
      from jsonb_each(v_new) n
     where n.value is distinct from (v_old -> n.key)
       and n.key not in ('updated_at', 'updated_by', 'last_sign_in_at');
    if v_changed is null then
      return null; -- nothing meaningful changed
    end if;
    v_meta := jsonb_build_object('changed', to_jsonb(v_changed));

    if v_new ? 'status' and (v_old ->> 'status') is distinct from (v_new ->> 'status') then
      v_action := case
        when v_new ->> 'status' = 'PUBLISHED' then 'publish'
        when v_new ->> 'status' = 'ARCHIVED' then 'archive'
        when v_old ->> 'status' = 'PUBLISHED' then 'unpublish'
        else 'update' end;
      v_meta := v_meta || jsonb_build_object('from', v_old ->> 'status', 'to', v_new ->> 'status');
    elsif tg_table_name = 'profiles' and (v_old ->> 'role_id') is distinct from (v_new ->> 'role_id') then
      v_action := 'role_change';
      v_meta := v_meta || jsonb_build_object(
        'from', (select key from public.roles where id = (v_old ->> 'role_id')::uuid),
        'to',   (select key from public.roles where id = (v_new ->> 'role_id')::uuid));
    elsif tg_table_name = 'profiles' then
      v_action := 'user_update';
    else
      v_action := 'update';
    end if;
  end if;

  v_meta := v_meta || jsonb_strip_nulls(jsonb_build_object(
    'label', coalesce(v_row ->> 'title', v_row ->> 'name', v_row ->> 'label', v_row ->> 'file_name',
                      v_row ->> 'path', v_row ->> 'email'),
    'slug', v_row ->> 'slug'));

  select email into v_email from auth.users where id = auth.uid();

  insert into public.audit_logs (user_id, user_email, action, entity, entity_id, metadata)
  values (auth.uid(), coalesce(v_email, 'system'), v_action, tg_table_name, v_row ->> 'id', v_meta);
  return null;
end $$;

do $$
declare t text;
begin
  foreach t in array array['pages', 'services', 'blogs', 'blog_categories', 'blog_tags', 'media',
                           'navigation_items', 'site_settings', 'seo_metadata', 'profiles', 'redirects']
  loop
    execute format('drop trigger if exists audit_row_change on public.%I', t);
    execute format('create trigger audit_row_change after insert or update or delete on public.%I
                    for each row execute function public.audit_row_change()', t);
  end loop;
end $$;

-- Login / logout events are recorded by the app through this function.
-- It always records the CALLER (auth.uid()), so it cannot be used to forge entries for others.
create or replace function public.log_auth_event(p_action text)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;
  if p_action not in ('login', 'logout') then
    raise exception 'Unsupported action' using errcode = '22023';
  end if;
  insert into public.audit_logs (user_id, user_email, action, entity, entity_id)
  select auth.uid(), coalesce(u.email, ''), p_action, 'auth', auth.uid()::text
    from auth.users u where u.id = auth.uid();
end $$;

-- ---------------------------------------------------------------------
-- First Super Admin (run once from the Supabase SQL editor).
-- Not callable through the public API: execute is revoked from anon and authenticated.
-- Refuses to run if a Super Admin already exists.
-- ---------------------------------------------------------------------
create or replace function public.bootstrap_super_admin(p_email text)
returns text
language plpgsql security definer
set search_path = ''
as $$
declare
  v_user uuid;
  v_role uuid := (select id from public.roles where key = 'SUPER_ADMIN');
begin
  if exists (select 1 from public.profiles where role_id = v_role) then
    raise exception 'A Super Admin already exists. Use Admin → Users to manage roles.';
  end if;
  select id into v_user from auth.users where lower(email) = lower(trim(p_email));
  if v_user is null then
    raise exception 'No auth user with email %. Create the user in Authentication → Users first.', p_email;
  end if;
  insert into public.profiles (id, email) values (v_user, lower(trim(p_email)))
  on conflict (id) do nothing;
  update public.profiles set role_id = v_role, is_active = true where id = v_user;
  return 'Super Admin granted to ' || p_email;
end $$;

revoke all on function public.bootstrap_super_admin(text) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.sync_profile_from_auth() from public, anon, authenticated;
revoke all on function public.audit_row_change() from public, anon, authenticated;
revoke all on function public.log_auth_event(text) from public, anon;
grant execute on function public.log_auth_event(text) to authenticated;

-- ---------------------------------------------------------------------
-- Atomic helpers used by the admin app. SECURITY INVOKER: they run with
-- the caller's permissions, so RLS and the workflow triggers still apply.
-- ---------------------------------------------------------------------
create or replace function public.replace_page_sections(p_page_id uuid, p_sections jsonb)
returns void
language plpgsql security invoker
set search_path = ''
as $$
begin
  if jsonb_typeof(p_sections) <> 'array' then
    raise exception 'sections must be an array' using errcode = '22023';
  end if;
  delete from public.page_sections where page_id = p_page_id;
  insert into public.page_sections (page_id, type, data, sort_order)
  select p_page_id, s.value ->> 'type', coalesce(s.value -> 'data', '{}'::jsonb), (s.ordinality - 1)::int
    from jsonb_array_elements(p_sections) with ordinality as s(value, ordinality);
end $$;

create or replace function public.set_blog_tags(p_blog_id uuid, p_tags text[])
returns void
language plpgsql security invoker
set search_path = ''
as $$
declare
  t text;
  v_slug text;
  v_id uuid;
begin
  delete from public.blog_post_tags where blog_id = p_blog_id;
  foreach t in array coalesce(p_tags, '{}') loop
    t := btrim(t);
    continue when t = '';
    v_slug := trim(both '-' from regexp_replace(lower(t), '[^a-z0-9]+', '-', 'g'));
    continue when v_slug = '';
    select id into v_id from public.blog_tags where slug = v_slug;
    if v_id is null then
      insert into public.blog_tags (name, slug) values (left(t, 60), v_slug) returning id into v_id;
    end if;
    insert into public.blog_post_tags (blog_id, tag_id) values (p_blog_id, v_id) on conflict do nothing;
  end loop;
end $$;

-- Swap sort order of two services (reordering), atomically.
create or replace function public.swap_service_order(p_a uuid, p_b uuid)
returns void
language plpgsql security invoker
set search_path = ''
as $$
declare
  oa int; ob int;
begin
  select sort_order into oa from public.services where id = p_a;
  select sort_order into ob from public.services where id = p_b;
  if oa is null or ob is null then
    raise exception 'Service not found' using errcode = 'P0002';
  end if;
  if oa = ob then ob := oa + 1; end if;
  update public.services set sort_order = ob where id = p_a;
  update public.services set sort_order = oa where id = p_b;
end $$;

revoke all on function public.replace_page_sections(uuid, jsonb) from public, anon;
revoke all on function public.set_blog_tags(uuid, text[]) from public, anon;
revoke all on function public.swap_service_order(uuid, uuid) from public, anon;
grant execute on function public.replace_page_sections(uuid, jsonb) to authenticated;
grant execute on function public.set_blog_tags(uuid, text[]) to authenticated;
grant execute on function public.swap_service_order(uuid, uuid) to authenticated;
