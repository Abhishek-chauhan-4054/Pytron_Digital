import { Fragment } from "react";
import { hero } from "@/content/home";
import { ctas } from "@/content/site";
import { HeroDashboard } from "./HeroDashboard";
import { ButtonLink, InlineChecks } from "./ui";

type HeadingLine = { text: string; highlight: boolean }[];

/** Default heading, identical to the original markup. */
const defaultHeading: HeadingLine[] = [
  [{ text: hero.h1Lines[0], highlight: false }],
  [
    { text: `${hero.h1Lines[1]} `, highlight: false },
    { text: hero.h1Highlight, highlight: true },
  ],
];

export function Hero({ heading = defaultHeading, copy = hero.copy, cta = ctas.start }: { heading?: HeadingLine[]; copy?: string; cta?: { label: string; href: string } }) {
  return (
    <section className="on-dark hero-dark relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div className="container-x relative grid items-center gap-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pt-24 lg:pb-28">
        <div>
          <p className="eyebrow-light">{hero.eyebrow}</p>
          <h1 id="hero-title" className="h-display mt-5 text-white">
            {heading.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line.map((part, j) =>
                  part.highlight ? (
                    <span key={j} className="text-gradient-light">
                      {part.text}
                    </span>
                  ) : (
                    <Fragment key={j}>{part.text}</Fragment>
                  ),
                )}
              </Fragment>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-[1.075rem] leading-relaxed text-slate-300 sm:text-lg">{copy}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={cta.href} className="w-full sm:w-auto">
              {cta.label}
            </ButtonLink>
            <ButtonLink href={ctas.work.href} variant="ghost-light" className="w-full sm:w-auto">
              {ctas.work.label}
            </ButtonLink>
          </div>
          <div className="mt-9 border-t border-white/10 pt-6">
            <InlineChecks items={hero.capabilities} dark />
          </div>
        </div>
        <HeroDashboard />
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
