import type { IconName } from "./types";

export const hero = {
  eyebrow: "Marketing · Development · AI · Automation",
  h1Lines: ["We Build the Technology.", "We Drive the"],
  h1Highlight: "Growth.",
  copy: "Websites, web apps, SEO, ads and AI automation — designed, built and marketed by one team, so every part of your digital presence works toward the same goal: more customers.",
  capabilities: ["Strategy", "Design", "Development", "Marketing", "Automation", "Ongoing Support"],
  dashboard: {
    caption: "Sample dashboard",
    badge: "AI-Powered Insights",
    product: "Growth Platform",
    kpis: [
      { label: "Website Visitors", value: "24,810", change: "+12%" },
      { label: "Leads", value: "642", change: "+8%" },
      { label: "Conversion Rate", value: "2.6%", change: "+0.4 pts" },
      { label: "Revenue", value: "$48.2k", change: "+9%" },
    ],
    activity: [
      { text: "New lead routed to sales", time: "2m" },
      { text: "Landing page A/B test started", time: "18m" },
      { text: "Weekly report emailed", time: "1h" },
    ],
    insight: "Organic visitors from “service near me” searches convert best on mobile. Consider a click-to-call button above the fold.",
  },
};

export const corePanels = {
  marketing: {
    label: "Digital Marketing",
    h2: "Turn Attention Into Customers.",
    copy: "Get found by people already searching, earn their trust, and convert more of them — with SEO, ads and content working together.",
    chips: ["SEO", "Google Ads", "Social", "Content", "Local SEO", "Analytics"],
    cta: { label: "Grow With Pytron", href: "/digital-marketing/" },
  },
  solutions: {
    label: "Digital Solutions",
    h2: "Got a Business Problem? We'll Build the Solution.",
    copy: "Websites, web apps, AI tools and automations designed around how your business actually runs — not a template.",
    labels: ["Custom Web Apps", "AI Solutions", "Business Automation", "Dashboards", "API Integrations"],
    cta: { label: "Explore Digital Solutions", href: "/services/#solutions" },
  },
};

export const servicesSection = {
  label: "Our Services",
  h2: "Everything Your Business Needs to Grow — Under One Roof",
  copy: "Marketing, development and automation delivered as one connected growth system, not six disconnected vendors.",
  cards: [
    { title: "SEO & Organic Growth", text: "Build lasting visibility and win customers who are actively searching for what you sell.", href: "/digital-marketing/seo/", icon: "search" },
    { title: "Paid Advertising", text: "Performance-focused Google, Meta and LinkedIn campaigns built around cost per lead, not vanity clicks.", href: "/digital-marketing/performance-marketing/", icon: "target" },
    { title: "Social Media Marketing", text: "Consistent, on-brand content that builds an audience and turns it into inquiries.", href: "/digital-marketing/social-media/", icon: "share-2" },
    { title: "Web Development", text: "Fast, modern websites and web apps engineered for speed, SEO and conversion.", href: "/web-development/", icon: "code" },
    { title: "AI & Automation", text: "Remove repetitive work and connect your tools with practical, reliable automation.", href: "/ai-solutions/", icon: "workflow" },
    { title: "UI/UX & Product Design", text: "Interfaces your users understand in seconds and enjoy coming back to.", href: "/web-development/ui-ux-design/", icon: "palette" },
  ] satisfies { title: string; text: string; href: string; icon: IconName }[],
};

export const differentiator = {
  label: "Marketing Meets Technology",
  h2: "Marketing That Works With Your Technology",
  copy: "Agencies chase traffic. Dev shops ship code. Neither owns the result. Pytron builds the digital foundation and the growth engine on top of it — so traffic lands on a site built to convert, and every lead flows into a system built to follow up.",
  steps: [
    { title: "Traffic", text: "SEO, ads and social bring the right visitors", icon: "mouse-pointer-click" },
    { title: "Website", text: "A fast site built to convert them", icon: "code" },
    { title: "Conversion", text: "Clear offers, forms and CTAs", icon: "target" },
    { title: "Automation", text: "Leads routed and followed up instantly", icon: "workflow" },
    { title: "Analytics", text: "Every step measured", icon: "chart-line" },
    { title: "Growth", text: "Insights fed back into the next cycle", icon: "trending-up" },
  ] satisfies { title: string; text: string; icon: IconName }[],
};

