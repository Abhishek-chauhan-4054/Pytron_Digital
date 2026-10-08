"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";
import { contactPage } from "@/content/pages";
import { ICON_STROKE } from "./Icon";

type Values = {
  name: string;
  company: string;
  email: string;
  country: string;
  website: string;
  needs: string[];
  budget: string;
  details: string;
  /** honeypot */
  fax: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = { name: "", company: "", email: "", country: "", website: "", needs: [], budget: "", details: "", fax: "" };

const interestMap: Record<string, string> = {
  "digital-marketing": "Digital Marketing",
  website: "Website",
  automation: "Automation",
};

/** Sends a conversion event to any analytics tags that are loaded (GA4, GTM, Meta Pixel). */
function trackLead() {
  try {
    const w = window as unknown as {
      gtag?: (...a: unknown[]) => void;
      dataLayer?: unknown[];
      fbq?: (...a: unknown[]) => void;
    };
    w.gtag?.("event", "generate_lead");
    w.dataLayer?.push({ event: "generate_lead" });
    w.fbq?.("track", "Lead");
  } catch {
    /* analytics must never break the form */
  }
}

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!v.company.trim()) e.company = "Please enter your business or company name.";
  if (!v.email.trim()) e.email = "Please enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email address, like name@company.com.";
  if (!v.country) e.country = "Please select your country.";
  if (v.website.trim() && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v.website.trim()))
    e.website = "Please enter a valid website address, like example.com.";
  if (v.needs.length === 0) e.needs = "Please choose at least one option.";
  if (v.details.trim().length < 20) e.details = "Please share a little more about your project (at least 20 characters).";
  return e;
}

export function ContactForm() {
  const uid = useId();
  const [v, setV] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interest = new URLSearchParams(window.location.search).get("interest");
    // Pre-select the need from ?interest= once on mount (the URL is only readable on the client).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (interest && interestMap[interest]) setV((p) => ({ ...p, needs: [interestMap[interest]] }));
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (attempt > 0) summaryRef.current?.focus();
  }, [attempt]);

  const id = (k: string) => `${uid}-${k}`;

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (touched[k]) setErrors(validate(next));
  };

  const blur = (k: keyof Values) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(v));
  };

  const toggleNeed = (n: string) => {
    set("needs", v.needs.includes(n) ? v.needs.filter((x) => x !== n) : [...v.needs, n]);
    setTouched((t) => ({ ...t, needs: true }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    setTouched({ name: true, company: true, email: true, country: true, website: true, needs: true, details: true });
    if (Object.keys(errs).length) {
      setAttempt((a) => a + 1);
      return;
    }
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setV(initial);
      trackLead();
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="card flex flex-col items-center px-6 py-14 text-center outline-none">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CircleCheck className="h-7 w-7" strokeWidth={ICON_STROKE} aria-hidden="true" />
        </span>
        <p className="mt-5 text-xl font-semibold text-navy-900">{contactPage.success}</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-secondary mt-8">
          Send another inquiry
        </button>
      </div>
    );
  }

  const errorList = (Object.entries(errors) as [keyof Values, string][]).filter(([k]) => touched[k]);
  const err = (k: keyof Values) => (touched[k] ? errors[k] : undefined);
  const describedBy = (k: keyof Values) => (err(k) ? id(`${k}-err`) : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-6" aria-describedby={id("req")}>
      <p id={id("req")} className="text-sm text-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      {errorList.length > 0 && status !== "loading" && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 outline-none">
          <p className="font-semibold">Please fix {errorList.length === 1 ? "this field" : `these ${errorList.length} fields`}:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorList.map(([k, msg]) => (
              <li key={k}>
                <a href={`#${id(k)}`} className="underline">
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required id={id("name")} error={err("name")}>
          <input id={id("name")} name="name" autoComplete="name" className="field" value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} aria-invalid={!!err("name")} aria-describedby={describedBy("name")} aria-required="true" />
        </Field>
        <Field label="Business / Company" required id={id("company")} error={err("company")}>
          <input id={id("company")} name="company" autoComplete="organization" className="field" value={v.company} onChange={(e) => set("company", e.target.value)} onBlur={() => blur("company")} aria-invalid={!!err("company")} aria-describedby={describedBy("company")} aria-required="true" />
        </Field>
        <Field label="Work Email" required id={id("email")} error={err("email")}>
          <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" className="field" value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} aria-invalid={!!err("email")} aria-describedby={describedBy("email")} aria-required="true" />
        </Field>
        <Field label="Country" required id={id("country")} error={err("country")}>
          <select id={id("country")} name="country" autoComplete="country-name" className="field" value={v.country} onChange={(e) => set("country", e.target.value)} onBlur={() => blur("country")} aria-invalid={!!err("country")} aria-describedby={describedBy("country")} aria-required="true">
            <option value="">Select your country</option>
            {contactPage.countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Website" optional id={id("website")} error={err("website")}>
        <input id={id("website")} name="website" type="url" inputMode="url" autoComplete="url" placeholder="example.com" className="field" value={v.website} onChange={(e) => set("website", e.target.value)} onBlur={() => blur("website")} aria-invalid={!!err("website")} aria-describedby={describedBy("website")} />
      </Field>

      <fieldset aria-describedby={describedBy("needs")} aria-invalid={!!err("needs")}>
        <legend className="field-label">
          What do you need? <span aria-hidden="true" className="text-red-700">*</span>
          <span className="ml-1 font-normal text-subtle">(choose all that apply)</span>
        </legend>
        <div id={id("needs")} className="mt-1 flex flex-wrap gap-2">
          {contactPage.needs.map((n) => {
            const checked = v.needs.includes(n);
            return (
              <label
                key={n}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600 ${
                  checked ? "border-brand-600 bg-brand-50 text-brand-800" : "border-line-strong bg-white text-navy-800 hover:border-brand-300"
                }`}
              >
                <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleNeed(n)} name="needs" value={n} />
                <span aria-hidden="true" className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong"}`}>
                  {checked && (
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2.5 6.5l2.2 2.2L9.5 3.8" />
                    </svg>
                  )}
                </span>
                {n}
              </label>
            );
          })}
        </div>
        {err("needs") && (
          <p id={id("needs-err")} className="mt-2 text-sm text-red-700">
            {err("needs")}
          </p>
        )}
      </fieldset>

      <Field label="Budget Range (USD)" optional id={id("budget")}>
        <select id={id("budget")} name="budget" className="field" value={v.budget} onChange={(e) => set("budget", e.target.value)}>
          <option value="">Select a range</option>
          {contactPage.budgets.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </Field>

      <Field label="Project Details" required id={id("details")} error={err("details")}>
        <textarea id={id("details")} name="details" rows={5} className="field resize-y" placeholder="What are you building or trying to improve? Any deadlines?" value={v.details} onChange={(e) => set("details", e.target.value)} onBlur={() => blur("details")} aria-invalid={!!err("details")} aria-describedby={describedBy("details")} aria-required="true" />
      </Field>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("fax")}>Fax number</label>
        <input id={id("fax")} name="fax" tabIndex={-1} autoComplete="off" value={v.fax} onChange={(e) => set("fax", e.target.value)} />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {serverError} You can also email us directly at sahil.chauhan@pytron.in.
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "loading"} aria-disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <LoaderCircle className="h-4 w-4 motion-safe:animate-spin" strokeWidth={ICON_STROKE} aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            {contactPage.submit}
            <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="sr-only" aria-live="polite">
        {status === "loading" ? "Sending your inquiry" : ""}
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  required,
  optional,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-700">
            *
          </span>
        )}
        {optional && <span className="ml-1 font-normal text-subtle">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
