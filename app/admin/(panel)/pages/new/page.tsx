import type { Metadata } from "next";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { PageForm } from "@/components/admin/forms/PageForm";

export const metadata: Metadata = { title: "New page" };

export default async function NewPage() {
  const s = await requirePageRole("EDITOR");
  return (
    <>
      <PageHeader title="New page" back={{ href: "/admin/pages/", label: "Pages" }} />
      <PageForm
        canPublish={roleAtLeast(s.profile.role, "ADMIN")}
        initial={{
          id: null,
          system_key: null,
          public_path: "/",
          title: "",
          slug: "",
          status: "DRAFT",
          hero_heading: "",
          hero_description: "",
          hero_cta_label: "",
          hero_cta_url: "",
          hero_image_url: "",
          content: null,
          featured_image_url: "",
          seo_title: "",
          seo_description: "",
          og_image_url: "",
          canonical_url: "",
          robots_index: true,
          robots_follow: true,
          published_date: "",
          sections: [],
        }}
      />
    </>
  );
}
