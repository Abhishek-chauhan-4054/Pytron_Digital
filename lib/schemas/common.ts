import { z } from "zod";
import { SLUG_RE } from "@/lib/slug";
export { imageUrl, safeUrl } from "@/lib/cms/blocks";

export const uuid = z.string().uuid("Invalid id");

export const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120, "Keep the slug under 120 characters")
  .regex(SLUG_RE, "Use lowercase letters, numbers and single hyphens (e.g. my-new-page)");

export const status = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const shortText = (max: number, label = "This field") => z.string().trim().max(max, `${label} must be ${max} characters or fewer`);
export const required = (max: number, label: string) => shortText(max, label).min(1, `${label} is required`);

/** Tiptap document. Structure is re-checked by the whitelist renderer, so only the envelope is validated here. */
export const richDoc = z
  .object({ type: z.literal("doc"), content: z.array(z.any()).max(2000).optional() })
  .nullable()
  .refine((d) => d === null || JSON.stringify(d).length < 400_000, "Content is too long");

export const canonicalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https:\/\//.test(v), "Canonical URL must start with https://");

/** yyyy-mm-dd or empty */
export const dateOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use a valid date");

export const seoFields = {
  seo_title: shortText(120, "SEO title"),
  seo_description: shortText(320, "SEO description"),
};
