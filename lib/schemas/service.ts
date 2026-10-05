import { z } from "zod";
import { ICON_NAMES } from "@/components/Icon";
import { imageUrl, required, richDoc, safeUrl, seoFields, shortText, slug, status } from "./common";

export const serviceSchema = z.object({
  pillar: z.enum(["marketing", "web", "ai"]),
  name: required(120, "Name"),
  slug,
  status,
  short_description: required(300, "Short description"),
  hero_heading: shortText(300, "Hero heading"),
  intro: shortText(1500, "Intro"),
  full_description: richDoc,
  icon: z.enum(ICON_NAMES as [string, ...string[]], { message: "Choose an icon" }),
  image_url: imageUrl,
  features: z.array(required(200, "Feature")).max(30, "Up to 30 features"),
  cta_label: shortText(60, "Button text"),
  cta_url: safeUrl,
  ...seoFields,
  og_image_url: imageUrl,
});

export type ServiceInput = z.input<typeof serviceSchema>;
