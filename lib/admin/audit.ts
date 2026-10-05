import type { AuditLogRow } from "@/lib/cms/types";

const ENTITY: Record<string, string> = {
  pages: "page",
  services: "service",
  blogs: "blog post",
  blog_categories: "category",
  blog_tags: "tag",
  media: "file",
  navigation_items: "navigation link",
  site_settings: "site settings",
  seo_metadata: "SEO override",
  profiles: "user",
  redirects: "redirect",
  auth: "session",
};

const VERB: Record<string, string> = {
  login: "Signed in",
  logout: "Signed out",
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  publish: "Published",
  unpublish: "Unpublished",
  archive: "Archived",
  media_upload: "Uploaded",
  media_delete: "Deleted",
  role_change: "Changed the role of",
  user_create: "Added",
  user_update: "Updated",
};

/** Human sentence for an audit entry, e.g. 'Published blog post "SEO costs"'. */
export function describeAudit(a: AuditLogRow) {
  if (a.action === "login" || a.action === "logout") return VERB[a.action];
  const label = typeof a.metadata?.label === "string" ? ` “${a.metadata.label}”` : "";
  let text = `${VERB[a.action] ?? a.action} ${ENTITY[a.entity] ?? a.entity}${label}`;
  if (a.action === "role_change") text += ` (${String(a.metadata?.from ?? "none")} → ${String(a.metadata?.to ?? "none")})`;
  return text;
}

export const AUDIT_ACTIONS = Object.keys(VERB);
export const AUDIT_ENTITIES = Object.keys(ENTITY);
export const entityLabel = (e: string) => ENTITY[e] ?? e;
