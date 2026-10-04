import { NextResponse } from "next/server";
import { contactPage } from "@/content/pages";
import { contactConfig } from "@/lib/config";

type Payload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  country?: unknown;
  website?: unknown;
  needs?: unknown;
  budget?: unknown;
  details?: unknown;
  fax?: unknown; // honeypot
};

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Best-effort in-memory rate limit (per server instance).
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing.
  if (str(body.fax)) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
  }

  const data = {
    name: str(body.name, 120),
    company: str(body.company, 160),
    email: str(body.email, 200),
    country: str(body.country, 80),
    website: str(body.website, 200),
    needs: Array.isArray(body.needs) ? body.needs.filter((n): n is string => typeof n === "string" && contactPage.needs.includes(n)) : [],
    budget: contactPage.budgets.includes(str(body.budget)) ? str(body.budget) : "",
    details: str(body.details, 5000),
  };

  const invalid =
    !data.name ||
    !data.company ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) ||
    !contactPage.countries.includes(data.country) ||
    data.needs.length === 0 ||
    data.details.length < 20;
  if (invalid) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 422 });
  }

  const subject = `New inquiry: ${data.company} (${data.country}) — ${data.needs.join(", ")}`;
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Country", data.country],
    ["Website", data.website || "—"],
    ["Needs", data.needs.join(", ")],
    ["Budget", data.budget || "Not specified"],
    ["Details", data.details],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="vertical-align:top;font-weight:600">${k}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("")}</table>`;

  const { resendKey, toEmail, fromEmail, webhookUrl, webhookSecret } = contactConfig;
  const delivered: string[] = [];
  const failures: string[] = [];

  // 1) Webhook — CRM, Zapier, Make, n8n, Google Sheets, Slack…
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(webhookSecret ? { "X-Webhook-Secret": webhookSecret } : {}) },
        body: JSON.stringify({ ...data, source: "digital.pytron.in", submittedAt: new Date().toISOString() }),
      });
      if (res.ok) delivered.push("webhook");
      else failures.push(`webhook ${res.status}`);
    } catch (e) {
      failures.push(`webhook ${String(e)}`);
    }
  }

  // 2) Email via Resend
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromEmail, to: [toEmail], reply_to: data.email, subject, text, html }),
      });
      if (res.ok) delivered.push("email");
      else failures.push(`email ${res.status} ${await res.text().catch(() => "")}`);
    } catch (e) {
      failures.push(`email ${String(e)}`);
    }
  }

  if (!webhookUrl && !resendKey) {
    // Nothing configured yet: keep the submission visible in the server logs.
    console.info("[contact] submission (no RESEND_API_KEY or CONTACT_WEBHOOK_URL set)\n" + text);
    return NextResponse.json({ ok: true });
  }
  if (failures.length) console.error("[contact] delivery issues:", failures.join(" | "));
  if (!delivered.length) {
    return NextResponse.json({ ok: false, error: "We couldn't send your message right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
