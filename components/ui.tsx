import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ctas } from "@/content/site";
import type { CtaKey } from "@/content/types";
import { ICON_STROKE } from "./Icon";

type Variant = "primary" | "secondary" | "light" | "ghost-light";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  const external = href.startsWith("http");
  const cls = `btn btn-${variant} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/** A CTA from the brand vocabulary (Section 0). */
export function Cta({
  k,
  variant = "primary",
  className = "",
  href,
}: {
  k: CtaKey;
  variant?: Variant;
  className?: string;
  href?: string;
}) {
  const c = ctas[k];
  return (
    <ButtonLink href={href ?? c.href} variant={variant} className={className}>
      {c.label}
    </ButtonLink>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link-arrow ${className}`}>
      {children}
      <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
    </Link>
  );
}

export function SectionHeader({
  label,
  title,
  copy,
  align = "center",
  as: Tag = "h2",
  id,
  dark = false,
}: {
  label?: string;
  title: string;
  copy?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  id?: string;
  dark?: boolean;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`} data-reveal>
      {label && (
        <p className={`eyebrow eyebrow-dot ${dark ? "text-electric-300" : ""}`}>{label}</p>
      )}
      <Tag id={id} className={`h-section mt-3 ${dark ? "text-white" : ""}`}>
        {title}
      </Tag>
      {copy && <p className={`lead mt-4 ${dark ? "text-slate-300" : ""}`}>{copy}</p>}
    </div>
  );
}

export function CheckList({ items, className = "", dark = false }: { items: string[]; className?: string; dark?: boolean }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              dark ? "bg-white/10 text-electric-300" : "bg-brand-50 text-brand-700"
            }`}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden="true" />
          </span>
          <span className={dark ? "text-slate-200" : "text-muted"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function InlineChecks({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
      {items.map((item) => (
        <li key={item} className={`flex items-center gap-1.5 text-sm font-medium ${dark ? "text-white" : "text-navy-800"}`}>
          <Check
            className={`h-4 w-4 ${dark ? "text-electric-300" : "text-brand-600"}`}
            strokeWidth={ICON_STROKE}
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
