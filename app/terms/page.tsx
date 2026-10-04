import type { Metadata } from "next";
import { getLegal, LegalView } from "@/components/LegalView";
import { buildMetadata } from "@/lib/seo";

const doc = getLegal("terms");

export const metadata: Metadata = buildMetadata({
  title: `${doc.title} | Pytron Digital`,
  description: doc.description,
  path: "/terms/",
});

export default function Page() {
  return <LegalView slug="terms" />;
}
