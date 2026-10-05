import type { Metadata } from "next";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { BlogForm } from "@/components/admin/forms/BlogForm";

export const metadata: Metadata = { title: "New post" };

export default async function NewPost() {
  const s = await requirePageRole("EDITOR");
  const [{ data: cats }, { data: tags }] = await Promise.all([
    s.supabase.from("blog_categories").select("id,name").order("sort_order"),
    s.supabase.from("blog_tags").select("name").order("name").limit(500),
  ]);
  return (
    <>
      <PageHeader title="New post" back={{ href: "/admin/blog/", label: "Blog" }} />
      <BlogForm
        id={null}
        canPublish={roleAtLeast(s.profile.role, "ADMIN")}
        categories={(cats ?? []) as { id: string; name: string }[]}
        tagSuggestions={((tags ?? []) as { name: string }[]).map((t) => t.name)}
        initial={{
          title: "",
          slug: "",
          status: "DRAFT",
          excerpt: "",
          intro: "",
          content: null,
          featured_image_url: "",
          author_name: s.profile.full_name || "Pytron Digital Team",
          category_id: "",
          tags: [],
          published_date: "",
          seo_title: "",
          seo_description: "",
          og_image_url: "",
          canonical_url: "",
          robots_index: true,
          cta: "marketing",
        }}
      />
    </>
  );
}
