"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { pageSchema, type PageInput, type PageValues } from "@/lib/schemas/page";
import { savePage } from "@/lib/admin/actions/pages";
import type { BlockType } from "@/lib/cms/blocks";
import type { ContentStatus, RichDoc } from "@/lib/cms/types";
import { Alert } from "../ui/Feedback";
import { describedBy, Field, Input, Textarea } from "../ui/Field";
import { Tabs } from "../ui/Tabs";
import { useToast } from "../ui/Toast";
import { ImageField } from "../media/ImageField";
import { RichTextEditor } from "../editors/RichTextEditor";
import { SectionsEditor, newKey, type SectionValue } from "../editors/SectionsEditor";
import { PublishPanel } from "./PublishPanel";
import { SeoFields } from "./SeoFields";
import { SlugInput } from "./SlugInput";
import { useUnsavedChanges } from "./useUnsavedChanges";

export type PageFormInitial = Omit<PageValues, "sections"> & {
  id: string | null;
  system_key: string | null;
  public_path: string;
  updated_at?: string;
  sections: { id: string; type: BlockType; data: Record<string, unknown> }[];
};

type Errors = Record<string, string>;

export function PageForm({ initial, canPublish }: { initial: PageFormInitial; canPublish: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const { id, system_key, public_path, updated_at, sections: initialSections, ...rest } = initial;
  const [v, setV] = useState<Omit<PageValues, "sections">>(rest);
  const [sections, setSections] = useState<SectionValue[]>(() => initialSections.map((s) => ({ key: s.id || newKey(), type: s.type, data: s.data })));
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("content");
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  const set = useCallback(<K extends keyof typeof v>(k: K, val: (typeof v)[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    setDirty(true);
  }, []);
  const setSlug = useCallback((s: string) => set("slug", s), [set]);
  const isSystem = Boolean(system_key);

  const sectionErrors: Record<number, string> = {};
  for (const [k, msg] of Object.entries(errors)) {
    const m = /^sections\.(\d+)/.exec(k);
    if (m) sectionErrors[Number(m[1])] = msg;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const input: PageInput = { ...v, sections: sections.map((s) => ({ type: s.type, data: s.data })) };
    const parsed = pageSchema.safeParse(input);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[i.path.join(".")] ??= i.message;
      setErrors(errs);
      setFormError("Please fix the highlighted fields.");
      const first = Object.keys(errs)[0] ?? "";
      setTab(first.startsWith("seo") || first.startsWith("og") || first.startsWith("canonical") ? "seo" : first.startsWith("sections") ? "sections" : "content");
      return;
    }
    setErrors({});
    setSaving(true);
    const res = await savePage(id, input);
    setSaving(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      setFormError(res.error);
      toast.error(res.error);
      return;
    }
    setDirty(false);
    toast.success(res.message ?? "Saved.");
    if (!id && res.data) router.replace(`/admin/pages/${res.data.id}/`);
    else router.refresh();
  }

  const content = (
    <div className="space-y-5">
      <Field label="Title" htmlFor="title" error={errors.title} help="Used in the admin, breadcrumbs and as the default heading.">
        <Input id="title" value={v.title} onChange={(e) => set("title", e.target.value)} maxLength={200} {...describedBy("title", errors.title, true)} />
      </Field>
      {!isSystem && <SlugInput value={v.slug} onChange={setSlug} title={v.title} prefix="/" error={errors.slug} published={initial.status === "PUBLISHED"} />}
      <div className="grid gap-5 lg:grid-cols-2">
        <Field
          label="Hero heading"
          htmlFor="hero_heading"
          error={errors.hero_heading}
          help={system_key === "home" ? "New line = line break. Wrap words in [[ ]] for the gradient highlight." : "Empty = the page title."}
          className="lg:col-span-2"
        >
          {system_key === "home" ? (
            <Textarea id="hero_heading" rows={2} value={v.hero_heading} onChange={(e) => set("hero_heading", e.target.value)} {...describedBy("hero_heading", errors.hero_heading, true)} />
          ) : (
            <Input id="hero_heading" value={v.hero_heading} onChange={(e) => set("hero_heading", e.target.value)} {...describedBy("hero_heading", errors.hero_heading, true)} />
          )}
        </Field>
        <Field label="Hero description" htmlFor="hero_description" error={errors.hero_description} className="lg:col-span-2">
          <Textarea id="hero_description" rows={3} value={v.hero_description} onChange={(e) => set("hero_description", e.target.value)} {...describedBy("hero_description", errors.hero_description)} />
        </Field>
        <Field label="Hero button text" htmlFor="hero_cta_label" error={errors.hero_cta_label} help={isSystem ? "Empty = the page's usual button." : undefined}>
          <Input id="hero_cta_label" value={v.hero_cta_label} onChange={(e) => set("hero_cta_label", e.target.value)} {...describedBy("hero_cta_label", errors.hero_cta_label, isSystem)} />
        </Field>
        <Field label="Hero button link" htmlFor="hero_cta_url" error={errors.hero_cta_url}>
          <Input id="hero_cta_url" value={v.hero_cta_url} onChange={(e) => set("hero_cta_url", e.target.value)} placeholder="/contact/" {...describedBy("hero_cta_url", errors.hero_cta_url)} />
        </Field>
      </div>
      {!isSystem && (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Hero image" htmlFor="hero_image_url" error={errors.hero_image_url}>
              <ImageField id="hero_image_url" value={v.hero_image_url} onChange={(x) => set("hero_image_url", x)} folder="pages" />
            </Field>
            <Field label="Featured image" htmlFor="featured_image_url" error={errors.featured_image_url} help="Shown under the hero and used for social sharing if no OG image is set.">
              <ImageField id="featured_image_url" value={v.featured_image_url} onChange={(x) => set("featured_image_url", x)} folder="pages" />
            </Field>
          </div>
          <div>
            <p className="adm-label" id="content-label">
              Content
            </p>
            <RichTextEditor id="content" labelledBy="content-label" value={(v.content as RichDoc | null) ?? null} onChange={(d) => set("content", d)} folder="pages" />
            <p className="adm-muted mt-1.5 text-xs">Optional intro text shown before the sections.</p>
          </div>
        </>
      )}
    </div>
  );

  const tabs = [
    { key: "content", label: "Content", content },
    ...(isSystem
      ? []
      : [
          {
            key: "sections",
            label: "Sections",
            badge: <span className="rounded-full bg-slate-100 px-1.5 text-xs dark:bg-white/10">{sections.length}</span>,
            content: (
              <SectionsEditor
                value={sections}
                onChange={(s) => {
                  setSections(s);
                  setDirty(true);
                }}
                errors={sectionErrors}
              />
            ),
          },
        ]),
    {
      key: "seo",
      label: "SEO",
      content: (
        <SeoFields
          value={v}
          onChange={(patch) => {
            setV((p) => ({ ...p, ...patch }));
            setDirty(true);
          }}
          errors={errors}
          fallbackTitle={`${v.title} | Pytron Digital`}
          fallbackDescription={v.hero_description}
          url={`digital.pytron.in${isSystem ? public_path : `/${v.slug}/`}`}
        />
      ),
    },
  ];

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        {formError && (
          <div className="mb-4">
            <Alert tone="error">{formError}</Alert>
          </div>
        )}
        {isSystem && (
          <div className="mb-4">
            <Alert tone="info" title="Built-in page">
              The layout of this page lives in the website code. Here you control its hero copy and SEO. Unpublish this record to fall back to the original copy.
            </Alert>
          </div>
        )}
        <div className="adm-card p-5">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>
      </div>
      <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <PublishPanel
          status={v.status as ContentStatus}
          onStatus={(s) => set("status", s)}
          canPublish={canPublish}
          date={v.published_date}
          onDate={(d) => set("published_date", d)}
          showDate={!isSystem}
          saving={saving}
          dirty={dirty}
          previewHref={id ? `/api/preview/?type=page&id=${id}` : undefined}
          liveHref={id ? (isSystem ? public_path : `/${initial.slug}/`) : undefined}
          updatedAt={updated_at}
        />
      </div>
    </form>
  );
}
