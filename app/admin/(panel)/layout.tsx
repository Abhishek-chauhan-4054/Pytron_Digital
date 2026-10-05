import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { NoAccess, NotConfigured } from "@/components/admin/AccessStates";
import { getSession } from "@/lib/admin/session";
import { isCmsConfigured } from "@/lib/supabase/env";

/** Server-side gate for every CMS screen (the proxy only handles the redirect UX). */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isCmsConfigured()) return <NotConfigured />;
  const session = await getSession();
  if (!session) redirect("/admin/login/");
  if (!session.profile.role) return <NoAccess email={session.profile.email} inactive={!session.profile.is_active} />;
  return (
    <AdminShell user={{ email: session.profile.email, name: session.profile.full_name, role: session.profile.role }}>{children}</AdminShell>
  );
}