export const productsSection = {
  label: "Our Products",
  h2: "We Don't Just Build for Clients. We Build Our Own Products.",
  copy: "Free, practical web tools that solve real problems for real people — and prove what our team can design, build and grow.",
  proof: "Every product here is designed, built and marketed in-house by Pytron. The same product thinking, engineering, UI/UX, SEO and automation goes into every client project.",
  chips: ["Product Thinking", "Engineering", "UI/UX", "SEO", "AI", "Automation", "Growth"],
  idea: {
    title: "Have an idea for a tool like ours?",
    text: "We build those too — calculators, finders, checkers and full digital products.",
  },
};

export const processSection = {
  label: "How We Work",
  h2: "From Idea to Impact",
  copy: "A clear five-step process, so you always know what's happening, what's next and why.",
  steps: [
    { title: "Discover", text: "We learn your goals, customers and constraints before proposing anything." },
    { title: "Design", text: "We map the experience and agree on the right solution — no surprises later." },
    { title: "Develop", text: "We build on modern, scalable technology with regular check-ins." },
    { title: "Launch", text: "We test, deploy and tune for speed, SEO and conversion." },
    { title: "Grow", text: "We use marketing, analytics and automation to keep improving results." },
  ],
};

export const whyPytron = {
  h2: "Built for Growth. Designed for Results.",
  copy: "Strategy, technology, AI and marketing — working as one system to move your business forward.",
  pillars: [
    { title: "Strategy First", text: "Every project starts with a business goal, not a feature list.", icon: "compass" },
    { title: "Technology + Marketing", text: "We build the product and the growth engine around it.", icon: "layers" },
    { title: "Built Around You", text: "No templates. We design around your workflow and your customers.", icon: "users" },
    { title: "Ready to Scale", text: "Systems that grow with you instead of holding you back.", icon: "rocket" },
  ] satisfies { title: string; text: string; icon: IconName }[],
  cta: { label: "Work With Pytron", href: "/contact/" },
};

export const trustSection = {
  h2: "One Team. Every Capability You Need.",
  copy: "Strategy, development, AI, automation and marketing — one partner, one point of contact, one shared goal.",
  badges: [
    { title: "Digital Marketing", text: "SEO, paid media and growth strategy.", icon: "megaphone" },
    { title: "Web Development", text: "Websites, web apps and custom digital experiences.", icon: "code" },
    { title: "AI & Automation", text: "Intelligent workflows that save hours every week.", icon: "bot" },
    { title: "Product & UI/UX", text: "User-first digital products and interfaces.", icon: "palette" },
  ] satisfies { title: string; text: string; icon: IconName }[],
  founderLine: "Led by Pardeep Kumar, with 10+ years of experience in technology and business.",
};

export const workSection = {
  label: "Our Work",
  h2: "Digital Experiences Built to Perform",
};

export const partnership = {
  h2: "Built for Long-Term Partnerships",
  copy: "We stay with you from first strategy call through design, development, launch and every growth cycle after — one team that already knows your business.",
  stages: [
    { title: "Strategy call", text: "Goals, audience and the shortest path to results." },
    { title: "Design & build", text: "One team, one plan, regular check-ins." },
    { title: "Launch", text: "Tested, tuned and measured from day one." },
    { title: "Every growth cycle after", text: "Marketing, analytics and automation that keep improving." },
  ],
};

export const globalSection = {
  h2: "Built in India. Trusted Across Borders.",
  copy: "We work with businesses across time zones, combining global design and engineering standards with responsive, transparent communication.",
  note: "Remote-first delivery with flexible meeting hours for US, UK and APAC time zones.",
  markets: [
    { label: "USA", href: "/locations/usa/" },
    { label: "UK", href: "/locations/uk/" },
    { label: "Canada", href: "/locations/canada/" },
    { label: "Australia", href: "/locations/australia/" },
    { label: "UAE", href: "/locations/uae/" },
    { label: "India", href: "/locations/india/" },
  ],
};

export const finalCta = {
  h2: "Your Next Digital Advantage Starts Here.",
  copy: "More customers, a better website or an automated workflow — tell us the goal and we'll show you the fastest way to get there.",
  secondary: { label: "Explore What We Do", href: "/services/" },
  checks: ["Free Consultation", "Tailored Proposal", "No Obligation"],
};
