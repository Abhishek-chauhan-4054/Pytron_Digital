import type { Metadata } from "next";
import { requirePageRole } from "@/lib/admin/session";
import { PageHeader } from "@/components/admin/ui/Layout";
import { AccountForms } from "@/components/admin/AccountForms";
import { ROLE_LABEL } from "@/lib/cms/types";

export const metadata: Metadata = { title: "My account" };

export default async function Account() {
  const s = await requirePageRole("EDITOR");
  return (
    <>
      <PageHeader title="My account" description={`${s.profile.email} · ${ROLE_LABEL[s.profile.role]}`} />
      <AccountForms name={s.profile.full_name} />
    </>
  );
}
