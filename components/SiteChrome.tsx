import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { RevealObserver } from "@/components/ClientBits";
import { JsonLd } from "@/components/ui";
import { Analytics } from "@/components/Analytics";
import { PreviewBanner } from "@/components/cms/PreviewBanner";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { getFooterNav, getSettings } from "@/lib/cms/public/site";

/** Public website chrome — shared by the (site) layout and the global 404 page. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [nav, settings] = await Promise.all([getFooterNav(), getSettings()]);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <PreviewBanner />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer nav={nav} settings={settings} />
      <WhatsAppFloat href={settings.whatsapp} />
      <RevealObserver />
      <Analytics />
      <JsonLd data={[organizationSchema(settings), websiteSchema()]} />
    </>
  );
}
