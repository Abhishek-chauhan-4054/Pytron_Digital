import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { IconName } from "@/content/types";
import { ServiceCard } from "@/components/Cards";
import { ContactForm } from "@/components/ContactForm";
import { Icon, ICON_NAMES, ICON_STROKE } from "@/components/Icon";
import { CTASection, FAQ, TestimonialsOrPartnership } from "@/components/Sections";
import { ButtonLink, JsonLd, SectionHeader } from "@/components/ui";
import { parseBlock, type BlockData, type BlockType } from "@/lib/cms/blocks";
import type { PageSectionRow } from "@/lib/cms/types";
import { pillarPath } from "@/lib/cms/types";
import { listServices } from "@/lib/cms/public/services";
import type { PublicSettings } from "@/lib/cms/public/site";
import { faqSchema } from "@/lib/schema";
import { RichText, safeHref, safeImageSrc } from "./RichText";

/**
 * Renders CMS page sections with the site's existing components and design tokens.
 * Each block type has structured, validated fields; there is no raw HTML block.
 */

const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const asIcon = (v: string): IconName => ((ICON_NAMES as string[]).includes(v) ? (v as IconName) : "sparkles");

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const safe = safeImageSrc(src);
  if (!safe) return null;
  // CMS images have unknown dimensions; lazy <img> keeps them off the critical path.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={safe} alt={alt} loading="lazy" decoding="async" className={className} />;
}

type Tone = "white" | "surface";

