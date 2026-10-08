/** Copy for About, Contact, Services overview and legal pages. */

export const aboutPage = {
  meta: {
    title: "About Pytron Digital — Growth & Technology Partner",
    description:
      "Pytron Digital is the growth and technology arm of Pytron, founded by Pardeep Kumar. One team for strategy, engineering, AI and marketing.",
  },
  h1: "We Build, Market and Automate Digital Growth.",
  intro:
    "Pytron Digital is the growth and technology arm of Pytron, founded by Pardeep Kumar. We bring strategy, engineering, AI and marketing into one team so businesses don't have to stitch together separate vendors.",
  story: {
    heading: "Our story",
    body: [
      "Pytron Digital grew out of a pattern we kept seeing: businesses paying one agency for marketing and another for technology, and watching results fall through the gap between them. Campaigns sent traffic to pages that weren't built to convert. Websites launched with nobody responsible for bringing visitors. Leads arrived with no system to follow up.",
      "So we built one team that does both. We design and build the digital foundation — websites, web apps, automation — and run the marketing on top of it. We also build our own products, which keeps our skills sharp and our advice grounded in experience.",
    ],
  },
  beliefs: {
    heading: "What we believe",
    items: [
      { title: "Proof over promises", text: "No inflated numbers. Real work, real products, transparent results." },
      { title: "Outcomes over output", text: "We measure success in customers, time saved and revenue — not in deliverables shipped." },
      { title: "Clarity over jargon", text: "You should always understand what we're doing, why, and what it costs." },
      { title: "Ownership", text: "You own your code, accounts, data and content. Always." },
    ],
  },
  howWeWork: {
    heading: "How we work",
    body: [
      "We're remote-first and based in Sitapur, India, working with businesses in the USA, UK, Canada, Australia, the UAE and India. Every engagement has a clear scope, a single point of contact, regular check-ins and written updates.",
    ],
  },
  leadership: {
    heading: "Leadership",
    name: "Pardeep Kumar",
    role: "Founder",
    text: "Pardeep founded Pytron and leads Pytron Digital, bringing 10+ years of experience in technology and business.",
  },
  invitation: "Have an idea for a tool like ours? We build those too.",
};

export const contactPage = {
  meta: {
    title: "Contact Pytron Digital — Start a Project",
    description:
      "Tell us what you're building. Contact Pytron Digital for digital marketing, web development, AI and automation projects. We reply within one business day.",
  },
  h1: "Start a Project With Pytron Digital",
  intro:
    "Whether you need more customers, a better website or an automated workflow, tell us the goal and we'll show you the fastest way to get there.",
  formHeading: "Tell Us What You're Building",
  formCopy: "Share a few details and we'll reply within one business day with next steps.",
  success: "Thanks — we've got your details. Expect a reply within one business day.",
  submit: "Let's Discuss Your Project",
  needs: [
    "Digital Marketing",
    "SEO",
    "Google Ads",
    "Social Media Marketing",
    "Website",
    "Web Application",
    "AI Solution",
    "Automation",
    "UI/UX",
    "Custom Digital Product",
    "Other",
  ],
  budgets: ["Under $1,000", "$1,000–$5,000", "$5,000–$15,000", "$15,000+", "Not sure yet"],
  countries: [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "United Arab Emirates",
    "India",
    "Other",
  ],
  next: [
    { title: "We read your brief", text: "A real person reviews every inquiry." },
    { title: "We reply within one business day", text: "With questions or a time for a call." },
    { title: "Free consultation", text: "We discuss goals, options and the fastest path." },
    { title: "Tailored proposal", text: "Clear scope, timeline and price. No obligation." },
  ],
};

