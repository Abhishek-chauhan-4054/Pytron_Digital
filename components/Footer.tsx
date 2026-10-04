import Link from "next/link";
import { brand, footerNav, site } from "@/content/site";
import { Logo } from "./Logo";

function Col({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

const linkCls = "text-slate-300 transition-colors hover:text-white";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-navy-950 text-slate-300">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark />
            <p className="mt-5 text-sm font-semibold text-white">{brand.line}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed">{brand.footerBlurb}</p>
            {site.social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
                {site.social.map((sl) => (
                  <li key={sl.label}>
                    <a
                      href={sl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center rounded-full border border-white/15 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      {sl.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-[1fr_1fr_1fr_1.45fr] lg:col-span-8">
            <Col title="Services">
              {footerNav.services.map((l) => (
                <li key={l.label}>
                  <Link className={linkCls} href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </Col>
            <Col title="Solutions">
              {footerNav.solutions.map((l) => (
                <li key={l.label}>
                  <Link className={linkCls} href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </Col>
            <Col title="Company">
              {footerNav.company.map((l) => (
                <li key={l.label}>
                  {"external" in l && l.external ? (
                    <a className={linkCls} href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ) : (
                    <Link className={linkCls} href={l.href}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </Col>
            <Col title="Contact" className="col-span-2 sm:col-span-1">
              <li>
                <a className={`${linkCls} break-words`} href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a className={linkCls} href={site.contact.phoneHref}>
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li>
                {site.location.city}, {site.location.country}
              </li>
              <li className="pt-2">
                <span className="block text-xs font-semibold tracking-wide text-slate-400 uppercase">Operations</span>
                <span className="mt-1 block text-white">{site.operations.name}</span>
                <a className={`${linkCls} break-words`} href={`mailto:${site.operations.email}`}>
                  {site.operations.email}
                </a>
              </li>
            </Col>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {footerNav.legal.map((l) => (
              <li key={l.label}>
                <Link className={linkCls} href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
