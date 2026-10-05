import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { RichDoc, RichMark, RichNode } from "@/lib/cms/types";
import { headingIds } from "@/lib/rich-text/text";

/**
 * Renders CMS rich text (Tiptap JSON) with an explicit whitelist of node and mark types.
 * Nothing is ever injected as HTML, unknown nodes are dropped, and URLs are restricted
 * to safe schemes — so stored content cannot run script (XSS-safe by construction).
 */

export type RichTextVariant = "article" | "page";

const styles = {
  article: {
    p: "mt-4 text-[1.05rem] leading-[1.8] text-muted",
    h2: "text-2xl font-semibold tracking-[-0.02em]",
    h3: "mt-8 text-xl font-semibold tracking-[-0.015em]",
    h4: "mt-6 text-lg font-semibold",
    ul: "mt-4 list-disc space-y-2 pl-6 text-[1.05rem] leading-[1.7] text-muted marker:text-brand-600",
    ol: "mt-4 list-decimal space-y-2 pl-6 text-[1.05rem] leading-[1.7] text-muted marker:font-semibold marker:text-brand-700",
    li: "[&>p]:mt-0",
    quote: "mt-6 border-l-4 border-brand-200 pl-5 text-[1.05rem] italic leading-[1.8] text-navy-800",
    code: "mt-5 overflow-x-auto rounded-xl bg-navy-950 p-4 text-sm leading-relaxed text-slate-100",
    hr: "my-10 border-line",
    img: "mt-6 h-auto w-full rounded-[var(--radius-card)] border border-line",
    a: "font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800",
  },
  page: {
    p: "prose-body mt-4",
    h2: "h-section mt-12",
    h3: "mt-8 text-xl font-semibold",
    h4: "mt-6 text-lg font-semibold",
    ul: "mt-4 list-disc space-y-2 pl-6 text-muted marker:text-brand-600",
    ol: "mt-4 list-decimal space-y-2 pl-6 text-muted marker:font-semibold marker:text-brand-700",
    li: "[&>p]:mt-0",
    quote: "mt-6 border-l-4 border-brand-200 pl-5 italic text-navy-800",
    code: "mt-5 overflow-x-auto rounded-xl bg-navy-950 p-4 text-sm text-slate-100",
    hr: "my-10 border-line",
    img: "mt-6 h-auto w-full rounded-[var(--radius-card)] border border-line",
    a: "font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800",
  },
} as const;

type Styles = (typeof styles)[RichTextVariant];

