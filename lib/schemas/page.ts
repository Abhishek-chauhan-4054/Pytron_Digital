import { z } from "zod";
import { sectionSchema } from "@/lib/cms/blocks";
import { canonicalUrl, dateOrEmpty, imageUrl, required, richDoc, safeUrl, seoFields, shortText, slug, status } from "./common";

export const RESERVED_SLUGS = [
  "admin", "api", "auth", "blog", "services", "products", "work", "about", "contact", "home",
  "digital-marketing", "web-development", "ai-solutions", "industries", "locations",
  "privacy-policy", "terms", "cookie-policy", "site-map", "sitemap", "robots", "_next", "preview",
];

export const pageSchema = z.object({
  title: required(200, "Title"),
  slug,
  status,
  hero_heading: shortText(300, "Hero heading"),
  hero_description: shortText(1000, "Hero description"),
  hero_cta_label: shortText(60, "Button text"),
  hero_cta_url: safeUrl,
  hero_image_url: imageUrl,
  content: richDoc,
  featured_image_url: imageUrl,
  ...seoFields,
  og_image_url: imageUrl,
  canonical_url: canonicalUrl,
  robots_index: z.boolean(),
  robots_follow: z.boolean(),
  published_date: dateOrEmpty,
  sections: z.array(sectionSchema).max(40, "Up to 40 sections per page"),
});

export type PageInput = z.input<typeof pageSchema>;
export type PageValues = z.output<typeof pageSchema>;
