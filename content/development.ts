import type { ServiceHub, ServicePage } from "./types";

export const developmentHub: ServiceHub = {
  slug: "web-development",
  pillar: "web",
  meta: {
    title: "Web Development Company — Websites & Web Apps | Pytron Digital",
    description:
      "A web development company that builds fast, secure websites and web applications engineered for SEO and conversion — and can market them after launch.",
  },
  eyebrow: "Web Development",
  h1: "Websites and Web Apps Engineered to Perform",
  intro:
    "Fast, modern websites and web apps engineered for speed, SEO and conversion. We design and build on modern frameworks, and because we also run marketing, every build is ready to bring in customers from day one.",
  pillars: [
    { title: "Performance", text: "Fast load times on real phones and real networks, measured with Core Web Vitals." },
    { title: "Conversion", text: "Clear messaging, obvious next steps and forms people actually finish." },
    { title: "Scalability", text: "Architecture that handles more pages, users and features without a rebuild." },
    { title: "UX", text: "Interfaces designed around how your customers think and decide." },
    { title: "SEO", text: "Clean structure, structured data and metadata built in, not bolted on." },
    { title: "Security", text: "Secure defaults, updated dependencies and sensible access control." },
    { title: "Integrations", text: "CRM, payments, email, analytics and internal tools connected properly." },
  ],
  approach: {
    heading: "Why build with a team that also markets",
    body: [
      "A website is usually the place where marketing either pays off or leaks. Developers who never see campaign data tend to optimize for how a site looks; marketers who can't change code work around problems instead of fixing them.",
      "We do both. Page structure is planned with search in mind, landing pages are built for the campaigns that will send traffic to them, and analytics are set up so you can see what's working from the first week.",
    ],
  },
  faqs: [
    { q: "Which technologies do you build with?", a: "Mostly Next.js, React and TypeScript for websites and web apps, with Node.js or Python on the back end and PostgreSQL for data. For stores we use Shopify or a headless setup. We pick based on your needs, not habit." },
    { q: "Can you work with WordPress or Shopify?", a: "Yes. If your team already runs WordPress or Shopify and it suits your goals, we'll build on it. If a platform is holding you back, we'll explain the trade-offs of moving." },
    { q: "Who owns the code and the website?", a: "You do. Code lives in a repository you own, and hosting and domains are in your name." },
    { q: "Do you provide support after launch?", a: "Yes. We offer ongoing support and improvement plans covering updates, fixes, monitoring and new features." },
    { q: "How long does a website take?", a: "A focused business website commonly takes a few weeks. Web applications vary with scope; we break them into phases so something useful ships early." },
  ],
};

