import type { ServiceHub, ServicePage } from "./types";

export const marketingHub: ServiceHub = {
  slug: "digital-marketing",
  pillar: "marketing",
  meta: {
    title: "Digital Marketing Services — SEO, Google Ads & Social | Pytron Digital",
    description:
      "Digital marketing services from a team that also builds your website: SEO, Google Ads, social media, content, email and local SEO tied to real business goals.",
  },
  eyebrow: "Digital Marketing",
  h1: "Digital Marketing That Turns Attention Into Customers",
  intro:
    "Data-driven marketing that attracts the right customers and turns them into revenue. Because we also build websites and automation, your campaigns land on pages built to convert and feed leads into systems built to follow up.",
  pillars: [
    { title: "Get found", text: "SEO, local SEO and content put you where buyers are already searching." },
    { title: "Get chosen", text: "Ads, social and landing pages make a clear case for your offer." },
    { title: "Get repeat business", text: "Email and automation keep customers coming back without extra manual work." },
  ],
  approach: {
    heading: "How our digital marketing agency works differently",
    body: [
      "Most marketing agencies stop at the click. We look at the whole path: the search or ad that brings someone in, the page they land on, the form they fill in and what happens to that lead afterward. When one link is weak, we fix it — even if it's a website or CRM problem rather than a marketing one.",
      "Every channel we run is tied to a measurable business goal agreed at the start: qualified leads, booked calls, store visits or online sales. Reports show those outcomes first, and the vanity metrics only where they explain something.",
    ],
  },
  extraSections: [
    {
      id: "growth-strategy",
      heading: "Growth Strategy: tie every marketing rupee and dollar to a business goal",
      body: [
        "Before we spend anything on media, we agree on the numbers that matter for your business — the value of a customer, what you can afford to pay for a lead, and which services or products you most want to sell.",
        "From there we build a channel plan that matches your stage. A new local business might start with Google Business Profile and a focused search campaign. An established e-commerce brand might need technical SEO, retargeting and email automation working together.",
      ],
      points: [
        "Goal and unit-economics workshop",
        "Channel mix and budget allocation by stage",
        "Measurement plan: conversions, attribution and reporting",
        "Quarterly review of what to scale, fix or stop",
      ],
    },
  ],
  faqs: [
    {
      q: "Which digital marketing channel should we start with?",
      a: "It depends on how people buy what you sell. If customers search for your service, SEO and Google Ads usually come first. If you are creating demand for something new, social and content matter more. We recommend a starting mix in the first consultation.",
    },
    {
      q: "Do you work with businesses outside India?",
      a: "Yes. We are remote-first and work with businesses in the USA, UK, Canada, Australia, the UAE and India, with meeting hours that overlap your working day.",
    },
    {
      q: "How do you report on results?",
      a: "You get a monthly report that starts with business outcomes — leads, calls, sales and cost per result — followed by channel detail and what we plan to change next.",
    },
    {
      q: "Can you fix our website as part of a marketing engagement?",
      a: "Yes. Because we also build websites and web apps, we can improve landing pages, speed, tracking and forms directly instead of handing you a list of recommendations.",
    },
    {
      q: "Do you lock clients into long contracts?",
      a: "No. We propose a scope that fits your goals and review it regularly. Some channels, like SEO, need a few months to show results, and we will be clear about that up front.",
    },
  ],
};

