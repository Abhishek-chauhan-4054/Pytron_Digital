import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { builtInServices } from "@/lib/cms/public/services";
import { pillarPath, type ServiceRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Edit service" };

export default async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const s = await requirePageRole("EDITOR");
  const { data } = await s.supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const r = data as ServiceRow;
  const builtIn = builtInServices[r.pillar].some((x) => x.slug === r.slug);
  return (
    <>
      <PageHeader title={r.name} description={`${pillarPath(r.pillar)}${r.slug}/`} back={{ href: "/admin/services/", label: "Services" }} />
      <ServiceForm
        key={r.updated_at}
        id={r.id}
        builtIn={builtIn}
        updatedAt={r.updated_at}
        canPublish={roleAtLeast(s.profile.role, "ADMIN")}
        initial={{
          pillar: r.pillar,
          name: r.name,
          slug: r.slug,
          status: r.status,
          short_description: r.short_description,
          hero_heading: r.hero_heading,
          intro: r.intro,
          full_description: r.full_description,
          icon: r.icon,
          image_url: r.image_url,
          features: r.features,
          cta_label: r.cta_label,
          cta_url: r.cta_url,
          seo_title: r.seo_title,
          seo_description: r.seo_description,
          og_image_url: r.og_image_url,
        }}
      />
    </>
  );
}
