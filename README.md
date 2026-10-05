# Pytron Digital — digital.pytron.in

Marketing site for Pytron Digital, built from the Master Website Build Prompt (v2).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Lucide icons · Geist (self-hosted via `geist`) · static generation + ISR · Supabase (CMS).

## CMS

Content is managed at **`/admin`** (pages, services, blog, media, navigation, SEO, settings, users, audit log), backed by Supabase. **Setup, roles, limits and rollback: see [`CMS_SETUP.md`](./CMS_SETUP.md).**

Without the Supabase environment variables the site runs exactly as before from `content/*.ts`. Once the CMS is connected, the database is the source of truth for blog posts, services (cards, hero, features, SEO), the hero copy and SEO of the main pages, footer links and contact details — edit those in `/admin`, not in the files below (the files remain the fallback and the source for long-form service sections, industries, locations, products and case studies).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # production build
npm start
```

## Deploy (Vercel → digital.pytron.in)

1. Push this folder to the repo and import it in Vercel (framework preset: Next.js).
2. Add the domain `digital.pytron.in` in Project → Domains.
3. Optional env vars for contact-form email (see `.env.example`):
   - `RESEND_API_KEY` — without it, submissions are validated and written to the server log only.
   - `CONTACT_TO_EMAIL` (default `business@pytron.io`), `CONTACT_FROM_EMAIL` (must be a domain verified in Resend).

## Quick edits (no coding needed)

| I want to… | Edit this | How |
|---|---|---|
| Make a product **Live** | `content/links.ts` → `productLinks` | Paste the product URL into `url`. Card switches from *Coming Soon* to *Live* + *Try It Free →*. |
| Add a project's website link | `content/links.ts` → `projectLinks` | Paste the URL. A *Visit website ↗* link appears and the browser bar shows the domain. |
| Show a real screenshot | `public/products/` or `public/work/` + `content/links.ts` | Drop the image (16:10 PNG/JPG/WebP, ~1600px wide) in the folder, then set `image: "/products/driveready.png"`. Replaces the built-in illustration. |
| Add founder photo | `public/team/` + `content/links.ts` → `founderPhoto` | e.g. `"/team/pardeep-kumar.jpg"` (square image). |
| Add LinkedIn / Instagram / etc. | `content/links.ts` → `socialLinks` | Filled ones appear in the footer and in the Organization schema. |
| Use Calendly / Cal.com | `content/links.ts` → `bookingUrl` | Every *Book a Free Consultation →* button opens it. |
| Change any text | `content/*.ts` | All copy lives there (see table below). |

After editing: commit and push — Vercel redeploys automatically.

## Integrations (environment variables)

Set these in **Vercel → Project → Settings → Environment Variables** (or `.env.local` locally). All optional — see `.env.example`.

| Variable | What it does |
|---|---|
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Emails every contact-form inquiry (reply-to = the client). |
| `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET` | POSTs every inquiry as JSON to any webhook: Zapier, Make, n8n, HubSpot/Zoho workflow, Google Sheets (Apps Script), Slack. Works together with email. |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity |

Notes:
- Tags load only when their ID is set. A successful form submission fires `generate_lead` (GA4/GTM) and `Lead` (Meta).
- When any analytics ID is set, the Cookie Policy and Privacy Policy pages automatically add an analytics section. If you serve UK/EU visitors, add a consent banner (e.g. through GTM consent mode) before turning ads tags on.
- Webhook payload: `{ name, company, email, country, website, needs[], budget, details, source, submittedAt }`.

## Where the copy lives

| File | What it controls |
|---|---|
| `content/links.ts` | **All links, screenshots, social, booking URL, founder photo** |
| `content/site.ts` | Brand system (Section 0), contact details, CTA vocabulary, nav, mega menu, footer |
| `content/home.ts` | Homepage sections, sample dashboard data |
| `content/products.ts` | Product names, descriptions, markets (status comes from `links.ts`) |
| `content/work.ts` | Case studies. Add `technology` once confirmed; only add verified outcome numbers |
| `content/marketing.ts`, `development.ts`, `ai.ts` | Service hubs and service pages |
| `content/industries.ts`, `locations.ts` | Industry and market pages |
| `content/blog.ts` | Blog posts (sections drive the table of contents; read time is calculated) |
| `content/pages.ts` | About, Contact, Services overview, Privacy, Terms, Cookie Policy |
| `lib/config.ts` | Reads the integration environment variables |
| `app/globals.css` | Colors, fonts, buttons, cards (design tokens at the top) |

Real testimonials: pass them to `<TestimonialsOrPartnership testimonials={[...]} />` (homepage and /work). Layout stays the same.

## What's included

- Header with mega menu (Digital Marketing) and dropdowns (Web Development, AI Solutions); full keyboard support (Tab, Enter, Esc, arrows, Home/End); mobile accordion menu.
- Pages: home, services overview, 7 marketing pages, 5 web development pages (incl. UI/UX design), 4 AI pages, 9 industries, 6 markets + 4 market-specific service pages, products, work, about, contact, blog (7 posts + category pages), legal pages, HTML sitemap, 404.
- SEO: unique titles/descriptions, canonicals, Open Graph/X cards (`public/og-default.png`), `sitemap.xml`, `robots.txt`, JSON-LD (Organization, WebSite, Service, BreadcrumbList, FAQPage, Article), hreflang on the six market pages only.
- Contact form: inline validation, error summary, loading/success states, honeypot, server-side validation, basic rate limiting. No captcha.
- Accessibility: skip link, landmarks, visible focus, labelled fields, AA contrast; axe checks pass on desktop and mobile.
- Motion: header shadow, menu fade, card lift, one-time scroll reveal, chart draw-in, growth-flow highlight — all disabled under `prefers-reduced-motion`.

## Before launch — please confirm

- **Products:** all five show *Coming Soon* until you paste their URLs in `content/links.ts`.
- **Work:** add project links/screenshots in `content/links.ts`; add the tech stack for Nachwal Solar and HimalayanRoutes in `content/work.ts` if you want it shown.
- **Legal pages:** written as sensible defaults (no analytics/ad cookies). Have them reviewed, and update the Cookie Policy if you add analytics.
- **Blog dates** are set to 2026-10-04; adjust to your real publish dates.
