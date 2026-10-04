import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { ICON_STROKE } from "@/components/Icon";
import { PageHero } from "@/components/PageTemplates";
import { JsonLd } from "@/components/ui";
import { contactPage } from "@/content/pages";
import { site } from "@/content/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ ...contactPage.meta, path: "/contact/" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact/" },
];

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">{icon}</span>
      <div className="min-w-0 text-sm leading-relaxed">{children}</div>
    </li>
  );
}

export default function ContactPage() {
  const ic = "h-4 w-4";
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Contact" title={contactPage.h1} intro={contactPage.intro} />

      <section className="section" aria-labelledby="form-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:gap-12">
          <div>
            <h2 id="form-title" className="h-section">
              {contactPage.formHeading}
            </h2>
            <p className="lead mt-3 mb-8">{contactPage.formCopy}</p>
            <ContactForm />
          </div>

          <aside className="space-y-6 lg:pt-2" aria-label="Contact details">
            <div className="card">
              <h2 className="text-lg font-semibold">General inquiries</h2>
              <ul className="mt-5 space-y-4">
                <Row icon={<Mail className={ic} strokeWidth={ICON_STROKE} aria-hidden="true" />}>
                  <span className="block text-subtle">Email</span>
                  <a href={`mailto:${site.contact.email}`} className="font-semibold break-all text-navy-900 hover:text-brand-700">
                    {site.contact.email}
                  </a>
                </Row>
                <Row icon={<Phone className={ic} strokeWidth={ICON_STROKE} aria-hidden="true" />}>
                  <span className="block text-subtle">Phone / WhatsApp</span>
                  <a href={site.contact.phoneHref} className="font-semibold text-navy-900 hover:text-brand-700">
                    {site.contact.phoneDisplay}
                  </a>
                </Row>
                <Row icon={<MapPin className={ic} strokeWidth={ICON_STROKE} aria-hidden="true" />}>
                  <span className="block text-subtle">Location</span>
                  <span className="font-semibold text-navy-900">
                    {site.location.city}, {site.location.country}
                  </span>
                </Row>
              </ul>
              <a
                href={site.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-6 w-full bg-[#167a41] text-white hover:bg-[#126535]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                Chat on WhatsApp
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold">{site.operations.label}</h2>
              <ul className="mt-5 space-y-4">
                <Row icon={<UserRound className={ic} strokeWidth={ICON_STROKE} aria-hidden="true" />}>
                  <span className="block font-semibold text-navy-900">{site.operations.name}</span>
                  <a href={`mailto:${site.operations.email}`} className="break-all text-brand-700 hover:underline">
                    {site.operations.email}
                  </a>
                </Row>
              </ul>
            </div>

            <div className="card bg-surface">
              <h2 className="text-lg font-semibold">What happens next</h2>
              <ol className="mt-5 space-y-4">
                {contactPage.next.map((n, i) => (
                  <li key={n.title} className="flex gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white text-xs font-semibold text-brand-700">
                      {i + 1}
                    </span>
                    <div className="text-sm">
                      <p className="font-semibold text-navy-900">{n.title}</p>
                      <p className="text-muted">{n.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-xs text-subtle">Remote-first delivery with flexible meeting hours for US, UK and APAC time zones.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
