export type IconName =
  | "search"
  | "target"
  | "megaphone"
  | "mail"
  | "map-pin"
  | "share-2"
  | "pen-line"
  | "trending-up"
  | "code"
  | "layout-dashboard"
  | "bot"
  | "workflow"
  | "file-text"
  | "plug"
  | "sparkles"
  | "palette"
  | "globe"
  | "heart-pulse"
  | "house"
  | "shopping-cart"
  | "graduation-cap"
  | "plane"
  | "utensils-crossed"
  | "briefcase"
  | "rocket"
  | "store"
  | "compass"
  | "layers"
  | "shield"
  | "gauge"
  | "zap"
  | "users"
  | "clock"
  | "chart-line"
  | "mouse-pointer-click"
  | "activity"
  | "lightbulb"
  | "repeat"
  | "database"
  | "calendar"
  | "book-open"
  | "list-checks"
  | "scan-text"
  | "send"
  | "handshake"
  | "scale"
  | "user";

export type CtaKey =
  | "start"
  | "marketing"
  | "web"
  | "ai"
  | "products"
  | "work"
  | "consult"
  | "learn";

export type FAQItem = { q: string; a: string };

export type TitledText = { title: string; text: string };

export type Workflow = { title: string; before: string; after: string };

export type ServicePage = {
  slug: string;
  /** Short label used in menus and cards */
  label: string;
  icon: IconName;
  /** One-line summary for cards and menus */
  summary: string;
  meta: { title: string; description: string };
  h1: string;
  intro: string;
  problem: { heading: string; body: string[]; points?: string[] };
  solution: { heading: string; body: string[] };
  benefits: TitledText[];
  process: TitledText[];
  included: string[];
  /** Optional before → after workflow examples */
  workflows?: Workflow[];
  /** Optional extra sections, rendered after "What's included" */
  extraSections?: { id: string; heading: string; body: string[]; points?: string[] }[];
  /** Industry slugs this service is most relevant to */
  industries: string[];
  faqs: FAQItem[];
  /** Internal links shown under "Related services" */
  related: { label: string; href: string }[];
};

export type ServiceHub = {
  slug: string;
  pillar: "marketing" | "web" | "ai";
  meta: { title: string; description: string };
  eyebrow: string;
  h1: string;
  intro: string;
  pillars?: TitledText[];
  approach: { heading: string; body: string[] };
  extraSections?: { id: string; heading: string; body: string[]; points?: string[] }[];
  workflows?: Workflow[];
  faqs: FAQItem[];
};

export type Industry = {
  slug: string;
  name: string;
  icon: IconName;
  summary: string;
  meta: { title: string; description: string };
  h1: string;
  intro: string;
  problems: TitledText[];
  services: { label: string; href: string; why: string }[];
  workflows: Workflow[];
  faqs: FAQItem[];
};

export type Location = {
  slug: string;
  name: string;
  /** e.g. "businesses in the United States" */
  audience: string;
  meta: { title: string; description: string };
  h1: string;
  intro: string;
  search: { heading: string; points: string[] };
  ads: { heading: string; points: string[] };
  compliance: { heading: string; items: TitledText[] };
  timezone: { heading: string; text: string; hours: string };
  services: { label: string; href: string; text: string }[];
  faqs: FAQItem[];
};

export type LocationService = {
  country: string;
  slug: string;
  label: string;
  meta: { title: string; description: string };
  h1: string;
  intro: string;
  sections: { heading: string; body: string[]; points?: string[] }[];
  serviceHref: string;
  cta: CtaKey;
  faqs: FAQItem[];
};

export type ProductStatus = "live" | "coming-soon";

export type Product = {
  name: string;
  description: string;
  markets: string[];
  status: ProductStatus;
  /** Real product URL. Shown as "Try It Free" once status is "live". */
  url?: string;
  icon: IconName;
  /** Built-in preview illustration to show on the card */
  visual: "quiz" | "flashcards" | "grants" | "points" | "checklist";
  /** Optional real screenshot in /public, e.g. "/products/driveready.png" (replaces the illustration) */
  image?: string;
};

export type CaseStudy = {
  project: string;
  industry: string;
  solution: string;
  services: string[];
  technology: string[];
  outcome: string;
  outcomeType: "qualitative" | "coming-soon";
  icon: IconName;
  /** Live website link, e.g. "https://example.com" — shows a "Visit website" link */
  url?: string;
  /** Built-in cover illustration */
  cover: "solar" | "travel" | "quiz" | "site";
  /** Optional real screenshot in /public, e.g. "/work/nachwal.png" (replaces the illustration) */
  image?: string;
};

export type BlogSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
  ordered?: boolean;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  intro: string;
  sections: BlogSection[];
  cta: CtaKey;
};
