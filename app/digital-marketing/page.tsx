import type { Metadata } from "next";
import { ServiceHubView } from "@/components/PageTemplates";
import { marketingHub, marketingPages } from "@/content/marketing";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ ...marketingHub.meta, path: "/digital-marketing/" });

export default function Page() {
  return <ServiceHubView hub={marketingHub} pages={marketingPages} />;
}
