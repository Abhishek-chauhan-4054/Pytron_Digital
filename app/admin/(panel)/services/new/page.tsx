import type { Metadata } from "next";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";

export const metadata: Metadata = { title: "New service" };

export default async function NewService({ searchParams }: { searchParams: Promise<{ pillar?: string }> }) {
  const { pillar } = await searchParams;
  const s = await requirePageRole("EDITOR");
  return (
    <>
      <PageHeader title="New service" back={{ href: "/admin/services/", label: "Services" }} />
      <ServiceForm
        id={null}
        builtIn={false}
        canPublish={roleAtLeast(s.profile.role, "ADMIN")}
        initial={{
          pillar: pillar === "web" || pillar === "ai" ? pillar : "marketing",
          name: "",
          slug: "",
          status: "DRAFT",
          short_description: "",
          hero_heading: "",
          intro: "",
          full_description: null,
          icon: "sparkles",
          image_url: "",
          features: [],
          cta_label: "",
          cta_url: "",
          seo_title: "",
          seo_description: "",
          og_image_url: "",
        }}
      />
    </>
  );
}
