import type { Location, LocationService } from "./types";

/**
 * Location pages describe how we serve each market remotely from India.
 * We do not claim offices or local presence outside India.
 * Compliance notes are general context, not legal advice.
 */
export const locationsPage = {
  meta: {
    title: "Markets We Serve — USA, UK, Canada, Australia, UAE & India | Pytron Digital",
    description:
      "Pytron Digital works remotely with businesses in the USA, UK, Canada, Australia, the UAE and India, with meeting hours that overlap your working day.",
  },
  h1: "Built in India. Trusted Across Borders.",
  intro:
    "We work with businesses across time zones, combining global design and engineering standards with responsive, transparent communication. Each market page explains how search, advertising, compliance and working hours differ where you are.",
};

export const locations: Location[] = [
  {
    slug: "usa",
    name: "United States",
    audience: "businesses in the United States",
    meta: {
      title: "Digital Marketing, Web Development & AI for US Businesses | Pytron Digital",
      description:
        "Remote digital marketing, web development and AI automation for US businesses. US-market SEO and ads, CAN-SPAM and TCPA-aware campaigns, and morning ET meeting hours.",
    },
    h1: "Digital Growth and Technology for US Businesses",
    intro:
      "US buyers compare options fast and expect a polished, fast experience. We help American businesses compete with SEO, paid media, websites and automation built to US standards — delivered remotely from India, with meeting hours that overlap your morning.",
    search: {
      heading: "How US customers search",
      points: [
        "Google dominates, but Bing and Microsoft's network still matter, especially on desktop and with older or B2B audiences.",
        "Local intent is strong: “near me” and city-specific searches, plus Apple Maps on iPhone, influence service businesses heavily.",
        "Reviews on Google, Yelp and industry sites shape decisions before anyone visits your website.",
        "Competitive verticals like legal, home services and healthcare often have high click costs, so landing page quality matters.",
      ],
    },
    ads: {
      heading: "Ad platforms we use for US campaigns",
      points: [
        "Google Ads: Search, Performance Max, Shopping and YouTube",
        "Microsoft Advertising for additional search reach",
        "Meta (Facebook and Instagram) for consumer brands and local services",
        "LinkedIn for B2B decision-makers",
        "Amazon Ads for brands selling on Amazon",
      ],
    },
    compliance: {
      heading: "Compliance notes for the US market",
      items: [
        { title: "CAN-SPAM", text: "Commercial emails need accurate sender details, a physical postal address and a working unsubscribe that is honored promptly." },
        { title: "TCPA", text: "Marketing texts and automated calls generally require prior express written consent. We design SMS and call workflows with consent capture built in." },
        { title: "State privacy laws", text: "California's CCPA/CPRA and a growing number of state laws affect tracking, cookies and how personal data is handled." },
        { title: "Accessibility", text: "Website accessibility claims under the ADA are common. We build to WCAG 2.2 AA to reduce that risk and serve more customers." },
        { title: "Reviews and endorsements", text: "FTC rules prohibit fake or incentivized reviews and require clear disclosure of endorsements. We never fabricate reviews or testimonials." },
      ],
    },
    timezone: {
      heading: "Working across US time zones",
      text: "India is roughly 9.5 to 13.5 hours ahead of US time zones, depending on daylight saving time and your coast. We schedule live calls in your morning, which is our evening, and work while you sleep — so updates are often ready at the start of your next business day.",
      hours: "Typical live meeting window: 7–11 a.m. Eastern / 7–9 a.m. Pacific",
    },
    services: [
      { label: "Digital Marketing in the USA", href: "/locations/usa/digital-marketing/", text: "SEO, Google Ads and paid social for US markets." },
      { label: "Web Development", href: "/web-development/", text: "Fast, accessible websites and web apps." },
      { label: "AI & Automation", href: "/ai-solutions/", text: "Lead routing, document processing and reporting." },
    ],
    faqs: [
      { q: "Do you have an office in the USA?", a: "No. We're based in India and work remotely with US clients, with meeting hours that overlap your morning." },
      { q: "Do you invoice in US dollars?", a: "Yes. Proposals and invoices for US clients are in USD." },
      { q: "Can you target specific US states or cities?", a: "Yes. Campaigns and local SEO can be focused on specific states, metro areas or service radiuses." },
      { q: "How do you communicate day to day?", a: "Through email, Slack, Microsoft Teams or WhatsApp, with scheduled video calls and written weekly updates." },
    ],
  },
  {
    slug: "uk",
    name: "United Kingdom",
    audience: "businesses in the United Kingdom",
    meta: {
      title: "Digital Marketing, SEO & Web Development for UK Businesses | Pytron Digital",
      description:
        "Remote SEO, paid media, web development and automation for UK businesses, with UK GDPR and PECR-aware tracking and email, and strong overlap with UK working hours.",
    },
    h1: "Digital Growth and Technology for UK Businesses",
    intro:
      "UK customers value clarity, credibility and privacy. We help UK businesses grow with search, paid media, websites and automation set up for UK rules — and our working day overlaps comfortably with yours.",
    search: {
      heading: "How UK customers search",
      points: [
        "Google is the main search engine, with Bing used by a meaningful minority on desktop.",
        "Review platforms such as Trustpilot and sector directories like Checkatrade influence trust in many categories.",
        "Searches often include UK place names and postcodes, so local and regional pages matter.",
        "Users expect cookie choices to be respected, which affects how analytics and ads are measured.",
      ],
    },
    ads: {
      heading: "Ad platforms we use for UK campaigns",
      points: [
        "Google Ads: Search, Performance Max and Shopping",
        "Microsoft Advertising",
        "Meta and TikTok for consumer audiences",
        "LinkedIn for B2B and professional services",
      ],
    },
    compliance: {
      heading: "Compliance notes for the UK market",
      items: [
        { title: "UK GDPR and Data Protection Act 2018", text: "Personal data needs a lawful basis, clear privacy information and appropriate security." },
        { title: "PECR", text: "Non-essential cookies and many forms of email and SMS marketing require consent. We set up consent banners and analytics accordingly." },
        { title: "Advertising standards", text: "The CAP Code, enforced by the ASA, requires ads to be legal, decent, honest and truthful — consistent with our no-fake-claims principle." },
        { title: "Accessibility", text: "We build to WCAG 2.2 AA, which supports obligations under the Equality Act and serves more customers." },
      ],
    },
    timezone: {
      heading: "Working with UK hours",
      text: "India is 4.5 hours ahead of the UK in summer and 5.5 hours ahead in winter. Your morning and early afternoon overlap with our working day, so same-day calls and quick turnarounds are straightforward.",
      hours: "Typical live meeting window: 8 a.m.–1 p.m. UK time",
    },
    services: [
      { label: "SEO Services in the UK", href: "/locations/uk/seo-services/", text: "Technical, content and local SEO for UK search." },
      { label: "Digital Marketing", href: "/digital-marketing/", text: "Paid media, social and email for UK audiences." },
      { label: "Web Development", href: "/web-development/", text: "Websites and web apps built to UK standards." },
    ],
    faqs: [
      { q: "Do you have a UK office?", a: "No. We work remotely from India, with good overlap with UK working hours." },
      { q: "Do you invoice in pounds?", a: "We can invoice in GBP or USD; we'll confirm the currency in your proposal." },
      { q: "Can you handle cookie consent properly?", a: "Yes. We set up consent management so analytics and ad tags respect visitor choices under PECR and UK GDPR." },
      { q: "Do you use UK English on UK client sites?", a: "Yes. Client content for UK audiences is written in UK English." },
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    audience: "businesses in Canada",
    meta: {
      title: "Digital Marketing, Web Development & AI for Canadian Businesses | Pytron Digital",
      description:
        "Remote digital marketing, web development and automation for Canadian businesses, with CASL-compliant email, PIPEDA and Quebec Law 25 awareness, and bilingual-ready sites.",
    },
    h1: "Digital Growth and Technology for Canadian Businesses",
    intro:
      "Canada combines a large, spread-out market with strict email and privacy rules — and, in Quebec, French-language requirements. We help Canadian businesses grow with marketing, websites and automation that account for all three.",
    search: {
      heading: "How Canadian customers search",
      points: [
        "Google is dominant, with Bing used by some desktop audiences.",
        "Searches are strongly regional: Toronto, Vancouver, Calgary and Montreal behave like different markets.",
        "French-language search matters in Quebec and for national brands.",
        "Local directories and review sites like Google, Yelp and HomeStars influence service businesses.",
      ],
    },
    ads: {
      heading: "Ad platforms we use for Canadian campaigns",
      points: [
        "Google Ads with province- and city-level targeting",
        "Microsoft Advertising",
        "Meta and LinkedIn",
        "Separate French-language campaigns for Quebec where needed",
      ],
    },
    compliance: {
      heading: "Compliance notes for the Canadian market",
      items: [
        { title: "CASL", text: "Commercial electronic messages require express or implied consent, sender identification and an unsubscribe mechanism. Email and SMS flows are built with consent records." },
        { title: "PIPEDA", text: "Federal private-sector privacy law requires meaningful consent and responsible handling of personal information." },
        { title: "Quebec Law 25", text: "Quebec's privacy law adds requirements around consent, privacy notices and tracking technologies." },
        { title: "French-language requirements", text: "Businesses operating in Quebec generally need French-language content. We build bilingual-ready sites." },
        { title: "Accessibility", text: "Ontario's AODA sets web accessibility requirements for many organizations; we build to WCAG 2.2 AA." },
      ],
    },
    timezone: {
      heading: "Working across Canadian time zones",
      text: "India is roughly 9.5 to 13.5 hours ahead of Canadian time zones. We hold live calls in your morning, which is our evening, and progress continues overnight so updates are ready when your day starts.",
      hours: "Typical live meeting window: 7–11 a.m. Eastern / 7–9 a.m. Pacific",
    },
    services: [
      { label: "Digital Marketing", href: "/digital-marketing/", text: "SEO, ads and CASL-compliant email." },
      { label: "Web Development", href: "/web-development/", text: "Bilingual-ready websites and web apps." },
      { label: "AI & Automation", href: "/ai-solutions/", text: "Lead routing and workflow automation." },
    ],
    faqs: [
      { q: "Do you have a Canadian office?", a: "No. We work remotely from India with Canadian clients." },
      { q: "Can you build bilingual English/French websites?", a: "Yes. We build multilingual sites with proper language switching and hreflang, working with your translators or translation partners." },
      { q: "Can you help us stay CASL-compliant?", a: "We set up consent capture, records and unsubscribe handling in your email and SMS tools. For legal interpretation, consult your advisor." },
      { q: "Do you invoice in Canadian dollars?", a: "We can invoice in CAD or USD." },
    ],
  },
  {
    slug: "australia",
    name: "Australia",
    audience: "businesses in Australia",
    meta: {
      title: "Digital Marketing, Web Development & AI Automation for Australian Businesses | Pytron Digital",
      description:
        "Remote SEO, Google Ads, web development and AI automation for Australian businesses, with Spam Act and Privacy Act awareness and convenient morning IST / afternoon AEST overlap.",
    },
    h1: "Digital Growth and Technology for Australian Businesses",
    intro:
      "Australian businesses often need agency-quality work without agency overhead. Our working day overlaps your afternoon, so we can collaborate in real time on marketing, websites and automation.",
    search: {
      heading: "How Australian customers search",
      points: [
        "Google holds a very large share of search in Australia.",
        "Location matters: searches often include suburbs, and service areas can be large.",
        "Trade and service platforms such as hipages, plus review sites like ProductReview.com.au, affect trust in many categories.",
        "A .com.au domain and Australian contact details signal local relevance to many buyers.",
      ],
    },
    ads: {
      heading: "Ad platforms we use for Australian campaigns",
      points: [
        "Google Ads with suburb- and radius-level targeting",
        "Microsoft Advertising",
        "Meta and TikTok for consumer audiences",
        "LinkedIn for B2B",
      ],
    },
    compliance: {
      heading: "Compliance notes for the Australian market",
      items: [
        { title: "Spam Act 2003", text: "Commercial emails and SMS need consent, accurate sender identification and a functional unsubscribe." },
        { title: "Privacy Act 1988", text: "Many businesses must follow the Australian Privacy Principles for collecting and handling personal information." },
        { title: "Australian Consumer Law", text: "Claims in ads and on websites must not be misleading — including reviews and testimonials." },
        { title: "Accessibility", text: "We build to WCAG 2.2 AA, supporting obligations under the Disability Discrimination Act." },
      ],
    },
    timezone: {
      heading: "Working with Australian hours",
      text: "Sydney and Melbourne are 4.5 to 5.5 hours ahead of India, depending on daylight saving time. Your late morning and afternoon overlap with our working day, which makes real-time collaboration easy.",
      hours: "Typical live meeting window: 1–6 p.m. AEST/AEDT",
    },
    services: [
      { label: "AI Automation in Australia", href: "/locations/australia/ai-automation/", text: "Practical automation for Australian SMEs." },
      { label: "Digital Marketing", href: "/digital-marketing/", text: "SEO, Google Ads and social." },
      { label: "Web Development", href: "/web-development/", text: "Websites and web apps." },
    ],
    faqs: [
      { q: "Do you have an Australian office?", a: "No. We're based in India and work remotely, with afternoon overlap with Australian east-coast time." },
      { q: "Do you invoice in Australian dollars?", a: "We can invoice in AUD or USD." },
      { q: "Can you work with Australian platforms like Xero?", a: "Yes. We integrate with tools common in Australia, including Xero, through their APIs." },
      { q: "Do you write in Australian English for our site?", a: "Yes. Client content for Australian audiences uses Australian English." },
    ],
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    audience: "businesses in the UAE",
    meta: {
      title: "Web Development, Digital Marketing & AI for UAE Businesses | Pytron Digital",
      description:
        "Bilingual Arabic-English websites, Google, Meta and Snapchat campaigns, WhatsApp automation and AI solutions for UAE businesses — with near-identical working hours.",
    },
    h1: "Digital Growth and Technology for UAE Businesses",
    intro:
      "The UAE market is mobile-first, multilingual and fast-moving. We're just 1.5 hours ahead of Dubai, so we work almost entirely within your business day on websites, campaigns and automation.",
    search: {
      heading: "How UAE customers search",
      points: [
        "Search happens in both English and Arabic, often on mobile.",
        "WhatsApp is a primary channel for business inquiries, so click-to-chat is essential.",
        "Instagram and Snapchat play a larger role in discovery than in many Western markets.",
        "Category platforms such as Bayut and Property Finder matter in real estate.",
      ],
    },
    ads: {
      heading: "Ad platforms we use for UAE campaigns",
      points: [
        "Google Ads in English and Arabic",
        "Meta (Instagram and Facebook)",
        "Snapchat and TikTok for consumer audiences",
        "LinkedIn for B2B",
      ],
    },
    compliance: {
      heading: "Compliance notes for the UAE market",
      items: [
        { title: "Personal Data Protection Law", text: "Federal Decree-Law No. 45 of 2021 governs personal data handling. Free zones such as DIFC and ADGM have their own data protection regimes." },
        { title: "Advertising content", text: "Media regulations set standards for advertising content and social media advertisers. We keep claims accurate and culturally appropriate." },
        { title: "WhatsApp messaging", text: "Business messaging should use the official WhatsApp Business Platform with approved templates and opt-in." },
        { title: "Arabic support", text: "Arabic content needs right-to-left layouts, correct typography and native-quality translation." },
      ],
    },
    timezone: {
      heading: "Working with UAE hours",
      text: "India is 1.5 hours ahead of the UAE, and the UAE work week runs Monday to Friday. That means near-complete overlap — same-day calls, fast replies and real-time collaboration.",
      hours: "Typical live meeting window: 9 a.m.–5 p.m. Gulf Standard Time",
    },
    services: [
      { label: "Web Development in the UAE", href: "/locations/uae/web-development/", text: "Bilingual, mobile-first websites and web apps." },
      { label: "Digital Marketing", href: "/digital-marketing/", text: "Google, Meta and Snapchat campaigns." },
      { label: "Business Automation", href: "/ai-solutions/business-automation/", text: "WhatsApp and lead automation." },
    ],
    faqs: [
      { q: "Do you have an office in the UAE?", a: "No. We work remotely from India, with almost identical working hours." },
      { q: "Can you build Arabic websites?", a: "Yes. We build bilingual Arabic-English sites with right-to-left layouts, working with professional translators for Arabic copy." },
      { q: "Can you automate WhatsApp inquiries?", a: "Yes, using the official WhatsApp Business Platform with approved templates." },
      { q: "Do you invoice in AED?", a: "We can invoice in AED or USD." },
    ],
  },
  {
    slug: "india",
    name: "India",
    audience: "businesses in India",
    meta: {
      title: "Digital Marketing Agency, Web Development & AI Automation in India | Pytron Digital",
      description:
        "Digital marketing, web development and AI automation for Indian businesses — built to international standards, with DPDP Act awareness, WhatsApp-first workflows and UPI-ready checkout.",
    },
    h1: "Digital Growth and Technology for Indian Businesses",
    intro:
      "We're based in India and build to international standards. Indian businesses get the same quality of strategy, design and engineering we deliver to clients abroad — with WhatsApp-first, mobile-first and UPI-ready thinking built in.",
    search: {
      heading: "How Indian customers search",
      points: [
        "Search is overwhelmingly mobile, often on mid-range phones and variable networks — speed matters.",
        "Many people search in Hindi and other Indian languages, or mix English with local languages.",
        "Google Maps and local platforms such as Justdial drive many local inquiries; IndiaMART matters for B2B.",
        "WhatsApp is the default follow-up channel for most customers.",
      ],
    },
    ads: {
      heading: "Ad platforms we use for Indian campaigns",
      points: [
        "Google Ads and YouTube",
        "Meta (Instagram and Facebook) with click-to-WhatsApp ads",
        "LinkedIn for B2B",
        "Regional-language creative where it improves results",
      ],
    },
    compliance: {
      heading: "Compliance notes for the Indian market",
      items: [
        { title: "DPDP Act 2023", text: "The Digital Personal Data Protection Act sets rules for consent, notice and handling of personal data, with obligations being phased in." },
        { title: "Commercial SMS", text: "Promotional and transactional SMS require DLT registration of sender IDs and templates under TRAI rules." },
        { title: "Advertising standards", text: "ASCI guidelines cover misleading claims and influencer disclosures." },
        { title: "E-commerce rules", text: "Online sellers must display key information required under consumer protection e-commerce rules." },
      ],
    },
    timezone: {
      heading: "Working hours",
      text: "We work on Indian Standard Time, with full overlap for calls, reviews and quick changes.",
      hours: "Typical live meeting window: 10 a.m.–7 p.m. IST",
    },
    services: [
      { label: "Digital Marketing", href: "/digital-marketing/", text: "SEO, Google Ads, Meta and local SEO." },
      { label: "Web Development", href: "/web-development/", text: "Fast, mobile-first websites with UPI-ready checkout." },
      { label: "AI & Automation", href: "/ai-solutions/", text: "WhatsApp, lead and document automation." },
    ],
    faqs: [
      { q: "Where are you based?", a: "Sitapur, India. We work remotely with clients across India and abroad." },
      { q: "Do you build Hindi or regional-language websites?", a: "Yes. We build multilingual sites and can create regional-language campaign creative." },
      { q: "Can you integrate Razorpay, Cashfree or UPI payments?", a: "Yes. We integrate common Indian payment gateways and UPI-based checkout." },
      { q: "Are your prices in rupees?", a: "Yes. Indian clients receive proposals and GST-compliant invoices in INR." },
    ],
  },
];

export const locationServices: LocationService[] = [
  {
    country: "usa",
    slug: "digital-marketing",
    label: "Digital Marketing in the USA",
    meta: {
      title: "Digital Marketing Services for US Businesses — SEO, Google Ads & Paid Social | Pytron Digital",
      description:
        "Digital marketing services for US businesses: SEO and local SEO, Google and Microsoft Ads, Meta and LinkedIn campaigns, and compliant email and SMS — managed remotely.",
    },
    h1: "Digital Marketing Services for US Businesses",
    intro:
      "The US is one of the most competitive advertising markets in the world. Winning there takes more than running ads — it takes landing pages that convert, tracking you can trust and follow-up that happens in minutes. We bring all three.",
    sections: [
      {
        heading: "Built for high-competition, high-cost markets",
        body: [
          "In many US categories, clicks are expensive and competitors are well funded. The fastest way to improve results is often not more budget but a better conversion rate: clearer offers, faster pages and fewer form fields.",
          "Because our team builds websites as well as campaigns, we improve landing pages directly instead of sending a list of recommendations to a separate developer.",
        ],
      },
      {
        heading: "Local and national strategies",
        body: [
          "For service businesses, we focus on metro areas and service radiuses: Google Business Profile, local landing pages and Local Services Ads where eligible. For national brands, we build topical authority with content and use Performance Max and Shopping to scale.",
        ],
        points: [
          "City and state targeting for search and social campaigns",
          "Google Business Profile and Apple Business Connect optimization",
          "Microsoft Advertising for additional search reach",
          "Amazon Ads support for brands selling on Amazon",
        ],
      },
      {
        heading: "Compliant email and SMS follow-up",
        body: [
          "Speed-to-lead matters in the US, and texting is a common follow-up channel. We build SMS and email follow-up with consent captured at the form, in line with TCPA and CAN-SPAM expectations, and record that consent in your CRM.",
        ],
      },
      {
        heading: "How we work with US clients",
        body: [
          "Live calls happen in your morning; work continues in our day. You'll get a written weekly update, a monthly results report and a shared dashboard. Proposals and invoices are in USD.",
        ],
      },
    ],
    serviceHref: "/digital-marketing/",
    cta: "marketing",
    faqs: [
      { q: "Do you manage campaigns in US time zones?", a: "Yes. Campaign schedules, bidding and reporting use your local time zone." },
      { q: "Can you run Local Services Ads?", a: "We can help set up and manage Local Services Ads for eligible categories; Google runs its own verification process." },
      { q: "How do you price US marketing engagements?", a: "Usually a fixed monthly fee based on scope, separate from your ad spend, which is paid directly to the platforms." },
      { q: "Can you work with our in-house team?", a: "Yes. We can run specific channels, or support your team with landing pages, tracking and automation." },
    ],
  },
  {
    country: "uk",
    slug: "seo-services",
    label: "SEO Services in the UK",
    meta: {
      title: "SEO Services for UK Businesses — Technical, Local & Content SEO | Pytron Digital",
      description:
        "SEO services for UK businesses: technical SEO, content in UK English, local SEO for UK towns and postcodes, and privacy-aware analytics under UK GDPR and PECR.",
    },
    h1: "SEO Services for UK Businesses",
    intro:
      "We help UK businesses rank for the searches their customers actually make — written in UK English, structured around UK towns and regions, and measured with analytics that respect UK consent rules.",
    sections: [
      {
        heading: "UK English, UK search behavior",
        body: [
          "Spelling and phrasing matter. UK searchers type “optimisation”, “estate agents” and “postcode”, not their US equivalents. We research UK search terms specifically and write client content in UK English.",
        ],
      },
      {
        heading: "Local SEO for UK towns, cities and regions",
        body: [
          "Many UK searches include a town, borough or postcode. We build location pages with genuinely local information, optimize Google Business Profiles and help you earn reviews on Google and relevant UK platforms.",
        ],
        points: [
          "Location pages for the towns and regions you serve",
          "Google Business Profile optimization",
          "Directory consistency across UK listings",
          "Review strategy for Google and Trustpilot",
        ],
      },
      {
        heading: "Technical SEO on any platform",
        body: [
          "Site speed, crawlability, structured data and internal linking are often the fastest wins. Our developers fix them directly, whether you run WordPress, Shopify or a custom site.",
        ],
      },
      {
        heading: "Measurement that respects consent",
        body: [
          "Under PECR and UK GDPR, analytics often needs consent. We configure consent management and Google Analytics consent mode so you get the best data available without breaking the rules — and we use Search Console data, which doesn't depend on cookies.",
        ],
      },
    ],
    serviceHref: "/digital-marketing/seo/",
    cta: "marketing",
    faqs: [
      { q: "Do you target google.co.uk specifically?", a: "Yes. Research, rank tracking and content are focused on UK search results." },
      { q: "Can you do SEO for multiple UK locations?", a: "Yes. We build a scalable location-page structure and optimize each branch's profile." },
      { q: "How long before we see SEO results?", a: "Technical improvements can help within weeks; competitive rankings usually take several months." },
      { q: "Will you work within our existing CMS?", a: "Yes. We work on most platforms and will tell you honestly if the platform is limiting your SEO." },
    ],
  },
  {
    country: "uae",
    slug: "web-development",
    label: "Web Development in the UAE",
    meta: {
      title: "Web Development for UAE Businesses — Bilingual Arabic-English Websites | Pytron Digital",
      description:
        "Web development for UAE businesses: bilingual Arabic-English websites with RTL layouts, mobile-first design, WhatsApp integration and local payment gateways.",
    },
    h1: "Web Development for UAE Businesses",
    intro:
      "UAE customers browse on mobile, switch between English and Arabic, and expect to reach you on WhatsApp. We build websites and web apps designed for exactly that — and we work within nearly the same hours as you.",
    sections: [
      {
        heading: "Bilingual and right-to-left done properly",
        body: [
          "Arabic isn't just translated text. Layouts need to mirror for right-to-left reading, typography needs proper Arabic fonts, and navigation, forms and icons need to make sense in both directions. We build bilingual sites with language-specific URLs and hreflang so both versions can rank.",
        ],
        points: [
          "Right-to-left layouts and mirrored components",
          "Arabic web fonts with correct rendering",
          "Separate, indexable English and Arabic URLs",
          "Translation workflow with your translator or partner",
        ],
      },
      {
        heading: "Mobile-first and WhatsApp-ready",
        body: [
          "Most UAE visitors arrive on phones. We design mobile-first, keep pages light and put WhatsApp click-to-chat where customers expect it, connected to your lead workflow.",
        ],
      },
      {
        heading: "Payments and integrations",
        body: [
          "We integrate payment gateways used in the region, booking and CRM tools, and property or inventory feeds where relevant.",
        ],
      },
      {
        heading: "Working hours that match yours",
        body: [
          "India is 1.5 hours ahead of the UAE, so our working day overlaps almost entirely with yours. Reviews, calls and quick changes happen same day.",
        ],
      },
    ],
    serviceHref: "/web-development/",
    cta: "web",
    faqs: [
      { q: "Do you translate the Arabic content?", a: "We work with professional translators or your own team for Arabic copy; we don't rely on machine translation for published content." },
      { q: "Can you build real estate portals?", a: "Yes. Property search, project pages and lead routing are common UAE projects." },
      { q: "Do you host sites in the region?", a: "We host on global platforms with regional edge delivery for speed, or in your preferred region if you have data residency requirements." },
      { q: "Can you also market the website?", a: "Yes — Google, Meta and Snapchat campaigns and SEO in English and Arabic." },
    ],
  },
  {
    country: "australia",
    slug: "ai-automation",
    label: "AI Automation in Australia",
    meta: {
      title: "AI Automation & Business Automation for Australian SMEs | Pytron Digital",
      description:
        "AI and business automation for Australian businesses: lead routing, Xero and CRM integrations, document processing and reporting — with afternoon AEST collaboration.",
    },
    h1: "AI and Business Automation for Australian Businesses",
    intro:
      "Australian SMEs face high labor costs and lean teams, which makes repetitive admin especially expensive. We build practical automations that connect the tools you already use and take routine work off your team's plate.",
    sections: [
      {
        heading: "Connecting the tools Australian businesses use",
        body: [
          "Most of our automation work connects existing systems rather than replacing them: accounting platforms like Xero and MYOB, CRMs, booking tools, e-commerce stores and job management software.",
        ],
        points: [
          "Quotes and jobs synced to Xero or MYOB invoices",
          "Leads routed from web forms, ads and hipages to your CRM",
          "Automated booking confirmations and reminders",
          "Scheduled reports delivered to email or Slack",
        ],
      },
      {
        heading: "AI where judgment is needed",
        body: [
          "For tasks that need reading or summarizing — triaging an inbox, drafting replies, extracting data from supplier invoices — we add AI steps with validation and human review, so your team stays in control.",
        ],
      },
      {
        heading: "Privacy and Spam Act considerations",
        body: [
          "Automated messages need consent and a working unsubscribe under the Spam Act 2003, and personal information should be handled in line with the Australian Privacy Principles where they apply. We build those requirements into every workflow.",
        ],
      },
      {
        heading: "Real-time collaboration",
        body: [
          "Your afternoon overlaps with our working day, so workshops, testing sessions and handovers happen live.",
        ],
      },
    ],
    serviceHref: "/ai-solutions/",
    cta: "ai",
    faqs: [
      { q: "Do you integrate with Xero?", a: "Yes. We use Xero's API to sync invoices, contacts and payments with your other tools." },
      { q: "Where is our data stored?", a: "We use reputable cloud providers and can choose Australian regions where data residency matters to you." },
      { q: "What should we automate first?", a: "Usually the most frequent, repetitive task with clear rules — lead handling, invoicing or reporting are common starting points." },
      { q: "Can you support automations after launch?", a: "Yes. We offer monitoring and support plans, and document everything for your team." },
    ],
  },
];
