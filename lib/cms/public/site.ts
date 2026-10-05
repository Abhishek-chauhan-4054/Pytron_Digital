import "server-only";
import { footerNav, site } from "@/content/site";
import type { NavigationItemRow, NavLocation, SeoMetadataRow, SiteSettingsRow } from "@/lib/cms/types";
import { cmsRead, must, TAGS } from "./core";

export type FooterLink = { label: string; href: string; external: boolean };
export type FooterNav = { services: FooterLink[]; solutions: FooterLink[]; company: FooterLink[]; legal: FooterLink[] };

const staticFooter = (): FooterNav => ({
  services: footerNav.services.map((l) => ({ label: l.label, href: l.href, external: false })),
  solutions: footerNav.solutions.map((l) => ({ label: l.label, href: l.href, external: false })),
  company: footerNav.company.map((l) => ({ label: l.label, href: l.href, external: "external" in l && Boolean(l.external) })),
  legal: footerNav.legal.map((l) => ({ label: l.label, href: l.href, external: false })),
});

/** Footer link columns (CMS → Navigation). Falls back to the built-in links. */
export async function getFooterNav(): Promise<FooterNav> {
  return cmsRead(
    ["navigation", "footer"],
    [TAGS.navigation],
    async (sb) => {
      const rows = must(
        await sb.from("navigation_items").select("location,label,href,is_external,sort_order").eq("is_active", true).order("sort_order"),
      ) as Pick<NavigationItemRow, "location" | "label" | "href" | "is_external">[];
      if (!rows.length) return staticFooter();
      const col = (loc: NavLocation) => rows.filter((r) => r.location === loc).map((r) => ({ label: r.label, href: r.href, external: r.is_external }));
      return { services: col("footer_services"), solutions: col("footer_solutions"), company: col("footer_company"), legal: col("footer_legal") };
    },
    staticFooter,
  );
}

export type PublicSettings = {
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsapp: string;
  social: { label: string; url: string }[];
  defaultOgImage: string;
};

const telHref = (display: string) => `tel:${display.replace(/[^\d+]/g, "")}`;

const staticSettings = (): PublicSettings => ({
  email: site.contact.email,
  phoneDisplay: site.contact.phoneDisplay,
  phoneHref: site.contact.phoneHref,
  whatsapp: site.contact.whatsapp,
  social: site.social.map((s) => ({ label: s.label, url: s.url })),
  defaultOgImage: "",
});

/** Public contact details and social links (CMS → Settings). */
export async function getSettings(): Promise<PublicSettings> {
  return cmsRead(
    ["settings"],
    [TAGS.settings],
    async (sb) => {
      const s = must(await sb.from("site_settings").select("*").eq("id", 1).maybeSingle()) as SiteSettingsRow | null;
      if (!s) return staticSettings();
      const social = (
        [
          ["LinkedIn", s.social_linkedin],
          ["Instagram", s.social_instagram],
          ["Facebook", s.social_facebook],
          ["X", s.social_x],
          ["YouTube", s.social_youtube],
        ] as const
      )
        .filter(([, url]) => Boolean(url))
        .map(([label, url]) => ({ label, url }));
      return {
        email: s.contact_email || site.contact.email,
        phoneDisplay: s.contact_phone || site.contact.phoneDisplay,
        phoneHref: s.contact_phone ? telHref(s.contact_phone) : site.contact.phoneHref,
        whatsapp: s.whatsapp_url || site.contact.whatsapp,
        social,
        defaultOgImage: s.default_og_image_url,
      };
    },
    staticSettings,
  );
}


/** SEO overrides keyed by path (CMS → SEO). Small table: loaded once and cached. */
export async function getSeoOverrides(): Promise<Map<string, SeoMetadataRow>> {
  const rows = await cmsRead(
    ["seo", "all"],
    [TAGS.seo],
    async (sb) => must(await sb.from("seo_metadata").select("*").limit(2000)) as SeoMetadataRow[],
    () => [],
  );
  return new Map(rows.map((r) => [r.path, r]));
}

/** Redirect target for an old URL (created automatically when a published slug changes). */
export async function findRedirect(path: string): Promise<{ to: string; status: number } | null> {
  const rows = await cmsRead(
    ["redirects"],
    [TAGS.redirects],
    async (sb) => must(await sb.from("redirects").select("from_path,to_path,status_code").limit(5000)) as {
      from_path: string;
      to_path: string;
      status_code: number;
    }[],
    () => [],
  );
  const hit = rows.find((r) => r.from_path === path);
  return hit ? { to: hit.to_path, status: hit.status_code } : null;
}
