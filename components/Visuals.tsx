import Image from "next/image";
import type { CaseStudy, Product } from "@/content/types";

/* ------------------------------------------------------------------
   Product previews — UI illustrations, not screenshots.
   Set `image` on a product in content/products.ts to use a real one.
------------------------------------------------------------------- */

function Bar({ w, className = "bg-line" }: { w: string; className?: string }) {
  return <span className={`block h-1.5 rounded-full ${className}`} style={{ width: w }} />;
}

function QuizPreview() {
  return (
    <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-line">
      <div className="flex items-center justify-between text-[10px] font-medium text-subtle">
        <span>Practice test</span>
        <span>Question 12 of 40</span>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-surface-2">
        <div className="h-1 w-[30%] rounded-full bg-brand-600" />
      </div>
      <p className="mt-2.5 text-[11px] font-semibold text-navy-900">What does a flashing red traffic light mean?</p>
      <div className="mt-2 space-y-1.5">
        {["Slow down and proceed", "Stop, then proceed when safe", "Yield to oncoming traffic"].map((o, i) => (
          <div
            key={o}
            className={`flex items-center gap-2 rounded-md border px-2 py-1 text-[10px] ${
              i === 1 ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-line text-muted"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full border ${i === 1 ? "border-emerald-600 bg-emerald-600" : "border-line-strong"}`} />
            {o}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashcardPreview() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-x-6 top-0 h-full rotate-[-4deg] rounded-lg bg-white/70 ring-1 ring-line" />
      <div className="absolute inset-x-4 top-1 h-full rotate-[3deg] rounded-lg bg-white/85 ring-1 ring-line" />
      <div className="relative mx-2 flex h-full flex-col rounded-lg bg-white p-3 shadow-sm ring-1 ring-line">
        <div className="flex items-center justify-between text-[10px] font-medium text-subtle">
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-semibold text-brand-800">Civics</span>
          <span>Card 8 / 100</span>
        </div>
        <p className="mt-3 text-center text-[11px] font-semibold text-navy-900">What is the supreme law of the land?</p>
        <div className="mt-auto flex justify-center gap-2 pt-2">
          <span className="rounded-md bg-surface px-2 py-1 text-[9px] font-semibold text-muted">Flip card</span>
          <span className="rounded-md bg-brand-600 px-2 py-1 text-[9px] font-semibold text-white">I know this</span>
        </div>
      </div>
    </div>
  );
}

function GrantsPreview() {
  return (
    <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-line">
      <div className="flex gap-1.5">
        <span className="flex-1 rounded-md border border-line px-2 py-1 text-[10px] text-subtle">Your state or province</span>
        <span className="rounded-md bg-brand-600 px-2 py-1 text-[10px] font-semibold text-white">Search</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {["First-time buyer assistance", "Down-payment loan program", "Local housing grant"].map((t, i) => (
          <div key={t} className="flex items-center justify-between rounded-md border border-line px-2 py-1.5">
            <span className="text-[10px] font-medium text-navy-900">{t}</span>
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${i === 0 ? "bg-emerald-50 text-emerald-800" : "bg-surface text-muted"}`}>
              {i === 0 ? "Likely match" : "Check rules"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PointsPreview() {
  const rows: [string, string][] = [
    ["Age", "70%"],
    ["Language", "55%"],
    ["Education", "80%"],
    ["Work experience", "40%"],
  ];
  return (
    <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-line">
      <p className="text-[10px] font-semibold text-navy-900">Points calculator</p>
      <div className="mt-2 space-y-2">
        {rows.map(([l, w]) => (
          <div key={l}>
            <div className="text-[9px] text-subtle">{l}</div>
            <div className="mt-0.5 h-1.5 rounded-full bg-surface-2">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-electric-400" style={{ width: w }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-md bg-surface px-2 py-1">
        <span className="text-[9px] font-medium text-muted">Your estimate</span>
        <span className="text-[10px] font-semibold text-navy-900">Updates as you answer</span>
      </div>
    </div>
  );
}

function ChecklistPreview() {
  return (
    <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-line">
      <p className="text-[10px] font-semibold text-navy-900">Permits for: Food truck · Texas</p>
      <div className="mt-2 space-y-1.5">
        {["Business registration", "Sales tax permit", "Health department permit", "Local vendor license"].map((t, i) => (
          <div key={t} className="flex items-center gap-2 text-[10px]">
            <span
              className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${i < 2 ? "border-brand-600 bg-brand-600" : "border-line-strong"}`}
            >
              {i < 2 && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M2.5 6.5l2.2 2.2L9.5 3.8" />
                </svg>
              )}
            </span>
            <span className={i < 2 ? "text-subtle line-through" : "text-navy-900"}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const productVisuals: Record<Product["visual"], () => React.ReactElement> = {
  quiz: QuizPreview,
  flashcards: FlashcardPreview,
  grants: GrantsPreview,
  points: PointsPreview,
  checklist: ChecklistPreview,
};

export function ProductPreview({ product }: { product: Product }) {
  if (product.image) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-surface">
        <Image src={product.image} alt={`${product.name} screenshot`} fill sizes="(min-width:1024px) 360px, 100vw" className="object-cover object-top" />
      </div>
    );
  }
  const V = productVisuals[product.visual];
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-gradient-to-br from-surface to-surface-2 p-4" aria-hidden="true">
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-brand-200/50 blur-2xl" />
      <div className="relative h-full">
        <V />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Case study covers — browser frame with an illustration or a real
   screenshot (set `image` in content/work.ts).
------------------------------------------------------------------- */

function SolarCover() {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="220" fill="#fff7e8" />
      <circle cx="320" cy="58" r="30" fill="#ffb020" />
      <circle cx="320" cy="58" r="44" fill="#ffb020" opacity="0.18" />
      <rect x="24" y="30" width="150" height="14" rx="4" fill="#1b2a4a" />
      <rect x="24" y="52" width="110" height="8" rx="4" fill="#9aa5bd" />
      <rect x="24" y="70" width="70" height="20" rx="6" fill="#f08c00" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${30 + i * 88} 128) skewX(-14)`}>
          <rect width="78" height="62" rx="3" fill="#1d3b78" />
          {[1, 2].map((k) => (
            <line key={k} x1={(78 / 3) * k} y1="0" x2={(78 / 3) * k} y2="62" stroke="#3f63ad" strokeWidth="1.5" />
          ))}
          <line x1="0" y1="31" x2="78" y2="31" stroke="#3f63ad" strokeWidth="1.5" />
        </g>
      ))}
      <rect y="196" width="400" height="24" fill="#e9dcc2" />
    </svg>
  );
}

function TravelCover() {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="tc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe5ff" />
          <stop offset="1" stopColor="#f1f7ff" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#tc-sky)" />
      <path d="M0 170 L70 92 L110 130 L170 58 L230 140 L280 96 L340 150 L400 110 V220 H0 Z" fill="#5b7fb8" />
      <path d="M170 58 L190 82 L178 80 L170 92 L160 78 L150 82 Z" fill="#fff" />
      <path d="M0 190 L90 140 L160 176 L240 128 L320 172 L400 150 V220 H0 Z" fill="#2f4f86" />
      <rect x="24" y="24" width="140" height="14" rx="4" fill="#0f2147" />
      <rect x="24" y="46" width="96" height="8" rx="4" fill="#6b7fa6" />
      <rect x="250" y="22" width="126" height="26" rx="8" fill="#fff" />
      <rect x="260" y="31" width="70" height="8" rx="4" fill="#c3cde2" />
      <rect x="338" y="28" width="30" height="14" rx="5" fill="#2457e6" />
    </svg>
  );
}

function QuizCover() {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="220" fill="#eef3ff" />
      <rect x="24" y="24" width="120" height="12" rx="4" fill="#0f2147" />
      <rect x="24" y="44" width="82" height="8" rx="4" fill="#8592b0" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${24 + (i % 3) * 120} ${70 + Math.floor(i / 3) * 70})`}>
          <rect width="108" height="58" rx="8" fill="#fff" stroke="#d9e0ee" />
          <rect x="10" y="12" width="44" height="8" rx="3" fill="#1b2a4a" />
          <rect x="10" y="28" width="70" height="6" rx="3" fill="#c3cde2" />
          <rect x="10" y="40" width="88" height="5" rx="2.5" fill="#e3e9f5" />
          <rect x="10" y="40" width={30 + i * 9} height="5" rx="2.5" fill="#2457e6" />
        </g>
      ))}
    </svg>
  );
}