export const marketingPages: ServicePage[] = [
  {
    slug: "seo",
    label: "SEO",
    icon: "search",
    summary: "Rank where your customers are already searching.",
    meta: {
      title: "SEO Services — Technical, On-Page & Content SEO | Pytron Digital",
      description:
        "SEO services that combine technical fixes, on-page optimization and content to win customers who are already searching. From an SEO agency that can also build your site.",
    },
    h1: "SEO Services That Win Customers Who Are Already Searching",
    intro:
      "Rank where your customers are already searching. We fix the technical foundations, sharpen your pages and publish content that answers real buyer questions — then measure SEO by leads and sales, not just rankings.",
    problem: {
      heading: "The problem: good businesses that are hard to find",
      body: [
        "Many businesses have a better offer than the competitors ranking above them. They lose because their site is slow, their pages don't match how people search, or search engines can't understand what they do.",
      ],
      points: [
        "Service pages that target no specific search",
        "Slow pages and poor Core Web Vitals on mobile",
        "Thin or duplicated content across locations or products",
        "No tracking, so nobody knows which searches bring customers",
      ],
    },
    solution: {
      heading: "Our approach to SEO",
      body: [
        "We start with research: what your customers type, which competitors win those searches and why. Then we fix what blocks you technically, rebuild key pages around search intent, and create content that earns links and trust over time.",
        "Because our team also builds websites, technical fixes don't wait on a separate developer. Speed, structured data, internal linking and site architecture are changed directly.",
      ],
    },
    benefits: [
      { title: "Compounding visibility", text: "Rankings built on solid pages keep bringing visitors without paying for every click." },
      { title: "Higher-intent visitors", text: "People who search for your service are often closer to buying than people who see an ad." },
      { title: "Clear measurement", text: "Conversions are tracked from search to inquiry, so you see which keywords drive revenue." },
      { title: "A faster, better site", text: "Technical SEO improvements also make your site faster and easier to use." },
    ],
    process: [
      { title: "Audit", text: "Technical crawl, content review, competitor and keyword research." },
      { title: "Prioritize", text: "A roadmap ranked by impact and effort, agreed with you." },
      { title: "Fix & optimize", text: "Technical fixes, page rewrites, schema and internal links." },
      { title: "Create", text: "Content and landing pages for the searches that matter." },
      { title: "Measure", text: "Monthly reporting on rankings, traffic, leads and next steps." },
    ],
    included: [
      "Technical SEO audit and fixes (speed, indexing, crawl errors)",
      "Keyword and search intent research",
      "On-page optimization of key service and product pages",
      "Structured data (schema) implementation",
      "Internal linking and site architecture",
      "Content plan and SEO-led content",
      "Google Search Console and analytics setup",
      "Monthly report with outcomes and next actions",
    ],
    industries: ["healthcare", "real-estate", "ecommerce", "professional-services", "local-business"],
    faqs: [
      { q: "How long does SEO take to work?", a: "Technical fixes can show impact within weeks. Competitive rankings usually take several months of consistent work. We set realistic milestones based on your market and starting point." },
      { q: "Do you guarantee first-page rankings?", a: "No. Nobody can honestly guarantee rankings, because search engines control them. We commit to the work, the process and transparent reporting." },
      { q: "Do you build links?", a: "We focus on earning links through useful content, digital PR and relationships. We don't buy links or use networks that put your site at risk." },
      { q: "Can you do SEO for a site you didn't build?", a: "Yes. We work on WordPress, Shopify, Webflow, custom Next.js and most other platforms. If the platform itself is the problem, we will tell you." },
      { q: "What's the difference between SEO and local SEO?", a: "SEO covers your whole site and broad searches. Local SEO focuses on map results and searches with local intent, such as “near me” searches, and relies heavily on your Google Business Profile." },
    ],
    related: [
      { label: "Local SEO", href: "/digital-marketing/local-seo/" },
      { label: "Content Marketing", href: "/digital-marketing/content-marketing/" },
      { label: "Business Websites", href: "/web-development/business-websites/" },
      { label: "Blog: How much does SEO cost?", href: "/blog/how-much-does-seo-cost-small-business-2026/" },
    ],
  },
  {
    slug: "google-ads",
    label: "Google Ads",
    icon: "target",
    summary: "Put your offer in front of buyers ready to act.",
    meta: {
      title: "Google Ads Agency — Search, Performance Max & Shopping | Pytron Digital",
      description:
        "Google Ads management built around cost per lead and cost per sale. Search, Performance Max and Shopping campaigns with landing pages and tracking done properly.",
    },
    h1: "Google Ads Management Built Around Cost per Lead",
    intro:
      "Put your offer in front of buyers ready to act. We build and manage Google Ads campaigns around the leads and sales they produce — and we fix the landing pages and tracking that most campaigns quietly depend on.",
    problem: {
      heading: "The problem: paying for clicks that never become customers",
      body: [
        "Google Ads can bring buyers to your site the same day. It can also spend a budget quickly on the wrong searches. Most wasted spend comes from a few common issues.",
      ],
      points: [
        "Broad keywords matching irrelevant searches",
        "Ads sending traffic to a generic homepage",
        "Conversion tracking that is missing or counts the wrong actions",
        "Automated bidding optimizing toward bad data",
      ],
    },
    solution: {
      heading: "Our approach to Google Ads",
      body: [
        "We structure campaigns around what you sell and who buys it, write ads that match search intent, and send each group of searches to a page built for it. Conversion tracking is set up and tested before we scale spend.",
        "Once real conversion data exists, we use Google's automated bidding where it helps and keep tight control where it doesn't — with weekly search-term reviews to remove waste.",
      ],
    },
    benefits: [
      { title: "Fast, controllable demand", text: "Turn campaigns up or down as capacity and seasonality change." },
      { title: "Less wasted spend", text: "Negative keywords and search-term reviews cut irrelevant clicks." },
      { title: "Better landing pages", text: "Dedicated pages built by our development team, not a template." },
      { title: "Trustworthy data", text: "Conversion tracking verified end to end, including calls and forms." },
    ],
    process: [
      { title: "Account review", text: "Audit of existing campaigns, tracking and landing pages." },
      { title: "Plan", text: "Campaign structure, budgets and target cost per result." },
      { title: "Build", text: "Campaigns, ads, assets, landing pages and conversion tracking." },
      { title: "Optimize", text: "Search terms, bids, ads and pages improved every week." },
      { title: "Report", text: "Monthly results by lead and sale, plus next steps." },
    ],
    included: [
      "Search, Performance Max, Shopping and Demand Gen campaigns",
      "Keyword research and negative keyword lists",
      "Ad copy and asset creation",
      "Landing page design and development",
      "Conversion tracking via Google Tag Manager and GA4",
      "Call and form tracking",
      "Weekly optimization and monthly reporting",
    ],
    industries: ["healthcare", "real-estate", "ecommerce", "education", "local-business"],
    faqs: [
      { q: "How much should we spend on Google Ads?", a: "Start with what you can afford to pay for a customer and how many you want. We help you work backward to a test budget that is large enough to learn from, then scale what works." },
      { q: "Is your fee a percentage of ad spend?", a: "We prefer a fixed management fee agreed in the proposal, so our recommendations aren't tied to increasing your spend." },
      { q: "Do we own the Google Ads account?", a: "Yes. Campaigns run in an account you own. You keep full access and all data if we stop working together." },
      { q: "Should we run Google Ads or invest in SEO?", a: "Often both, in sequence. Ads deliver results quickly and reveal which searches convert; SEO builds lasting visibility for those searches. Our blog post on SEO vs Google Ads goes into detail." },
      { q: "Can you take over an existing account?", a: "Yes. We start with an audit and keep what works, so performance doesn't reset." },
    ],
    related: [
      { label: "Performance Marketing", href: "/digital-marketing/performance-marketing/" },
      { label: "SEO Services", href: "/digital-marketing/seo/" },
      { label: "Business Websites", href: "/web-development/business-websites/" },
      { label: "Blog: SEO vs Google Ads", href: "/blog/seo-vs-google-ads-which-first/" },
    ],
  },
  {
    slug: "social-media",
    label: "Social Media Marketing",
    icon: "share-2",
    summary: "Build a brand people recognize and trust.",
    meta: {
      title: "Social Media Marketing Services — Strategy, Content & Ads | Pytron Digital",
      description:
        "Social media marketing that builds a recognizable brand and turns attention into inquiries: strategy, content production, community management and paid social.",
    },
    h1: "Social Media Marketing That Builds Trust and Brings Inquiries",
    intro:
      "Build a brand people recognize and trust. We plan, create and publish consistent, on-brand content on the platforms your customers actually use — and connect it to clear next steps so attention turns into inquiries.",
    problem: {
      heading: "The problem: posting without a plan",
      body: [
        "Many businesses post regularly and see little in return. The content is inconsistent, aimed at nobody in particular, and there is no path from a post to a conversation or sale.",
      ],
      points: [
        "Content that doesn't reflect what makes you different",
        "Too many platforms, done thinly",
        "No link between social activity and leads",
        "Comments and messages answered late or not at all",
      ],
    },
    solution: {
      heading: "Our approach to social media",
      body: [
        "We pick the right platforms for your audience, define a small set of content themes that match your strengths, and produce content in batches so quality stays high. Every profile has a clear next step: book, call, message or buy.",
        "Organic content builds trust; paid social extends reach to precise audiences. We use both, and track what each contributes.",
      ],
    },
    benefits: [
      { title: "A consistent brand", text: "Recognizable visuals and voice across every channel." },
      { title: "Content with a purpose", text: "Each theme supports a business goal, from awareness to inquiries." },
      { title: "Faster responses", text: "Message and comment handling, with automation where it helps." },
      { title: "Clear attribution", text: "UTM tracking shows which posts and campaigns bring leads." },
    ],
    process: [
      { title: "Audit", text: "Review of current profiles, audience and competitors." },
      { title: "Strategy", text: "Platforms, themes, posting rhythm and goals." },
      { title: "Create", text: "Monthly content batches: graphics, short video and copy." },
      { title: "Publish & engage", text: "Scheduling, community management and messaging." },
      { title: "Review", text: "Monthly report and content adjustments." },
    ],
    included: [
      "Social media strategy and content calendar",
      "Design of post templates aligned to your brand",
      "Short-form video scripting and editing",
      "Copywriting and hashtag research",
      "Scheduling and publishing",
      "Community and inbox management",
      "Optional paid social campaigns",
      "Monthly performance report",
    ],
    industries: ["hospitality", "travel", "education", "ecommerce", "local-business"],
    faqs: [
      { q: "Which platforms should we be on?", a: "Usually two or three, chosen by where your buyers spend time. B2B often means LinkedIn; consumer brands often mean Instagram, Facebook or YouTube. We recommend based on your audience, not trends." },
      { q: "Do you create the content or do we?", a: "We can do all of it, or work with photos and video you supply. Many clients send raw footage and we handle editing, captions and publishing." },
      { q: "How do you measure social media success?", a: "By the business goal we agree: inquiries, bookings, sales or audience growth in the right segment. Likes and reach are reported as context, not as the goal." },
      { q: "Do you run paid social ads too?", a: "Yes. Paid social on Meta, LinkedIn and other platforms is covered on our performance marketing page." },
    ],
    related: [
      { label: "Performance Marketing", href: "/digital-marketing/performance-marketing/" },
      { label: "Content Marketing", href: "/digital-marketing/content-marketing/" },
      { label: "Hospitality", href: "/industries/hospitality/" },
    ],
  },
  {
    slug: "content-marketing",
    label: "Content Marketing",
    icon: "pen-line",
    summary: "Publish content that earns attention and leads.",
    meta: {
      title: "Content Marketing Services — Strategy, Writing & Distribution | Pytron Digital",
      description:
        "Content marketing that earns search traffic, builds authority and generates leads: research-led articles, guides, landing pages and tools, written for people first.",
    },
    h1: "Content Marketing That Earns Attention and Leads",
    intro:
      "Publish content that earns attention and leads. We plan content around the questions your buyers ask before they buy, write it for people first, and make sure it ranks, gets shared and moves readers toward an inquiry.",
    problem: {
      heading: "The problem: content that nobody reads",
      body: [
        "Blogs written to fill a calendar rarely bring customers. Generic articles compete with thousands of similar pages, and even good posts often have no clear next step for the reader.",
      ],
      points: [
        "Topics chosen without search or customer research",
        "Articles that sound like everyone else",
        "No internal links to service pages",
        "No way to tell which content creates leads",
      ],
    },
    solution: {
      heading: "Our approach to content",
      body: [
        "We map content to the buyer journey: questions people ask when they first notice a problem, when they compare options and when they're ready to choose. Each piece has a target search, a clear angle and a link to the next step.",
        "Where it helps, we go beyond articles — calculators, checklists, comparison pages and free tools. Our own products are an example of content that solves a real problem and earns attention on its own.",
      ],
    },
    benefits: [
      { title: "Authority in your niche", text: "Content that shows real expertise builds trust with buyers and search engines." },
      { title: "Long-lasting traffic", text: "Well-targeted content can bring visitors for years." },
      { title: "Better sales conversations", text: "Prospects arrive already understanding your approach." },
      { title: "Material for every channel", text: "One strong piece feeds social, email and ads." },
    ],
    process: [
      { title: "Research", text: "Customer questions, search demand and competitor gaps." },
      { title: "Plan", text: "Topic clusters, formats and a realistic publishing rhythm." },
      { title: "Create", text: "Writing, editing, design and on-page SEO." },
      { title: "Distribute", text: "Internal linking, email, social and outreach." },
      { title: "Refresh", text: "Update content that's slipping and expand what's working." },
    ],
    included: [
      "Content strategy and topic clusters",
      "SEO-led articles and guides",
      "Landing page and service page copy",
      "Comparison pages and FAQs",
      "Interactive tools and calculators (with our dev team)",
      "Content refreshes for existing posts",
      "Distribution via email and social",
    ],
    industries: ["professional-services", "startups", "education", "healthcare"],
    faqs: [
      { q: "Do you use AI to write content?", a: "We use AI tools for research and drafting support, but every piece is shaped, fact-checked and edited by people. Content that adds nothing new doesn't perform, however it's produced." },
      { q: "How often should we publish?", a: "Consistency matters more than volume. For most businesses, a few strong pieces per month beat daily filler." },
      { q: "Can you write about technical or regulated topics?", a: "Yes. We work from your expertise through short interviews and review cycles, and we cite official sources where accuracy matters." },
      { q: "Who owns the content?", a: "You do. Everything we write for you is yours." },
    ],
    related: [
      { label: "SEO Services", href: "/digital-marketing/seo/" },
      { label: "Email Marketing", href: "/digital-marketing/email-marketing/" },
      { label: "Our Products", href: "/products/" },
    ],
  },
  {
    slug: "local-seo",
    label: "Local SEO",
    icon: "map-pin",
    summary: "Be the first choice in your area on Google Maps.",
    meta: {
      title: "Local SEO Services — Google Business Profile & Maps | Pytron Digital",
      description:
        "Local SEO services that help nearby customers find and choose you on Google Maps: Google Business Profile optimization, local pages, citations and review strategy.",
    },
    h1: "Local SEO That Makes You the First Choice Nearby",
    intro:
      "Be the first choice in your area on Google Maps. We optimize your Google Business Profile, build location pages with real substance and help you earn the reviews that convince local customers to call.",
    problem: {
      heading: "The problem: invisible on the map",
      body: [
        "For local services, many customers never scroll past the map results. If your profile is incomplete, your details are inconsistent across the web or competitors have more recent reviews, you lose calls you never knew about.",
      ],
      points: [
        "Incomplete or unverified Google Business Profile",
        "Different addresses or phone numbers across directories",
        "No location-specific pages on your website",
        "Few or old reviews, and no replies",
      ],
    },
    solution: {
      heading: "Our approach to local SEO",
      body: [
        "We treat your Google Business Profile as your second homepage: categories, services, photos, posts and Q&A all kept current. Your website gets location pages with genuinely local information, and your business details are made consistent across key directories.",
        "Reviews are the other half. We set up a simple, policy-compliant way to ask happy customers for reviews and to reply to every review promptly.",
      ],
    },
    benefits: [
      { title: "More calls and direction requests", text: "The actions that matter most for local businesses." },
      { title: "Visibility for “near me” searches", text: "Show up when people search with local intent." },
      { title: "Stronger reputation", text: "A steady flow of genuine reviews with professional replies." },
      { title: "Multi-location ready", text: "A structure that scales as you open new branches." },
    ],
    process: [
      { title: "Local audit", text: "Profile, citations, reviews and local competitors." },
      { title: "Fix foundations", text: "Profile optimization and directory consistency." },
      { title: "Build pages", text: "Location and service-area pages with real local content." },
      { title: "Reviews", text: "Review request flow and reply process." },
      { title: "Track", text: "Calls, direction requests and local rankings each month." },
    ],
    included: [
      "Google Business Profile optimization and posting",
      "Apple Business Connect and Bing Places setup",
      "Citation cleanup across key directories",
      "Location pages with LocalBusiness schema",
      "Review request automation (policy-compliant)",
      "Review reply guidance or management",
      "Local rank and call tracking",
    ],
    industries: ["healthcare", "hospitality", "real-estate", "local-business", "professional-services"],
    faqs: [
      { q: "Do we need a physical address for local SEO?", a: "Not always. Service-area businesses can hide their address on Google and define the areas they serve. The rules differ for storefronts, and we set it up correctly for your situation." },
      { q: "Can you get us more reviews?", a: "We help you ask more customers, more consistently, at the right moment. We never buy, fake or incentivize reviews — that breaks platform policies and can get a profile suspended." },
      { q: "How quickly does local SEO work?", a: "Profile fixes can make a difference within weeks. Competitive markets take longer, especially where competitors have many reviews." },
      { q: "We have several branches. Can you handle that?", a: "Yes. Each location gets its own optimized profile and a page on your website with information specific to that branch." },
    ],
    related: [
      { label: "SEO Services", href: "/digital-marketing/seo/" },
      { label: "Local Businesses", href: "/industries/local-business/" },
      { label: "Blog: How local SEO brings customers", href: "/blog/how-local-seo-brings-more-customers/" },
    ],
  },
  {
    slug: "email-marketing",
    label: "Email Marketing",
    icon: "mail",
    summary: "Turn one-time buyers into repeat customers.",
    meta: {
      title: "Email Marketing Services — Automation, Campaigns & Lifecycle | Pytron Digital",
      description:
        "Email marketing that turns one-time buyers into repeat customers: welcome flows, abandoned-cart and follow-up automation, newsletters and segmentation, set up properly.",
    },
    h1: "Email Marketing That Turns One-Time Buyers Into Repeat Customers",
    intro:
      "Turn one-time buyers into repeat customers. We build automated email journeys that welcome, follow up, remind and re-engage — so revenue from customers you already have doesn't depend on someone remembering to send a newsletter.",
    problem: {
      heading: "The problem: a list nobody uses",
      body: [
        "Most businesses collect email addresses and then send an occasional broadcast. The people most likely to buy again — recent customers and warm leads — get the same message as everyone else, or nothing at all.",
      ],
      points: [
        "No welcome or follow-up sequences",
        "Leads that go cold after the first inquiry",
        "Emails landing in spam because authentication isn't set up",
        "One message for every customer, regardless of behavior",
      ],
    },
    solution: {
      heading: "Our approach to email",
      body: [
        "We start with deliverability — domain authentication (SPF, DKIM, DMARC) and list hygiene — so emails reach the inbox. Then we build the automated flows that matter most for your business, connected to your website, store or CRM.",
        "Broadcast campaigns come after, segmented by what people bought, read or asked about.",
      ],
    },
    benefits: [
      { title: "Revenue on autopilot", text: "Flows keep working every day without manual sends." },
      { title: "Warmer leads", text: "Prospects get timely, useful follow-up after they inquire." },
      { title: "Better inbox placement", text: "Proper authentication and clean lists protect your sender reputation." },
      { title: "Compliance built in", text: "Consent, unsubscribe and data handling set up for your markets." },
    ],
    process: [
      { title: "Audit", text: "Platform, list, deliverability and existing emails." },
      { title: "Map journeys", text: "Key moments: signup, inquiry, purchase, inactivity." },
      { title: "Build", text: "Templates, flows, integrations and segments." },
      { title: "Launch", text: "Testing across devices and email clients." },
      { title: "Improve", text: "Subject lines, timing and content tested over time." },
    ],
    included: [
      "Email platform setup or migration (Klaviyo, Mailchimp, Brevo and others)",
      "SPF, DKIM and DMARC configuration",
      "Welcome, lead nurture and post-purchase flows",
      "Abandoned cart and browse abandonment flows",
      "Responsive email templates",
      "Segmentation and list cleanup",
      "Consent capture aligned with CAN-SPAM, GDPR and CASL",
    ],
    industries: ["ecommerce", "education", "hospitality", "startups"],
    faqs: [
      { q: "Which email platform do you recommend?", a: "It depends on your stack. E-commerce stores often suit Klaviyo; service businesses may be fine with Brevo or Mailchimp, or with email inside their CRM. We recommend based on your integrations and budget." },
      { q: "Can you connect email to our website forms and CRM?", a: "Yes. Connecting forms, stores and CRMs is part of what our development and automation team does every day." },
      { q: "How often should we email our list?", a: "Automated flows run as people take actions. For broadcasts, regular and useful beats frequent — we test what your audience responds to." },
      { q: "Is it legal to email people who gave us their address?", a: "It depends on how consent was collected and where they live. Rules differ between the USA, UK, EU and Canada. We set up consent capture appropriate for your markets." },
    ],
    related: [
      { label: "Business Automation", href: "/ai-solutions/business-automation/" },
      { label: "E-commerce Development", href: "/web-development/ecommerce/" },
      { label: "Content Marketing", href: "/digital-marketing/content-marketing/" },
    ],
  },
  {
    slug: "performance-marketing",
    label: "Performance Marketing",
    icon: "trending-up",
    summary: "Reach precise audiences on Meta, LinkedIn and more.",
    meta: {
      title: "Performance Marketing & Paid Social — Meta, LinkedIn Ads | Pytron Digital",
      description:
        "Performance marketing across Google, Meta, LinkedIn and more, managed around cost per lead and return on ad spend, with creative, landing pages and tracking under one team.",
    },
    h1: "Performance Marketing and Paid Social, Managed Around Results",
    intro:
      "Reach precise audiences on Meta, LinkedIn and more. We run paid campaigns across platforms with one goal — profitable growth — and own the creative, landing pages and tracking that decide whether ads pay off.",
    problem: {
      heading: "The problem: spend spread thin, results unclear",
      body: [
        "Running ads across several platforms often means several dashboards, each claiming credit for the same sale. Without a single view of cost per result, it's hard to know where the next dollar should go.",
      ],
      points: [
        "Platforms reporting conflicting numbers",
        "Creative that gets tired and is rarely refreshed",
        "Tracking weakened by browser privacy changes",
        "Budgets set by habit rather than results",
      ],
    },
    solution: {
      heading: "Our approach to performance marketing",
      body: [
        "We set one source of truth for results — usually your CRM, store or GA4 — and judge every platform against it. Server-side tracking and conversion APIs are set up where they improve data quality.",
        "Creative is treated as the biggest lever: we test new angles regularly, and our team builds the landing pages so message and page always match.",
      ],
    },
    benefits: [
      { title: "One view of performance", text: "Cost per lead and return on ad spend compared fairly across platforms." },
      { title: "Precise targeting", text: "Audiences built from your customer data, interests and job titles." },
      { title: "Fresh creative", text: "A steady testing rhythm for images, video and copy." },
      { title: "Budget that follows results", text: "Spend shifts toward what's working each month." },
    ],
    process: [
      { title: "Goals & tracking", text: "Targets, attribution approach and pixel / API setup." },
      { title: "Audience & creative", text: "Audiences, offers and first creative concepts." },
      { title: "Launch", text: "Structured campaigns with clear tests." },
      { title: "Optimize", text: "Weekly reviews of creative, audiences and bids." },
      { title: "Scale", text: "Increase spend on winners, retire what doesn't work." },
    ],
    included: [
      "Meta (Facebook and Instagram) ads",
      "LinkedIn ads for B2B lead generation",
      "Google, YouTube and Microsoft Ads",
      "Conversion API and server-side tracking setup",
      "Ad creative: static, carousel and short video",
      "Landing pages and lead forms",
      "Cross-platform reporting dashboard",
    ],
    industries: ["ecommerce", "startups", "real-estate", "education", "travel"],
    faqs: [
      { q: "What's the difference between performance marketing and Google Ads?", a: "Google Ads is one channel. Performance marketing covers every paid channel together — Google, Meta, LinkedIn and others — managed against a single set of business results." },
      { q: "Is LinkedIn worth it for B2B?", a: "LinkedIn clicks usually cost more than other platforms, but its job-title and company targeting can make it efficient for high-value B2B offers. We test it with a defined budget before scaling." },
      { q: "How do you handle tracking with privacy changes?", a: "We use conversion APIs, server-side tagging and first-party data where appropriate, and we're clear about what can and can't be measured." },
      { q: "Do you produce the ad creative?", a: "Yes. Our team designs static and video creative and writes ad copy, working from your brand and any footage you have." },
    ],
    related: [
      { label: "Google Ads", href: "/digital-marketing/google-ads/" },
      { label: "Social Media Marketing", href: "/digital-marketing/social-media/" },
      { label: "Startups & SaaS", href: "/industries/startups/" },
    ],
  },
];