export const servicesOverview = {
  meta: {
    title: "Services — Digital Marketing, Web Development, AI & Automation | Pytron Digital",
    description:
      "All Pytron Digital services in one place: digital marketing, web development, UI/UX design, AI solutions and business automation, delivered by one team.",
  },
  h1: "Everything Your Business Needs to Grow — Under One Roof",
  intro:
    "Marketing, development and automation delivered as one connected growth system, not six disconnected vendors.",
};

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How Pytron Digital collects, uses and protects personal information submitted through digital.pytron.in.",
    updated: "2026-10-04",
    sections: [
      {
        heading: "Who we are",
        body: [
          "This website, digital.pytron.in, is operated by Pytron Digital, the digital growth and technology arm of Pytron, based in Sitapur, India. You can contact us about privacy at sahil.chauhan@pytron.in.",
        ],
      },
      {
        heading: "Information we collect",
        body: [
          "When you submit our contact form, we collect the details you provide: your name, business name, work email, country, website, the services you're interested in, your budget range and your project details.",
          "Our hosting provider automatically processes technical data such as IP address, browser type and pages requested, to deliver and secure the website. This site does not use advertising or analytics cookies by default.",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          "We use the information you submit to respond to your inquiry, prepare proposals and communicate with you about a potential or ongoing project. We do not sell your personal information or use it for unrelated marketing without your consent.",
        ],
      },
      {
        heading: "Legal basis",
        body: [
          "Where data protection laws such as the GDPR, UK GDPR or India's Digital Personal Data Protection Act apply, we process inquiry data on the basis of your consent and our legitimate interest in responding to business inquiries you initiate.",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We share data only with service providers that help us operate — for example, website hosting and email delivery — under appropriate agreements. We may disclose information if required by law.",
        ],
      },
      {
        heading: "International transfers",
        body: [
          "Our team is based in India and our service providers may process data in other countries. We take reasonable steps to ensure your information is protected wherever it is processed.",
        ],
      },
      {
        heading: "Retention",
        body: [
          "We keep inquiry data for as long as needed to respond and, if we work together, for the duration of the relationship and any legal record-keeping period. You can ask us to delete your data at any time.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Depending on where you live, you may have the right to access, correct, delete or restrict use of your personal information, and to withdraw consent. Email sahil.chauhan@pytron.in and we will respond within a reasonable time.",
        ],
      },
      {
        heading: "Changes",
        body: ["We may update this policy. The date at the top shows when it was last revised."],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description: "Terms governing use of the Pytron Digital website at digital.pytron.in.",
    updated: "2026-10-04",
    sections: [
      {
        heading: "About these terms",
        body: [
          "These terms govern your use of digital.pytron.in, operated by Pytron Digital. By using the site, you agree to them. Client projects are governed by separate written agreements.",
        ],
      },
      {
        heading: "Website content",
        body: [
          "Content on this site is provided for general information. Articles and guides are not legal, financial or professional advice for your specific situation. Dashboards, charts and figures labelled “Sample” or “Illustrative” are examples, not results achieved for any client.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "The design, text, graphics and code of this site belong to Pytron Digital or its licensors. You may share links and quote short excerpts with attribution, but you may not copy substantial parts of the site without permission.",
        ],
      },
      {
        heading: "Products and tools",
        body: [
          "Our free tools are provided as-is to help with research and preparation. Where they reference official requirements — such as tests, grants, visas or permits — always confirm details with the relevant official authority.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "Don't misuse the site, attempt to access it without authorization, submit spam through our forms or interfere with its operation.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "To the extent permitted by law, Pytron Digital is not liable for losses arising from use of this website or reliance on its general information.",
        ],
      },
      {
        heading: "Governing law",
        body: ["These terms are governed by the laws of India."],
      },
      {
        heading: "Contact",
        body: ["Questions about these terms can be sent to sahil.chauhan@pytron.in."],
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description: "How digital.pytron.in uses cookies and similar technologies.",
    updated: "2026-10-04",
    sections: [
      {
        heading: "Our approach",
        body: [
          "This website is built to work without advertising or analytics cookies. We do not set marketing or tracking cookies by default.",
        ],
      },
      {
        heading: "Strictly necessary technologies",
        body: [
          "Our hosting and security providers may use strictly necessary technologies to deliver pages reliably and protect the site from abuse. These do not track you across other websites.",
        ],
      },
      {
        heading: "Third-party links",
        body: [
          "If you follow a link to another site — for example WhatsApp or one of our product sites — that site's own cookie policy applies.",
        ],
      },
      {
        heading: "Changes",
        body: [
          "If we add analytics or other non-essential cookies in future, we will update this policy and, where required, ask for your consent before setting them.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about cookies can be sent to sahil.chauhan@pytron.in."],
      },
    ],
  },
];
