import type { Metadata } from "next";
import { getLegal, LegalView } from "@/components/LegalView";
import { cmsMetadata } from "@/lib/cms/seo";

const doc = getLegal("privacy-policy");

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata({
    title: `${doc.title} | Pytron Digital`,
    description: doc.description,
    path: "/privacy-policy/",
  });
}

export default function Page() {
  return <LegalView slug="privacy-policy" />;
}
