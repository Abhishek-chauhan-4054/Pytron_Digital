/** "AI Digital Marketing Services" → "ai-digital-marketing-services" */
export function slugify(input: string, max = 120) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/g, "");
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
