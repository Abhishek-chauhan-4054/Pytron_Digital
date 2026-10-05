-- =====================================================================
--  Pytron Digital CMS — 1/5 — Schema
--  Tables, constraints, indexes and helper functions.
--  Safe to run on a brand-new Supabase project (SQL editor or `supabase db push`).
-- =====================================================================

create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------------
-- Shared types
-- ---------------------------------------------------------------------
do $$ begin
  create type public.content_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Roles & profiles
-- ---------------------------------------------------------------------
create table if not exists public.roles (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique check (key in ('SUPER_ADMIN', 'ADMIN', 'EDITOR')),
  name        text not null,
  description text not null default '',
  rank        smallint not null unique, -- higher = more power
  created_at  timestamptz not null default now()
);

insert into public.roles (key, name, description, rank) values
  ('SUPER_ADMIN', 'Super Admin', 'Everything, including users, roles and site settings.', 30),
  ('ADMIN',       'Admin',       'Pages, services, blog, media, navigation and SEO. Can publish and delete.', 20),
  ('EDITOR',      'Editor',      'Creates and edits drafts. Cannot publish, delete, or manage users and settings.', 10)
on conflict (key) do nothing;

create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text not null,
  full_name       text not null default '',
  role_id         uuid references public.roles (id) on delete set null,
  is_active       boolean not null default true,
  last_sign_in_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists profiles_role_id_idx on public.profiles (role_id);
create index if not exists profiles_email_idx on public.profiles (lower(email));

-- ---------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER so RLS policies can call them
-- without recursing into profiles' own policies)
-- ---------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql stable security definer
set search_path = ''
as $$
  select r.key
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where p.id = auth.uid() and p.is_active
$$;

