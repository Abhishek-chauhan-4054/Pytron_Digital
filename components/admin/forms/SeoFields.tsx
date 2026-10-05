"use client";

import { describedBy, Field, Input, Textarea, Checkbox } from "../ui/Field";
import { ImageField } from "../media/ImageField";

export type SeoValue = {
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
};

/** SEO tab: search snippet preview, title/description with counters, OG image, canonical and robots. */
export function SeoFields({
  value,
  onChange,
  errors,
  fallbackTitle,
  fallbackDescription,
  url,
  showCanonical = true,
  showRobots = true,
  showFollow = true,
}: {
  value: SeoValue;
  onChange: (patch: Partial<SeoValue>) => void;
  errors: Partial<Record<keyof SeoValue, string>>;
  fallbackTitle: string;
  fallbackDescription: string;
  url: string;
  showCanonical?: boolean;
  showRobots?: boolean;
  showFollow?: boolean;
}) {
  const title = value.seo_title || fallbackTitle;
  const desc = value.seo_description || fallbackDescription;
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]" aria-label="Search result preview">
        <p className="adm-muted text-xs">Search preview</p>
        <p className="mt-2 truncate text-xs text-emerald-700 dark:text-emerald-400">{url}</p>
        <p className="truncate text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{title || "Page title"}</p>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{desc || "Description shown in search results."}</p>
      </div>
      <Field label="SEO title" htmlFor="seo_title" error={errors.seo_title} help="Shown in search results and browser tabs (aim for about 60 characters). Leave empty to use the default." counter={{ value: value.seo_title.length, max: 60 }}>
        <Input id="seo_title" value={value.seo_title} onChange={(e) => onChange({ seo_title: e.target.value })} placeholder={fallbackTitle} maxLength={120} {...describedBy("seo_title", errors.seo_title, true)} />
      </Field>
      <Field label="SEO description" htmlFor="seo_description" error={errors.seo_description} help="About 150–160 characters." counter={{ value: value.seo_description.length, max: 160 }}>
        <Textarea id="seo_description" value={value.seo_description} onChange={(e) => onChange({ seo_description: e.target.value })} placeholder={fallbackDescription} maxLength={320} {...describedBy("seo_description", errors.seo_description, true)} />
      </Field>
      <Field label="Social share image (Open Graph)" htmlFor="og_image_url" error={errors.og_image_url} help="1200 × 630 px works best. Empty = the site default.">
        <ImageField id="og_image_url" value={value.og_image_url} onChange={(v) => onChange({ og_image_url: v })} folder="seo" error={errors.og_image_url} />
      </Field>
      {showCanonical && (
        <Field label="Canonical URL" htmlFor="canonical_url" error={errors.canonical_url} help="Only if this content is published elsewhere first. Empty = this page's own URL.">
          <Input id="canonical_url" value={value.canonical_url ?? ""} onChange={(e) => onChange({ canonical_url: e.target.value })} placeholder="https://" {...describedBy("canonical_url", errors.canonical_url, true)} />
        </Field>
      )}
      {showRobots && (
        <fieldset className="space-y-3">
          <legend className="adm-label">Search engines</legend>
          <Checkbox id="robots_index" label="Allow search engines to index this page" checked={value.robots_index ?? true} onChange={(e) => onChange({ robots_index: e.target.checked })} description="Unchecked = noindex, and the page is left out of sitemap.xml." />
          {showFollow && (
            <Checkbox id="robots_follow" label="Allow search engines to follow links on this page" checked={value.robots_follow ?? true} onChange={(e) => onChange({ robots_follow: e.target.checked })} />
          )}
        </fieldset>
      )}
    </div>
  );
}
