import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { PageForm } from "@/components/admin/forms/PageForm";
import { SYSTEM_PAGE_PATHS, type SystemPageKey } from "@/lib/cms/public/pages";
import type { BlockType } from "@/lib/cms/blocks";
import type { PageRow, PageSectionRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Edit page" };

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await requirePageRole("EDITOR");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await s.supabase.from("pages").select("*, sections:page_sections(id,type,data,sort_order)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const p = data as PageRow & { sections: PageSectionRow[] };
  const publicPath = p.system_key ? (SYSTEM_PAGE_PATHS[p.system_key as SystemPageKey] ?? "/") : `/${p.slug}/`;
  return (
    <>
      <PageHeader title={p.title} description={publicPath} back={{ href: "/admin/pages/", label: "Pages" }} />
      <PageForm
        key={p.updated_at}
        canPublish={roleAtLeast(s.profile.role, "ADMIN")}
        initial={{
          id: p.id,
          system_key: p.system_key,
          public_path: publicPath,
          updated_at: p.updated_at,
          title: p.title,
          slug: p.slug,
          status: p.status,
          hero_heading: p.hero_heading,
          hero_description: p.hero_description,
          hero_cta_label: p.hero_cta_label,
          hero_cta_url: p.hero_cta_url,
          hero_image_url: p.hero_image_url,
          content: p.content,
          featured_image_url: p.featured_image_url,
          seo_title: p.seo_title,
          seo_description: p.seo_description,
          og_image_url: p.og_image_url,
          canonical_url: p.canonical_url,
          robots_index: p.robots_index,
          robots_follow: p.robots_follow,
          published_date: p.published_at ? p.published_at.slice(0, 10) : "",
          sections: [...p.sections].sort((a, b) => a.sort_order - b.sort_order).map((x) => ({ id: x.id, type: x.type as BlockType, data: x.data })),
        }}
      />
    </>
  );
}
