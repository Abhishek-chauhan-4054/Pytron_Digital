import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Clock } from "lucide-react";
import { CaseStudyCover, ProductPreview } from "./Visuals";
import { ButtonLink } from "./ui";
import type { CaseStudy, IconName, Product } from "@/content/types";
import { Icon, ICON_STROKE } from "./Icon";

export function ServiceCard({
  title,
  text,
  href,
  icon,
  cta = "Learn More",
}: {
  title: string;
  text: string;
  href: string;
  icon: IconName;
  cta?: string;
}) {
  return (
    <article className="card card-hover group relative flex h-full flex-col" data-reveal>
      <span className="icon-tile">
        <Icon name={icon} />
      </span>
      <h3 className="h-card mt-5">
        <Link href={href} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none">
          {title}
        </Link>
      </h3>
      <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-muted">{text}</p>
      <span className="link-arrow mt-6 text-sm" aria-hidden="true">
        {cta}
        <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} />
      </span>
    </article>
  );
}

export function IndustryCard({ name, summary, href, icon }: { name: string; summary: string; href: string; icon: IconName }) {
  return (
    <article className="card card-hover group relative flex h-full flex-col p-6" data-reveal>
      <div className="flex items-center gap-3">
        <span className="icon-tile h-10 w-10">
          <Icon name={icon} />
        </span>
        <h3 className="text-base font-semibold">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]">
            {name}
          </Link>
        </h3>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{summary}</p>
      <span className="link-arrow mt-4 text-sm" aria-hidden="true">
        Learn More
        <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} />
      </span>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const live = product.status === "live" && product.url;
  const id = `p-${product.name.replace(/\W+/g, "-")}`;
  return (
    <article className="card card-hover flex h-full flex-col p-5 sm:p-6" data-reveal aria-labelledby={id}>
      <ProductPreview product={product} />
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="icon-tile h-9 w-9 rounded-lg">
            <Icon name={product.icon} className="h-4.5 w-4.5" />
          </span>
          <h3 id={id} className="h-card">
            {product.name}
          </h3>
        </div>
        {live ? (
          <span className="badge shrink-0 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Live
          </span>
        ) : (
          <span className="badge shrink-0 bg-surface-2 text-navy-700 ring-1 ring-line">
            <Clock className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden="true" />
            Coming Soon
          </span>
        )}
      </div>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{product.description}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Markets">
        {product.markets.map((m) => (
          <li key={m} className="badge bg-brand-50 text-brand-800 ring-1 ring-brand-100">
            {m}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        {live ? (
          <a href={product.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            Try It Free
            <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <button type="button" disabled className="btn w-full" aria-label={`${product.name} is coming soon`}>
            Coming Soon
          </button>
        )}
      </div>
    </article>
  );
}

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const rows: [string, React.ReactNode][] = [
    ["Industry", study.industry],
    ["Solution", study.solution],
    ["Services", study.services.join(" · ")],
  ];
  if (study.technology.length) rows.push(["Technology", study.technology.join(" · ")]);
  const external = study.url?.startsWith("http");
  return (
    <article className="card flex h-full flex-col p-5 sm:p-6" data-reveal>
      <CaseStudyCover study={study} />
      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="h-card">{study.project}</h3>
        {study.outcomeType === "coming-soon" ? (
          <span className="badge shrink-0 bg-surface-2 text-navy-700 ring-1 ring-line">Case Study Coming Soon</span>
        ) : (
          <span className="badge shrink-0 bg-brand-50 text-brand-800 ring-1 ring-brand-100">
            <BadgeCheck className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden="true" />
            Real project
          </span>
        )}
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[96px_1fr] gap-3">
            <dt className="font-semibold text-navy-900">{k}</dt>
            <dd className="text-muted">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex-1 rounded-xl border border-line bg-surface p-4">
        <p className="text-xs font-semibold tracking-wide text-navy-900 uppercase">Outcome</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{study.outcome}</p>
      </div>
      {external && (
        <a href={study.url} target="_blank" rel="noopener noreferrer" className="link-arrow mt-5 text-sm">
          Visit website
          <ArrowUpRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </article>
  );
}

export function CapabilityBadges({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((c) => (
        <li
          key={c}
          className={
            dark
              ? "inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-medium text-white"
              : "chip"
          }
        >
          {c}
        </li>
      ))}
    </ul>
  );
}

/** Dark "build your own tool" card shown at the end of product grids. */
export function IdeaCard({ title, text, cta }: { title: string; text: string; cta: { label: string; href: string } }) {
  const kinds = ["Calculators", "Finders", "Eligibility checkers", "Test prep", "Internal tools", "Dashboards"];
  return (
    <article className="on-dark hero-dark relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]" data-reveal>
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div className="relative flex h-full flex-col">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-electric-300 ring-1 ring-white/15">
          <Icon name="lightbulb" />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-300">{text}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {kinds.map((k) => (
            <li key={k} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-200">
              {k}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <ButtonLink href={cta.href} variant="light" className="w-full">
            {cta.label}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
