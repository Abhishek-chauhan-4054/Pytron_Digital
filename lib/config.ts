/**
 * Integration settings, read from environment variables.
 * Set them in Vercel → Project → Settings → Environment Variables
 * (or in a local .env.local file). Leave any of them unset to switch that integration off.
 */
export const integrations = {
  /** Google Analytics 4 measurement ID, e.g. G-XXXXXXXXXX */
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "",
  /** Google Tag Manager container ID, e.g. GTM-XXXXXXX */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  /** Meta (Facebook) Pixel ID */
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  /** Microsoft Clarity project ID */
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || "",
};

export const hasAnalytics = Boolean(
  integrations.ga4Id || integrations.gtmId || integrations.metaPixelId || integrations.clarityId,
);

/** Server-only settings for the contact form (never exposed to the browser). */
export const contactConfig = {
  /** Resend API key — sends each inquiry by email */
  resendKey: process.env.RESEND_API_KEY || "",
  toEmail: process.env.CONTACT_TO_EMAIL || "business@pytron.io",
  fromEmail: process.env.CONTACT_FROM_EMAIL || "Pytron Digital <website@pytron.io>",
  /**
   * Any webhook URL — Zapier, Make, n8n, HubSpot/Zoho workflow, Google Apps Script (to a Sheet),
   * Slack incoming webhook, etc. Each inquiry is POSTed as JSON.
   */
  webhookUrl: process.env.CONTACT_WEBHOOK_URL || "",
  /** Optional shared secret sent as the X-Webhook-Secret header */
  webhookSecret: process.env.CONTACT_WEBHOOK_SECRET || "",
};
