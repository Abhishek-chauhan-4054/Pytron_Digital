import type { Metadata } from "next";
import { ServiceHubView } from "@/components/PageTemplates";
import { developmentHub, developmentPages } from "@/content/development";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ ...developmentHub.meta, path: "/web-development/" });

export default function Page() {
  return <ServiceHubView hub={developmentHub} pages={developmentPages} />;
}
