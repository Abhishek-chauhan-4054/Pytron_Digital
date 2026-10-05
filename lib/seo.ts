import type { Metadata } from "next";
import { brand, site } from "@/content/site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  alternates?: Record<string, string>;
  /** Absolute or site-relative image URL; defaults to /og-default.png */
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Absolute canonical URL; defaults to the page URL */
  canonical?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  alternates,
  ogImage,
  ogTitle,
  ogDescription,
  canonical,
  robotsIndex,
  robotsFollow,
}: MetaInput): Metadata {
  const url = absoluteUrl(path);
  const image = ogImage
    ? { url: ogImage, width: 1200, height: 630, alt: ogTitle || title }
    : { url: "/og-default.png", width: 1200, height: 630, alt: `${brand.name} — ${brand.line}` };
  const noRobots = robotsIndex === false || robotsFollow === false;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonical || url,
      ...(alternates ? { languages: alternates } : {}),
    },
    ...(noRobots ? { robots: { index: robotsIndex !== false, follow: robotsFollow !== false } } : {}),
    openGraph: {
      type,
      url,
      title: ogTitle || title,
      description: ogDescription || description,
      siteName: brand.name,
      locale: "en_US",
      images: [image],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || title,
      description: ogDescription || description,
      images: [image.url],
    },
  };
}
