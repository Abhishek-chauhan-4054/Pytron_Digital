import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { brand, site } from "@/content/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { RevealObserver } from "@/components/ClientBits";
import { JsonLd } from "@/components/ui";
import { Analytics } from "@/components/Analytics";
import { organizationSchema, websiteSchema } from "@/lib/schema";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className="min-h-screen overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <RevealObserver />
        <Analytics />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
