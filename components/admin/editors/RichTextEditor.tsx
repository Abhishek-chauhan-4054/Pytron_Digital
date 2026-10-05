"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import type { RichDoc } from "@/lib/cms/types";
import type { MediaBucket } from "@/lib/cms/types";
import { MediaPicker } from "../media/MediaPicker";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";

/** Headings keep a stable `id` (used for the article table of contents and anchor links). */
const HeadingWithId = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("id"),
        renderHTML: (attrs: { id?: string | null }) => (attrs.id ? { id: attrs.id } : {}),
      },
    };
  },
}).configure({ levels: [2, 3, 4] });

const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

function ToolbarButton({ onClick, active, disabled, label, children }: { onClick: () => void; active?: boolean; disabled?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active ?? undefined}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white ${
        active ? "bg-slate-200/80 text-slate-900 dark:bg-white/15 dark:text-white" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onLink, onImage }: { editor: Editor; onLink: () => void; onImage: () => void }) {
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      code: e.isActive("codeBlock"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();
  const i = "h-4 w-4";
  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/80 px-2 py-1.5 dark:border-white/10 dark:bg-white/[0.03]">
      <ToolbarButton label="Heading 2" active={st.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}>
        <Heading2 className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Heading 3" active={st.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}>
        <Heading3 className={i} aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
      <ToolbarButton label="Bold" active={st.bold} onClick={() => c().toggleBold().run()}>
        <Bold className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={st.italic} onClick={() => c().toggleItalic().run()}>
        <Italic className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Underline" active={st.underline} onClick={() => c().toggleUnderline().run()}>
        <UnderlineIcon className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={st.strike} onClick={() => c().toggleStrike().run()}>
        <Strikethrough className={i} aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
      <ToolbarButton label="Bulleted list" active={st.bullet} onClick={() => c().toggleBulletList().run()}>
        <List className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={st.ordered} onClick={() => c().toggleOrderedList().run()}>
        <ListOrdered className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Quote" active={st.quote} onClick={() => c().toggleBlockquote().run()}>
        <Quote className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Code block" active={st.code} onClick={() => c().toggleCodeBlock().run()}>
        <Code2 className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Divider" onClick={() => c().setHorizontalRule().run()}>
        <Minus className={i} aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
      <ToolbarButton label={st.link ? "Edit link" : "Add link"} active={st.link} onClick={onLink}>
        <Link2 className={i} aria-hidden="true" />
      </ToolbarButton>
      {st.link && (
        <ToolbarButton label="Remove link" onClick={() => c().extendMarkRange("link").unsetLink().run()}>
          <Unlink className={i} aria-hidden="true" />
        </ToolbarButton>
      )}
      <ToolbarButton label="Insert image" onClick={onImage}>
        <ImagePlus className={i} aria-hidden="true" />
      </ToolbarButton>
      <span className="ml-auto" />
      <ToolbarButton label="Undo" disabled={!st.canUndo} onClick={() => c().undo().run()}>
        <Undo2 className={i} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="Redo" disabled={!st.canRedo} onClick={() => c().redo().run()}>
        <Redo2 className={i} aria-hidden="true" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder = "Start writing…",
  bucket = "website-images",
  folder = "general",
  labelledBy,
}: {
  id: string;
  value: RichDoc | null;
  onChange: (doc: RichDoc) => void;
  placeholder?: string;
  bucket?: MediaBucket;
  folder?: string;
  labelledBy?: string;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkError, setLinkError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        link: {
          openOnClick: false,
          autolink: true,
          protocols: ["http", "https", "mailto", "tel"],
          isAllowedUri: (url) => SAFE_LINK.test(url),
          HTMLAttributes: { rel: "noopener noreferrer", target: null },
        },
      }),
      HeadingWithId,
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? { type: "doc", content: [] },
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getJSON() as RichDoc),
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) {
    return <div className="adm-skeleton h-72 w-full" aria-label="Loading editor" role="status" />;
  }

  return (
    <div className="adm-tiptap overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-brand-500 dark:border-white/15 dark:bg-white/[0.03]">
      <Toolbar
        editor={editor}
        onLink={() => {
          setLinkValue((editor.getAttributes("link").href as string | undefined) ?? "");
          setLinkError("");
          setLinkOpen(true);
        }}
        onImage={() => setPickerOpen(true)}
      />
      <EditorContent editor={editor} />

      <Dialog
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="Link"
        description="A page on this site (e.g. /contact/) or a full https:// address."
        size="sm"
        footer={
          <>
            <Button onClick={() => setLinkOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                const url = linkValue.trim();
                if (!url) {
                  editor.chain().focus().extendMarkRange("link").unsetLink().run();
                  setLinkOpen(false);
                  return;
                }
                if (!SAFE_LINK.test(url)) {
                  setLinkError("Use a path starting with / or a link starting with https://");
                  return;
                }
                editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                setLinkOpen(false);
              }}
            >
              Apply
            </Button>
          </>
        }
      >
        <label htmlFor={`${id}-link`} className="adm-label">
          URL
        </label>
        <input
          id={`${id}-link`}
          className="adm-input"
          value={linkValue}
          onChange={(e) => setLinkValue(e.target.value)}
          placeholder="https://"
          aria-invalid={linkError ? true : undefined}
          autoFocus
        />
        {linkError && <p className="mt-1.5 text-xs font-medium text-red-600">{linkError}</p>}
      </Dialog>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        bucket={bucket}
        folder={folder}
        onSelect={(m) => editor.chain().focus().setImage({ src: m.url, alt: m.alt }).run()}
      />
    </div>
  );
}
