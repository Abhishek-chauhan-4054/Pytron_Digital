import { z } from "zod";

/**
 * Page-section ("block") definitions shared by the admin editor and the public renderer.
 * Every block has structured fields only — no raw HTML and no scripts.
 */

const text = (max = 300) => z.string().trim().max(max).default("");
const longText = (max = 5000) => z.string().trim().max(max).default("");

/** Relative path, http(s), mailto: or tel: — nothing else (blocks javascript: URLs). */
export const safeUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^(\/(?!\/)|https?:\/\/|mailto:|tel:|#)/i.test(v), "Use a path like /contact/ or a full https:// link")
  .default("");

/** Image URL: https:// (e.g. Supabase Storage) or a site path like /og-default.png */
export const imageUrl = z
  .string()
  .trim()
  .max(600)
  .refine((v) => v === "" || /^(\/(?!\/)|https:\/\/|http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/)/i.test(v), "Use an uploaded image or a https:// URL")
  .default("");

const richDoc = z
  .object({ type: z.literal("doc"), content: z.array(z.any()).optional() })
  .nullable()
  .default(null);

export const blockSchemas = {
  hero: z.object({ heading: text(200), description: longText(800), ctaText: text(60), ctaUrl: safeUrl, image: imageUrl }),
  text: z.object({ heading: text(200), body: longText(8000) }),
  image: z.object({ image: imageUrl, alt: text(200), caption: text(300) }),
  image_text: z.object({
    heading: text(200),
    body: longText(4000),
    image: imageUrl,
    alt: text(200),
    imagePosition: z.enum(["left", "right"]).default("right"),
    ctaText: text(60),
    ctaUrl: safeUrl,
  }),
  features: z.object({
    heading: text(200),
    intro: longText(800),
    items: z.array(z.object({ title: text(120), text: longText(600), icon: text(40) })).max(24).default([]),
  }),
  cards: z.object({
    heading: text(200),
    intro: longText(800),
    items: z.array(z.object({ title: text(120), text: longText(600), href: safeUrl })).max(24).default([]),
  }),
  services: z.object({ heading: text(200), intro: longText(800), pillar: z.enum(["all", "marketing", "web", "ai"]).default("all") }),
  testimonials: z.object({
    heading: text(200),
    items: z.array(z.object({ quote: longText(1000), name: text(120), role: text(120), company: text(120) })).max(12).default([]),
  }),
  cta: z.object({
    heading: text(200),
    description: longText(600),
    ctaText: text(60),
    ctaUrl: safeUrl,
    secondaryText: text(60),
    secondaryUrl: safeUrl,
  }),
  faq: z.object({ heading: text(200), items: z.array(z.object({ q: text(300), a: longText(2000) })).max(40).default([]) }),
  stats: z.object({ heading: text(200), items: z.array(z.object({ value: text(30), label: text(120) })).max(8).default([]) }),
  logo_grid: z.object({
    heading: text(200),
    items: z.array(z.object({ image: imageUrl, alt: text(120), href: safeUrl })).max(24).default([]),
  }),
  rich_text: z.object({ content: richDoc }),
  contact: z.object({ heading: text(200), description: longText(800), showForm: z.boolean().default(true) }),
} as const;

export type BlockType = keyof typeof blockSchemas;
export const BLOCK_TYPES = Object.keys(blockSchemas) as BlockType[];
export type BlockData<T extends BlockType = BlockType> = z.infer<(typeof blockSchemas)[T]>;

export const sectionSchema = z
  .object({ type: z.enum(BLOCK_TYPES as [BlockType, ...BlockType[]]), data: z.record(z.string(), z.unknown()) })
  .transform((s, ctx) => {
    const parsed = blockSchemas[s.type].safeParse(s.data);
    if (!parsed.success) {
      ctx.addIssue({ code: "custom", message: `${BLOCK_META[s.type].label}: ${parsed.error.issues[0]?.message ?? "invalid"}` });
      return z.NEVER;
    }
    return { type: s.type, data: parsed.data as Record<string, unknown> };
  });

/** Parse stored block data safely (bad data renders as an empty block instead of crashing). */
export function parseBlock<T extends BlockType>(type: T, data: unknown): BlockData<T> | null {
  const res = blockSchemas[type].safeParse(data ?? {});
  return res.success ? (res.data as BlockData<T>) : null;
}

// ---------------------------------------------------------------------------
// Editor field configuration
// ---------------------------------------------------------------------------
export type FieldDef =
  | { name: string; label: string; kind: "text" | "textarea" | "url" | "image"; help?: string; placeholder?: string }
  | { name: string; label: string; kind: "select"; options: { value: string; label: string }[]; help?: string }
  | { name: string; label: string; kind: "checkbox"; help?: string }
  | { name: string; label: string; kind: "rich"; help?: string }
  | { name: string; label: string; kind: "list"; itemLabel: string; fields: FieldDef[]; help?: string };

export const BLOCK_META: Record<BlockType, { label: string; description: string; fields: FieldDef[] }> = {
  hero: {
    label: "Hero",
    description: "Large dark banner with heading, text and a button.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "ctaText", label: "Button text", kind: "text" },
      { name: "ctaUrl", label: "Button link", kind: "url", placeholder: "/contact/" },
      { name: "image", label: "Image", kind: "image" },
    ],
  },
  text: {
    label: "Text",
    description: "Heading and plain paragraphs (blank line = new paragraph).",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "body", label: "Body", kind: "textarea" },
    ],
  },
  image: {
    label: "Image",
    description: "A single image with caption.",
    fields: [
      { name: "image", label: "Image", kind: "image" },
      { name: "alt", label: "Alt text", kind: "text", help: "Describe the image for screen readers." },
      { name: "caption", label: "Caption", kind: "text" },
    ],
  },
  image_text: {
    label: "Image + Text",
    description: "Text beside an image.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "body", label: "Body", kind: "textarea" },
      { name: "image", label: "Image", kind: "image" },
      { name: "alt", label: "Alt text", kind: "text" },
      {
        name: "imagePosition",
        label: "Image position",
        kind: "select",
        options: [
          { value: "right", label: "Right" },
          { value: "left", label: "Left" },
        ],
      },
      { name: "ctaText", label: "Button text", kind: "text" },
      { name: "ctaUrl", label: "Button link", kind: "url" },
    ],
  },
  features: {
    label: "Features",
    description: "Grid of features with icons.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "intro", label: "Intro", kind: "textarea" },
      {
        name: "items",
        label: "Features",
        kind: "list",
        itemLabel: "Feature",
        fields: [
          { name: "title", label: "Title", kind: "text" },
          { name: "text", label: "Text", kind: "textarea" },
          { name: "icon", label: "Icon", kind: "text", help: "Icon name, e.g. rocket, chart-line, bot" },
        ],
      },
    ],
  },
  cards: {
    label: "Cards",
    description: "Grid of linked cards.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "intro", label: "Intro", kind: "textarea" },
      {
        name: "items",
        label: "Cards",
        kind: "list",
        itemLabel: "Card",
        fields: [
          { name: "title", label: "Title", kind: "text" },
          { name: "text", label: "Text", kind: "textarea" },
          { name: "href", label: "Link", kind: "url" },
        ],
      },
    ],
  },
  services: {
    label: "Services",
    description: "Live list of your published services.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "intro", label: "Intro", kind: "textarea" },
      {
        name: "pillar",
        label: "Which services",
        kind: "select",
        options: [
          { value: "all", label: "All services" },
          { value: "marketing", label: "Digital Marketing" },
          { value: "web", label: "Web Development" },
          { value: "ai", label: "AI Solutions" },
        ],
      },
    ],
  },
  testimonials: {
    label: "Testimonials",
    description: "Real client quotes only — never invented ones.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "items",
        label: "Testimonials",
        kind: "list",
        itemLabel: "Testimonial",
        help: "Only publish quotes you have permission to use.",
        fields: [
          { name: "quote", label: "Quote", kind: "textarea" },
          { name: "name", label: "Name", kind: "text" },
          { name: "role", label: "Role", kind: "text" },
          { name: "company", label: "Company", kind: "text" },
        ],
      },
    ],
  },
  cta: {
    label: "Call to action",
    description: "Gradient panel with buttons.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "ctaText", label: "Button text", kind: "text" },
      { name: "ctaUrl", label: "Button link", kind: "url" },
      { name: "secondaryText", label: "Second button text", kind: "text" },
      { name: "secondaryUrl", label: "Second button link", kind: "url" },
    ],
  },
  faq: {
    label: "FAQ",
    description: "Questions and answers (adds FAQ structured data).",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "items",
        label: "Questions",
        kind: "list",
        itemLabel: "Question",
        fields: [
          { name: "q", label: "Question", kind: "text" },
          { name: "a", label: "Answer", kind: "textarea" },
        ],
      },
    ],
  },
  stats: {
    label: "Stats",
    description: "Key numbers — verified figures only.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "items",
        label: "Stats",
        kind: "list",
        itemLabel: "Stat",
        help: "Only publish numbers you can verify.",
        fields: [
          { name: "value", label: "Value", kind: "text" },
          { name: "label", label: "Label", kind: "text" },
        ],
      },
    ],
  },
  logo_grid: {
    label: "Logo grid",
    description: "Client or partner logos.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      {
        name: "items",
        label: "Logos",
        kind: "list",
        itemLabel: "Logo",
        fields: [
          { name: "image", label: "Logo image", kind: "image" },
          { name: "alt", label: "Company name", kind: "text" },
          { name: "href", label: "Link (optional)", kind: "url" },
        ],
      },
    ],
  },
  rich_text: {
    label: "Rich text",
    description: "Formatted text with headings, lists, links and images.",
    fields: [{ name: "content", label: "Content", kind: "rich" }],
  },
  contact: {
    label: "Contact",
    description: "Contact details, optionally with the site's contact form.",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "showForm", label: "Show the contact form", kind: "checkbox" },
    ],
  },
};

export function emptyBlock(type: BlockType): Record<string, unknown> {
  return blockSchemas[type].parse({}) as Record<string, unknown>;
}