create or replace function public.has_min_role(min_role text)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select coalesce(
    (select r.rank
       from public.profiles p
       join public.roles r on r.id = p.role_id
      where p.id = auth.uid() and p.is_active)
    >= (select rank from public.roles where key = min_role),
    false)
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer
set search_path = ''
as $$ select public.has_min_role('EDITOR') $$;

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- Pages + sections
-- ---------------------------------------------------------------------
create table if not exists public.pages (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(title) between 1 and 200),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  -- Non-null for the site's built-in pages (home, about…). Their layout lives in code;
  -- the CMS controls their hero copy and SEO.
  system_key         text unique check (system_key ~ '^[a-z0-9-]+$'),
  status             public.content_status not null default 'DRAFT',
  hero_heading       text not null default '',
  hero_description   text not null default '',
  hero_cta_label     text not null default '',
  hero_cta_url       text not null default '',
  hero_image_url     text not null default '',
  content            jsonb,                 -- rich text (Tiptap JSON), rendered through a whitelist
  featured_image_url text not null default '',
  seo_title          text not null default '',
  seo_description    text not null default '',
  og_image_url       text not null default '',
  canonical_url      text not null default '',
  robots_index       boolean not null default true,
  robots_follow      boolean not null default true,
  published_at       timestamptz,
  created_by         uuid references public.profiles (id) on delete set null,
  updated_by         uuid references public.profiles (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists pages_status_idx on public.pages (status);
create index if not exists pages_updated_at_idx on public.pages (updated_at desc);
create index if not exists pages_title_trgm_idx on public.pages using gin (title extensions.gin_trgm_ops);

create table if not exists public.page_sections (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.pages (id) on delete cascade,
  type       text not null check (type in (
               'hero', 'text', 'image', 'image_text', 'features', 'cards', 'services',
               'testimonials', 'cta', 'faq', 'stats', 'logo_grid', 'rich_text', 'contact')),
  data       jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists page_sections_page_idx on public.page_sections (page_id, sort_order);

-- ---------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------
create table if not exists public.services (
  id                uuid primary key default gen_random_uuid(),
  pillar            text not null check (pillar in ('marketing', 'web', 'ai')),
  name              text not null check (char_length(name) between 1 and 120),
  slug              text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  short_description text not null default '',
  hero_heading      text not null default '',
  intro             text not null default '',
  full_description  jsonb,
  icon              text not null default 'sparkles',
  image_url         text not null default '',
  features          text[] not null default '{}',
  cta_label         text not null default '',
  cta_url           text not null default '',
  sort_order        integer not null default 0,
  status            public.content_status not null default 'DRAFT',
  seo_title         text not null default '',
  seo_description   text not null default '',
  og_image_url      text not null default '',
  published_at      timestamptz,
  created_by        uuid references public.profiles (id) on delete set null,
  updated_by        uuid references public.profiles (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (pillar, slug)
);
create index if not exists services_pillar_order_idx on public.services (pillar, sort_order);
create index if not exists services_status_idx on public.services (status);
create index if not exists services_name_trgm_idx on public.services using gin (name extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------
create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(name) between 1 and 80),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.blog_tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique check (char_length(name) between 1 and 60),
  slug       text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(title) between 1 and 200),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  excerpt            text not null default '',
  intro              text not null default '',
  content            jsonb,
  featured_image_url text not null default '',
  author_name        text not null default 'Pytron Digital Team',
  author_id          uuid references public.profiles (id) on delete set null,
  category_id        uuid references public.blog_categories (id) on delete set null,
  status             public.content_status not null default 'DRAFT',
  published_at       timestamptz,
  seo_title          text not null default '',
  seo_description    text not null default '',
  og_image_url       text not null default '',
  canonical_url      text not null default '',
  robots_index       boolean not null default true,
  reading_minutes    integer not null default 1 check (reading_minutes between 1 and 240),
  cta                text not null default 'marketing' check (cta in ('marketing', 'web', 'ai')),
  created_by         uuid references public.profiles (id) on delete set null,
  updated_by         uuid references public.profiles (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists blogs_status_published_idx on public.blogs (status, published_at desc);
create index if not exists blogs_category_idx on public.blogs (category_id);
create index if not exists blogs_title_trgm_idx on public.blogs using gin (title extensions.gin_trgm_ops);

create table if not exists public.blog_post_tags (
  blog_id uuid not null references public.blogs (id) on delete cascade,
  tag_id  uuid not null references public.blog_tags (id) on delete cascade,
  primary key (blog_id, tag_id)
);
create index if not exists blog_post_tags_tag_idx on public.blog_post_tags (tag_id);

-- ---------------------------------------------------------------------
-- Media library (files live in Supabase Storage; this is the metadata)
-- ---------------------------------------------------------------------
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  bucket      text not null check (bucket in ('website-images', 'blog-images', 'service-images', 'documents')),
  path        text not null check (path !~ '\.\.' and path !~ '^/' and char_length(path) <= 400),
  file_name   text not null,
  mime_type   text not null,
  size_bytes  bigint not null check (size_bytes >= 0),
  width       integer,
  height      integer,
  alt_text    text not null default '',
  folder      text not null default 'general' check (folder ~ '^[a-z0-9-]+$'),
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (bucket, path)
);
create index if not exists media_created_idx on public.media (created_at desc);
create index if not exists media_folder_idx on public.media (folder);
create index if not exists media_file_name_trgm_idx on public.media using gin (file_name extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------
-- Navigation (footer link columns — the header mega menu stays in code)
-- ---------------------------------------------------------------------
create table if not exists public.navigation_items (
  id          uuid primary key default gen_random_uuid(),
  location    text not null check (location in ('footer_services', 'footer_solutions', 'footer_company', 'footer_legal')),
  label       text not null check (char_length(label) between 1 and 80),
  href        text not null check (href ~ '^(/|https?://|mailto:|tel:)'),
  is_external boolean not null default false,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists navigation_items_location_idx on public.navigation_items (location, sort_order);

-- ---------------------------------------------------------------------
-- Site settings (single row, public information only — never secrets)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id                   smallint primary key default 1 check (id = 1),
  contact_email        text not null default '',
  contact_phone        text not null default '',
  whatsapp_url         text not null default '',
  social_linkedin      text not null default '',
  social_instagram     text not null default '',
  social_facebook      text not null default '',
  social_x             text not null default '',
  social_youtube       text not null default '',
  default_og_image_url text not null default '',
  updated_by           uuid references public.profiles (id) on delete set null,
  updated_at           timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- SEO overrides for any route (incl. built-in pages)
-- ---------------------------------------------------------------------
create table if not exists public.seo_metadata (
  id             uuid primary key default gen_random_uuid(),
  path           text not null unique check (path ~ '^/([a-z0-9-]+/)*$'),
  title          text not null default '',
  description    text not null default '',
  canonical_url  text not null default '',
  og_title       text not null default '',
  og_description text not null default '',
  og_image_url   text not null default '',
  robots_index   boolean not null default true,
  robots_follow  boolean not null default true,
  updated_by     uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Redirects (created automatically when a published slug changes)
-- ---------------------------------------------------------------------
create table if not exists public.redirects (
  id          uuid primary key default gen_random_uuid(),
  from_path   text not null unique check (from_path ~ '^/([a-z0-9-]+/)*$'),
  to_path     text not null check (to_path ~ '^/'),
  status_code smallint not null default 308 check (status_code in (301, 302, 307, 308)),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Audit log (append-only)
-- ---------------------------------------------------------------------
create table if not exists public.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete set null,
  user_email text not null default '',
  action     text not null check (action in (
               'login', 'logout', 'create', 'update', 'delete', 'publish', 'unpublish',
               'archive', 'media_upload', 'media_delete', 'role_change', 'user_create', 'user_update')),
  entity     text not null,
  entity_id  text,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity, entity_id);
create index if not exists audit_logs_user_idx on public.audit_logs (user_id);

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profiles', 'pages', 'page_sections', 'services', 'blog_categories', 'blogs',
                           'media', 'navigation_items', 'site_settings', 'seo_metadata']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;
