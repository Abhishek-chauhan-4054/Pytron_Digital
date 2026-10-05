"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { z } from "zod";
import { blogSchema } from "@/lib/schemas/blog";
import { saveBlog } from "@/lib/admin/actions/blogs";
import type { ContentStatus, RichDoc } from "@/lib/cms/types";
import { nodeText, readingMinutesFor } from "@/lib/rich-text/text";
import { Alert } from "../ui/Feedback";
import { describedBy, Field, Input, Select, Textarea } from "../ui/Field";
import { Tabs } from "../ui/Tabs";
import { useToast } from "../ui/Toast";
import { ImageField } from "../media/ImageField";
import { RichTextEditor } from "../editors/RichTextEditor";
import { PublishPanel } from "./PublishPanel";
import { SeoFields } from "./SeoFields";
import { SlugInput } from "./SlugInput";
import { TagInput } from "./TagInput";
import { useUnsavedChanges } from "./useUnsavedChanges";

export type BlogValues = z.output<typeof blogSchema>;

export function BlogForm({
  id,
  initial,
  canPublish,
  categories,
  tagSuggestions,
  updatedAt,
}: {
  id: string | null;
  initial: BlogValues;
  canPublish: boolean;
  categories: { id: string; name: string }[];
  tagSuggestions: string[];
  updatedAt?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [v, setV] = useState<BlogValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("content");
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);
  const set = useCallback(<K extends keyof BlogValues>(k: K, val: BlogValues[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    setDirty(true);
  }, []);
  const setSlug = useCallback((s: string) => set("slug", s), [set]);
  const minutes = useMemo(() => readingMinutesFor(v.intro, nodeText(v.content as RichDoc | null)), [v.intro, v.content]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const parsed = blogSchema.safeParse(v);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path.join(".")] ??= i.message;
      setErrors(errs);
      setFormError("Please fix the highlighted fields.");
      const keys = Object.keys(errs);
      setTab(keys.every((k) => /^(seo|og|canonical|robots)/.test(k)) ? "seo" : "content");
      return;
    }
    setErrors({});
    setSaving(true);
    const res = await saveBlog(id, v);
    setSaving(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      setFormError(res.error);
      toast.error(res.error);
      return;
    }
    setDirty(false);
    toast.success(res.message ?? "Saved.");
    if (!id && res.data) router.replace(`/admin/blog/${res.data.id}/`);
    else router.refresh();
  }

  const content = (
    <div className="space-y-5">
      <Field label="Title" htmlFor="title" error={errors.title}>
        <Input id="title" value={v.title} onChange={(e) => set("title", e.target.value)} maxLength={200} className="text-base font-medium" {...describedBy("title", errors.title)} />
      </Field>
      <SlugInput value={v.slug} onChange={setSlug} title={v.title} prefix="/blog/" error={errors.slug} published={initial.status === "PUBLISHED"} />
      <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt} help="Shown on blog cards and under the article title." counter={{ value: v.excerpt.length, max: 300 }}>
        <Textarea id="excerpt" rows={3} value={v.excerpt} onChange={(e) => set("excerpt", e.target.value)} {...describedBy("excerpt", errors.excerpt, true)} />
      </Field>
      <Field label="Lead paragraph" htmlFor="intro" error={errors.intro} help="Optional larger opening paragraph.">
        <Textarea id="intro" rows={3} value={v.intro} onChange={(e) => set("intro", e.target.value)} {...describedBy("intro", errors.intro, true)} />
      </Field>
      <div>
        <div className="flex items-baseline justify-between">
          <p className="adm-label" id="content-label">
            Article
          </p>
          <span className="adm-muted text-xs">≈ {minutes} min read</span>
        </div>
        <RichTextEditor
          id="content"
          labelledBy="content-label"
          value={(v.content as RichDoc | null) ?? null}
          onChange={(d) => set("content", d)}
          bucket="blog-images"
          folder="blog"
          placeholder="Write the article. Use Heading 2 for sections — they build the table of contents."
        />
        {errors.content && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.content}</p>}
      </div>
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        {formError && (
          <div className="mb-4">
            <Alert tone="error">{formError}</Alert>
          </div>
        )}
        <div className="adm-card p-5">
          <Tabs
            active={tab}
            onChange={setTab}
            tabs={[
              { key: "content", label: "Content", content },
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
                    fallbackDescription={v.excerpt}
                    url={`digital.pytron.in/blog/${v.slug}/`}
                    showFollow={false}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
      <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <PublishPanel
          status={v.status as ContentStatus}
          onStatus={(s) => set("status", s)}
          canPublish={canPublish}
          date={v.published_date}
          onDate={(d) => set("published_date", d)}
          saving={saving}
          dirty={dirty}
          previewHref={id ? `/api/preview/?type=blog&id=${id}` : undefined}
          liveHref={id ? `/blog/${initial.slug}/` : undefined}
          updatedAt={updatedAt}
        />
        <section className="adm-card space-y-4 p-5" aria-labelledby="post-details">
          <h2 id="post-details" className="text-sm font-semibold">
            Details
          </h2>
          <Field label="Category" htmlFor="category_id" error={errors.category_id}>
            <Select id="category_id" value={v.category_id} onChange={(e) => set("category_id", e.target.value)}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tags" htmlFor="tags" error={errors.tags}>
            <TagInput id="tags" value={v.tags} onChange={(t) => set("tags", t)} suggestions={tagSuggestions} />
          </Field>
          <Field label="Author" htmlFor="author_name" error={errors.author_name}>
            <Input id="author_name" value={v.author_name} onChange={(e) => set("author_name", e.target.value)} {...describedBy("author_name", errors.author_name)} />
          </Field>
          <Field label="Call to action" htmlFor="cta" help="The box at the end of the article.">
            <Select id="cta" value={v.cta} onChange={(e) => set("cta", e.target.value as BlogValues["cta"])}>
              <option value="marketing">Marketing — Grow With Pytron</option>
              <option value="web">Web — Build Your Website</option>
              <option value="ai">AI — Automate Your Workflow</option>
            </Select>
          </Field>
          <Field label="Featured image" htmlFor="featured_image_url" error={errors.featured_image_url} help="Shown above the article and used when shared.">
            <ImageField id="featured_image_url" value={v.featured_image_url} onChange={(x) => set("featured_image_url", x)} bucket="blog-images" folder="blog" />
          </Field>
        </section>
      </div>
    </form>
  );
}
