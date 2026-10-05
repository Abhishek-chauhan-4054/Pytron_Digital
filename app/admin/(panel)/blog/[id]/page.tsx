import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePageRole, roleAtLeast } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { BlogForm } from "@/components/admin/forms/BlogForm";
import type { BlogRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const s = await requirePageRole("EDITOR");
  const [{ data }, { data: cats }, { data: tags }] = await Promise.all([
    s.supabase.from("blogs").select("*, blog_post_tags(tag:blog_tags(name))").eq("id", id).maybeSingle(),
    s.supabase.from("blog_categories").select("id,name").order("sort_order"),
    s.supabase.from("blog_tags").select("name").order("name").limit(500),
  ]);
  if (!data) notFound();
  const b = data as BlogRow & { blog_post_tags: { tag: { name: string } | null }[] };
  return (
    <>
      <PageHeader title={b.title} description={`/blog/${b.slug}/`} back={{ href: "/admin/blog/", label: "Blog" }} />
      <BlogForm
        key={b.updated_at}
        id={b.id}
        updatedAt={b.updated_at}
        canPublish={roleAtLeast(s.profile.role, "ADMIN")}
        categories={(cats ?? []) as { id: string; name: string }[]}
        tagSuggestions={((tags ?? []) as { name: string }[]).map((t) => t.name)}
        initial={{
          title: b.title,
          slug: b.slug,
          status: b.status,
          excerpt: b.excerpt,
          intro: b.intro,
          content: b.content,
          featured_image_url: b.featured_image_url,
          author_name: b.author_name,
          category_id: b.category_id ?? "",
          tags: b.blog_post_tags.flatMap((t) => (t.tag ? [t.tag.name] : [])),
          published_date: b.published_at ? b.published_at.slice(0, 10) : "",
          seo_title: b.seo_title,
          seo_description: b.seo_description,
          og_image_url: b.og_image_url,
          canonical_url: b.canonical_url,
          robots_index: b.robots_index,
          cta: b.cta,
        }}
      />
    </>
  );
}
