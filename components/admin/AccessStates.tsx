import { ShieldAlert, Wrench } from "lucide-react";
import { signOut } from "@/lib/admin/actions/auth";

function Shell({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="adm-card w-full max-w-md p-7 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-400/10">{icon}</span>
        <h1 className="mt-4 text-lg font-semibold">{title}</h1>
        <div className="adm-muted mt-2 text-sm">{children}</div>
      </div>
    </main>
  );
}

export function NoAccess({ email, inactive }: { email: string; inactive: boolean }) {
  return (
    <Shell icon={<ShieldAlert className="h-6 w-6" aria-hidden="true" />} title={inactive ? "Account deactivated" : "No CMS access yet"}>
      <p>
        You are signed in as <strong>{email}</strong>
        {inactive ? ", but this account has been deactivated." : ", but no role has been assigned to this account."} Ask a Super Admin for access.
      </p>
      <form action={signOut} className="mt-5">
        <button type="submit" className="adm-btn adm-btn-secondary">
          Sign out
        </button>
      </form>
    </Shell>
  );
}

export function NotConfigured() {
  return (
    <Shell icon={<Wrench className="h-6 w-6" aria-hidden="true" />} title="Connect Supabase to use the CMS">
      <p>
        Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (and <code>SUPABASE_SERVICE_ROLE_KEY</code> for user management), then
        redeploy. Step-by-step instructions are in <code>CMS_SETUP.md</code>. The public website keeps working with its built-in content meanwhile.
      </p>
    </Shell>
  );
}
