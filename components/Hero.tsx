import { hero } from "@/content/home";
import { ctas } from "@/content/site";
import { HeroDashboard } from "./HeroDashboard";
import { ButtonLink, InlineChecks } from "./ui";

export function Hero() {
  return (
    <section className="on-dark hero-dark relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div className="container-x relative grid items-center gap-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pt-24 lg:pb-28">
        <div>
          <p className="eyebrow-light">{hero.eyebrow}</p>
          <h1 id="hero-title" className="h-display mt-5 text-white">
            {hero.h1Lines[0]}
            <br />
            {hero.h1Lines[1]} <span className="text-gradient-light">{hero.h1Highlight}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.075rem] leading-relaxed text-slate-300 sm:text-lg">{hero.copy}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={ctas.start.href} className="w-full sm:w-auto">
              {ctas.start.label}
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
