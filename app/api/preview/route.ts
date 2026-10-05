import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSession, roleAtLeast } from "@/lib/admin/session";
import { SYSTEM_PAGE_PATHS, type SystemPageKey } from "@/lib/cms/public/pages";
import { pillarPath, type Pillar } from "@/lib/cms/types";

const query = z.object({ type: z.enum(["page", "blog", "service"]), id: z.string().uuid() });

/**
 * Secure preview: only signed-in CMS staff can turn on draft mode, and draft content is
 * then fetched with *their* session (RLS), so a leaked preview cookie alone reveals nothing.
 */
export async function GET(req: NextRequest) {
  const parsed = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid preview link" }, { status: 400 });

  const session = await getSession();
  if (!session || !roleAtLeast(session.profile.role, "EDITOR")) {
    return NextResponse.redirect(new URL("/admin/login/", req.url));
  }
  const { type, id } = parsed.data;
  const sb = session.supabase;
  let path: string | null = null;
  if (type === "page") {
    const { data } = await sb.from("pages").select("slug,system_key").eq("id", id).maybeSingle();
    const p = data as { slug: string; system_key: string | null } | null;
    if (p) path = p.system_key ? (SYSTEM_PAGE_PATHS[p.system_key as SystemPageKey] ?? "/") : `/${p.slug}/`;
  } else if (type === "blog") {
    const { data } = await sb.from("blogs").select("slug").eq("id", id).maybeSingle();
    if (data) path = `/blog/${(data as { slug: string }).slug}/`;
  } else {
    const { data } = await sb.from("services").select("pillar,slug").eq("id", id).maybeSingle();
    const s = data as { pillar: Pillar; slug: string } | null;
    if (s) path = `${pillarPath(s.pillar)}${s.slug}/`;
  }
  if (!path) return NextResponse.json({ error: "Not found" }, { status: 404 });

  (await draftMode()).enable();
  const res = NextResponse.redirect(new URL(path, req.url));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
