import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { brand, site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${brand.name} — ${brand.descriptor}`, template: `%s | ${brand.name}` },
  description: brand.positioning,
  applicationName: brand.name,
  authors: [{ name: brand.name, url: site.url }],
  creator: brand.name,
  publisher: brand.name,
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
  openGraph: {
    siteName: brand.name,
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: `${brand.name} — ${brand.line}` }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.png"] },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const revealBootstrap = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__pdReveal){document.querySelectorAll('[data-reveal]').forEach(function(e){e.classList.add('is-in')})}},2500);`;

/**
 * Root layout: document shell only. The public website chrome (header, footer, analytics)
 * lives in app/(site)/layout.tsx; the CMS has its own layout in app/admin/.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className="min-h-screen overflow-x-clip">{children}</body>
    </html>
  );
}