export function safeHref(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const href = raw.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (/^#[A-Za-z0-9_-]+$/.test(href)) return href;
  return null;
}

export function safeImageSrc(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const src = raw.trim();
  if (/^https:\/\//i.test(src) || /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//i.test(src)) return src;
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  return null;
}

function renderMarks(text: string, marks: RichMark[] | undefined, s: Styles, key: string): ReactNode {
  let out: ReactNode = text;
  for (const [i, m] of (marks ?? []).entries()) {
    const k = `${key}-m${i}`;
    switch (m.type) {
      case "bold":
        out = <strong key={k}>{out}</strong>;
        break;
      case "italic":
        out = <em key={k}>{out}</em>;
        break;
      case "underline":
        out = <u key={k}>{out}</u>;
        break;
      case "strike":
        out = <s key={k}>{out}</s>;
        break;
      case "code":
        out = (
          <code key={k} className="rounded bg-surface px-1.5 py-0.5 text-[0.9em] text-navy-900">
            {out}
          </code>
        );
        break;
      case "link": {
        const href = safeHref(m.attrs?.href);
        if (!href) break;
        const external = /^https?:\/\//i.test(href);
        out = external ? (
          <a key={k} href={href} className={s.a} target="_blank" rel="noopener noreferrer">
            {out}
          </a>
        ) : href.startsWith("/") ? (
          <Link key={k} href={href} className={s.a}>
            {out}
          </Link>
        ) : (
          <a key={k} href={href} className={s.a}>
            {out}
          </a>
        );
        break;
      }
      default:
        break; // unknown marks are ignored
    }
  }
  return out;
}

function renderInline(nodes: RichNode[] | undefined, s: Styles, key: string): ReactNode[] {
  return (nodes ?? []).map((n, i) => {
    const k = `${key}-${i}`;
    if (n.type === "text" && typeof n.text === "string") {
      if (!n.marks?.length) return n.text;
      return <Fragment key={k}>{renderMarks(n.text, n.marks, s, k)}</Fragment>;
    }
    if (n.type === "hardBreak") return <br key={k} />;
    return null;
  });
}

function renderBlock(n: RichNode, s: Styles, key: string, ids: Map<RichNode, string>): ReactNode {
  switch (n.type) {
    case "paragraph":
      return (
        <p key={key} className={s.p}>
          {renderInline(n.content, s, key)}
        </p>
      );
    case "heading": {
      const level = Number(n.attrs?.level ?? 2);
      const id = ids.get(n);
      if (level <= 2)
        return (
          <h2 key={key} id={id} className={s.h2}>
            {renderInline(n.content, s, key)}
          </h2>
        );
      if (level === 3)
        return (
          <h3 key={key} id={id} className={s.h3}>
            {renderInline(n.content, s, key)}
          </h3>
        );
      return (
        <h4 key={key} id={id} className={s.h4}>
          {renderInline(n.content, s, key)}
        </h4>
      );
    }
    case "bulletList":
    case "orderedList": {
      const items = (n.content ?? []).filter((c) => c.type === "listItem");
      const children = items.map((li, i) =>
        li.content?.length === 1 && li.content[0].type === "paragraph" ? (
          <li key={`${key}-${i}`}>{renderInline(li.content[0].content, s, `${key}-${i}`)}</li>
        ) : (
        <li key={`${key}-${i}`} className={s.li}>
          {(li.content ?? []).map((c, j) =>
            c.type === "paragraph" ? (
              <span key={`${key}-${i}-${j}`} className="block">
                {renderInline(c.content, s, `${key}-${i}-${j}`)}
              </span>
            ) : (
              renderBlock(c, s, `${key}-${i}-${j}`, ids)
            ),
          )}
        </li>
        ),
      );
      if (n.type === "orderedList") {
        const start = Number(n.attrs?.start ?? 1);
        return (
          <ol key={key} className={s.ol} start={Number.isFinite(start) && start > 1 ? start : undefined}>
            {children}
          </ol>
        );
      }
      return (
        <ul key={key} className={s.ul}>
          {children}
        </ul>
      );
    }
    case "blockquote":
      return (
        <blockquote key={key} className={s.quote}>
          {(n.content ?? []).map((c, i) => renderBlock(c, s, `${key}-${i}`, ids))}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key} className={s.code}>
          <code>{(n.content ?? []).map((c) => c.text ?? "").join("")}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} className={s.hr} />;
    case "image": {
      const src = safeImageSrc(n.attrs?.src);
      if (!src) return null;
      const alt = typeof n.attrs?.alt === "string" ? n.attrs.alt : "";
      return (
        // Rich-text images have unknown dimensions; a lazy <img> avoids layout-blocking work.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={src} alt={alt} loading="lazy" decoding="async" className={s.img} />
      );
    }
    default:
      return null; // unknown / disallowed node types are dropped
  }
}

export function RichText({ doc, variant = "article", className }: { doc: RichDoc | null | undefined; variant?: RichTextVariant; className?: string }) {
  if (!doc || doc.type !== "doc") return null;
  const s = styles[variant];
  const ids = new Map(headingIds(doc).map((h) => [h.node, h.id] as const));
  const nodes = doc.content ?? [];

  if (variant === "page") {
    return <div className={className}>{nodes.map((n, i) => renderBlock(n, s, `n${i}`, ids))}</div>;
  }

  // Article: each H2 opens a <section aria-labelledby> (same structure as the original blog markup).
  const groups: { heading: RichNode | null; body: { node: RichNode; i: number }[] }[] = [{ heading: null, body: [] }];
  nodes.forEach((n, i) => {
    if (n.type === "heading" && Number(n.attrs?.level ?? 2) <= 2) groups.push({ heading: n, body: [] });
    else groups[groups.length - 1].body.push({ node: n, i });
  });
  const out: ReactNode[] = groups.flatMap((g, gi): ReactNode[] => {
    const body: ReactNode[] = g.body.map(({ node, i }) => renderBlock(node, s, `n${i}`, ids));
    if (!g.heading) return body;
    const id = ids.get(g.heading);
    return [
      <section key={`g${gi}`} aria-labelledby={id} className="mt-10">
        {renderBlock(g.heading, s, `h${gi}`, ids)}
        {body}
      </section>,
    ];
  });
  return className ? <div className={className}>{out}</div> : <>{out}</>;
}
