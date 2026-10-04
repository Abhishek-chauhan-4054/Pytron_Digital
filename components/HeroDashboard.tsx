import { Bot, ChartLine, LayoutDashboard, Mail, MousePointerClick, Sparkles, Users, Workflow } from "lucide-react";
import { hero } from "@/content/home";
import { ICON_STROKE } from "./Icon";

const d = hero.dashboard;

function GrowthChart() {
  // Sample series only.
  const line = "M0 118 C40 112 60 104 95 100 S150 86 185 80 S240 66 275 52 S330 30 380 22";
  const prev = "M0 124 C45 122 70 118 110 116 S170 108 210 104 S280 96 320 90 S360 84 380 82";
  return (
    <svg viewBox="0 0 380 140" className="h-full w-full" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="hd-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a6cf4" stopOpacity="0.25" />
          <stop offset="1" stopColor="#3a6cf4" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[28, 62, 96, 130].map((y) => (
        <line key={y} x1="0" x2="380" y1={y} y2={y} stroke="#e2e8f5" strokeWidth="1" />
      ))}
      <path d={`${line} V140 H0 Z`} fill="url(#hd-area)" className="fade-area" />
      <path d={prev} fill="none" stroke="#bdd0ff" strokeWidth="2" strokeDasharray="4 5" />
      <path d={line} fill="none" stroke="#2457e6" strokeWidth="3" strokeLinecap="round" className="draw-line" />
      <circle cx="380" cy="22" r="4.5" fill="#2457e6" className="fade-area" />
    </svg>
  );
}

function Sidebar() {
  const items = [LayoutDashboard, ChartLine, Users, Workflow, Mail];
  return (
    <div className="hidden w-12 shrink-0 flex-col items-center gap-3 border-r border-line bg-surface py-4 sm:flex">
      {items.map((I, i) => (
        <span
          key={i}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${i === 0 ? "bg-brand-600 text-white" : "text-subtle"}`}
        >
          <I className="h-4 w-4" strokeWidth={ICON_STROKE} />
        </span>
      ))}
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="float-slow absolute -bottom-10 left-0 hidden w-[116px] rounded-[20px] border border-line bg-white p-2 shadow-[var(--shadow-lift)] md:block">
      <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-line" />
      <div className="rounded-xl bg-surface p-2.5">
        <p className="text-[9px] font-medium text-subtle">Leads today</p>
        <p className="text-base font-semibold text-navy-900">28</p>
        <svg viewBox="0 0 100 32" className="mt-1 h-7 w-full">
          <path d="M0 28 L14 24 L28 26 L42 18 L56 20 L70 12 L84 14 L100 4" fill="none" stroke="#2457e6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="mt-2 space-y-1.5 px-0.5 pb-1">
        {["Form · Pricing page", "Call · Google Ads", "Chat · WhatsApp"].map((t) => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-electric-500" />
            <span className="truncate text-[9px] text-muted">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroDashboard() {
  return (
    <figure className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
      <p className="sr-only">
        Illustration of a sample business growth dashboard showing website visitors, leads, conversion rate,
        revenue, a growth chart, recent activity and an AI insights panel. All figures are sample data.
      </p>
      <div aria-hidden="true" className="relative md:pl-16">
        {/* Floating badge */}
        <div className="float-slow absolute -top-7 right-3 z-10 inline-flex sm:right-[100px] items-center gap-2 rounded-full border border-brand-100 bg-white px-3.5 py-2 text-xs font-semibold text-navy-900 shadow-[var(--shadow-lift)] ">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <Sparkles className="h-3 w-3" strokeWidth={ICON_STROKE} />
          </span>
          {d.badge}
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/10">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-line bg-white px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="ml-3 text-xs font-semibold text-navy-900">{d.product}</span>
            <span className="ml-auto hidden rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-subtle sm:inline">Last 30 days</span>
          </div>

          <div className="flex">
            <Sidebar />
            <div className="min-w-0 flex-1 p-3.5 sm:p-4">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-2.5">
                {d.kpis.map((k, i) => (
                  <div key={k.label} className={`rounded-xl border border-line p-2.5 ${i > 1 ? "hidden sm:block" : ""}`}>
                    <p className="truncate text-[10px] font-medium text-subtle">{k.label}</p>
                    <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-navy-900">{k.value}</p>
                    <p className="text-[10px] font-semibold text-emerald-700">{k.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-5">
                {/* Chart */}
                <div className="rounded-xl border border-line p-3 sm:col-span-3 lg:col-span-5 xl:col-span-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-navy-900">Growth</p>
                    <div className="flex items-center gap-2 text-[9px] whitespace-nowrap text-subtle">
                      <span className="flex items-center gap-1">
                        <span className="h-0.5 w-3 rounded bg-brand-600" /> Leads
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-0.5 w-3 rounded bg-brand-200" /> Prior period
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-24 sm:h-28">
                    <GrowthChart />
                  </div>
                </div>
                {/* Activity */}
                <div className="hidden rounded-xl border border-line p-3 sm:col-span-2 sm:block lg:hidden xl:block">
                  <p className="text-[11px] font-semibold text-navy-900">Recent Activity</p>
                  <ul className="mt-2 space-y-2">
                    {d.activity.map((a, i) => {
                      const I = [MousePointerClick, ChartLine, Mail][i] ?? Mail;
                      return (
                        <li key={a.text} className="flex items-start gap-2">
                          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface text-brand-700">
                            <I className="h-3 w-3" strokeWidth={ICON_STROKE} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[10px] leading-tight text-navy-800">{a.text}</span>
                            <span className="text-[9px] text-subtle">{a.time} ago</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* AI insight */}
              <div className="mt-2.5 flex gap-2.5 rounded-xl border border-brand-100 bg-brand-50/60 p-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-brand-100">
                  <Bot className="h-4 w-4" strokeWidth={ICON_STROKE} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-navy-900">AI Insights</p>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-muted">{d.insight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PhoneMock />
      </div>
      <figcaption className="mt-12 text-center text-xs text-slate-400 md:mt-14">{d.caption} · sample data only</figcaption>
    </figure>
  );
}
