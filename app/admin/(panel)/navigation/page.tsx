import type { Metadata } from "next";
import { requirePageRole } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { Alert } from "@/components/admin/ui/Feedback";
import { NavigationManager } from "@/components/admin/NavigationManager";
import type { NavigationItemRow } from "@/lib/cms/types";

export const metadata: Metadata = { title: "Navigation" };

export default async function NavigationPage() {
  const s = await requirePageRole("ADMIN");
  const { data, error } = await s.supabase.from("navigation_items").select("*").order("sort_order");
  return (
    <>
      <PageHeader title="Navigation" description="Footer link columns. Changes go live immediately." />
      <div className="mb-6">
        <Alert tone="info">The header mega menu is part of the site design and stays in code (content/site.ts). New services still appear on their hub pages automatically.</Alert>
      </div>
      {error ? <Alert tone="error">Could not load navigation.</Alert> : <NavigationManager items={(data ?? []) as NavigationItemRow[]} />}
    </>
  );
}
