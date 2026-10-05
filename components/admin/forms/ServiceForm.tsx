"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { z } from "zod";
import { serviceSchema } from "@/lib/schemas/service";
import { saveService } from "@/lib/admin/actions/services";
import { PILLARS, type ContentStatus, type RichDoc } from "@/lib/cms/types";
import { Icon, ICON_NAMES } from "@/components/Icon";
import type { IconName } from "@/content/types";
import { Alert } from "../ui/Feedback";
import { describedBy, Field, Input, Select, Textarea } from "../ui/Field";
import { Tabs } from "../ui/Tabs";
import { useToast } from "../ui/Toast";
import { ImageField } from "../media/ImageField";
import { RichTextEditor } from "../editors/RichTextEditor";
import { ListInput } from "./ListInput";
import { PublishPanel } from "./PublishPanel";
import { SeoFields } from "./SeoFields";
import { SlugInput } from "./SlugInput";
import { useUnsavedChanges } from "./useUnsavedChanges";

export type ServiceValues = z.output<typeof serviceSchema>;

export function ServiceForm({ id, initial, canPublish, builtIn, updatedAt }: { id: string | null; initial: ServiceValues; canPublish: boolean; builtIn: boolean; updatedAt?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [v, setV] = useState<ServiceValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("content");
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);
  const set = useCallback(<K extends keyof ServiceValues>(k: K, val: ServiceValues[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    setDirty(true);
  }, []);
  const setSlug = useCallback((s: string) => set("slug", s), [set]);
  const prefix = PILLARS.find((p) => p.key === v.pillar)!.path;

  const featureErrors: Record<number, string> = {};
  for (const [k, m] of Object.entries(errors)) {
    const mm = /^features\.(\d+)/.exec(k);
    if (mm) featureErrors[Number(mm[1])] = m;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const parsed = serviceSchema.safeParse(v);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path.join(".")] ??= i.message;
      setErrors(errs);
      setFormError("Please fix the highlighted fields.");
      setTab(Object.keys(errs).some((k) => k.startsWith("seo") || k.startsWith("og")) && !Object.keys(errs).some((k) => !k.startsWith("seo") && !k.startsWith("og")) ? "seo" : "content");
      return;
    }
    setErrors({});
    setSaving(true);
    const res = await saveService(id, v);
    setSaving(false);
    if (!res.ok) {
      setErrors(res.fieldErrors ?? {});
      setFormError(res.error);
      toast.error(res.error);
      return;
    }
    setDirty(false);
    toast.success(res.message ?? "Saved.");
    if (!id && res.data) router.replace(`/admin/services/${res.data.id}/`);
    else router.refresh();
  }

  const content = (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Service area" htmlFor="pillar" error={errors.pillar} help="Decides the URL and which hub page lists it.">
          <Select id="pillar" value={v.pillar} onChange={(e) => set("pillar", e.target.value as ServiceValues["pillar"])}>
            {PILLARS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Icon" htmlFor="icon" error={errors.icon}>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">
              <Icon name={(ICON_NAMES as string[]).includes(v.icon) ? (v.icon as IconName) : "sparkles"} />
            </span>
            <Select id="icon" value={v.icon} onChange={(e) => set("icon", e.target.value)}>
              {ICON_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
        </Field>
      </div>
      <Field label="Name" htmlFor="name" error={errors.name} help="Shown on cards, menus and breadcrumbs.">
        <Input id="name" value={v.name} onChange={(e) => set("name", e.target.value)} maxLength={120} {...describedBy("name", errors.name, true)} />
      </Field>
      <SlugInput value={v.slug} onChange={setSlug} title={v.name} prefix={prefix} error={errors.slug} published={initial.status === "PUBLISHED"} />
      <Field label="Short description" htmlFor="short_description" error={errors.short_description} help="One line for service cards." counter={{ value: v.short_description.length, max: 160 }}>
        <Textarea id="short_description" rows={2} value={v.short_description} onChange={(e) => set("short_description", e.target.value)} {...describedBy("short_description", errors.short_description, true)} />
      </Field>
      <Field label="Hero heading (H1)" htmlFor="hero_heading" error={errors.hero_heading} help="Empty = the service name.">
        <Input id="hero_heading" value={v.hero_heading} onChange={(e) => set("hero_heading", e.target.value)} {...describedBy("hero_heading", errors.hero_heading, true)} />
      </Field>
      <Field label="Intro" htmlFor="intro" error={errors.intro} help="The paragraph under the heading.">
        <Textarea id="intro" rows={4} value={v.intro} onChange={(e) => set("intro", e.target.value)} {...describedBy("intro", errors.intro, true)} />
      </Field>
      <Field label="Features — what's included" htmlFor="features" error={errors.features}>
        <ListInput id="features" value={v.features} onChange={(f) => set("features", f)} itemLabel="Feature" errors={featureErrors} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Button text" htmlFor="cta_label" error={errors.cta_label} help="Empty = the area's usual button.">
          <Input id="cta_label" value={v.cta_label} onChange={(e) => set("cta_label", e.target.value)} {...describedBy("cta_label", errors.cta_label, true)} />
        </Field>
        <Field label="Button link" htmlFor="cta_url" error={errors.cta_url}>
          <Input id="cta_url" value={v.cta_url} onChange={(e) => set("cta_url", e.target.value)} placeholder="/contact/?interest=…" {...describedBy("cta_url", errors.cta_url)} />
        </Field>
      </div>
      <Field label="Image" htmlFor="image_url" error={errors.image_url} help={builtIn ? "Optional." : "Shown beside the description."}>
        <ImageField id="image_url" value={v.image_url} onChange={(x) => set("image_url", x)} bucket="service-images" folder="services" />
      </Field>
      <div>
        <p className="adm-label" id="full-desc-label">
          Full description
        </p>
        <RichTextEditor id="full_description" labelledBy="full-desc-label" value={(v.full_description as RichDoc | null) ?? null} onChange={(d) => set("full_description", d)} bucket="service-images" folder="services" />
        <p className="adm-muted mt-1.5 text-xs">
          {builtIn
            ? "Optional overview shown right after the hero. The detailed sections of this page (problem, process, FAQ…) are built into the site."
            : "The main content of this service page."}
        </p>
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
                    fallbackTitle={`${v.name} | Pytron Digital`}
                    fallbackDescription={v.short_description}
                    url={`digital.pytron.in${prefix}${v.slug}/`}
                    showCanonical={false}
                    showRobots={false}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
      <div className="xl:sticky xl:top-20 xl:self-start">
        <PublishPanel
          status={v.status as ContentStatus}
          onStatus={(s) => set("status", s)}
          canPublish={canPublish}
          showDate={false}
          saving={saving}
          dirty={dirty}
          previewHref={id ? `/api/preview/?type=service&id=${id}` : undefined}
          liveHref={id ? `${PILLARS.find((p) => p.key === initial.pillar)!.path}${initial.slug}/` : undefined}
          updatedAt={updatedAt}
        />
      </div>
    </form>
  );
}
