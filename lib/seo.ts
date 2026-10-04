import type { Metadata } from "next";
import { brand, site } from "@/content/site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  alternates?: Record<string, string>;
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({ title, description, path, type = "website", publishedTime, alternates }: MetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      ...(alternates ? { languages: alternates } : {}),
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: brand.name,
      locale: "en_US",
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: `${brand.name} — ${brand.line}` }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-default.png"],
    },
  };
}
