import Link from "next/link";
import { ChevronDown, ChevronRight, Globe } from "lucide-react";
import { differentiator, finalCta, globalSection, partnership, processSection, whyPytron } from "@/content/home";
import { ctas } from "@/content/site";
import type { FAQItem } from "@/content/types";
import { Icon, ICON_STROKE } from "./Icon";
import { ButtonLink, InlineChecks, SectionHeader } from "./ui";

/* ---------------- Growth flow ---------------- */
export function GrowthFlow() {
  const steps = differentiator.steps;
  return (
    <ol className="relative mt-14 grid gap-4 lg:grid-cols-6 lg:gap-3" aria-label="How marketing and technology connect">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 lg:flex-col lg:gap-0">
          {/* connector */}
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute top-14 bottom-[-1rem] left-[27px] w-px bg-line-strong lg:top-[27px] lg:bottom-auto lg:left-[calc(50%+34px)] lg:h-px lg:w-[calc(100%-68px+0.75rem)]"
            />
          )}
          <span
            className="flow-step relative z-[1] inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-white text-brand-700 shadow-[var(--shadow-card)] lg:mx-auto"
            style={{ animationDelay: `${i * 1.2}s` }}
          >
            <Icon name={s.icon} className="h-6 w-6" />
          </span>
          <div className="pb-2 lg:mt-4 lg:text-center">
            <p className="text-xs font-semibold text-subtle">0{i + 1}</p>
            <h3 className="text-base font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm leading-snug text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Differentiator({ tone = "white" }: { tone?: "white" | "surface" }) {
  return (
    <section className={`section ${tone === "surface" ? "bg-surface" : ""}`} aria-labelledby="diff-title">
      <div className="container-x">
        <SectionHeader id="diff-title" label={differentiator.label} title={differentiator.h2} copy={differentiator.copy} />
        <GrowthFlow />
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
export function ProcessTimeline({ steps = processSection.steps }: { steps?: { title: string; text: string }[] }) {
  return (
    <ol className="relative mt-14 grid gap-8 lg:grid-cols-5 lg:gap-6">
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-5 w-px bg-line-strong lg:top-5 lg:right-[10%] lg:bottom-auto lg:left-[10%] lg:h-px lg:w-auto" />
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 lg:flex-col lg:gap-0" data-reveal>
          <span className="relative z-[1] inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white text-sm font-semibold text-brand-700 lg:mx-auto">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="lg:mt-5 lg:text-center">
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProcessSection() {
  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container-x">
        <SectionHeader id="process-title" label={processSection.label} title={processSection.h2} copy={processSection.copy} />
        <ProcessTimeline />
      </div>
    </section>
  );
}

/* ---------------- Why Pytron (dark) ---------------- */
export function WhyPytron() {
  return (
    <section className="on-dark section relative overflow-hidden bg-navy-900" aria-labelledby="why-title">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="container-x relative">
        <SectionHeader id="why-title" title={whyPytron.h2} copy={whyPytron.copy} dark />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyPytron.pillars.map((p) => (
            <article key={p.title} className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-6" data-reveal>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-electric-300">
                <Icon name={p.icon} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-300">{p.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <ButtonLink href={whyPytron.cta.href} variant="light">
            {whyPytron.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials or Partnership (swappable) ---------------- */
export type Testimonial = { quote: string; name: string; role: string; company: string };

/**
 * Renders real testimonials when provided; otherwise the partnership section.
 * Never pass invented testimonials. Layout stays identical either way.
 */
export function TestimonialsOrPartnership({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  const hasTestimonials = testimonials.length > 0;
  return (
    <section className="section" aria-labelledby="partner-title">
      <div className="container-x">
        {hasTestimonials ? (
          <>
            <SectionHeader id="partner-title" label="Client Stories" title="What Our Clients Say" />
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {testimonials.slice(0, 4).map((t) => (
                <figure key={t.name} className="card h-full" data-reveal>
                  <blockquote className="text-[0.95rem] leading-relaxed text-navy-800">{t.quote}</blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="block font-semibold text-navy-900">{t.name}</span>
                    <span className="text-muted">
                      {t.role}, {t.company}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : (
          <>
            <SectionHeader id="partner-title" label="Partnership" title={partnership.h2} copy={partnership.copy} />
            <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {partnership.stages.map((s, i) => (
                <li key={s.title} className="card h-full" data-reveal>
                  <p className="text-sm font-semibold text-brand-700">Stage {i + 1}</p>
                  <h3 className="h-card mt-2">{s.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------------- Global strip ---------------- */
export function GlobalStrip() {
  return (
    <section className="section bg-surface" aria-labelledby="global-title">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div data-reveal>
          <p className="eyebrow eyebrow-dot">International</p>
          <h2 id="global-title" className="h-section mt-3">
            {globalSection.h2}
          </h2>
          <p className="lead mt-4">{globalSection.copy}</p>
          <p className="mt-5 inline-flex items-start gap-2 text-sm text-muted">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" strokeWidth={ICON_STROKE} aria-hidden="true" />
            {globalSection.note}
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-reveal>
          {globalSection.markets.map((m) => (
            <li key={m.label}>
              <Link
                href={m.href}
                className="group flex min-h-16 items-center justify-between rounded-xl border border-line bg-white px-5 py-4 font-semibold text-navy-900 shadow-[var(--shadow-card)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-brand-200"
              >
                {m.label}
                <ChevronRight className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5" strokeWidth={ICON_STROKE} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Final CTA (gradient panel) ---------------- */
export function CTASection({
  title = finalCta.h2,
  copy = finalCta.copy,
  primary = { label: ctas.consult.label, href: ctas.consult.href },
  secondary = finalCta.secondary,
}: {
  title?: string;
  copy?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
}) {
  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="container-x">
        <div className="on-dark relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-14 text-center sm:px-12 sm:py-16" data-reveal>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_20%_0%,rgb(255_255_255/0.18),transparent_45%),radial-gradient(circle_at_90%_100%,rgb(255_255_255/0.12),transparent_40%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 id="cta-title" className="h-section text-white">
              {title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/90">{copy}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={primary.href} variant="light" className="w-full sm:w-auto">
                {primary.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="ghost-light" className="w-full sm:w-auto">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
            <div className="mt-8 flex justify-center">
              <InlineChecks items={finalCta.checks} dark />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function FAQ({
  items,
  title = "Frequently Asked Questions",
  id = "faq",
  tone = "white",
}: {
  items: FAQItem[];
  title?: string;
  id?: string;
  tone?: "white" | "surface";
}) {
  return (
    <section className={`section ${tone === "surface" ? "bg-surface" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow eyebrow-dot">FAQs</p>
          <h2 id={`${id}-title`} className="h-section mt-3">
            {title}
          </h2>
        </div>
        <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
          {items.map((f) => (
            <details key={f.q} className="group px-5 sm:px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-subtle transition-transform group-open:rotate-180" strokeWidth={ICON_STROKE} aria-hidden="true" />
              </summary>
              <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Breadcrumbs ---------------- */
export function Breadcrumbs({ items, dark = false }: { items: { name: string; path: string }[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className={`flex flex-wrap items-center gap-1.5 ${dark ? "text-slate-400" : "text-subtle"}`}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={`font-medium ${dark ? "text-white" : "text-navy-800"}`}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className={dark ? "hover:text-white" : "hover:text-brand-700"}>
                    {item.name}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