async function Block({ type, data, tone, settings }: { type: BlockType; data: unknown; tone: Tone; settings: PublicSettings }) {
  const bg = tone === "surface" ? "bg-surface" : "";
  switch (type) {
    case "hero": {
      const d = parseBlock("hero", data);
      if (!d) return null;
      const href = safeHref(d.ctaUrl);
      return (
        <section className="on-dark hero-dark relative overflow-hidden">
          <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
          <div className={`container-x relative py-16 sm:py-20 ${d.image ? "grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]" : ""}`}>
            <div className="max-w-3xl">
              {d.heading && <h2 className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-white sm:text-5xl">{d.heading}</h2>}
              {d.description && <p className="mt-5 text-[1.075rem] leading-relaxed text-slate-300 sm:text-lg">{d.description}</p>}
              {d.ctaText && href && (
                <div className="mt-8">
                  <ButtonLink href={href}>{d.ctaText}</ButtonLink>
                </div>
              )}
            </div>
            {d.image && <Img src={d.image} alt="" className="w-full rounded-2xl border border-white/10" />}
          </div>
        </section>
      );
    }
    case "text": {
      const d = parseBlock("text", data);
      if (!d) return null;
      return (
        <section className={`section ${bg}`}>
          <div className="container-x max-w-3xl" data-reveal>
            {d.heading && <h2 className="h-section">{d.heading}</h2>}
            {paragraphs(d.body).map((p, i) => (
              <p key={i} className="prose-body mt-4 text-[1.05rem]">
                {p}
              </p>
            ))}
          </div>
        </section>
      );
    }
    case "image": {
      const d = parseBlock("image", data);
      if (!d?.image) return null;
      return (
        <section className={`section ${bg}`}>
          <figure className="container-x max-w-4xl" data-reveal>
            <Img src={d.image} alt={d.alt} className="w-full rounded-[var(--radius-card)] border border-line shadow-[var(--shadow-card)]" />
            {d.caption && <figcaption className="mt-3 text-center text-sm text-muted">{d.caption}</figcaption>}
          </figure>
        </section>
      );
    }
    case "image_text": {
      const d = parseBlock("image_text", data);
      if (!d) return null;
      const href = safeHref(d.ctaUrl);
      return (
        <section className={`section ${bg}`}>
          <div className="container-x grid items-center gap-10 lg:grid-cols-2">
            <div className={d.imagePosition === "left" ? "lg:order-2" : ""} data-reveal>
              {d.heading && <h2 className="h-section">{d.heading}</h2>}
              {paragraphs(d.body).map((p, i) => (
                <p key={i} className="prose-body mt-4">
                  {p}
                </p>
              ))}
              {d.ctaText && href && (
                <div className="mt-7">
                  <ButtonLink href={href}>{d.ctaText}</ButtonLink>
                </div>
              )}
            </div>
            <div data-reveal>{d.image && <Img src={d.image} alt={d.alt} className="w-full rounded-[var(--radius-card)] border border-line shadow-[var(--shadow-card)]" />}</div>
          </div>
        </section>
      );
    }
    case "features": {
      const d = parseBlock("features", data);
      if (!d) return null;
      return (
        <section className={`section ${bg}`}>
          <div className="container-x">
            {d.heading && <SectionHeader title={d.heading} copy={d.intro || undefined} />}
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {d.items.map((f, i) => (
                <article key={i} className="card h-full" data-reveal>
                  <span className="icon-tile">
                    <Icon name={asIcon(f.icon)} />
                  </span>
                  <h3 className="h-card mt-5">{f.title}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "cards": {
      const d = parseBlock("cards", data);
      if (!d) return null;
      return (
        <section className={`section ${bg}`}>
          <div className="container-x">
            {d.heading && <SectionHeader title={d.heading} copy={d.intro || undefined} />}
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {d.items.map((c, i) => {
                const href = safeHref(c.href);
                return (
                  <article key={i} className={`card h-full ${href ? "card-hover group relative" : ""}`} data-reveal>
                    <h3 className="h-card">
                      {href ? (
                        <Link href={href} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]">
                          {c.title}
                        </Link>
                      ) : (
                        c.title
                      )}
                    </h3>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>
                    {href && (
                      <span className="link-arrow mt-5 text-sm" aria-hidden="true">
                        Learn More
                        <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} />
                      </span>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      );
    }
    case "services": {
      const d = parseBlock("services", data);
      if (!d) return null;
      const items = await listServices(d.pillar === "all" ? undefined : d.pillar);
      return (
        <section className={`section ${bg}`}>
          <div className="container-x">
            {d.heading && <SectionHeader title={d.heading} copy={d.intro || undefined} />}
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <ServiceCard key={`${s.pillar}-${s.slug}`} title={s.label} text={s.summary} href={`${pillarPath(s.pillar)}${s.slug}/`} icon={s.icon} />
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "testimonials": {
      const d = parseBlock("testimonials", data);
      if (!d) return null;
      const real = d.items.filter((t) => t.quote && t.name);
      return real.length ? <TestimonialsOrPartnership testimonials={real} /> : null;
    }
    case "cta": {
      const d = parseBlock("cta", data);
      if (!d) return null;
      const primary = safeHref(d.ctaUrl);
      const secondary = safeHref(d.secondaryUrl);
      return (
        <CTASection
          {...(d.heading ? { title: d.heading } : {})}
          {...(d.description ? { copy: d.description } : {})}
          {...(d.ctaText && primary ? { primary: { label: d.ctaText, href: primary } } : {})}
          secondary={d.secondaryText && secondary ? { label: d.secondaryText, href: secondary } : null}
        />
      );
    }
    case "faq": {
      const d = parseBlock("faq", data);
      if (!d) return null;
      const items = d.items.filter((f) => f.q && f.a);
      if (!items.length) return null;
      return (
        <>
          <JsonLd data={faqSchema(items)} />
          <FAQ items={items} title={d.heading || "Frequently Asked Questions"} tone={tone} id={`faq-${Math.abs(hash(items[0].q))}`} />
        </>
      );
    }
    case "stats": {
      const d = parseBlock("stats", data);
      if (!d || !d.items.length) return null;
      return (
        <section className={`section ${bg}`}>
          <div className="container-x">
            {d.heading && <SectionHeader title={d.heading} />}
            <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {d.items.map((s, i) => (
                <div key={i} className="card text-center" data-reveal>
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="text-gradient mt-1 text-4xl font-semibold tracking-[-0.03em]">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      );
    }
    case "logo_grid": {
      const d = parseBlock("logo_grid", data);
      if (!d || !d.items.length) return null;
      return (
        <section className={`section ${bg}`}>
          <div className="container-x">
            {d.heading && <SectionHeader title={d.heading} />}
            <ul className="mt-10 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {d.items.map((l, i) => {
                const href = safeHref(l.href);
                const img = <Img src={l.image} alt={l.alt} className="mx-auto max-h-12 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" />;
                return (
                  <li key={i} className="flex justify-center">
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      );
    }
    case "rich_text": {
      const d = parseBlock("rich_text", data);
      if (!d?.content) return null;
      return (
        <section className={`section ${bg}`}>
          <div className="container-x max-w-3xl" data-reveal>
            <RichText doc={d.content as BlockData<"rich_text">["content"] & { type: "doc" }} variant="page" />
          </div>
        </section>
      );
    }
    case "contact": {
      const d = parseBlock("contact", data);
      if (!d) return null;
      return (
        <section className={`section ${bg}`}>
          <div className={`container-x ${d.showForm ? "grid gap-10 lg:grid-cols-[0.9fr_1.35fr] lg:gap-12" : "max-w-3xl"}`}>
            <div data-reveal>
              {d.heading && <h2 className="h-section">{d.heading}</h2>}
              {d.description && <p className="lead mt-4">{d.description}</p>}
              <ul className="mt-6 space-y-2 text-muted">
                <li>
                  Email:{" "}
                  <a className="font-semibold text-brand-700" href={`mailto:${settings.email}`}>
                    {settings.email}
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a className="font-semibold text-brand-700" href={settings.phoneHref}>
                    {settings.phoneDisplay}
                  </a>
                </li>
              </ul>
            </div>
            {d.showForm && (
              <div className="card">
                <ContactForm />
              </div>
            )}
          </div>
        </section>
      );
    }
    default:
      return null;
  }
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export async function BlockRenderer({ sections, settings }: { sections: PageSectionRow[]; settings: PublicSettings }) {
  // Alternate white / surface backgrounds so adjacent sections never match.
  const tones: Tone[] = [];
  let current: Tone = "surface";
  for (const s of sections) {
    if (!["hero", "cta", "testimonials"].includes(s.type)) current = current === "white" ? "surface" : "white";
    tones.push(current);
  }
  return (
    <>
      {sections.map((s, i) => (
        <Block key={s.id} type={s.type as BlockType} data={s.data} tone={tones[i]} settings={settings} />
      ))}
    </>
  );
}
