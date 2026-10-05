import type { Metadata } from "next";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { Alert } from "@/components/admin/ui/Feedback";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";
import type { SiteSettingsRow } from "@/lib/cms/types";
import { formatDateTime } from "@/lib/admin/format";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const s = await requirePageRole("ADMIN");
  const { data } = await s.supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const row = data as SiteSettingsRow | null;
  const canEdit = roleAtLeast(s.profile.role, "SUPER_ADMIN");
  return (
    <>
      <PageHeader title="Settings" description={row ? `Last changed ${formatDateTime(row.updated_at)}` : undefined} />
      {!canEdit && (
        <div className="mb-6">
          <Alert tone="info">Only a Super Admin can change site settings.</Alert>
        </div>
      )}
      {row ? (
        <SettingsForm
          canEdit={canEdit}
          initial={{
            contact_email: row.contact_email,
            contact_phone: row.contact_phone,
            whatsapp_url: row.whatsapp_url,
            social_linkedin: row.social_linkedin,
            social_instagram: row.social_instagram,
            social_facebook: row.social_facebook,
            social_x: row.social_x,
            social_youtube: row.social_youtube,
            default_og_image_url: row.default_og_image_url,
          }}
        />
      ) : (
        <Alert tone="error">Settings row missing — run the database migrations.</Alert>
      )}
    </>
  );
}
