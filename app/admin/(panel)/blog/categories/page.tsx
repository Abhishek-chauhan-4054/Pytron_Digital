import type { Metadata } from "next";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

export const metadata: Metadata = { title: "Categories & tags" };

export default async function Categories() {
  const s = await requirePageRole("EDITOR");
  const [{ data: cats }, { data: tags }] = await Promise.all([
    s.supabase.from("blog_categories").select("id,name,slug,description,blogs(count)").order("sort_order"),
    s.supabase.from("blog_tags").select("id,name,slug,blog_post_tags(count)").order("name").limit(500),
  ]);
  type C = { id: string; name: string; slug: string; description: string; blogs: { count: number }[] };
  type T = { id: string; name: string; slug: string; blog_post_tags: { count: number }[] };
  return (
    <>
      <PageHeader title="Categories & tags" description="Organise blog posts. Category pages appear on the site once they have a published post." />
      <TaxonomyManager
        canDelete={roleAtLeast(s.profile.role, "ADMIN")}
        categories={((cats ?? []) as C[]).map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, count: c.blogs[0]?.count ?? 0 }))}
        tags={((tags ?? []) as T[]).map((t) => ({ id: t.id, name: t.name, slug: t.slug, count: t.blog_post_tags[0]?.count ?? 0 }))}
      />
    </>
  );
}
