import type { CtaKey } from "./types";
import { bookingUrl, founderPhoto, socialLinks } from "./links";

/** Section 0 — Brand messaging system. Use exactly; do not rewrite. */
export const brand = {
  name: "Pytron Digital",
  descriptor: "Digital Growth & Technology Partner",
  line: "Build. Market. Automate. Grow.",
  promise: "We build the technology. We drive the growth.",
  positioning:
    "Pytron Digital is a growth and technology partner that builds, markets and automates digital products for ambitious businesses.",
  elevator: [
    "Most businesses hire one agency for marketing and another for technology — and the gap between them is where growth gets lost.",
    "Pytron Digital closes that gap with one team for strategy, development, AI and marketing.",
  ],
  proof: "No inflated numbers. Real work, real products, transparent results.",
  footerBlurb:
    "Digital marketing, web development, AI and automation for businesses ready to grow.",
};

export const site = {
  url: "https://digital.pytron.in",
  parent: { name: "Pytron", url: "https://pytron.io" },
  founder: {
    name: "Pardeep Kumar",
    role: "Founder",
    experience: "10+ years of experience in technology and business",
    photo: founderPhoto,
  },
  location: { city: "Sitapur", country: "India", countryCode: "IN" },
  contact: {
    email: "business@pytron.io",
    phoneDisplay: "+91 70092 14812",
    phoneHref: "tel:+917009214812",
    whatsapp: "https://wa.me/917009214812",
  },
  operations: {
    label: "Client & Technology Operations",
    name: "Abhishek Chauhan",
    email: "abhishek.chauhan@pytron.in",
  },
  markets: ["USA", "UK", "Canada", "Australia", "UAE", "India"],
  /** Filled-in profiles only (edit in content/links.ts) */
  social: (
    [
      ["LinkedIn", socialLinks.linkedin],
      ["Instagram", socialLinks.instagram],
      ["Facebook", socialLinks.facebook],
      ["X", socialLinks.x],
      ["YouTube", socialLinks.youtube],
    ] as const
  )
    .filter(([, url]) => Boolean(url))
    .map(([label, url]) => ({ label, url })),
};

/** Primary CTA vocabulary */
export const ctas: Record<CtaKey, { label: string; href: string }> = {
  start: { label: "Start a Project", href: "/contact/" },
  marketing: { label: "Grow With Pytron", href: "/contact/?interest=digital-marketing" },
  web: { label: "Build Your Website", href: "/contact/?interest=website" },
  ai: { label: "Automate Your Workflow", href: "/contact/?interest=automation" },
  products: { label: "Explore Our Products", href: "/products/" },
  work: { label: "See Our Work", href: "/work/" },
  consult: { label: "Book a Free Consultation", href: bookingUrl || "/contact/" },
  learn: { label: "Learn More", href: "/services/" },
};

export type NavLink = { label: string; href: string; description?: string };

export const marketingMenu = {
  title: "Digital Marketing",
  text: "Data-driven marketing that attracts the right customers and turns them into revenue.",
  cta: { label: "Explore Digital Marketing", href: "/digital-marketing/" },
  services: [
    { label: "SEO", href: "/digital-marketing/seo/", description: "Rank where your customers are already searching." },
    { label: "Google Ads", href: "/digital-marketing/google-ads/", description: "Put your offer in front of buyers ready to act." },
    { label: "Social Media Marketing", href: "/digital-marketing/social-media/", description: "Build a brand people recognize and trust." },
    { label: "Content Marketing", href: "/digital-marketing/content-marketing/", description: "Publish content that earns attention and leads." },
    { label: "Email Marketing", href: "/digital-marketing/email-marketing/", description: "Turn one-time buyers into repeat customers." },
    { label: "Local SEO", href: "/digital-marketing/local-seo/", description: "Be the first choice in your area on Google Maps." },
    { label: "Paid Social Ads", href: "/digital-marketing/performance-marketing/", description: "Reach precise audiences on Meta, LinkedIn and more." },
    { label: "Growth Strategy", href: "/digital-marketing/#growth-strategy", description: "Tie every marketing rupee and dollar to a business goal." },
  ] satisfies NavLink[],
  industries: [
    { label: "Healthcare & Clinics", href: "/industries/healthcare/" },
    { label: "Real Estate", href: "/industries/real-estate/" },
    { label: "E-commerce & Retail", href: "/industries/ecommerce/" },
    { label: "Education", href: "/industries/education/" },
    { label: "Travel & Tourism", href: "/industries/travel/" },
    { label: "Restaurants & Hospitality", href: "/industries/hospitality/" },
    { label: "Professional Services", href: "/industries/professional-services/" },
    { label: "Startups & SaaS", href: "/industries/startups/" },
    { label: "Local Businesses", href: "/industries/local-business/" },
  ] satisfies NavLink[],
  allCta: { label: "View All Services", href: "/services/" },
};

