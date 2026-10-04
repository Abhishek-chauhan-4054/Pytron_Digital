import type { Metadata } from "next";
import { getLegal, LegalView } from "@/components/LegalView";
import { buildMetadata } from "@/lib/seo";

const doc = getLegal("privacy-policy");

export const metadata: Metadata = buildMetadata({
  title: `${doc.title} | Pytron Digital`,
  description: doc.description,
  path: "/privacy-policy/",
});

export default function Page() {
  return <LegalView slug="privacy-policy" />;
}
