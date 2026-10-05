import { z } from "zod";
import { canonicalUrl, dateOrEmpty, imageUrl, required, richDoc, seoFields, shortText, slug, status, uuid } from "./common";

export const blogSchema = z.object({
  title: required(200, "Title"),
  slug,
  status,
  excerpt: required(400, "Excerpt"),
  intro: shortText(2000, "Intro"),
  content: richDoc,
  featured_image_url: imageUrl,
  author_name: required(120, "Author"),
  category_id: z.union([uuid, z.literal("")]),
  tags: z.array(shortText(60, "Tag").min(1)).max(20, "Up to 20 tags"),
  published_date: dateOrEmpty,
  ...seoFields,
  og_image_url: imageUrl,
  canonical_url: canonicalUrl,
  robots_index: z.boolean(),
  cta: z.enum(["marketing", "web", "ai"]),
});

export type BlogInput = z.input<typeof blogSchema>;

export const categorySchema = z.object({
  name: required(80, "Name"),
  slug,
  description: shortText(300, "Description"),
});

export const tagSchema = z.object({ name: required(60, "Name"), slug });
