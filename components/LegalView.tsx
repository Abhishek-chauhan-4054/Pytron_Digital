import { PageHero } from "./PageTemplates";
import { JsonLd } from "./ui";
import { legalDocs } from "@/content/pages";
import { breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "./BlogCard";
import { hasAnalytics, integrations } from "@/lib/config";

export function getLegal(slug: string) {
  const doc = legalDocs.find((d) => d.slug === slug);
  if (!doc) throw new Error(`Missing legal doc ${slug}`);
  return doc;
}

function analyticsSections(slug: string) {
  if (!hasAnalytics || (slug !== "cookie-policy" && slug !== "privacy-policy")) return [];
  const tools = [
    integrations.ga4Id || integrations.gtmId ? "Google Analytics / Google Tag Manager" : "",
    integrations.metaPixelId ? "Meta Pixel" : "",
    integrations.clarityId ? "Microsoft Clarity" : "",
  ].filter(Boolean);
  return [
    {
      heading: "Analytics and advertising measurement",
      body: [
        `This site uses ${tools.join(", ")} to understand how visitors use the site and to measure marketing performance. These tools may set cookies or similar identifiers and process data such as pages viewed, device and approximate location.`,
        "You can block or delete cookies in your browser settings. Where the law requires consent for these technologies, we ask for it before they load.",
      ],
    },
  ];
}

export function LegalView({ slug }: { slug: string }) {
  const base = getLegal(slug);
  const extra = analyticsSections(slug);
  const doc = {
    ...base,
    sections:
      slug === "cookie-policy" && extra.length
        ? [...base.sections.filter((s) => s.heading !== "Our approach" && s.heading !== "Changes"), ...extra]
        : [...base.sections, ...extra],
  };
  const crumbs = [
    { name: "Home", path: "/" },
    { name: doc.title, path: `/${doc.slug}/` },
  ];
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero crumbs={crumbs} title={doc.title} intro={`Last updated ${formatDate(doc.updated)}.`} />
      <section className="section">
        <div className="container-x max-w-3xl space-y-10">
          {doc.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-xl font-semibold">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="prose-body mt-3">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
