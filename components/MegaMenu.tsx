import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { marketingMenu, type NavLink } from "@/content/site";
import { ICON_STROKE } from "./Icon";

/** Small illustrative chart. Clearly labelled and never shown with a figure. */
function IllustrativeChart() {
  return (
    <figure className="mt-5 rounded-xl border border-line bg-white p-4">
      <svg viewBox="0 0 240 90" className="h-20 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="mm-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a6cf4" stopOpacity="0.22" />
            <stop offset="1" stopColor="#3a6cf4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 45, 70].map((y) => (
          <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="#e2e8f5" strokeWidth="1" />
        ))}
        <path d="M0 78 C30 74 45 66 70 62 S115 52 140 40 S190 24 240 12 V90 H0 Z" fill="url(#mm-area)" />
        <path d="M0 78 C30 74 45 66 70 62 S115 52 140 40 S190 24 240 12" fill="none" stroke="#2457e6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <figcaption className="mt-2 flex items-center justify-between text-xs">
        <span className="font-medium text-navy-800">Growth trend</span>
        <span className="badge bg-surface-2 text-muted">Illustrative</span>
      </figcaption>
    </figure>
  );
}

export function MegaMenuPanel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid grid-cols-12 gap-8 p-8">
      <div className="col-span-4 rounded-2xl bg-surface p-6">
        <p className="text-lg font-semibold text-navy-900">{marketingMenu.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{marketingMenu.text}</p>
        <IllustrativeChart />
        <Link href={marketingMenu.cta.href} onClick={onNavigate} className="link-arrow mt-5 text-sm" data-menu-item>
          {marketingMenu.cta.label}
          <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
        </Link>
      </div>
      <div className="col-span-5">
        <p className="text-xs font-semibold tracking-[0.12em] text-subtle uppercase">Our Marketing Services</p>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
          {marketingMenu.services.map((s: NavLink) => (
            <li key={s.label}>
              <Link
                href={s.href}
                onClick={onNavigate}
                data-menu-item
                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-surface focus-visible:bg-surface"
              >
                <span className="block text-sm font-semibold text-navy-900">{s.label}</span>
                <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted">{s.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-3">
        <p className="text-xs font-semibold tracking-[0.12em] text-subtle uppercase">Industries We Help</p>
        <ul className="mt-4 space-y-0.5">
          {marketingMenu.industries.map((i) => (
            <li key={i.label}>
              <Link
                href={i.href}
                onClick={onNavigate}
                data-menu-item
                className="block rounded-lg px-3 py-1.5 text-sm font-medium text-navy-800 transition-colors hover:bg-surface hover:text-brand-700"
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={marketingMenu.allCta.href} onClick={onNavigate} data-menu-item className="link-arrow mt-4 px-3 text-sm">
          {marketingMenu.allCta.label}
          <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function DropdownPanel({ links, onNavigate }: { links: NavLink[]; onNavigate?: () => void }) {
  return (
    <ul className="p-2">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            onClick={onNavigate}
            data-menu-item
            className="block rounded-lg px-3.5 py-2.5 transition-colors hover:bg-surface focus-visible:bg-surface"
          >
            <span className="block text-sm font-semibold text-navy-900">{l.label}</span>
            {l.description && <span className="mt-0.5 block text-[0.8rem] text-muted">{l.description}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
