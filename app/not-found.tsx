import type { Metadata } from "next";
import { NotFoundContent } from "@/components/NotFoundContent";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = { title: { absolute: "Page Not Found | Pytron Digital" }, robots: { index: false } };

/** Global 404 (URLs outside every route group) — rendered with the public site chrome. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
