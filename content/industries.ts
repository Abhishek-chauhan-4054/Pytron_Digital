import type { Industry } from "./types";

export const industriesPage = {
  meta: {
    title: "Industries We Help — Digital Marketing & Technology | Pytron Digital",
    description:
      "Digital marketing, websites, AI and automation for healthcare, real estate, e-commerce, education, travel, hospitality, professional services, startups and local businesses.",
  },
  h1: "Industries We Help Grow",
  intro:
    "Every industry has its own buying journey, rules and bottlenecks. We bring the same connected approach — marketing, technology and automation — and shape it around how your customers decide.",
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare & Clinics",
    icon: "heart-pulse",
    summary: "More booked appointments, fewer phone calls, and patient communication handled with care.",
    meta: {
      title: "Digital Marketing & Websites for Clinics and Healthcare | Pytron Digital",
      description:
        "Websites, local SEO, online booking and patient communication automation for clinics and healthcare providers — built with privacy and compliance in mind.",
    },
    h1: "Digital Growth for Clinics and Healthcare Providers",
    intro:
      "Patients choose providers they can find, trust and book easily. We help clinics and healthcare businesses show up in local searches, explain services clearly and reduce the admin that keeps staff on the phone.",
    problems: [
      { title: "Phones that never stop", text: "Front-desk teams spend much of the day on booking calls, reminders and routine questions." },
      { title: "Losing local searches", text: "Patients search “near me” and choose from the map — often before visiting any website." },
      { title: "Sensitive information", text: "Health data carries legal obligations that generic marketing tools and agencies often overlook." },
      { title: "No-shows", text: "Missed appointments cost revenue and leave slots empty that others could have used." },
    ],
    services: [
      { label: "Local SEO", href: "/digital-marketing/local-seo/", why: "Show up in map results for your services and neighborhoods." },
      { label: "Business Websites", href: "/web-development/business-websites/", why: "Clear service pages, practitioner profiles and accessible design." },
      { label: "Business Automation", href: "/ai-solutions/business-automation/", why: "Online booking, reminders and intake forms that reduce calls." },
      { label: "Document Processing", href: "/ai-solutions/document-processing/", why: "Turn referral letters and forms into structured records." },
    ],
    workflows: [
      { title: "Appointment booking", before: "Patients call during opening hours to find a slot.", after: "Online booking with live availability, confirmations and automated reminders." },
      { title: "Patient intake", before: "Paper forms filled in the waiting room and typed up later.", after: "Secure digital intake completed before the visit, ready in your system." },
      { title: "Review requests", before: "Satisfied patients rarely leave reviews.", after: "A polite, policy-compliant review request after each visit." },
    ],
    faqs: [
      { q: "Can you build HIPAA- or GDPR-aware systems?", a: "We design workflows with health-data rules in mind — minimizing data collected, using vendors that sign the necessary agreements and controlling access. Final compliance decisions should involve your compliance advisor." },
      { q: "Can we advertise medical services on Google and Meta?", a: "Usually yes, with restrictions. Platforms limit certain health claims and targeting. We build campaigns that follow platform policies and local advertising rules." },
      { q: "Can patients book online through our website?", a: "Yes. We integrate with your existing practice management or booking system, or set up a booking tool if you don't have one." },
      { q: "Do you work with multi-location clinics?", a: "Yes. Each location gets its own optimized Google Business Profile and location page." },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: "house",
    summary: "Faster lead response, better listings and follow-up that doesn't depend on memory.",
    meta: {
      title: "Real Estate Digital Marketing, Websites & Lead Automation | Pytron Digital",
      description:
        "Real estate websites, Google and Meta ads, and lead-routing automation for agencies, brokers and developers. Respond to buyers in seconds and follow up consistently.",
    },
    h1: "Digital Marketing and Lead Automation for Real Estate",
    intro:
      "In real estate, the agent who responds first often wins the conversation. We build property websites and ad campaigns that generate inquiries — and automation that gets every lead to the right agent in seconds.",
    problems: [
      { title: "Slow lead response", text: "Inquiries from portals, ads and your website arrive in different places and wait for someone to notice." },
      { title: "Long buying cycles", text: "Buyers research for months, and leads go cold without consistent follow-up." },
      { title: "Portal dependency", text: "Relying on listing portals means paying for leads competitors also receive." },
      { title: "Listing updates", text: "Property details updated by hand across a website, portals and social media." },
    ],
    services: [
      { label: "Google Ads", href: "/digital-marketing/google-ads/", why: "Reach buyers searching for specific areas and property types." },
      { label: "Performance Marketing", href: "/digital-marketing/performance-marketing/", why: "Meta campaigns for new projects with lead forms and retargeting." },
      { label: "Business Automation", href: "/ai-solutions/business-automation/", why: "Instant lead routing, CRM updates and nurture sequences." },
      { label: "Web Applications", href: "/web-development/web-applications/", why: "Property search, project microsites and buyer portals." },
    ],
    workflows: [
      { title: "Lead routing", before: "Leads from three portals collected manually each evening.", after: "Every lead lands in the CRM instantly, assigned by area, with an automatic acknowledgment." },
      { title: "Buyer nurture", before: "Follow-up depends on each agent's memory.", after: "Automated updates on matching new listings and price changes." },
      { title: "Site visit scheduling", before: "Back-and-forth calls to arrange viewings.", after: "Buyers book viewing slots online with automated reminders." },
    ],
    faqs: [
      { q: "Can you connect our website to our CRM?", a: "Yes. We integrate with common real estate CRMs or set up a general CRM such as HubSpot or Zoho." },
      { q: "Do you run ads for new project launches?", a: "Yes. We build project landing pages and run Google and Meta campaigns, following housing-ad policies on targeting where they apply." },
      { q: "Can listings sync automatically from our system?", a: "Often, yes — through your listing software's feed or API, so the website stays current without manual updates." },
      { q: "Do you serve real estate businesses outside India?", a: "Yes. We work with real estate businesses in the USA, UK, Canada, Australia and the UAE, adapting to local ad rules and platforms." },
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce & Retail",
    icon: "shopping-cart",
    summary: "Faster stores, better product visibility and automated repeat sales.",
    meta: {
      title: "E-commerce Marketing, Store Development & Automation | Pytron Digital",
      description:
        "E-commerce growth for online and omnichannel retailers: fast Shopify or headless stores, product SEO, Google Shopping, Meta ads and email automation.",
    },
    h1: "E-commerce Growth: Faster Stores, Better Visibility, Repeat Sales",
    intro:
      "Online retail rewards speed — fast pages, fast decisions, fast follow-up. We build and market stores where product discovery, checkout and repeat purchases work as one system.",
    problems: [
      { title: "Rising ad costs", text: "Paid acquisition alone gets expensive as more competitors bid for the same customers." },
      { title: "Abandoned carts", text: "Shoppers add items and leave, and nobody follows up." },
      { title: "Weak product pages", text: "Thin descriptions and poor images don't answer buyer questions or rank in search." },
      { title: "Manual operations", text: "Orders, stock and customer updates handled across disconnected tools." },
    ],
    services: [
      { label: "E-commerce Development", href: "/web-development/ecommerce/", why: "Fast Shopify or headless stores with a smooth checkout." },
      { label: "SEO", href: "/digital-marketing/seo/", why: "Product and collection pages that rank for buying searches." },
      { label: "Email Marketing", href: "/digital-marketing/email-marketing/", why: "Abandoned cart, post-purchase and win-back flows." },
      { label: "Performance Marketing", href: "/digital-marketing/performance-marketing/", why: "Google Shopping and Meta campaigns measured by profit." },
    ],
    workflows: [
      { title: "Abandoned carts", before: "Carts abandoned with no follow-up.", after: "A short sequence of reminders, with product images and an easy return to checkout." },
      { title: "Order updates", before: "Customers message to ask where their order is.", after: "Automatic shipping updates by email or WhatsApp with tracking links." },
      { title: "Product data", before: "Product details updated in several places by hand.", after: "One product source synced to the store, feeds and marketplaces." },
    ],
    faqs: [
      { q: "Do you work with Shopify stores?", a: "Yes. We build, improve and market Shopify stores, and build headless stores when a project needs more flexibility." },
      { q: "Can you improve an existing store rather than rebuild?", a: "Usually. We start with a speed, UX and SEO audit and fix the highest-impact issues first." },
      { q: "Do you handle Google Shopping feeds?", a: "Yes. We set up and optimize product feeds for Google Merchant Center and other channels." },
      { q: "Can you help us sell internationally?", a: "Yes — multi-currency, local payment methods, shipping rules and market-specific campaigns." },
    ],
  },
  {
    slug: "education",
    name: "Education",
    icon: "graduation-cap",
    summary: "More enrollments, smoother admissions and learning tools students actually use.",
    meta: {
      title: "Digital Marketing & EdTech Development for Education | Pytron Digital",
      description:
        "Enrollment marketing, admissions automation and learning platforms for schools, coaching institutes, training providers and EdTech companies.",
    },
    h1: "Digital Growth for Schools, Training Providers and EdTech",
    intro:
      "Students and parents research carefully before they enroll. We help education businesses get found during that research, make admissions simple and build learning tools — like our own test-prep products — that students return to.",
    problems: [
      { title: "Seasonal enrollment pressure", text: "Most inquiries arrive in short windows, and slow responses lose students to competitors." },
      { title: "Complex admissions", text: "Applications, documents and payments are handled across email and paper." },
      { title: "Generic course pages", text: "Programs described in ways that don't match what students search for." },
      { title: "Engagement after signup", text: "Learners drop off when materials are hard to access on mobile." },
    ],
    services: [
      { label: "SEO & Content", href: "/digital-marketing/content-marketing/", why: "Course pages and guides that match how students search." },
      { label: "Google Ads", href: "/digital-marketing/google-ads/", why: "Campaigns timed to enrollment seasons." },
      { label: "Web Applications", href: "/web-development/web-applications/", why: "Learning portals, practice tests and student dashboards." },
      { label: "Document Processing", href: "/ai-solutions/document-processing/", why: "Faster application and document checks." },
    ],
    workflows: [
      { title: "Inquiry follow-up", before: "Inquiries answered when admissions staff have time.", after: "Instant replies with course details, then a scheduled counselor call." },
      { title: "Application review", before: "Documents checked one by one for completeness.", after: "Missing documents flagged automatically; complete applications go straight to review." },
      { title: "Practice and revision", before: "Printed question banks and PDFs.", after: "Mobile-friendly practice tests with progress tracking." },
    ],
    faqs: [
      { q: "Can you build a practice test or learning platform?", a: "Yes. We're building our own test-prep products, DriveReady and Citizenship Test Prep, and bring the same approach to client platforms." },
      { q: "Do you market courses internationally?", a: "Yes. We run campaigns for audiences in the USA, UK, Canada, Australia, the UAE and India, adapted to each market." },
      { q: "Can you integrate with our LMS?", a: "We integrate with common learning management systems through their APIs, or build lightweight learning features directly." },
      { q: "How do you handle student data?", a: "We collect only what's needed, secure it properly and follow data protection rules relevant to your students' locations." },
    ],
  },
  {
    slug: "travel",
    name: "Travel & Tourism",
    icon: "plane",
    summary: "Inspiring travel websites, direct bookings and less dependence on aggregators.",
    meta: {
      title: "Travel & Tourism Websites, SEO and Booking Automation | Pytron Digital",
      description:
        "Travel portals, tour websites, destination SEO and booking automation for tour operators, travel agencies and tourism businesses — more direct bookings, less manual work.",
    },
    h1: "Travel and Tourism Websites That Inspire and Convert",
    intro:
      "Travelers plan with dozens of open tabs. We build travel websites and content that inspire, answer practical questions and turn planning into direct bookings — as we did for HimalayanRoutes.",
    problems: [
      { title: "Aggregator commissions", text: "Relying on third-party platforms reduces margins and customer relationships." },
      { title: "Long planning journeys", text: "Travelers research for weeks before booking, across many sites." },
      { title: "Manual itineraries", text: "Custom quotes and itineraries built by hand for every inquiry." },
      { title: "Seasonality", text: "Demand swings that make planning marketing and staffing hard." },
    ],
    services: [
      { label: "Content Marketing", href: "/digital-marketing/content-marketing/", why: "Destination guides and route content that rank and inspire." },
      { label: "Web Applications", href: "/web-development/web-applications/", why: "Travel portals with search, itineraries and booking." },
      { label: "Social Media Marketing", href: "/digital-marketing/social-media/", why: "Visual storytelling on Instagram and YouTube." },
      { label: "Business Automation", href: "/ai-solutions/business-automation/", why: "Inquiry handling, quotes and pre-trip communication." },
    ],
    workflows: [
      { title: "Custom trip inquiries", before: "Each inquiry answered with a manually built itinerary.", after: "An itinerary builder drafts options from templates; staff personalize and send." },
      { title: "Pre-trip communication", before: "Packing lists and reminders sent manually.", after: "Automatic pre-trip messages with documents, checklists and contacts." },
      { title: "Booking follow-up", before: "Quotes sent and forgotten.", after: "Automated follow-ups with availability reminders." },
    ],
    faqs: [
      { q: "Can you build a travel portal with booking?", a: "Yes. We build travel websites and portals with search, itineraries, inquiry forms and payment integration." },
      { q: "Will content help us rely less on aggregators?", a: "Destination and route content can earn search traffic you own, which supports more direct bookings over time." },
      { q: "Do you work with tourism boards or only operators?", a: "We work with operators, agencies and tourism businesses of different sizes." },
      { q: "Can you handle multiple languages?", a: "Yes. We can build multilingual sites with proper hreflang and localized content." },
    ],
  },
  {
    slug: "hospitality",
    name: "Restaurants & Hospitality",
    icon: "utensils-crossed",
    summary: "Full tables and rooms through direct bookings, local search and repeat guests.",
    meta: {
      title: "Restaurant & Hotel Marketing, Websites and Automation | Pytron Digital",
      description:
        "Local SEO, social media, direct booking websites and guest communication automation for restaurants, cafes, hotels and hospitality businesses.",
    },
    h1: "Digital Marketing for Restaurants and Hospitality",
    intro:
      "Guests decide quickly — from a map listing, a photo or a friend's post. We help restaurants and hospitality businesses win those moments, take more direct bookings and bring guests back.",
    problems: [
      { title: "Third-party fees", text: "Delivery and booking platforms take a significant share of each order or stay." },
      { title: "Map visibility", text: "Many diners pick from map results without ever visiting a website." },
      { title: "Outdated menus and info", text: "Hours, menus and prices that differ between Google, social and the website." },
      { title: "One-time guests", text: "No simple way to invite guests back." },
    ],
    services: [
      { label: "Local SEO", href: "/digital-marketing/local-seo/", why: "Strong Google Business Profile, photos and reviews." },
      { label: "Social Media Marketing", href: "/digital-marketing/social-media/", why: "Food, rooms and experiences shown the way guests see them." },
      { label: "Business Websites", href: "/web-development/business-websites/", why: "Fast menus, direct booking and ordering." },
      { label: "Email Marketing", href: "/digital-marketing/email-marketing/", why: "Guest lists, offers and return-visit campaigns." },
    ],
    workflows: [
      { title: "Table reservations", before: "Bookings taken by phone during the busiest hours.", after: "Online reservations with confirmations and reminders." },
      { title: "Review management", before: "Reviews noticed weeks later, often unanswered.", after: "New reviews flagged daily with suggested replies." },
      { title: "Guest re-engagement", before: "No contact after a guest leaves.", after: "Birthday and seasonal offers sent automatically to opted-in guests." },
    ],
    faqs: [
      { q: "Can customers order directly from our website?", a: "Yes. We can integrate direct ordering and booking so you keep more of each sale." },
      { q: "How do we get more Google reviews?", a: "By asking more guests at the right moment, in a policy-compliant way, and replying to every review. We set up the process." },
      { q: "Do you create food and venue content?", a: "We plan, edit and publish content, and can work with your photos or a local photographer." },
      { q: "Is this suitable for a single location?", a: "Yes. Many of these services work especially well for independent restaurants and small hotels." },
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    icon: "briefcase",
    summary: "Authority-building content, qualified inquiries and less admin per client.",
    meta: {
      title: "Marketing & Automation for Professional Services Firms | Pytron Digital",
      description:
        "Websites, SEO, LinkedIn and workflow automation for consultants, accountants, law firms, agencies and advisory businesses — more qualified inquiries, less admin.",
    },
    h1: "Growth Systems for Professional Services Firms",
    intro:
      "Clients choose professional firms on expertise and trust. We help consultancies, accountants, law firms and advisors show that expertise online, attract qualified inquiries and automate the admin around every engagement.",
    problems: [
      { title: "Referral dependence", text: "Most new work comes from referrals, which makes growth unpredictable." },
      { title: "Unqualified inquiries", text: "Time spent on calls with prospects who were never a fit." },
      { title: "Onboarding admin", text: "Proposals, engagement letters and document collection handled by email." },
      { title: "Expertise that's invisible", text: "Deep knowledge that never makes it onto the website." },
    ],
    services: [
      { label: "Content Marketing", href: "/digital-marketing/content-marketing/", why: "Guides and insights that demonstrate expertise." },
      { label: "Performance Marketing", href: "/digital-marketing/performance-marketing/", why: "LinkedIn campaigns aimed at decision-makers." },
      { label: "Business Automation", href: "/ai-solutions/business-automation/", why: "Qualification, scheduling and onboarding workflows." },
      { label: "Document Processing", href: "/ai-solutions/document-processing/", why: "Faster handling of client documents." },
    ],
    workflows: [
      { title: "Lead qualification", before: "Every inquiry gets a discovery call.", after: "A short qualification form routes good-fit prospects to a booking page." },
      { title: "Client onboarding", before: "Engagement letters and document requests sent by email.", after: "A client portal for signing, uploading documents and tracking progress." },
      { title: "Recurring reports", before: "Client reports built manually each month.", after: "Reports generated from your data and reviewed before sending." },
    ],
    faqs: [
      { q: "Is LinkedIn advertising worth it for professional services?", a: "For higher-value engagements, often yes, because you can target by role, seniority and industry. We test with a defined budget first." },
      { q: "Can you write content in our area of expertise?", a: "Yes. We interview your experts and turn their knowledge into clear content, which they review before publishing." },
      { q: "Can you automate client onboarding?", a: "Yes — e-signatures, document collection, CRM updates and welcome emails can all be connected." },
      { q: "Do you follow advertising rules for regulated professions?", a: "We follow platform policies and work with you on profession-specific rules, such as those for legal or financial advertising." },
    ],
  },
  {
    slug: "startups",
    name: "Startups & SaaS",
    icon: "rocket",
    summary: "From MVP to first customers: one team for product, website and growth.",
    meta: {
      title: "MVP Development & Growth Marketing for Startups and SaaS | Pytron Digital",
      description:
        "MVP and SaaS development, product design, launch websites and growth marketing for startups — one team from first version to first customers.",
    },
    h1: "From MVP to Growth: One Team for Startups and SaaS",
    intro:
      "Early-stage companies can't afford handoffs between a design studio, a dev shop and a marketing agency. We help founders build the first version, launch it and find the channels that bring customers — the same journey we take with our own products.",
    problems: [
      { title: "Building too much", text: "Months spent on features before any customer feedback." },
      { title: "Launching to silence", text: "A product launched without a plan for getting its first users." },
      { title: "Unclear positioning", text: "A website that describes features instead of the problem solved." },
      { title: "No measurement", text: "Signups happen, but nobody knows which channels or features drive activation." },
    ],
    services: [
      { label: "Web Applications", href: "/web-development/web-applications/", why: "MVPs and SaaS products built to evolve." },
      { label: "UI/UX Design", href: "/web-development/ui-ux-design/", why: "Onboarding and core flows that users understand." },
      { label: "Performance Marketing", href: "/digital-marketing/performance-marketing/", why: "Channel tests with clear cost-per-signup targets." },
      { label: "AI Integrations", href: "/ai-solutions/ai-integrations/", why: "AI features where they add real value for users." },
    ],
    workflows: [
      { title: "Onboarding", before: "New users sign up and never return.", after: "A guided first session plus triggered emails based on what users haven't done yet." },
      { title: "Product analytics", before: "No view of which features matter.", after: "Event tracking and a dashboard of activation and retention." },
      { title: "Lead handling", before: "Demo requests collected in a spreadsheet.", after: "Demo requests scored, routed and booked automatically." },
    ],
    faqs: [
      { q: "Can you build our MVP?", a: "Yes. We help define the smallest version worth launching, build it on solid foundations and plan the launch." },
      { q: "Do you work with non-technical founders?", a: "Often. We explain trade-offs in plain language and set up processes so you always know what's being built and why." },
      { q: "Can you help after launch?", a: "Yes — iterative product development, analytics and growth marketing are where we work best." },
      { q: "Do you take equity instead of fees?", a: "Our standard engagements are fee-based. Talk to us about your situation." },
    ],
  },
  {
    slug: "local-business",
    name: "Local Businesses",
    icon: "store",
    summary: "Be the obvious choice nearby, and answer every customer quickly.",
    meta: {
      title: "Digital Marketing & Websites for Local Businesses | Pytron Digital",
      description:
        "Local SEO, Google Business Profile, simple websites, Google Ads and WhatsApp automation for local service businesses, shops and trades.",
    },
    h1: "Digital Marketing That Makes Local Businesses the Obvious Choice",
    intro:
      "Local customers search, compare a few options and call. We help local businesses — trades, shops, service providers and agencies like Nachwal Solar — show up in those searches, look trustworthy and respond fast.",
    problems: [
      { title: "Invisible on Google Maps", text: "Competitors with complete profiles and more reviews get the calls." },
      { title: "Missed inquiries", text: "Calls and messages missed during busy hours never get returned." },
      { title: "Outdated website", text: "A slow or old site that makes a good business look unreliable." },
      { title: "No time for marketing", text: "Owners busy running the business have little time to post or optimize." },
    ],
    services: [
      { label: "Local SEO", href: "/digital-marketing/local-seo/", why: "Google Business Profile, reviews and local pages." },
      { label: "Business Websites", href: "/web-development/business-websites/", why: "A fast, clear website with click-to-call and WhatsApp." },
      { label: "Google Ads", href: "/digital-marketing/google-ads/", why: "Local search campaigns for high-intent customers." },
      { label: "Business Automation", href: "/ai-solutions/business-automation/", why: "Missed-call follow-up and inquiry handling." },
    ],
    workflows: [
      { title: "Missed calls", before: "Calls missed on a job are never returned.", after: "An automatic text or WhatsApp reply with a booking link." },
      { title: "Quote requests", before: "Quote requests answered days later.", after: "Instant acknowledgment and a structured form that collects job details up front." },
      { title: "Reviews", before: "Happy customers never asked for a review.", after: "A review request sent after each completed job." },
    ],
    faqs: [
      { q: "We're a small business. Is this affordable?", a: "We scope work to your budget and start with what brings the fastest return — usually your Google Business Profile, a solid website and review generation." },
      { q: "Do we need a website if we have a Google profile?", a: "A Google Business Profile is essential, but a website builds trust, supports rankings and gives you a place to explain your services in full." },
      { q: "Can customers contact us on WhatsApp from the website?", a: "Yes. We add click-to-chat and can connect WhatsApp to your lead workflow." },
      { q: "Can you manage everything for us?", a: "Yes. Many local clients prefer a monthly plan where we handle profile updates, reviews, ads and reporting." },
    ],
  },
];
