"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { z } from "zod";
import { settingsSchema } from "@/lib/schemas/site";
import { saveSettings } from "@/lib/admin/actions/site";
import { Button } from "../ui/Button";
import { describedBy, Field, Input } from "../ui/Field";
import { Card } from "../ui/Layout";
import { useToast } from "../ui/Toast";
import { ImageField } from "../media/ImageField";

type V = z.output<typeof settingsSchema>;

export function SettingsForm({ initial, canEdit }: { initial: V; canEdit: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [v, setV] = useState<V>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (k: keyof V, val: string) => setV((p) => ({ ...p, [k]: val }));
  const text = (k: keyof V, label: string, opts: { type?: string; help?: string; placeholder?: string } = {}) => (
    <Field label={label} htmlFor={k} error={errors[k]} help={opts.help}>
      <Input id={k} type={opts.type ?? "text"} value={v[k]} disabled={!canEdit} placeholder={opts.placeholder} onChange={(e) => set(k, e.target.value)} {...describedBy(k, errors[k], Boolean(opts.help))} />
    </Field>
  );

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const parsed = settingsSchema.safeParse(v);
        if (!parsed.success) {
          const errs: Record<string, string> = {};
          for (const i of parsed.error.issues) errs[i.path.join(".")] ??= i.message;
          setErrors(errs);
          return;
        }
        setErrors({});
        setSaving(true);
        const res = await saveSettings(v);
        setSaving(false);
        if (!res.ok) {
          setErrors(res.fieldErrors ?? {});
          return toast.error(res.error);
        }
        toast.success(res.message ?? "Saved.");
        router.refresh();
      }}
    >
      <Card title="Contact details" description="Shown in the footer, contact blocks and structured data.">
        <div className="grid gap-5 sm:grid-cols-2">
          {text("contact_email", "Email", { type: "email" })}
          {text("contact_phone", "Phone", { help: "Shown as written; the dial link is built automatically.", placeholder: "+91 70177 05690" })}
          <div className="sm:col-span-2">{text("whatsapp_url", "WhatsApp link", { help: "e.g. https://wa.me/917009214812 — used by the floating WhatsApp button." })}</div>
        </div>
      </Card>
      <Card title="Social profiles" description="Filled-in profiles appear in the footer and in the Organization schema.">
        <div className="grid gap-5 sm:grid-cols-2">
          {text("social_linkedin", "LinkedIn", { placeholder: "https://www.linkedin.com/company/…" })}
          {text("social_instagram", "Instagram", { placeholder: "https://www.instagram.com/…" })}
          {text("social_facebook", "Facebook", { placeholder: "https://www.facebook.com/…" })}
          {text("social_x", "X (Twitter)", { placeholder: "https://x.com/…" })}
          {text("social_youtube", "YouTube", { placeholder: "https://www.youtube.com/@…" })}
        </div>
      </Card>
      <Card title="Default social share image" description="Used when a page has no image of its own. Empty = the built-in /og-default.png.">
        {canEdit ? (
          <ImageField id="default_og_image_url" value={v.default_og_image_url} onChange={(x) => set("default_og_image_url", x)} folder="seo" />
        ) : (
          <p className="adm-muted text-sm">{v.default_og_image_url || "Built-in default"}</p>
        )}
        {errors.default_og_image_url && <p className="mt-1.5 text-xs text-red-600">{errors.default_og_image_url}</p>}
      </Card>
      {canEdit && (
        <div className="flex justify-end">
          <Button type="submit" variant="primary" loading={saving}>
            Save settings
          </Button>
        </div>
      )}
    </form>
  );
}
