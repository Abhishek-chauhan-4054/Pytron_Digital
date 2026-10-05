/** Database row types for the CMS (mirror supabase/migrations). */

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export const CONTENT_STATUSES: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export type RoleKey = "SUPER_ADMIN" | "ADMIN" | "EDITOR";
export const ROLE_RANK: Record<RoleKey, number> = { SUPER_ADMIN: 30, ADMIN: 20, EDITOR: 10 };
export const ROLE_LABEL: Record<RoleKey, string> = { SUPER_ADMIN: "Super Admin", ADMIN: "Admin", EDITOR: "Editor" };

export type Pillar = "marketing" | "web" | "ai";
export const PILLARS: { key: Pillar; label: string; path: string }[] = [
  { key: "marketing", label: "Digital Marketing", path: "/digital-marketing/" },
  { key: "web", label: "Web Development", path: "/web-development/" },
  { key: "ai", label: "AI Solutions", path: "/ai-solutions/" },
];
export const pillarPath = (p: Pillar) => PILLARS.find((x) => x.key === p)!.path;

/** Tiptap / ProseMirror JSON document (rendered through a whitelist, never as raw HTML). */
export type RichMark = { type: string; attrs?: Record<string, unknown> };
export type RichNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichNode[];
  text?: string;
  marks?: RichMark[];
};
export type RichDoc = { type: "doc"; content?: RichNode[] };

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  role_id: string | null;
  is_active: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PageRow = {
  id: string;
  title: string;
  slug: string;
  system_key: string | null;
  status: ContentStatus;
  hero_heading: string;
  hero_description: string;
  hero_cta_label: string;
  hero_cta_url: string;
  hero_image_url: string;
  content: RichDoc | null;
  featured_image_url: string;
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PageSectionRow = {
  id: string;
  page_id: string;
  type: string;
  data: Record<string, unknown>;
  sort_order: number;
};

export type ServiceRow = {
  id: string;
  pillar: Pillar;
  name: string;
  slug: string;
  short_description: string;
  hero_heading: string;
  intro: string;
  full_description: RichDoc | null;
  icon: string;
  image_url: string;
  features: string[];
  cta_label: string;
  cta_url: string;
  sort_order: number;
  status: ContentStatus;
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogCategoryRow = { id: string; name: string; slug: string; description: string; sort_order: number };
export type BlogTagRow = { id: string; name: string; slug: string };

export type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  intro: string;
  content: RichDoc | null;
  featured_image_url: string;
  author_name: string;
  category_id: string | null;
  status: ContentStatus;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  canonical_url: string;
  robots_index: boolean;
  reading_minutes: number;
  cta: "marketing" | "web" | "ai";
  created_at: string;
  updated_at: string;
};

export type MediaRow = {
  id: string;
  bucket: MediaBucket;
  path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string;
  folder: string;
  uploaded_by: string | null;
  created_at: string;
};

export type MediaBucket = "website-images" | "blog-images" | "service-images" | "documents";

export type NavLocation = "footer_services" | "footer_solutions" | "footer_company" | "footer_legal";
export const NAV_LOCATIONS: { key: NavLocation; label: string }[] = [
  { key: "footer_services", label: "Footer · Services" },
  { key: "footer_solutions", label: "Footer · Solutions" },
  { key: "footer_company", label: "Footer · Company" },
  { key: "footer_legal", label: "Footer · Legal (bottom bar)" },
];

export type NavigationItemRow = {
  id: string;
  location: NavLocation;
  label: string;
  href: string;
  is_external: boolean;
  is_active: boolean;
  sort_order: number;
};

export type SiteSettingsRow = {
  id: number;
  contact_email: string;
  contact_phone: string;
  whatsapp_url: string;
  social_linkedin: string;
  social_instagram: string;
  social_facebook: string;
  social_x: string;
  social_youtube: string;
  default_og_image_url: string;
  updated_at: string;
};

export type SeoMetadataRow = {
  id: string;
  path: string;
  title: string;
  description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  updated_at: string;
};

export type AuditLogRow = {
  id: string;
  user_id: string | null;
  user_email: string;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};
