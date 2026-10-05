import { z } from "zod";
import { canonicalUrl, imageUrl, required, shortText } from "./common";

const optionalHttps = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\//.test(v), "Use a full https:// link");

export const settingsSchema = z.object({
  contact_email: z.string().trim().email("Enter a valid email").max(200),
  contact_phone: required(40, "Phone").regex(/^[+\d][\d\s()-]{5,}$/, "Use digits, spaces and an optional leading +"),
  whatsapp_url: optionalHttps,
  social_linkedin: optionalHttps,
  social_instagram: optionalHttps,
  social_facebook: optionalHttps,
  social_x: optionalHttps,
  social_youtube: optionalHttps,
  default_og_image_url: imageUrl,
});
export type SettingsInput = z.input<typeof settingsSchema>;

export const navItemSchema = z.object({
  location: z.enum(["footer_services", "footer_solutions", "footer_company", "footer_legal"]),
  label: required(80, "Label"),
  href: z
    .string()
    .trim()
    .min(1, "Link is required")
    .max(500)
    .refine((v) => /^(\/(?!\/)|https?:\/\/|mailto:|tel:)/.test(v), "Use a path like /about/ or a full https:// link"),
  is_external: z.boolean(),
  is_active: z.boolean(),
});
export type NavItemInput = z.input<typeof navItemSchema>;

export const seoOverrideSchema = z.object({
  path: z
    .string()
    .trim()
    .regex(/^\/([a-z0-9-]+\/)*$/, "Path must look like /about/ (with slashes)"),
  title: shortText(120, "Title"),
  description: shortText(320, "Description"),
  canonical_url: canonicalUrl,
  og_title: shortText(95, "OG title"),
  og_description: shortText(200, "OG description"),
  og_image_url: imageUrl,
  robots_index: z.boolean(),
  robots_follow: z.boolean(),
});
export type SeoOverrideInput = z.input<typeof seoOverrideSchema>;

export const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  full_name: required(120, "Name"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
  password: z
    .string()
    .min(12, "Use at least 12 characters")
    .max(72, "Use 72 characters or fewer")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/\d/, "Include a number"),
});
export type CreateUserInput = z.input<typeof createUserSchema>;

export const passwordSchema = createUserSchema.shape.password;

export const mediaUploadSchema = z.object({
  bucket: z.enum(["website-images", "blog-images", "service-images", "documents"]),
  folder: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{1,40}$/, "Folder: lowercase letters, numbers and hyphens"),
  fileName: z.string().min(1).max(200),
  size: z.number().int().positive(),
  mimeType: z.string().max(120),
});

export const mediaUpdateSchema = z.object({
  alt_text: shortText(250, "Alt text"),
  folder: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{1,40}$/, "Folder: lowercase letters, numbers and hyphens"),
});
