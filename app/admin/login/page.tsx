import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { Alert } from "@/components/admin/ui/Feedback";
import { isCmsConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  // Only same-site admin paths are allowed as a post-login destination
  const safeNext = next && /^\/admin\/[a-z0-9\-/]*$/i.test(next) ? next : "/admin/dashboard/";
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="hero-dark absolute inset-0" />
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo dark />
        </div>
        <div className="adm-card p-6 sm:p-7">
          <h1 className="text-xl font-semibold">Sign in to the CMS</h1>
          <p className="adm-muted mt-1 text-sm">Use the account your administrator created for you.</p>
          <div className="mt-6">
            {isCmsConfigured() ? (
              <LoginForm next={safeNext} />
            ) : (
              <Alert tone="warning" title="CMS not configured">
                Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the environment, then redeploy. See CMS_SETUP.md.
              </Alert>
            )}
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-white">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