export const developmentPages: ServicePage[] = [
  {
    slug: "business-websites",
    label: "Business Websites",
    icon: "globe",
    summary: "A site that explains, persuades and converts.",
    meta: {
      title: "Business Website Design & Development | Pytron Digital",
      description:
        "Business websites designed to explain what you do, earn trust and turn visitors into inquiries. Fast, SEO-ready and easy for your team to update.",
    },
    h1: "Business Websites That Turn Visitors Into Inquiries",
    intro:
      "Your website is often the first serious conversation a customer has with you. We design and build business websites that explain what you do in seconds, earn trust and make the next step obvious.",
    problem: {
      heading: "The problem: a website that looks fine but doesn't sell",
      body: [
        "Plenty of business websites look professional and still don't produce inquiries. Visitors can't tell quickly what the business does, who it's for or what to do next — and many leave before the page finishes loading on mobile.",
      ],
      points: [
        "Vague headlines that could describe any company",
        "Slow pages, especially on mobile data",
        "Contact forms that ask too much or break silently",
        "Hard for your team to update without a developer",
      ],
    },
    solution: {
      heading: "How we build business websites",
      body: [
        "We start with messaging: who you serve, what you solve and why you're the right choice. Page structure follows from that and from what people search for. Design and development come after the story is clear.",
        "Sites are built on fast, modern frameworks with an editing setup your team can use. Analytics, conversion tracking and SEO foundations are included, so marketing can start the day you launch.",
      ],
    },
    benefits: [
      { title: "Clarity in seconds", text: "Visitors understand your offer before they scroll." },
      { title: "Fast everywhere", text: "Built to load quickly on phones and slower connections." },
      { title: "Ready for search", text: "Structure, metadata and schema in place from launch." },
      { title: "Easy to update", text: "Edit text, pages and posts without touching code." },
    ],
    process: [
      { title: "Discover", text: "Goals, audience, competitors and search research." },
      { title: "Structure & message", text: "Sitemap, page outlines and core copy." },
      { title: "Design", text: "Visual design for desktop and mobile, reviewed with you." },
      { title: "Build", text: "Development, content entry, integrations and tracking." },
      { title: "Launch & tune", text: "Testing, launch, redirects and speed tuning." },
    ],
    included: [
      "Messaging and page structure",
      "Custom design (no purchased templates)",
      "Responsive development on a modern framework",
      "Content management for your team",
      "On-page SEO, schema and XML sitemap",
      "Analytics and conversion tracking",
      "Accessibility checks against WCAG 2.2 AA",
      "Redirects from your old site to protect rankings",
    ],
    industries: ["professional-services", "healthcare", "real-estate", "local-business", "hospitality"],
    faqs: [
      { q: "Do you write the website copy?", a: "Yes. We can write all copy from interviews with you, or edit and structure copy you provide." },
      { q: "Will redesigning our site hurt our Google rankings?", a: "Not if it's done carefully. We map old URLs to new ones, keep what ranks well and set up redirects. A rebuild is often a chance to improve SEO." },
      { q: "Can we update the site ourselves?", a: "Yes. We set up an editing system suited to your team and show you how to use it." },
      { q: "Do you handle hosting and domains?", a: "We set up hosting in your name — usually on Vercel or a similar platform — and can manage it for you as part of a support plan." },
    ],
    related: [
      { label: "UI/UX Design", href: "/web-development/ui-ux-design/" },
      { label: "SEO Services", href: "/digital-marketing/seo/" },
      { label: "Blog: What every business website needs", href: "/blog/what-every-modern-business-website-needs/" },
    ],
  },
  {
    slug: "web-applications",
    label: "Web Applications",
    icon: "layout-dashboard",
    summary: "Portals, platforms and internal tools.",
    meta: {
      title: "Web Application Development — Portals, Platforms & SaaS | Pytron Digital",
      description:
        "Web application development for customer portals, booking systems, SaaS products and internal tools. Built in phases on modern, scalable technology.",
    },
    h1: "Web Application Development for Portals, Platforms and Tools",
    intro:
      "When spreadsheets, email threads and off-the-shelf software stop fitting how you work, a web application can. We design and build customer portals, booking systems, SaaS products and internal tools that are fast, secure and easy to use.",
    problem: {
      heading: "The problem: work held together by spreadsheets",
      body: [
        "Growing businesses often run key processes across several tools that don't talk to each other. Data gets copied by hand, customers wait for updates, and nobody has a single view of what's happening.",
      ],
      points: [
        "Customer updates sent manually by email or phone",
        "Data duplicated across spreadsheets and apps",
        "Off-the-shelf software that forces awkward workarounds",
        "No reliable reporting on the numbers that matter",
      ],
    },
    solution: {
      heading: "How we build web applications",
      body: [
        "We begin with the workflow, not the screens: who does what, with which data, and where things go wrong. That becomes a scoped first release that solves the most painful problem quickly.",
        "Applications are built with TypeScript, modern frameworks and managed cloud services, with authentication, permissions, audit trails and backups considered from the start.",
      ],
    },
    benefits: [
      { title: "Fits your process", text: "Software shaped around how your team actually works." },
      { title: "Self-service for customers", text: "Portals where customers check status, upload documents or book." },
      { title: "One source of truth", text: "Data in one place with reliable reporting." },
      { title: "Room to grow", text: "Architecture that supports new features and more users." },
    ],
    process: [
      { title: "Workflow mapping", text: "Users, roles, data and the problems to solve first." },
      { title: "Prototype", text: "Clickable prototype tested with real users." },
      { title: "Build in phases", text: "Working releases every few weeks with demos." },
      { title: "Launch", text: "Data migration, training and go-live support." },
      { title: "Evolve", text: "Ongoing improvements based on usage." },
    ],
    included: [
      "Discovery and workflow mapping",
      "UX design and clickable prototypes",
      "Front-end and back-end development",
      "Authentication, roles and permissions",
      "Integrations via APIs and webhooks",
      "Admin dashboards and reporting",
      "Automated testing and deployment",
      "Hosting, monitoring and backups",
    ],
    workflows: [
      { title: "Client onboarding", before: "Documents collected by email, details retyped into three systems.", after: "A secure portal where clients upload documents once; data flows to your CRM automatically." },
      { title: "Booking and scheduling", before: "Phone calls and back-and-forth messages to find a slot.", after: "Online booking with live availability, reminders and payment." },
      { title: "Operations tracking", before: "A shared spreadsheet updated whenever someone remembers.", after: "A web app with status updates, assignments and an audit trail." },
    ],
    industries: ["startups", "professional-services", "education", "healthcare", "real-estate"],
    faqs: [
      { q: "How much does a web application cost?", a: "It depends on scope. We recommend starting with a focused first release that solves the most valuable problem, then expanding. You'll get a clear, itemized proposal after discovery." },
      { q: "Can you build a SaaS product or MVP?", a: "Yes. We help founders define the smallest version worth launching, build it properly and set up the analytics to learn from early users." },
      { q: "How do you handle security?", a: "Secure authentication, role-based permissions, encrypted connections, dependency updates and least-privilege cloud access are standard. We also follow your industry's specific requirements." },
      { q: "Can you take over an existing application?", a: "Usually, yes. We start with a code review and tell you honestly whether to improve, refactor or rebuild." },
    ],
    related: [
      { label: "Custom Solutions", href: "/web-development/custom-solutions/" },
      { label: "AI Integrations", href: "/ai-solutions/ai-integrations/" },
      { label: "Startups & SaaS", href: "/industries/startups/" },
    ],
  },
  {
    slug: "ecommerce",
    label: "E-commerce",
    icon: "shopping-cart",
    summary: "Stores built for speed and checkout.",
    meta: {
      title: "E-commerce Website Development — Shopify & Headless | Pytron Digital",
      description:
        "E-commerce development on Shopify or headless Next.js: fast product pages, smooth checkout, connected inventory and marketing that drives sales after launch.",
    },
    h1: "E-commerce Stores Built for Speed, Search and Checkout",
    intro:
      "We build online stores that load fast, rank well and make buying easy — then connect them to the email, ads and automation that bring shoppers back. Shopify, WooCommerce or headless, depending on what your business needs.",
    problem: {
      heading: "The problem: traffic that doesn't buy",
      body: [
        "Many stores get visitors but lose them on slow product pages, confusing navigation or a checkout that asks too much. Behind the scenes, orders and inventory are often managed by hand.",
      ],
      points: [
        "Slow product and collection pages on mobile",
        "Checkout friction and unexpected costs",
        "Product data managed in spreadsheets",
        "No follow-up for abandoned carts",
      ],
    },
    solution: {
      heading: "How we build e-commerce",
      body: [
        "We choose the platform based on your catalog, markets and team — Shopify for most growing brands, headless when you need more flexibility or speed. Product pages are designed to answer buyer questions, and checkout is kept as short as possible.",
        "Inventory, shipping, payments, email and analytics are connected so the store runs with less manual work.",
      ],
    },
    benefits: [
      { title: "Faster pages, more sales", text: "Speed improvements reduce drop-off on mobile." },
      { title: "Search-friendly catalog", text: "Product and collection pages structured for SEO." },
      { title: "Smoother checkout", text: "Fewer steps and local payment options." },
      { title: "Automated operations", text: "Orders, stock and notifications handled automatically." },
    ],
    process: [
      { title: "Discover", text: "Catalog, markets, payments and fulfillment." },
      { title: "Design", text: "Store structure, product page and checkout design." },
      { title: "Build", text: "Theme or headless build, apps and integrations." },
      { title: "Migrate & launch", text: "Products, customers, orders and redirects." },
      { title: "Grow", text: "Email flows, ads and conversion improvements." },
    ],
    included: [
      "Shopify, WooCommerce or headless Next.js builds",
      "Product page and checkout optimization",
      "Multi-currency and international setup",
      "Payment gateways (Stripe, PayPal, Razorpay and others)",
      "Inventory, shipping and ERP integrations",
      "Product schema and SEO",
      "Abandoned cart and post-purchase email flows",
    ],
    industries: ["ecommerce", "hospitality", "local-business"],
    faqs: [
      { q: "Shopify or a custom store?", a: "Shopify suits most growing brands well. A headless or custom build makes sense when you need unusual product logic, very high performance or deep integrations. We'll recommend one honestly." },
      { q: "Can you migrate our existing store?", a: "Yes. We migrate products, customers and order history, and set up redirects so you keep your search rankings." },
      { q: "Can you sell internationally?", a: "Yes. We set up multi-currency pricing, local payment methods, tax and shipping rules for your markets." },
      { q: "Do you handle marketing for the store too?", a: "Yes. SEO, Google Shopping, Meta ads and email marketing are all part of what we do." },
    ],
    related: [
      { label: "E-commerce & Retail", href: "/industries/ecommerce/" },
      { label: "Email Marketing", href: "/digital-marketing/email-marketing/" },
      { label: "Google Ads", href: "/digital-marketing/google-ads/" },
    ],
  },
  {
    slug: "ui-ux-design",
    label: "UI/UX Design",
    icon: "palette",
    summary: "Interfaces people understand in seconds.",
    meta: {
      title: "UI/UX Design & Product Design Services | Pytron Digital",
      description:
        "UI/UX design for websites, web apps and digital products: research, user flows, prototypes and design systems that make interfaces easy to understand and use.",
    },
    h1: "UI/UX and Product Design People Understand in Seconds",
    intro:
      "Interfaces your users understand in seconds and enjoy coming back to. We research how people use your product, design flows that remove friction and hand over designs our own engineers can build without guesswork.",
    problem: {
      heading: "The problem: products that are hard to use",
      body: [
        "Confusing interfaces cost money quietly — abandoned signups, support tickets, features nobody finds. Often the product works; people just can't tell how to use it.",
      ],
      points: [
        "Signup and onboarding that lose people halfway",
        "Inconsistent screens built by different people over time",
        "Key features hidden behind unclear labels",
        "Designs that don't translate cleanly into code",
      ],
    },
    solution: {
      heading: "How we design",
      body: [
        "We start by watching how real users try to complete real tasks, and by looking at your analytics for where they drop off. Flows and wireframes come before visual polish.",
        "Final designs come with a component-based design system, so screens stay consistent and development is faster. Because the same team builds what we design, nothing gets lost in handover.",
      ],
    },
    benefits: [
      { title: "Fewer drop-offs", text: "Smoother signup, onboarding and checkout flows." },
      { title: "Consistency", text: "A design system that keeps every screen aligned." },
      { title: "Accessible by default", text: "Contrast, focus states and keyboard use considered from the start." },
      { title: "Faster builds", text: "Designs mapped to reusable components." },
    ],
    process: [
      { title: "Research", text: "User interviews, analytics review and task testing." },
      { title: "Flows", text: "User journeys and information architecture." },
      { title: "Wireframes", text: "Low-fidelity layouts to agree structure quickly." },
      { title: "Visual design", text: "High-fidelity screens and a design system." },
      { title: "Test & hand off", text: "Prototype testing and build-ready specs." },
    ],
    included: [
      "User research and usability testing",
      "Information architecture and user flows",
      "Wireframes and clickable prototypes",
      "Visual and interaction design",
      "Design systems and component libraries",
      "Accessibility review (WCAG 2.2 AA)",
      "Developer-ready handoff in Figma",
    ],
    industries: ["startups", "education", "healthcare", "ecommerce"],
    faqs: [
      { q: "Do you only design, or do you build too?", a: "Both. We can design only, but most clients choose design and build together so the final product matches the design exactly." },
      { q: "What tools do you use?", a: "Figma for design and prototyping, plus analytics and session tools for research where you have them." },
      { q: "Can you redesign part of our product?", a: "Yes. Focused redesigns of one flow — onboarding, checkout, a dashboard — are often the fastest way to see results." },
      { q: "Do you create brand identities?", a: "We create visual systems for digital products and websites. For full brand strategy work, we can collaborate with your brand team." },
    ],
    related: [
      { label: "Web Applications", href: "/web-development/web-applications/" },
      { label: "Business Websites", href: "/web-development/business-websites/" },
      { label: "Our Products", href: "/products/" },
    ],
  },
  {
    slug: "custom-solutions",
    label: "Custom Solutions",
    icon: "layers",
    summary: "Software shaped around your workflow.",
    meta: {
      title: "Custom Software Development & Business Dashboards | Pytron Digital",
      description:
        "Custom software development for problems off-the-shelf tools don't solve: business dashboards, internal tools, calculators, integrations and digital products.",
    },
    h1: "Custom Software Development for Problems Off-the-Shelf Tools Don't Solve",
    intro:
      "Got a business problem? We'll build the solution. From business dashboards and internal tools to customer-facing calculators and full digital products, we build custom software around how your business actually runs.",
    problem: {
      heading: "The problem: forcing your business into someone else's software",
      body: [
        "Off-the-shelf software is the right choice — until it isn't. When your process is what makes you different, generic tools force workarounds, extra subscriptions and manual steps.",
      ],
      points: [
        "Several subscriptions that each do part of the job",
        "Manual exports to build weekly reports",
        "Customer questions that a simple tool could answer",
        "Ideas for digital products with no team to build them",
      ],
    },
    solution: {
      heading: "How we approach custom builds",
      body: [
        "We first check whether existing tools could solve the problem with better setup or integration — often they can. When custom software is the better answer, we build the smallest version that delivers value and expand from there.",
        "Product thinking, design, engineering and growth sit in one team, which is how we build our own products.",
      ],
    },
    benefits: [
      { title: "Built around your workflow", text: "No workarounds, no unused features." },
      { title: "Fewer subscriptions", text: "Replace or connect tools that overlap." },
      { title: "Decision-ready data", text: "Dashboards that show the numbers that matter." },
      { title: "New revenue options", text: "Turn expertise into tools and digital products." },
    ],
    process: [
      { title: "Problem framing", text: "What's broken, who it affects, what success looks like." },
      { title: "Options", text: "Configure, integrate or build — with honest trade-offs." },
      { title: "Prototype", text: "A working slice to prove the idea." },
      { title: "Build", text: "Phased delivery with regular demos." },
      { title: "Support", text: "Monitoring, fixes and new features." },
    ],
    included: [
      "Business dashboards and reporting",
      "Internal tools and admin panels",
      "Calculators, finders and eligibility checkers",
      "API development and third-party integrations",
      "Data pipelines and automated reports",
      "Digital product design and launch",
    ],
    extraSections: [
      {
        id: "dashboards",
        heading: "Business dashboards",
        body: [
          "Most businesses already have the data they need — it's just spread across a CRM, an ad account, a store and a few spreadsheets. We connect those sources and build dashboards that show the handful of numbers your team actually uses to make decisions.",
        ],
        points: [
          "Sales, marketing and operations metrics in one view",
          "Automatic daily or weekly refresh — no manual exports",
          "Role-based access so each team sees what it needs",
          "Scheduled summaries sent to email or chat",
        ],
      },
    ],
    workflows: [
      { title: "Weekly reporting", before: "A manager spends hours exporting data and building slides.", after: "A live dashboard plus an automatic summary every Monday morning." },
      { title: "Quote calculation", before: "Sales staff calculate quotes by hand from a price sheet.", after: "An internal calculator produces accurate quotes in seconds." },
      { title: "Customer questions", before: "The same eligibility questions answered by phone all day.", after: "A public self-service checker that answers them instantly." },
    ],
    industries: ["professional-services", "startups", "real-estate", "education"],
    faqs: [
      { q: "How do we know if we need custom software?", a: "If you're paying for several tools that each do part of a job, or repeating the same manual steps every day, it's worth a conversation. Sometimes the answer is better setup of tools you already have." },
      { q: "Can you build a dashboard from our existing tools?", a: "Usually, yes — most CRMs, stores, ad platforms and accounting tools have APIs we can connect to." },
      { q: "Can you help us turn an idea into a digital product?", a: "Yes. We help define the idea, design it, build it and market it — the same way we build our own products." },
      { q: "Who maintains the software after launch?", a: "We offer support plans, and we document everything so your own team or another developer can take over if you prefer." },
    ],
    related: [
      { label: "Business Automation", href: "/ai-solutions/business-automation/" },
      { label: "Web Applications", href: "/web-development/web-applications/" },
      { label: "Our Products", href: "/products/" },
    ],
  },
];
