import type { Metadata } from "next";
import { requirePageRole } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { Alert } from "@/components/admin/ui/Feedback";
import { UsersManager } from "@/components/admin/UsersManager";
import { hasServiceRoleKey } from "@/lib/supabase/admin";
import type { RoleKey } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const s = await requirePageRole("SUPER_ADMIN");
  const { data, error } = await s.supabase
    .from("profiles")
    .select("id,email,full_name,is_active,last_sign_in_at,created_at,role:roles(key)")
    .order("created_at", { ascending: true })
    .limit(500);
  type R = { id: string; email: string; full_name: string; is_active: boolean; last_sign_in_at: string | null; created_at: string; role: { key: RoleKey } | null };
  const users = ((data ?? []) as unknown as R[]).map((u) => ({ ...u, role: u.role?.key ?? null }));
  return (
    <>
      <PageHeader title="Users" description="Who can sign in to the CMS, and what they can do." />
      {!hasServiceRoleKey() && (
        <div className="mb-4">
          <Alert tone="warning" title="User creation is disabled">
            Set <code>SUPABASE_SERVICE_ROLE_KEY</code> on the server (Vercel → Environment Variables) to create users and reset passwords. Changing roles works without it.
          </Alert>
        </div>
      )}
      {error ? <Alert tone="error">Could not load users.</Alert> : <UsersManager users={users} me={s.user.id} canCreate={hasServiceRoleKey()} />}
    </>
  );
}
