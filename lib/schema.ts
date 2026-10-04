import { brand, site } from "@/content/site";
import type { BlogPost, FAQItem } from "@/content/types";
import { absoluteUrl } from "./seo";

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

export function organizationSchema() {
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
    email: site.contact.email,
    telephone: "+91-70092-14812",
    founder: { "@type": "Person", name: site.founder.name },
    parentOrganization: { "@type": "Organization", name: site.parent.name, url: site.parent.url },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: "Uttar Pradesh",
      addressCountry: site.location.countryCode,
    },
    areaServed: ["US", "GB", "CA", "AU", "AE", "IN"],
    ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.contact.email,
        telephone: "+91-70092-14812",
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

export function articleSchema(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author, url: site.url },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: url,
    url,
    image: absoluteUrl("/og-default.png"),
    articleSection: post.category,
  };
}