export const webMenu: NavLink[] = [
  { label: "Web Development Overview", href: "/web-development/", description: "Fast websites and web apps built to convert." },
  { label: "Business Websites", href: "/web-development/business-websites/", description: "A site that explains, persuades and converts." },
  { label: "Web Applications", href: "/web-development/web-applications/", description: "Portals, platforms and internal tools." },
  { label: "E-commerce", href: "/web-development/ecommerce/", description: "Stores built for speed and checkout." },
  { label: "UI/UX Design", href: "/web-development/ui-ux-design/", description: "Interfaces people understand in seconds." },
  { label: "Custom Solutions", href: "/web-development/custom-solutions/", description: "Software shaped around your workflow." },
];

export const aiMenu: NavLink[] = [
  { label: "AI Solutions Overview", href: "/ai-solutions/", description: "Practical AI that removes manual work." },
  { label: "AI Automation", href: "/ai-solutions/ai-automation/", description: "AI steps inside everyday workflows." },
  { label: "Business Automation", href: "/ai-solutions/business-automation/", description: "Connect tools and stop copy-pasting." },
  { label: "Document Processing", href: "/ai-solutions/document-processing/", description: "Extract data from PDFs, scans and forms." },
  { label: "AI Integrations", href: "/ai-solutions/ai-integrations/", description: "Assistants and AI features in your product." },
];

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Digital Marketing", href: "/digital-marketing/", menu: "marketing" as const },
  { label: "Web Development", href: "/web-development/", menu: "web" as const },
  { label: "AI Solutions", href: "/ai-solutions/", menu: "ai" as const },
  { label: "Products", href: "/products/" },
  { label: "Our Work", href: "/work/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/about/" },
];

export const footerNav = {
  services: [
    { label: "SEO", href: "/digital-marketing/seo/" },
    { label: "Google Ads", href: "/digital-marketing/google-ads/" },
    { label: "Social Media Marketing", href: "/digital-marketing/social-media/" },
    { label: "Web Development", href: "/web-development/" },
    { label: "AI Solutions", href: "/ai-solutions/" },
    { label: "Automation", href: "/ai-solutions/business-automation/" },
    { label: "UI/UX", href: "/web-development/ui-ux-design/" },
  ],
  solutions: [
    { label: "Web Applications", href: "/web-development/web-applications/" },
    { label: "AI Automation", href: "/ai-solutions/ai-automation/" },
    { label: "Business Dashboards", href: "/web-development/custom-solutions/#dashboards" },
    { label: "Digital Products", href: "/products/" },
    { label: "Custom Solutions", href: "/web-development/custom-solutions/" },
  ],
  company: [
    { label: "About", href: "/about/" },
    { label: "Our Work", href: "/work/" },
    { label: "Products", href: "/products/" },
    { label: "Blog", href: "/blog/" },
    { label: "Contact", href: "/contact/" },
    { label: "Pytron (pytron.io)", href: "https://pytron.io", external: true },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy/" },
    { label: "Terms", href: "/terms/" },
    { label: "Cookie Policy", href: "/cookie-policy/" },
    { label: "Sitemap", href: "/site-map/" },
  ],
};
