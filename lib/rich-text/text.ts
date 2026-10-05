import type { RichDoc, RichNode } from "@/lib/cms/types";
import { slugify } from "@/lib/slug";

/** Plain text of a node tree (for reading time, search snippets, validation). */
export function nodeText(node: RichNode | RichDoc | null | undefined): string {
  if (!node) return "";
  if ("text" in node && typeof node.text === "string") return node.text;
  const parts = (node.content ?? []).map((c) => nodeText(c));
  const block = ["paragraph", "heading", "listItem", "blockquote", "codeBlock"].includes(node.type);
  return parts.join(block ? "" : " ") + (block ? " " : "");
}

export function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Same rule the site already used: 220 words per minute, minimum 1. */
export function readingMinutesFor(...texts: string[]) {
  return Math.max(1, Math.round(wordCount(texts.join(" ")) / 220));
}

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Stable ids for H2 headings (table of contents + anchors). Uses the stored id when it
 * is safe, otherwise a slug of the text; de-duplicates.
 */
export function headingIds(doc: RichDoc | null | undefined) {
  const seen = new Map<string, number>();
  const out: { node: RichNode; id: string; text: string; level: number }[] = [];
  for (const n of doc?.content ?? []) {
    if (n.type !== "heading") continue;
    const text = nodeText(n).trim();
    const stored = typeof n.attrs?.id === "string" && ID_RE.test(n.attrs.id) ? n.attrs.id : "";
    let id = stored || slugify(text, 80) || "section";
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count) id = `${id}-${count + 1}`;
    out.push({ node: n, id, text, level: Number(n.attrs?.level ?? 2) });
  }
  return out;
}

export function isEmptyDoc(doc: RichDoc | null | undefined) {
  return !doc || (nodeText(doc).trim().length === 0 && !(doc.content ?? []).some((n) => n.type === "image"));
}
