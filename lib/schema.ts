import { brand, site } from "@/content/site";
import type { FAQItem } from "@/content/types";
import type { PublicPost } from "@/lib/cms/public/blog";
import type { PublicSettings } from "@/lib/cms/public/site";
import { absoluteUrl } from "./seo";

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

export function organizationSchema(settings?: Pick<PublicSettings, "email" | "phoneDisplay" | "social">) {
  const email = settings?.email ?? site.contact.email;
  const telephone = settings ? settings.phoneDisplay.replace(/[^\d+]/g, "").replace(/^\+?(\d{2})(\d{5})(\d{5})$/, "+$1-$2-$3") : "+91-70092-14812";
  const social = settings?.social ?? site.social;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: brand.name,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/og-default.png"),
    slogan: brand.line,
    description: brand.positioning,
    email,
    telephone,
    founder: { "@type": "Person", name: site.founder.name },
    parentOrganization: { "@type": "Organization", name: site.parent.name, url: site.parent.url },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: "Uttar Pradesh",
      addressCountry: site.location.countryCode,
    },
    areaServed: ["US", "GB", "CA", "AU", "AE", "IN"],
    ...(social.length ? { sameAs: social.map((s) => s.url) } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email,
        telephone,
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: brand.name,
    url: site.url,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function serviceSchema(input: { name: string; description: string; path: string; serviceType?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType ?? input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": ORG_ID },
    areaServed: ["United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates", "India"],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(post: PublicPost) {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated && post.updated > post.date ? post.updated : post.date,
    author: { "@type": "Organization", name: post.author, url: site.url },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: url,
    url,
    image: absoluteUrl(post.ogImage || post.featuredImage || "/og-default.png"),
    articleSection: post.category.name,
    ...(post.tags.length ? { keywords: post.tags.map((t) => t.name).join(", ") } : {}),
  };
}
