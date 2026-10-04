import { Bot, ChartLine, LayoutDashboard, Plug, Workflow, Code } from "lucide-react";
import { corePanels } from "@/content/home";
import { ICON_STROKE } from "./Icon";
import { ButtonLink } from "./ui";

export function MarketingPanel() {
  const p = corePanels.marketing;
  return (
    <article className="card card-hover flex flex-col p-7 sm:p-9" data-reveal aria-labelledby="panel-marketing">
      <p className="eyebrow eyebrow-dot">{p.label}</p>
      <h2 id="panel-marketing" className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-[1.9rem]">
        {p.h2}
      </h2>
      <p className="mt-3 text-muted">{p.copy}</p>

      <div className="mt-7 rounded-xl border border-line bg-surface p-5" aria-hidden="true">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-navy-900">Qualified leads by channel</span>
          <span className="badge bg-white text-muted ring-1 ring-line">Illustrative</span>
        </div>
        <div className="mt-4 flex h-28 items-end gap-2.5">
          {[28, 36, 34, 46, 52, 58, 66, 74, 82, 94].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-brand-500 to-electric-400"
              style={{ height: `${h}%`, opacity: 0.55 + i * 0.045 }}
            />
          ))}
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Marketing channels">
        {p.chips.map((c) => (
          <li key={c} className="chip">
            {c}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <ButtonLink href={p.cta.href} className="w-full sm:w-auto">
          {p.cta.label}
        </ButtonLink>
      </div>
    </article>
  );
}

export function SolutionsPanel() {
  const p = corePanels.solutions;
  const icons = [Code, Bot, Workflow, LayoutDashboard, Plug];
  return (
    <article className="card card-hover flex flex-col p-7 sm:p-9" data-reveal aria-labelledby="panel-solutions">
      <p className="eyebrow eyebrow-dot">{p.label}</p>
      <h2 id="panel-solutions" className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-[1.9rem]">
        {p.h2}
      </h2>
      <p className="mt-3 text-muted">{p.copy}</p>

      <div className="relative mt-7 rounded-xl border border-line bg-surface p-4" aria-hidden="true">
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="ml-2 text-[10px] font-semibold text-navy-900">Operations App</span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            {["Orders", "Approvals", "Tasks"].map((t) => (
              <div key={t} className="rounded-md border border-line p-2">
                <p className="text-[9px] text-subtle">{t}</p>
                <div className="mt-1.5 h-1.5 w-3/4 rounded bg-brand-100" />
                <div className="mt-1 h-1.5 w-1/2 rounded bg-surface-2" />
              </div>
            ))}
            <div className="col-span-3 flex h-16 items-end gap-1.5 rounded-md border border-line p-2">
              {[40, 55, 35, 70, 60, 80, 65, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-brand-200" style={{ height: `${h}%` }} />
              ))}
              <ChartLine className="ml-1 h-4 w-4 self-start text-brand-600" strokeWidth={ICON_STROKE} />
            </div>
          </div>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Digital solutions">
        {p.labels.map((l, i) => {
          const I = icons[i];
          return (
            <li key={l} className="chip gap-1.5">
              <I className="h-3.5 w-3.5 text-brand-700" strokeWidth={ICON_STROKE} aria-hidden="true" />
              {l}
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-8">
        <ButtonLink href={p.cta.href} className="w-full sm:w-auto">
          {p.cta.label}
        </ButtonLink>
      </div>
    </article>
  );
}
