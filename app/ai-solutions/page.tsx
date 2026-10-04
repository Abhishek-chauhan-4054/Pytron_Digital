import type { Metadata } from "next";
import { ServiceHubView } from "@/components/PageTemplates";
import { aiHub, aiPages } from "@/content/ai";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ ...aiHub.meta, path: "/ai-solutions/" });

export default function Page() {
  return <ServiceHubView hub={aiHub} pages={aiPages} />;
}
