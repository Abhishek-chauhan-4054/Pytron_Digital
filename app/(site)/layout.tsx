import { SiteChrome } from "@/components/SiteChrome";

/** Re-check CMS content at least hourly (edits are normally pushed instantly). */
export const revalidate = 3600;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