function SiteCover() {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sc-glow" cx="0.85" cy="0" r="0.8">
          <stop offset="0" stopColor="#2457e6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2457e6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sc-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8fc9ff" />
          <stop offset="1" stopColor="#b9a2ff" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="#050e26" />
      <rect width="400" height="220" fill="url(#sc-glow)" />
      <rect x="24" y="54" width="170" height="16" rx="4" fill="#fff" />
      <rect x="24" y="78" width="120" height="16" rx="4" fill="url(#sc-g)" />
      <rect x="24" y="106" width="150" height="7" rx="3.5" fill="#64748b" />
      <rect x="24" y="119" width="130" height="7" rx="3.5" fill="#64748b" />
      <rect x="24" y="140" width="64" height="20" rx="6" fill="#2457e6" />
      <rect x="94" y="140" width="64" height="20" rx="6" fill="none" stroke="#ffffff55" />
      <rect x="220" y="44" width="160" height="128" rx="10" fill="#fff" />
      <rect x="232" y="58" width="64" height="30" rx="5" fill="#eef2f9" />
      <rect x="304" y="58" width="64" height="30" rx="5" fill="#eef2f9" />
      <path d="M234 152 C260 146 270 132 296 128 S340 110 366 100" fill="none" stroke="#2457e6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const covers: Record<CaseStudy["cover"], () => React.ReactElement> = {
  solar: SolarCover,
  travel: TravelCover,
  quiz: QuizCover,
  site: SiteCover,
};

export function CaseStudyCover({ study }: { study: CaseStudy }) {
  const C = covers[study.cover];
  let host = "";
  if (study.url?.startsWith("http")) {
    try {
      host = new URL(study.url).hostname.replace(/^www\./, "");
    } catch {
      host = "";
    }
  }
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-line-strong" />
        <span className="h-2 w-2 rounded-full bg-line-strong" />
        <span className="h-2 w-2 rounded-full bg-line-strong" />
        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[10px] text-subtle ring-1 ring-line">
          {host || study.project}
        </span>
      </div>
      <div className="relative aspect-[20/11]">
        {study.image ? (
          <Image src={study.image} alt={`${study.project} website screenshot`} fill sizes="(min-width:768px) 560px, 100vw" className="object-cover object-top" />
        ) : (
          <div className="absolute inset-0" aria-hidden="true">
            <C />
          </div>
        )}
      </div>
    </div>
  );
}
