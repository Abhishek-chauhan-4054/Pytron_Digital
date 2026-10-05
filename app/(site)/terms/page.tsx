import type { Metadata } from "next";
import { getLegal, LegalView } from "@/components/LegalView";
import { cmsMetadata } from "@/lib/cms/seo";

const doc = getLegal("terms");

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata({
    title: `${doc.title} | Pytron Digital`,
    description: doc.description,
    path: "/terms/",
  });
}

export default function Page() {
  return <LegalView slug="terms" />;
}
