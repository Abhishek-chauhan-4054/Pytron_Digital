import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ctas } from "@/content/site";
import { industries } from "@/content/industries";
import type { CtaKey, FAQItem, IconName, ServiceHub, ServicePage, TitledText, Workflow } from "@/content/types";
import { IndustryCard, ServiceCard } from "./Cards";
import { Icon, ICON_STROKE } from "./Icon";
import { Breadcrumbs, CTASection, FAQ, ProcessTimeline } from "./Sections";
import { ButtonLink, CheckList, JsonLd, SectionHeader } from "./ui";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

/** "The problem: x" → "X" (the card already carries a "The Problem" label). */
function stripLabel(h: string) {
  const t = h.replace(/^the problem:\s*/i, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

type Tone = "white" | "surface";
const flip = (t: Tone): Tone => (t === "white" ? "surface" : "white");
const bg = (t: Tone) => (t === "surface" ? "bg-surface" : "");

export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  cta,
  secondary,
  children,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  cta?: { label: string; href: string };
  secondary?: { label: string; href: string };
  children?: React.ReactNode;
  /** Optional right-hand visual on large screens */
  aside?: React.ReactNode;
}) {
  return (
    <section className="on-dark hero-dark relative overflow-hidden">
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div className="container-x relative pt-8 pb-16 sm:pt-10 sm:pb-20">
        <Breadcrumbs items={crumbs} dark />
        <div className={`mt-10 ${aside ? "grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]" : ""}`}>
          <div className="max-w-3xl">
            {eyebrow && <p className="eyebrow-light">{eyebrow}</p>}
            <h1 className="mt-4 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-white sm:text-5xl">{title}</h1>
            {intro && <p className="mt-5 text-[1.075rem] leading-relaxed text-slate-300 sm:text-lg">{intro}</p>}
            {(cta || secondary) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {cta && (
                  <ButtonLink href={cta.href} className="w-full sm:w-auto">
                    {cta.label}
                  </ButtonLink>
                )}
                {secondary && (
                  <ButtonLink href={secondary.href} variant="ghost-light" className="w-full sm:w-auto">
                    {secondary.label}
                  </ButtonLink>
                )}
              </div>
            )}
            {children}
          </div>
          {aside && <div className="hidden lg:block">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

/** Decorative-but-informative hero panel: service icon plus what's included. */
export function HeroPanel({ icon, title, items }: { icon: IconName; title: string; items: string[] }) {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[28px] bg-brand-600/20 blur-2xl" />
      <div className="relative rounded-2xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-700 shadow-lg">
            <Icon name={icon} className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-electric-300 uppercase">Included</p>
            <p className="font-semibold text-white">{title}</p>
          </div>
        </div>
        <ul className="mt-5 space-y-2.5">
          {items.slice(0, 5).map((it) => (
            <li key={it} className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-400" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TitledGrid({ items, cols = 4 }: { items: TitledText[]; cols?: 2 | 3 | 4 }) {
  const colCls = cols === 2 ? "md:grid-cols-2" : cols === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid gap-5 ${colCls}`}>
      {items.map((b) => (
        <article key={b.title} className="card h-full" data-reveal>
          <h3 className="h-card">{b.title}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{b.text}</p>
        </article>
      ))}
    </div>
  );
}

export function WorkflowExamples({
  items,
  heading = "Before → after: real workflow examples",
  tone = "surface",
}: {
  items: Workflow[];
  heading?: string;
  tone?: "white" | "surface";
}) {
  return (
    <section className={`section ${tone === "surface" ? "bg-surface" : ""}`} aria-labelledby="workflows-title">
      <div className="container-x">
        <SectionHeader id="workflows-title" label="Workflow Examples" title={heading} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {items.map((w) => (
            <article key={w.title} className="card h-full" data-reveal>
              <h3 className="h-card">{w.title}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                <div className="rounded-xl border border-line bg-surface p-4">
                  <p className="text-xs font-semibold tracking-wide text-subtle uppercase">Before</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{w.before}</p>
                </div>
                <span className="flex items-center justify-center text-brand-600" aria-hidden="true">
                  <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" strokeWidth={ICON_STROKE} />
                </span>
                <div className="rounded-xl border border-brand-100 bg-brand-50/70 p-4">
                  <p className="text-xs font-semibold tracking-wide text-brand-800 uppercase">After</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-800">{w.after}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const pillarMeta: Record<ServiceHub["pillar"], { name: string; path: string; cta: CtaKey }> = {
  marketing: { name: "Digital Marketing", path: "/digital-marketing/", cta: "marketing" },
  web: { name: "Web Development", path: "/web-development/", cta: "web" },
  ai: { name: "AI Solutions", path: "/ai-solutions/", cta: "ai" },
};

const hubServicesTitle: Record<ServiceHub["pillar"], string> = {
  marketing: "Our digital marketing services",
  web: "Our web development services",
  ai: "Our AI and automation services",
};

/** Generic service detail page (marketing, web development, AI). */
export function ServicePageView({ page, pillar }: { page: ServicePage; pillar: ServiceHub["pillar"] }) {
  const pm = pillarMeta[pillar];
  const path = `${pm.path}${page.slug}/`;
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: pm.name, path: pm.path },
    { name: page.label, path },
  ];
  const cta = ctas[pm.cta];
  const rel = industries.filter((i) => page.industries.includes(i.slug));

  // Alternate backgrounds after "What's included" (surface) so no two adjacent sections match.
  let t: Tone = "surface";
  const tones = { workflows: "white" as Tone, extra: "white" as Tone, industries: "white" as Tone, faq: "white" as Tone };
  if (page.workflows) tones.workflows = t = flip(t);
  if (page.extraSections?.length) tones.extra = t = flip(t);
  if (rel.length) tones.industries = t = flip(t);
  tones.faq = flip(t);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({ name: page.label, description: page.meta.description, path }),
          breadcrumbSchema(crumbs),
          faqSchema(page.faqs),
        ]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={pm.name}
        title={page.h1}
        intro={page.intro}
        cta={cta}
        secondary={{ label: "See Our Work", href: "/work/" }}
        aside={<HeroPanel icon={page.icon} title={page.label} items={page.included} />}
      />

      {/* Problem / Solution */}
      <section className="section" aria-label="Problem and solution">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <article className="card" data-reveal>
            <p className="eyebrow">The Problem</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{stripLabel(page.problem.heading)}</h2>
            {page.problem.body.map((p) => (
              <p key={p} className="prose-body mt-4">
                {p}
              </p>
            ))}
            {page.problem.points && (
              <ul className="mt-5 space-y-2.5">
                {page.problem.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-muted">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600" aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>
            )}
          </article>
          <article className="card border-brand-100 bg-gradient-to-b from-brand-50/60 to-white" data-reveal>
            <p className="eyebrow">Our Solution</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{page.solution.heading}</h2>
            {page.solution.body.map((p) => (
              <p key={p} className="prose-body mt-4">
                {p}
              </p>
            ))}
          </article>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-surface" aria-labelledby="benefits-title">
        <div className="container-x">
          <SectionHeader id="benefits-title" label="Benefits" title={`Benefits of ${page.label}`} />
          <div className="mt-12">
            <TitledGrid items={page.benefits} />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section" aria-labelledby="process-title">
        <div className="container-x">
          <SectionHeader id="process-title" label="Process" title="How we deliver it" copy="A clear process, so you always know what's happening, what's next and why." />
          <ProcessTimeline steps={page.process} />
        </div>
      </section>

      {/* Included */}
      <section className="section bg-surface" aria-labelledby="included-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <p className="eyebrow eyebrow-dot">What&apos;s Included</p>
            <h2 id="included-title" className="h-section mt-3">
              Everything you get with {page.label}
            </h2>
            <p className="lead mt-4">Scope is tailored to your goals in the proposal. These are the building blocks.</p>
            <div className="mt-7">
              <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
            </div>
          </div>
          <div className="card" data-reveal>
            <CheckList items={page.included} />
          </div>
        </div>
      </section>

      {page.workflows && <WorkflowExamples items={page.workflows} tone={tones.workflows} />}

      {page.extraSections?.map((s) => (
        <section key={s.id} id={s.id} className={`section ${bg(tones.extra)}`} aria-labelledby={`${s.id}-title`}>
          <div className="container-x grid gap-10 lg:grid-cols-2">
            <div data-reveal>
              <h2 id={`${s.id}-title`} className="h-section">
                {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="prose-body mt-4">
                  {p}
                </p>
              ))}
            </div>
            {s.points && (
              <div className="card" data-reveal>
                <CheckList items={s.points} />
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Industries */}
      {rel.length > 0 && (
        <section className={`section ${bg(tones.industries)}`} aria-labelledby="industries-title">
          <div className="container-x">
            <SectionHeader id="industries-title" label="Industries" title={`Industries we help with ${page.label}`} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rel.map((i) => (
                <IndustryCard key={i.slug} name={i.name} summary={i.summary} href={`/industries/${i.slug}/`} icon={i.icon} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQ items={page.faqs} title={`${page.label} FAQs`} tone={tones.faq} />

      <RelatedLinks links={page.related} />

      <CTASection primary={{ label: cta.label, href: cta.href }} secondary={{ label: "Explore What We Do", href: "/services/" }} />
    </>
  );
}

export function RelatedLinks({ links, title = "Related services and reading" }: { links: { label: string; href: string }[]; title?: string }) {
  return (
    <section className="pt-12 pb-4" aria-labelledby="related-title">
      <div className="container-x">
        <div className="rounded-[var(--radius-card)] border border-line p-6 sm:p-8">
          <h2 id="related-title" className="text-lg font-semibold">
            {title}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-arrow text-sm">
                  {l.label}
                  <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Hub page for a service pillar. */
export function ServiceHubView({ hub, pages }: { hub: ServiceHub; pages: ServicePage[] }) {
  const pm = pillarMeta[hub.pillar];
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: pm.name, path: pm.path },
  ];
  const cta = ctas[pm.cta];
  // services (white) → pillars (surface) → approach (white) → alternate from there.
  let ht: Tone = "white";
  const htones = { extra: "white" as Tone, workflows: "white" as Tone, industries: "white" as Tone, faq: "white" as Tone };
  if (hub.extraSections?.length) htones.extra = ht = flip(ht);
  if (hub.workflows) htones.workflows = ht = flip(ht);
  htones.industries = ht = flip(ht);
  htones.faq = flip(ht);
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({ name: pm.name, description: hub.meta.description, path: pm.path }),
          breadcrumbSchema(crumbs),
          faqSchema(hub.faqs),
        ]}
      />
      <PageHero crumbs={crumbs} eyebrow={hub.eyebrow} title={hub.h1} intro={hub.intro} cta={cta} secondary={{ label: "See Our Work", href: "/work/" }} />

      <section className="section" aria-labelledby="services-title" id="services">
        <div className="container-x">
          <SectionHeader id="services-title" label="Services" title={hubServicesTitle[hub.pillar]} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((p) => (
              <ServiceCard key={p.slug} title={p.label} text={p.summary} href={`${pm.path}${p.slug}/`} icon={p.icon} />
            ))}
          </div>
        </div>
      </section>

      {hub.pillars && (
        <section className="section bg-surface" aria-labelledby="pillars-title">
          <div className="container-x">
            <SectionHeader id="pillars-title" label="What We Focus On" title={hub.pillar === "web" ? "Built around seven things that matter" : hub.pillar === "ai" ? "Practical use cases, not hype" : "Three jobs every marketing plan must do"} />
            <div className="mt-12">
              <TitledGrid items={hub.pillars} cols={hub.pillars.length === 3 ? 3 : 4} />
            </div>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="approach-title">
        <div className="container-x max-w-3xl" data-reveal>
          <h2 id="approach-title" className="h-section">
            {hub.approach.heading}
          </h2>
          {hub.approach.body.map((p) => (
            <p key={p} className="prose-body mt-5 text-[1.05rem]">
              {p}
            </p>
          ))}
        </div>
      </section>

      {hub.extraSections?.map((s) => (
        <section key={s.id} id={s.id} className={`section ${bg(htones.extra)}`} aria-labelledby={`${s.id}-title`}>
          <div className="container-x grid gap-10 lg:grid-cols-2">
            <div data-reveal>
              <h2 id={`${s.id}-title`} className="h-section">
                {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p} className="prose-body mt-4">
                  {p}
                </p>
              ))}
            </div>
            {s.points && (
              <div className="card" data-reveal>
                <CheckList items={s.points} />
              </div>
            )}
          </div>
        </section>
      ))}

      {hub.workflows && <WorkflowExamples items={hub.workflows} tone={htones.workflows} />}

      <section className={`section ${bg(htones.industries)}`} aria-labelledby="hub-ind-title">
        <div className="container-x">
          <SectionHeader id="hub-ind-title" label="Industries" title="Industries we help" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((i) => (
              <IndustryCard key={i.slug} name={i.name} summary={i.summary} href={`/industries/${i.slug}/`} icon={i.icon} />
            ))}
          </div>
        </div>
      </section>

      <FAQ items={hub.faqs} title={`${pm.name} FAQs`} tone={htones.faq} />
      <CTASection primary={{ label: cta.label, href: cta.href }} secondary={{ label: "Explore What We Do", href: "/services/" }} />
    </>
  );
}

export function FaqOnlyJson({ faqs }: { faqs: FAQItem[] }) {
  return <JsonLd data={faqSchema(faqs)} />;
}

export function IconBullet({ icon, title, text }: { icon: Parameters<typeof Icon>[0]["name"]; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="icon-tile">
        <Icon name={icon} />
      </span>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}
