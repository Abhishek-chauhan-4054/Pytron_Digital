import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import { TAGS } from "@/lib/cms/public/core";

function path(p: string) {
  revalidatePath(p);
  // Next normalises routes without the trailing slash; invalidate both spellings.
  if (p.length > 1 && p.endsWith("/")) revalidatePath(p.slice(0, -1));
}

/**
 * Push CMS changes to the public site immediately — no redeploy needed.
 * Tags expire cached queries; paths expire pre-rendered (ISR) pages.
 */
export function revalidatePublic(kind: keyof typeof TAGS, paths: string[] = []) {
  updateTag(TAGS[kind]);
  if (kind === "blogs" || kind === "services" || kind === "pages") updateTag(TAGS.redirects);
  for (const p of paths) path(p);
  path("/site-map/");
  revalidatePath("/sitemap.xml");
  if (kind === "navigation" || kind === "settings" || kind === "seo") {
    // Footer, contact details and metadata appear on every page.
    revalidatePath("/", "layout");
  }
  if (kind === "blogs") {
    revalidatePath("/(site)/blog/category/[category]", "page");
    revalidatePath("/(site)/blog/tag/[tag]", "page");
  }
  if (kind === "services") {
    // CMS pages may embed a live "Services" block.
    revalidatePath("/(site)/[slug]", "page");
  }
}
