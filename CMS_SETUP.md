# Pytron Digital CMS — setup, operation and reference

This project now includes a full content management system at **`/admin`**, built on **Supabase** (PostgreSQL, Auth, Storage and Row Level Security) inside the existing Next.js 16 app. Nothing about the public design, URLs or behaviour changed: with the CMS connected, every existing page renders byte-for-byte the same HTML as before (verified on all 63 routes), and without Supabase variables the site keeps serving its built-in content.

---

## Contents

1. [What you get](#1-what-you-get)
2. [How it works](#2-how-it-works)
3. [Supabase setup, step by step](#3-supabase-setup-step-by-step)
4. [Environment variables (local and Vercel)](#4-environment-variables)
5. [Commands](#5-commands)
6. [Roles and permissions](#6-roles-and-permissions)
7. [What the CMS controls (and what stays in code)](#7-what-the-cms-controls)
8. [Free-tier limits](#8-free-tier-limits--read-this)
9. [Testing checklist](#9-testing-checklist)
10. [Security checklist](#10-security-checklist)
11. [Rollback](#11-rollback)
12. [Files created and changed](#12-files-created-and-changed)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. What you get

| Area | Route | Highlights |
|---|---|---|
| Sign in | `/admin/login/` | Supabase email + password, server-validated, generic error messages, throttling |
| Dashboard | `/admin/dashboard/` | Real counts (pages, published/draft, services, posts, media), recent updates, recent activity |
| Pages | `/admin/pages/` | Built-in pages (hero copy + SEO) and new pages made of 14 content blocks; draft/publish/archive, duplicate, preview, delete |
| Services | `/admin/services/` | All 16 existing services imported; create, edit, reorder, publish/unpublish, duplicate, delete |
| Blog | `/admin/blog/` | All 7 existing posts imported; Tiptap rich-text editor, categories, tags, author, featured/OG image, reading time, scheduling date |
| Categories | `/admin/blog/categories/` | Categories and tags |
| Media | `/admin/media/` | Supabase Storage uploads with progress, drag-and-drop, alt text, folders, search, copy URL, private documents with signed links |
| Navigation | `/admin/navigation/` | The four footer link columns |
| SEO | `/admin/seo/` | Per-URL overrides (title, description, canonical, robots, OG), automatic redirects list |
| Settings | `/admin/settings/` | Contact email/phone, WhatsApp, social profiles, default share image |
| Users | `/admin/users/` | Create users, roles, deactivate, reset password, delete |
| Audit logs | `/admin/audit-logs/` | Every sign-in and change, written by the database |
| My account | `/admin/account/` | Change name and password |

Also: preview of drafts (`/api/preview/`), automatic 308 redirects when a published slug changes, CMS-driven `sitemap.xml`, `robots.txt` that blocks `/admin/`, tag archives (`/blog/tag/<tag>/`), light/dark admin theme, responsive admin.

---

## 2. How it works

```
Browser ──► Next.js on Vercel ──────────────► Supabase
             │ public pages: static + ISR      │ PostgreSQL (+ RLS policies, triggers)
             │   anon key, published rows only │ Auth (email + password)
             │ /admin: server components +     │ Storage (4 buckets)
             │   server actions with the       │
             │   signed-in user's session      │
             └ proxy.ts refreshes the session  │
```

* **Public site.** Pages stay statically generated. CMS data is read with the anonymous key (Row Level Security only returns `PUBLISHED` rows) and cached with tags. When an editor saves, the server action expires those tags and the affected paths (`updateTag` / `revalidatePath`), so changes are live on the next request — **no redeploy**. A 1-hour safety revalidation also applies.
* **Built-in fallback.** If the Supabase variables are missing, or the database is unreachable (for example a paused free project), the site serves the original content from `content/*.ts` instead of failing. Failures are never cached.
* **Admin.** Every screen and every server action re-checks the signed-in user and role on the server; the database enforces the same rules again with RLS and triggers (editors cannot publish, nobody can edit the audit log, the last Super Admin cannot be removed, etc.).
* **Rich text** is stored as Tiptap JSON and rendered through a whitelist renderer — no HTML is ever injected, so stored content cannot run scripts.
* **Uploads** go from the browser straight to Supabase Storage through a one-time signed URL (with a progress bar, and without Vercel's request-size limit). The server then downloads the file, checks its real type from its first bytes, and only then records it; anything else is deleted. SVG is not allowed.
* **Preview** turns on Next.js draft mode only for signed-in staff, and drafts are then read with *their* session — a copied preview cookie alone shows nothing.

---

## 3. Supabase setup, step by step

You don't need to know Supabase already. Allow about 20 minutes.

### 3.1 Create a free account and project
1. Go to <https://supabase.com> → **Start your project** → sign up (GitHub sign-in is fine).
2. **New project**: choose your organization, name it `pytron-digital`, set a **strong database password** and store it in your password manager (you rarely need it, and it must never go into the code).
3. **Region**: pick the one closest to your Vercel region (Vercel's default is Washington D.C., `iad1` → choose *East US (North Virginia)*). Plan: **Free**. Click **Create new project** and wait ~2 minutes.

### 3.2 Copy the URL and keys
In the project: **Project Settings → API** (newer dashboards: **Project Settings → API Keys** and **Data API**).
* **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (looks like `https://abcd1234.supabase.co`)
* **anon public** key (or the new **publishable** key, `sb_publishable_…`) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* **service_role** key (or a **secret** key, `sb_secret_…`) → `SUPABASE_SERVICE_ROLE_KEY` — **server only, treat like a password.**

### 3.3 Configure the environment variables locally
```bash
cp .env.example .env.local
# then edit .env.local and paste the three values from 3.2
```
`.env.local` is git-ignored. Never commit it.

### 3.4 Run the database migration (creates everything)
**Option A — SQL editor (simplest, no tools):**
1. Supabase → **SQL Editor** → **New query**.
2. Open `supabase/setup.sql` from this project, copy **all** of it, paste, click **Run**.
3. You should see "Success. No rows returned" (a single `policy` result row is also fine).

`setup.sql` is all five files of `supabase/migrations/` in order. It is safe to run again: it never overwrites your CMS edits.

**Option B — Supabase CLI:**
```bash
npx supabase login
npx supabase init            # only if supabase/config.toml doesn't exist yet; keeps the existing migrations
npx supabase link --project-ref <your-project-ref>   # the ref is the "abcd1234" part of your URL
npx supabase db push         # applies supabase/migrations/*.sql
```

What it creates: 15 tables (`profiles, roles, pages, page_sections, services, blogs, blog_categories, blog_tags, blog_post_tags, media, navigation_items, site_settings, seo_metadata, redirects, audit_logs`), indexes, constraints, Row Level Security policies, workflow + audit triggers, the four Storage buckets with their policies, and an import of the content that is live today (7 posts, 7 categories, 16 services, 12 built-in pages, footer links, contact details). No invented content or statistics.

### 3.5 Check the Storage buckets
**Storage** should now list:

| Bucket | Public | Max size | Allowed types |
|---|---|---|---|
| `website-images` | yes | 5 MB | JPG, PNG, WebP, GIF, AVIF |
| `blog-images` | yes | 5 MB | same |
| `service-images` | yes | 5 MB | same |
| `documents` | **no** (signed links) | 10 MB | PDF, DOCX, XLSX, PPTX, TXT, CSV |

Nothing to click — the migration created them and their policies (staff may upload, only Admins may delete). If a bucket is missing, re-run `supabase/setup.sql`.

### 3.6 Configure Authentication
**Authentication → Sign In / Providers** (older dashboards: *Authentication → Providers* and *Settings*):
1. **Email** provider: enabled.
2. **Allow new users to sign up: OFF.** The CMS has no public sign-up; Super Admins create accounts. (Even if someone signs up, they get no role and no access — this just keeps the user list clean.)
3. **Confirm email**: can stay on; users created from the CMS are created already confirmed.
4. **Authentication → URL Configuration → Site URL**: `https://digital.pytron.in` (add `http://localhost:3000` under *Redirect URLs* for local work).
5. Optional hardening: *Authentication → Policies/Passwords* → minimum length 12, require letters + digits; *Attack Protection* → leaked-password protection if available on your plan.

> **Email on the free plan.** Supabase's built-in email service is for testing only and does not deliver to arbitrary addresses at volume. That's why the CMS creates users with a **temporary password** (shared by you, changed by them under *My account*) and Super Admins reset passwords from *Users*. If you later want invite / reset emails, add your own SMTP under *Authentication → Emails → SMTP* (e.g. Resend, which this site already supports for the contact form).

### 3.7 Create the first Super Admin
There is deliberately **no web endpoint** that grants admin rights. Use one of these:

**Option A — dashboard + one SQL line**
1. **Authentication → Users → Add user → Create new user**: your email + a strong password, tick **Auto Confirm User**.
2. **SQL Editor** → run:
   ```sql
   select public.bootstrap_super_admin('you@pytron.io');
   ```
   It returns `Super Admin granted to you@pytron.io`. The function only works while **no Super Admin exists**, and it cannot be called through the public API.

**Option B — script (uses the service-role key from `.env.local`, runs on your machine)**
```bash
SUPER_ADMIN_EMAIL=you@pytron.io SUPER_ADMIN_PASSWORD='choose-a-long-password' npm run cms:create-admin
```

Additional users: sign in → **Users → Add user**.

### 3.8 Run the site locally
```bash
npm install
npm run dev
# open http://localhost:3000/admin/  → sign in
```

### 3.9 Push to GitHub
```bash
git status                      # .env.local must NOT appear
git add -A
git commit -m "Add Supabase CMS"
git push origin main
```

### 3.10 Connect the repository to Vercel (if not already)
Vercel → **Add New → Project** → import the GitHub repo → framework **Next.js** (auto-detected) → no build-setting changes needed.

### 3.11 Add the Vercel environment variables
Vercel → Project → **Settings → Environment Variables**:

| Name | Value | Environments | Sensitive |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Production, Preview, Development | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key | Production, Preview, Development | no |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key | **Production** (add Preview only if you manage users there) | **yes — mark Sensitive** |

Keep the existing ones (`RESEND_API_KEY`, `NEXT_PUBLIC_GA4_ID`, …) as they are. Preview deployments share the same database as production unless you create a second Supabase project for them.

### 3.12 Deploy
Push to `main` (Vercel deploys automatically) or in the Vercel dashboard **Deployments → Redeploy** (environment-variable changes need a redeploy). Then open `https://digital.pytron.in/admin/` and sign in.

---

## 4. Environment variables

| Variable | Required | Where it's used | Exposed to the browser? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | for the CMS | public reads, admin, uploads | yes (public by design) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for the CMS | public reads (RLS-limited), auth | yes (public by design) |
| `SUPABASE_SERVICE_ROLE_KEY` | for user management only | `lib/supabase/admin.ts` (marked `server-only`) and `scripts/create-super-admin.ts` | **never** |

Without the first two, the site runs exactly as before and `/admin` shows a setup notice. Without the service-role key, everything works except creating users, resetting passwords and deleting users (role changes still work).

---

## 5. Commands

```bash
# Local development
npm install
npm run dev                 # http://localhost:3000 and /admin
npm run lint                # ESLint (Next.js core-web-vitals + TypeScript rules)
npm run typecheck           # tsc --noEmit
npm run build && npm start  # production build locally

# Database
#   SQL editor: paste supabase/setup.sql  (or)
npx supabase link --project-ref <ref> && npx supabase db push
npm run cms:generate-import # regenerate the content-import migration + setup.sql from content/*.ts
npm run cms:create-admin    # first Super Admin (see 3.7)

# Production
git push origin main        # Vercel builds and deploys
npx vercel --prod           # alternative, with the Vercel CLI
```

New schema changes later: add a new file `supabase/migrations/<timestamp>_<name>.sql`, run it in the SQL editor (or `db push`), and re-run `npm run cms:generate-import` to refresh `setup.sql`.

---

## 6. Roles and permissions

Enforced in three places: the admin UI (hides what you can't do), every server action (`requireActionRole`) and the database (RLS policies + triggers).

| Capability | Editor | Admin | Super Admin |
|---|:-:|:-:|:-:|
| Sign in, dashboard, preview | ✓ | ✓ | ✓ |
| Create and edit **drafts** (pages, services, posts) | ✓ | ✓ | ✓ |
| Publish / unpublish / archive, edit live content | — | ✓ | ✓ |
| Delete content, categories, tags | — | ✓ | ✓ |
| Upload media, edit alt text | ✓ | ✓ | ✓ |
| Delete media | — | ✓ | ✓ |
| Navigation, SEO overrides, redirects | — | ✓ | ✓ |
| Read audit log | — | ✓ | ✓ |
| Site settings | view: — | view only | ✓ |
| Users and roles | — | — | ✓ |

An account with no role (or deactivated) can sign in but sees "No CMS access". The database refuses to remove or deactivate the last active Super Admin.

---

## 7. What the CMS controls

The rule followed: **the CMS controls content, the code controls layout.**

| Content | In the CMS | Still in code |
|---|---|---|
| Blog | Everything (posts, categories, tags, SEO). Existing posts imported. | Article layout |
| Services | Name, slug, card summary, hero heading + intro, features list ("What's included"), icon, image, button, optional overview text, order, status, SEO. New services get a complete page. | The long-form sections of the 16 original service pages (problem/solution, benefits, process, FAQs, related links) in `content/marketing.ts`, `development.ts`, `ai.ts` |
| Built-in pages (home, about, services, contact, blog, products, work, industries, locations, 3 hubs) | Hero heading, intro and button; SEO. Unpublish the record to fall back to the original copy. On the home page, a new line breaks the heading and `[[words]]` get the gradient highlight. | Their sections and layout |
| New pages | Everything: hero, rich text, 14 blocks (Hero, Text, Image, Image + Text, Features, Cards, Services, Testimonials, CTA, FAQ, Stats, Logo grid, Rich text, Contact) at `/<slug>/` | Block designs (they reuse the site's components) |
| Footer links | All four columns | — |
| Header mega menu | — | `content/site.ts` (keyboard-accessible menu logic). New services still appear on hub pages, `/services/`, the sitemap and the footer if you add them. |
| Contact details & social links | Settings | — |
| Industries, locations, products, case studies, legal pages | SEO overrides only | `content/*.ts` |

Notes:
* Changing the slug of anything that is published creates a permanent (308) redirect automatically (see *SEO → Redirects*).
* A CMS page cannot use a slug that belongs to a built-in route (the database rejects it).
* Testimonials and Stats blocks are labelled "real quotes / verified numbers only".

---

## 8. Free-tier limits — read this

Everything here runs on free tiers **technically**, but check these limits (as listed in October 2026; they change, so confirm on supabase.com/pricing and vercel.com/pricing):

**Supabase Free**
* 500 MB database, **1 GB file storage**, 5 GB egress (+5 GB cached) per month, 50,000 monthly active users, 2 active free projects, max 50 MB per uploaded file (this CMS limits images to 5 MB, documents to 10 MB).
* **A free project pauses after 1 week without activity.** While paused, `/admin` is unavailable and the public site automatically serves its built-in content (CMS-only pages and posts disappear until you restore the project from the dashboard). Regular site traffic normally keeps it active; for business-critical use consider the Pro plan.
* Automatic daily backups are a paid-plan feature — export important data periodically (e.g. `pg_dump` with your database connection string), or upgrade.
* Built-in auth email is for testing only (see 3.6).

**Vercel**
* **The Hobby (free) plan is for non-commercial, personal use only.** A site that advertises a company's services is commercial use under Vercel's fair-use guidelines and needs the **Pro** plan. This applies to the existing site too, not just the CMS.
* Hobby guidelines: 100 GB fast data transfer, 1M function invocations, 5K image transformations per month. The CMS adds little: pages remain static/ISR; uploads go straight to Supabase, not through Vercel.

---

## 9. Testing checklist

Already run against a local Supabase stack (Postgres 16 + Supabase Auth + PostgREST + Storage API) on both `next dev` and the production build — 59 end-to-end checks and 33 database/storage security checks passed, and all 63 public routes rendered identically to the original site. Repeat on your project after setup:

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` succeed
- [ ] `/` and a few service, blog and industry pages look exactly as before
- [ ] `/admin/` while signed out → redirects to `/admin/login/`
- [ ] Wrong password → "Incorrect email or password."
- [ ] Sign in as Super Admin → dashboard shows real counts (7 posts, 16 services, 12 pages)
- [ ] **Page**: create with a FAQ + CTA block → Publish → `/<slug>/` is live; Unpublish → 404
- [ ] **Built-in page**: edit About's intro → `/about/` updates without redeploy; restore it
- [ ] **Blog**: as Editor create a draft with an H2 and tags → not public → Preview shows it → as Admin Publish → live, on `/blog/`, tag page works
- [ ] Change a published post's slug → old URL 308-redirects
- [ ] **Service**: create in AI Solutions → appears on `/ai-solutions/` and `/services/`; reorder with arrows
- [ ] **Media**: upload a JPG/PNG (progress bar) → copy URL works; rename a `.txt` to `.png` and upload → rejected; delete (Admin)
- [ ] **SEO**: override `/about/` title + noindex → `<title>` changes and `/about/` leaves `sitemap.xml`; remove override
- [ ] **Settings**: change phone → footer updates; **Navigation**: add a footer link → appears
- [ ] **Roles**: Editor can't open Users, can't publish, can't edit live posts, sees no Delete; Admin can't edit Settings or roles
- [ ] **Users**: create a user with a temporary password → they sign in → change it under My account; deactivate → they lose access
- [ ] **Audit log** lists sign-ins, publishes, uploads and role changes with the user
- [ ] Admin on a phone: menu drawer, lists without horizontal scrolling
- [ ] Sign out → back to login

---

## 10. Security checklist

- [x] Row Level Security on every CMS table; anonymous users only see `PUBLISHED` content; no `USING (true)` on sensitive tables (only on public taxonomy, settings, SEO and redirects, which contain public information)
- [x] Authorization checked on the server in every admin page, server action and route handler, and again in the database (RLS + triggers)
- [x] Session validated with Supabase Auth (`getUser()`), session cookie `httpOnly`, `secure` in production, `SameSite=Lax`
- [x] Service-role key only in `server-only` modules; never in client code or `NEXT_PUBLIC_*`
- [x] No public "make me admin" endpoint; first admin via SQL editor or local script; the bootstrap function is not executable through the API
- [x] Zod validation on the client *and* again in every server action; database CHECK constraints for slugs, URLs, statuses
- [x] XSS: rich text rendered from JSON through a whitelist; links limited to `http(s)`, `mailto:`, `tel:`, relative paths; `javascript:` URLs rejected
- [x] Uploads: MIME + size checked in the browser, the server action and by the bucket; real type verified from file bytes; server-generated file names (no path traversal); SVG disallowed; private bucket for documents
- [x] CSRF: Server Actions are POST-only with Next.js origin checks; preview can only be enabled by signed-in staff
- [x] Audit log is append-only (no update/delete for anyone through the API) and stores field *names*, never values or secrets
- [x] Admin is `noindex`, blocked in `robots.txt`, and sends `X-Robots-Tag: noindex`
- [x] `.env*.local` and `.env` are git-ignored; `.env.example` contains no real values
- [ ] Your side: keep "Allow new users to sign up" **off**; use strong, unique passwords; rotate keys if leaked (Project Settings → API); upgrade Vercel to Pro for commercial use

---

## 11. Rollback

The CMS is additive, so you can roll back at three levels:

1. **Instant, no code change** — In Vercel remove (or blank) `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and redeploy. The public site serves its original built-in content; `/admin` shows a setup notice.
2. **Previous deployment** — Vercel → Deployments → pick the deployment before the CMS → **⋯ → Promote to Production** (Instant Rollback).
3. **Code** — `git revert <cms-commit>` (or reset to the commit before it) and push.
4. **Database** — to remove the CMS schema, run `supabase/rollback.sql` in the SQL editor (deletes all CMS content and the audit log — export first if needed). Delete the four buckets in *Storage* if you want, and remove CMS users in *Authentication → Users*. Re-running `supabase/setup.sql` recreates everything.

---

## 12. Files created and changed

**Moved (URLs unchanged):** all public routes moved into the `app/(site)/` route group so the admin can have its own layout — `about, ai-solutions, blog, contact, cookie-policy, digital-marketing, industries, locations, page.tsx (home), privacy-policy, products, services, site-map, terms, web-development, work`.

**Changed**
| File | Change |
|---|---|
| `app/layout.tsx` | Now only the document shell; site chrome moved to `app/(site)/layout.tsx` |
| `app/not-found.tsx` | Same 404, rendered with the site chrome |
| `app/sitemap.ts`, `app/robots.ts` | CMS-aware sitemap (published only, noindex removed, hourly ISR); robots blocks `/admin/` |
| `app/globals.css` | Admin design tokens (`adm-` classes) and class-based dark variant (public styles untouched) |
| `app/(site)/**/page.tsx` | Read hero copy / lists / SEO from the CMS with built-in fallback |
| `components/Footer.tsx`, `WhatsAppFloat.tsx` | Receive footer links and contact details as props |
| `components/Hero.tsx` | Heading/intro/button as props (defaults = original) |
| `components/BlogCard.tsx` | Works with CMS and built-in posts; categories passed in |
| `components/PageTemplates.tsx` | Optional CMS overview/CTA on service pages; hub accepts CMS lists; new `CmsServiceView` |
| `components/Icon.tsx` | Exports the list of icon names (for the icon picker) |
| `components/Header.tsx`, `ContactForm.tsx` | Lint-only comments (no behaviour change) |
| `components/ui.tsx`, `app/(site)/products/page.tsx`, `postcss.config.mjs` | Lint clean-ups (no behaviour change) |
| `lib/seo.ts` | Supports OG image, canonical and robots overrides |
| `lib/schema.ts` | Organization data from settings; Article schema for CMS posts |
| `lib/routes.ts` | Async; includes CMS posts, services and pages |
| `package.json` | Supabase, Zod, React Hook Form, Tiptap; `lint` and `cms:*` scripts |
| `.env.example` | Supabase variables |

**Created**
| Path | Purpose |
|---|---|
| `proxy.ts` | Session refresh + login redirect for `/admin` and preview requests |
| `app/(site)/layout.tsx`, `not-found.tsx`, `[slug]/page.tsx`, `blog/tag/[tag]/page.tsx` | Site layout, CMS pages, tag archives |
| `app/admin/**` | Login, dashboard and every CMS screen (+ loading/error states) |
| `app/api/preview/route.ts`, `app/api/preview/exit/route.ts` | Secure preview on/off |
| `components/SiteChrome.tsx`, `NotFoundContent.tsx` | Shared site chrome and 404 content |
| `components/cms/` | `RichText` (safe renderer), `BlockRenderer`, `PreviewBanner`, service route helpers |
| `components/admin/` | Admin shell, UI kit (`ui/`), forms, editors (Tiptap, sections builder), media library/picker, managers |
| `lib/supabase/` | `env`, `public` (anon), `server` (session), `admin` (service role, server-only) clients |
| `lib/cms/` | Types, block definitions, media rules, public data layer (`public/*`), SEO merge |
| `lib/admin/` | Session/role guards, server actions, revalidation, results, formatting, audit labels |
| `lib/schemas/` | Zod schemas shared by forms and server actions |
| `lib/rich-text/text.ts`, `lib/slug.ts` | Text helpers, slugify |
| `supabase/migrations/*.sql` | Schema, workflow/audit triggers, RLS, storage, content import |
| `supabase/setup.sql`, `supabase/rollback.sql` | One-file setup; removal |
| `scripts/generate-content-import.ts`, `scripts/create-super-admin.ts` | Content import generator; first admin |
| `eslint.config.mjs` | Lint configuration |
| `CMS_SETUP.md` | This guide |

### Project structure (CMS parts)
```
app/
  (site)/            public website (unchanged URLs) + [slug] CMS pages + blog/tag
  admin/
    login/
    (panel)/         dashboard, pages, services, blog, blog/categories, media,
                     navigation, seo, settings, users, audit-logs, account
  api/preview/       draft preview on/off
components/
  admin/             shell, ui/, forms/, editors/, media/
  cms/               RichText, BlockRenderer, PreviewBanner
lib/
  supabase/          clients
  cms/               types, blocks, media rules, public/ data layer, seo
  admin/             session, actions/, revalidate, result
  schemas/           zod
supabase/
  migrations/  setup.sql  rollback.sql
scripts/
proxy.ts
```

---

## 13. Troubleshooting

| Symptom | Fix |
|---|---|
| `/admin` says "Connect Supabase to use the CMS" | The two `NEXT_PUBLIC_SUPABASE_*` variables are missing in this environment; add them and redeploy |
| Signed in but "No CMS access yet" | The account has no role — run the bootstrap (3.7) for the first admin, or ask a Super Admin |
| "Could not find a relationship …" / "relation does not exist" in logs | The migration wasn't run (or only partly) — run `supabase/setup.sql` again |
| Public site still shows old content after saving | It refreshes on the next request; hard-refresh. If it persists, check the server logs for `[cms]` messages (the database may be paused) |
| Upload fails with "Network error" | Check the browser console; ensure the bucket exists and the file is an allowed type/size |
| "Add SUPABASE_SERVICE_ROLE_KEY…" on Users | Set the service-role key in Vercel (Production) and redeploy |
| Free project paused | Supabase dashboard → project → **Restore**. The public site keeps working meanwhile with built-in content |
