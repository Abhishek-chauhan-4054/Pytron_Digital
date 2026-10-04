import type { BlogPost } from "./types";

export const blogCategories = [
  { slug: "seo", name: "SEO" },
  { slug: "digital-marketing", name: "Digital Marketing" },
  { slug: "ai-automation", name: "AI & Automation" },
  { slug: "web-development", name: "Web Development" },
  { slug: "business-growth", name: "Business Growth" },
  { slug: "technology", name: "Technology" },
  { slug: "industry-insights", name: "Industry Insights" },
];

export const blogPage = {
  meta: {
    title: "Blog — SEO, Marketing, AI & Web Development Insights | Pytron Digital",
    description:
      "Practical articles on SEO, Google Ads, websites, AI and automation for growing businesses. Clear advice, no hype.",
  },
  h1: "Insights on Marketing, Technology and Growth",
  intro: "Practical, no-hype articles for business owners and teams deciding where to invest next.",
};

const AUTHOR = "Pytron Digital Team";

export const posts: BlogPost[] = [
  {
    slug: "how-much-does-seo-cost-small-business-2026",
    title: "How Much Does SEO Cost for a Small Business in 2026?",
    description:
      "What small businesses typically pay for SEO, what drives the price, the pricing models agencies use and how to judge whether a quote is worth it.",
    category: "SEO",
    date: "2026-10-04",
    author: AUTHOR,
    intro:
      "“How much does SEO cost?” is one of the first questions business owners ask, and one of the hardest to answer in a sentence. The honest answer depends on your market, your website and what you want SEO to achieve. Here's how to think about it — and how to tell a fair quote from a risky one.",
    sections: [
      {
        id: "what-you-pay-for",
        heading: "What you're actually paying for",
        paragraphs: [
          "SEO isn't one task. A typical engagement combines technical work (site speed, indexing, structured data), on-page work (making service and product pages match what people search for), content creation and authority building. Some months lean technical; others lean content.",
          "The more of these your site needs — and the more competitive your market — the more effort it takes to move results. A five-page local business site with clean code needs far less work than a five-thousand-product store with duplicate content and slow templates.",
          "You're also paying for judgment: deciding which keywords are worth chasing, which pages to fix first and which work to skip entirely. Good prioritization is often the difference between SEO that pays for itself and SEO that just produces reports.",
        ],
      },
      {
        id: "pricing-models",
        heading: "Common SEO pricing models",
        paragraphs: ["Most agencies and consultants use one of these models:"],
        list: [
          "Monthly retainer: ongoing work for a fixed fee. The most common model for small businesses.",
          "One-time audit or project: a technical audit, a site migration or a fixed set of fixes.",
          "Hourly consulting: useful if your team will do the implementation.",
          "Performance-based pricing: paid per ranking or lead. Be careful — it can encourage shortcuts that put your site at risk.",
        ],
      },
      {
        id: "typical-ranges",
        heading: "Typical price ranges",
        paragraphs: [
          "As a rough guide, small-business SEO retainers in the US, UK, Canada and Australia often fall somewhere between about $500 and $5,000 per month, with one-time audits ranging from a few hundred to a few thousand dollars. Local businesses in less competitive areas tend toward the lower end; e-commerce stores and businesses in competitive cities toward the higher end.",
          "Teams based in lower-cost countries, including India, can often deliver similar work for less — but price alone tells you little about quality. What matters is what's included and how results are measured.",
          "Treat any figure you see online, including these, as a starting point for conversation rather than a benchmark. Two quotes at the same price can contain very different amounts of real work.",
        ],
      },
      {
        id: "what-drives-cost",
        heading: "What drives the cost up or down",
        paragraphs: ["The biggest factors are:"],
        list: [
          "Competition: ranking for “personal injury lawyer” in a major city takes far more work than for a niche service in a small town.",
          "Site condition: a slow site with technical issues needs fixing before content can perform.",
          "Scope: one location versus many; fifty products versus five thousand.",
          "Content needs: how much new content is needed, and who writes it.",
          "Who implements changes: if your SEO provider can't edit your website, every fix waits on a developer.",
        ],
      },
      {
        id: "whats-included",
        heading: "What a fair quote should include",
        paragraphs: [
          "A good SEO proposal is specific. It should tell you what will be done in the first few months, how priorities were chosen, who does the work and how progress will be reported. Look for these elements:",
        ],
        list: [
          "A technical audit with a prioritized fix list, not a 100-page export from a tool",
          "Keyword and competitor research tied to your services or products",
          "A content plan with realistic volume and clear ownership",
          "Conversion tracking, so SEO is judged by inquiries and sales",
          "A reporting rhythm and a clear way to end the engagement",
        ],
      },
      {
        id: "red-flags",
        heading: "Red flags in SEO quotes",
        paragraphs: [
          "Be cautious of guaranteed rankings (nobody controls Google), very cheap packages promising hundreds of backlinks, vague monthly reports with no business outcomes, and contracts that lock you in for a year with no exit.",
          "Also be wary of providers who won't explain what they're doing. Legitimate SEO has nothing to hide; you should be able to see every change made to your site and every piece of content published.",
        ],
      },
      {
        id: "how-to-budget",
        heading: "How to set your SEO budget",
        paragraphs: [
          "Work backward from value. Estimate what a new customer is worth to you, how many extra customers per month would make SEO worthwhile, and how long you can invest before expecting returns — usually several months.",
          "If you need results this month, pair SEO with paid search. Ads bring traffic immediately and show which searches convert, which helps focus your SEO.",
        ],
      },
      {
        id: "bottom-line",
        heading: "The bottom line",
        paragraphs: [
          "Good SEO is an investment in an asset — rankings and content that keep working. Choose a provider who explains exactly what they'll do, measures success in leads and sales, and can fix your website themselves when it's holding you back.",
        ],
      },
    ],
    cta: "marketing",
  },
  {
    slug: "seo-vs-google-ads-which-first",
    title: "SEO vs Google Ads: Which Should You Invest In First?",
    description:
      "How SEO and Google Ads differ on speed, cost and longevity, and a simple way to decide which to start with — or how to combine them.",
    category: "Digital Marketing",
    date: "2026-10-04",
    author: AUTHOR,
    intro:
      "Both SEO and Google Ads put your business in front of people searching for what you sell. They work very differently, though, and the right first step depends on your timeline, budget and market. Here's a practical way to decide.",
    sections: [
      {
        id: "key-difference",
        heading: "The key difference",
        paragraphs: [
          "With Google Ads, you pay for each click and can appear at the top of results almost immediately. When you stop paying, the traffic stops.",
          "With SEO, you invest in your website and content to earn organic rankings. Results take longer to build, but traffic continues without paying per click.",
          "Put simply: ads rent attention, SEO builds an asset. Most healthy businesses end up using both, but the order matters when budget and time are limited.",
        ],
      },
      {
        id: "compare",
        heading: "How they compare",
        paragraphs: ["A quick side-by-side on the factors that usually decide the question:"],
        list: [
          "Speed: ads can produce clicks the day a campaign goes live; SEO usually takes months.",
          "Cost structure: ads cost money for every click; SEO costs time and expertise up front, then keeps working.",
          "Control: ads let you choose exactly which searches, locations and hours to target; SEO is less precise.",
          "Trust: many searchers trust organic results more and scroll past ads, especially for research-heavy decisions.",
          "Learning: ads produce clean data on which searches convert, quickly.",
        ],
      },
      {
        id: "when-ads-first",
        heading: "When to start with Google Ads",
        paragraphs: ["Ads are usually the better first move when:"],
        list: [
          "You need leads or sales this month",
          "You're launching a new business, product or location",
          "You want to test which offers and keywords convert before investing in content",
          "Your market is dominated by strong organic competitors you can't outrank quickly",
        ],
      },
      {
        id: "when-seo-first",
        heading: "When to start with SEO",
        paragraphs: ["SEO deserves priority when:"],
        list: [
          "Clicks in your industry are expensive",
          "Customers research carefully before buying",
          "You can wait a few months for results",
          "Your website has technical problems that would also hurt ad performance",
        ],
      },
      {
        id: "use-both",
        heading: "Why the best answer is often both, in sequence",
        paragraphs: [
          "Ads and SEO strengthen each other. Ad data shows which search terms actually produce customers, so SEO effort goes to the right keywords. As organic rankings grow for those terms, you can reduce ad spend on them and redirect budget.",
          "Both also depend on the same thing: a landing page that converts. Improving your pages lowers your cost per lead from ads and helps you rank. That's why we treat the website as part of the marketing, not a separate project.",
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        paragraphs: [],
        list: [
          "Running ads to your homepage instead of a page built for the search",
          "Judging SEO after a few weeks, or ads after a few days",
          "Skipping conversion tracking, so neither channel can be compared fairly",
          "Bidding on broad keywords without reviewing which searches trigger your ads",
        ],
      },
      {
        id: "simple-plan",
        heading: "A simple starting plan",
        paragraphs: [],
        list: [
          "Fix the basics: speed, clear service pages, working tracking.",
          "Run a focused Google Ads campaign on your highest-intent searches.",
          "Use the results to choose SEO priorities.",
          "Build SEO content and pages for the searches that convert.",
          "Rebalance budget each quarter based on cost per customer.",
        ],
        ordered: true,
      },
    ],
    cta: "marketing",
  },
  {
    slug: "repetitive-business-tasks-to-automate",
    title: "7 Repetitive Business Tasks You Can Automate This Month",
    description:
      "Seven everyday tasks that most growing businesses can automate quickly — from lead routing to reporting — with what the before and after looks like.",
    category: "AI & Automation",
    date: "2026-10-04",
    author: AUTHOR,
    intro:
      "Automation doesn't have to start with a big project. Most businesses have a handful of small, repetitive tasks that can be automated in days using tools they already pay for. Here are seven of the most common, with what changes and what to watch out for.",
    sections: [
      {
        id: "lead-routing",
        heading: "1. Routing new leads",
        paragraphs: [
          "Before: inquiries from your website, ads and messaging apps land in different inboxes and wait. After: every lead goes into your CRM automatically, is assigned to the right person and gets an instant acknowledgment.",
          "This is usually the highest-value automation for any business that spends money on marketing. A faster, consistent response means more of the leads you already pay for turn into conversations.",
        ],
      },
      {
        id: "follow-ups",
        heading: "2. Follow-up reminders",
        paragraphs: [
          "Before: follow-ups depend on someone remembering. After: if a lead hasn't been contacted or a quote hasn't been answered within a set time, the system reminds the owner or sends a polite follow-up.",
          "Start with reminders to your team rather than automatic messages to customers. Once you trust the timing and wording, automate the customer-facing step.",
        ],
      },
      {
        id: "appointment-reminders",
        heading: "3. Appointment reminders",
        paragraphs: [
          "Before: staff call or message clients the day before. After: confirmations and reminders go out automatically by email or message, with an easy way to reschedule.",
          "Most booking tools include this already; it's often just switched off or poorly configured. Make sure messages comply with consent rules in your customers' countries.",
        ],
      },
      {
        id: "invoice-entry",
        heading: "4. Invoice data entry",
        paragraphs: [
          "Before: supplier invoices are typed into accounting software. After: document processing extracts the supplier, amounts and dates, and a person approves with one click.",
          "Keep the approval step. Extraction is fast and usually accurate, but a quick human check catches the occasional unusual invoice before it reaches your books.",
        ],
      },
      {
        id: "reporting",
        heading: "5. Weekly reporting",
        paragraphs: [
          "Before: someone spends hours exporting data and building a report. After: a scheduled report or live dashboard pulls numbers from your tools and arrives every Monday.",
          "Agree on the five or six numbers that actually drive decisions before building anything. A dashboard with forty charts gets ignored as quickly as a manual report.",
        ],
      },
      {
        id: "reviews",
        heading: "6. Review requests",
        paragraphs: [
          "Before: happy customers are rarely asked for a review. After: a request goes out automatically after a completed job or delivery, following each platform's policies.",
          "Never filter requests so only happy customers are asked, and never offer incentives for reviews — most platforms prohibit both.",
        ],
      },
      {
        id: "onboarding",
        heading: "7. Customer onboarding",
        paragraphs: [
          "Before: welcome emails, document requests and setup tasks are sent manually. After: a new customer triggers a welcome sequence, a document request and tasks for your team.",
          "Onboarding automation also improves the customer's first impression: they get clear next steps immediately instead of waiting for someone to find time.",
        ],
      },
      {
        id: "getting-started",
        heading: "How to get started",
        paragraphs: [
          "Pick one task that happens often and follows clear rules. Write down every step, including the exceptions. Then choose the simplest tool that can do it reliably — an integration platform, your CRM's built-in automation or custom code — and add an alert so failures never go unnoticed.",
          "Measure the time the task took before and after. That number makes the case for the next automation.",
        ],
      },
    ],
    cta: "ai",
  },
  {
    slug: "what-every-modern-business-website-needs",
    title: "What Every Modern Business Website Needs",
    description:
      "The essentials of a modern business website in 2026: clear messaging, speed, mobile usability, trust signals, SEO foundations, accessibility and tracking.",
    category: "Web Development",
    date: "2026-10-04",
    author: AUTHOR,
    intro:
      "A modern business website doesn't need every new trend. It needs to do a few things exceptionally well: explain what you do, load fast, earn trust and make it easy to take the next step. Here's the checklist we use on every build.",
    sections: [
      {
        id: "clear-message",
        heading: "A message visitors understand in seconds",
        paragraphs: [
          "Your headline should say what you do, who it's for and why it matters. If a visitor can't explain your business after a few seconds on the homepage, the design doesn't matter yet.",
          "Write for the customer's problem, not your history. “Fast, reliable plumbing repairs across Austin” does more work than “Welcome to our company.”",
        ],
      },
      {
        id: "speed",
        heading: "Speed on real phones",
        paragraphs: [
          "Most visitors arrive on mobile, often on imperfect connections. Optimized images, minimal scripts and modern hosting make a visible difference. Google's Core Web Vitals are a useful way to measure it.",
          "Be especially careful with third-party scripts — chat widgets, trackers and embedded social feeds often slow a site more than its own code does.",
        ],
      },
      {
        id: "next-step",
        heading: "An obvious next step",
        paragraphs: [
          "Every page should lead somewhere: book a call, request a quote, buy, or message you. Keep forms short and make phone and WhatsApp contact one tap away on mobile.",
          "Match the call to action to the page. Someone reading a detailed guide may not be ready for a sales call, but might download a checklist or join a newsletter.",
        ],
      },
      {
        id: "trust",
        heading: "Honest trust signals",
        paragraphs: [
          "Real work examples, clear pricing or process information, named people, genuine reviews and complete contact details build trust. Inflated numbers and stock-photo testimonials do the opposite — visitors notice.",
          "If you're a newer business without many reviews yet, show your process, your team and your work in detail. Transparency is a trust signal in itself.",
        ],
      },
      {
        id: "seo-foundations",
        heading: "SEO foundations",
        paragraphs: ["Build these in from the start rather than adding them later:"],
        list: [
          "One clear page per core service or product",
          "Unique titles and meta descriptions",
          "Clean URLs and logical internal links",
          "Structured data for your business, services and FAQs",
          "An XML sitemap and correct redirects from any old site",
        ],
      },
      {
        id: "accessibility",
        heading: "Accessibility",
        paragraphs: [
          "Good contrast, keyboard navigation, labelled forms and meaningful image descriptions help everyone — and reduce legal risk in markets like the US and UK. WCAG 2.2 AA is a sensible standard.",
          "Accessibility also tends to improve SEO and conversion: clear headings, descriptive links and readable text help search engines and hurried visitors alike.",
        ],
      },
      {
        id: "security",
        heading: "Security and reliability",
        paragraphs: [
          "HTTPS everywhere, updated software, spam protection on forms and reliable backups are basic expectations. A site that's down, hacked or flagged as unsafe loses trust instantly.",
        ],
      },
      {
        id: "measurement",
        heading: "Measurement and connected follow-up",
        paragraphs: [
          "Track the actions that matter — form submissions, calls, bookings — not just pageviews. Then connect your forms to a CRM or automation so every inquiry gets a fast response.",
        ],
      },
      {
        id: "easy-updates",
        heading: "Easy updates",
        paragraphs: [
          "Your team should be able to change text, add pages and publish posts without waiting for a developer. A website that's hard to update quickly goes out of date — and out-of-date information costs trust.",
        ],
      },
    ],
    cta: "web",
  },
  {
    slug: "how-local-seo-brings-more-customers",
    title: "How Local SEO Brings More Customers Through Your Door",
    description:
      "How local SEO works, why Google Business Profile matters so much, and the practical steps local businesses can take to win more nearby customers.",
    category: "SEO",
    date: "2026-10-04",
    author: AUTHOR,
    intro:
      "When someone searches for a service “near me”, Google shows a map with a small number of businesses before any regular results. Being in that group can make a real difference to calls and visits. That's what local SEO is about — and most of it is within your control.",
    sections: [
      {
        id: "how-it-works",
        heading: "How local rankings work",
        paragraphs: [
          "Google describes three broad factors for local results: relevance (how well your business matches the search), distance (how close you are to the searcher or the location in the search) and prominence (how well known and well reviewed you are). You can't move your business closer, but you can improve relevance and prominence.",
          "Relevance comes mostly from your Google Business Profile and website content. Prominence comes from reviews, mentions across the web and the overall strength of your site.",
        ],
      },
      {
        id: "business-profile",
        heading: "Start with your Google Business Profile",
        paragraphs: ["Your profile is often the first impression — sometimes the only one. Make sure it has:"],
        list: [
          "The most accurate primary category, plus relevant secondary categories",
          "Complete services, hours, service areas and attributes",
          "Recent, real photos of your work, team and premises",
          "Regular posts and answers to common questions",
        ],
      },
      {
        id: "other-maps",
        heading: "Don't forget the other maps",
        paragraphs: [
          "Apple Maps matters for iPhone users, and Bing Places feeds several other services. Claiming and completing these listings takes little time and widens your reach.",
        ],
      },
      {
        id: "consistency",
        heading: "Keep your details consistent",
        paragraphs: [
          "Your business name, address and phone number should match across your website, Google, Apple Maps, Bing and major directories. Inconsistent details make it harder for search engines to trust your information — and confuse customers.",
        ],
      },
      {
        id: "reviews",
        heading: "Earn reviews steadily",
        paragraphs: [
          "Reviews influence both rankings and decisions. Ask every satisfied customer, make it easy with a direct link, and reply to every review — especially the critical ones. Never buy or fake reviews; platforms remove them and regulators increasingly penalize them.",
          "A steady flow of recent reviews tends to matter more than a burst of reviews from years ago. Build asking into your normal process, right after a job is complete.",
        ],
      },
      {
        id: "local-pages",
        heading: "Build useful local pages",
        paragraphs: [
          "If you serve several areas, create a page for each with genuinely local information: projects you've done there, area-specific services, local FAQs. Pages that only swap the town name rarely help and can hurt.",
          "Link these pages from your main navigation or service pages, and add LocalBusiness structured data to your site.",
        ],
      },
      {
        id: "measure",
        heading: "Measure what matters",
        paragraphs: [
          "Track calls, direction requests, website clicks from your profile and form submissions from local pages. These tell you far more than rankings alone, which vary by where the searcher is standing.",
        ],
      },
      {
        id: "checklist",
        heading: "A one-hour local SEO checklist",
        paragraphs: [],
        list: [
          "Verify and complete your Google Business Profile.",
          "Upload ten recent, real photos.",
          "Check your name, address and phone on your website and top directories.",
          "Send a review request to your last ten happy customers.",
          "Reply to every unanswered review.",
        ],
        ordered: true,
      },
    ],
    cta: "marketing",
  },
  {
    slug: "why-website-gets-traffic-but-no-leads",
    title: "Why Your Website Gets Traffic but No Leads",
    description:
      "Common reasons websites attract visitors but don't generate inquiries — from mismatched traffic to slow pages and broken forms — and how to fix each one.",
    category: "Business Growth",
    date: "2026-10-04",
    author: AUTHOR,
    intro:
      "Traffic is going up, but the phone isn't ringing. It's one of the most frustrating situations in marketing, and it usually comes down to a few fixable problems. Here's how to diagnose yours, in the order we check them.",
    sections: [
      {
        id: "wrong-traffic",
        heading: "1. The traffic isn't the right traffic",
        paragraphs: [
          "Blog posts can attract readers who will never buy, and broad ad keywords can bring people looking for something else. Check which pages and searches bring visitors, and whether those visitors match your customers.",
          "A useful test: look at your top landing pages and ask whether someone reading each one could plausibly become a customer this year. If most can't, the problem is targeting, not conversion.",
        ],
      },
      {
        id: "unclear-offer",
        heading: "2. The offer isn't clear",
        paragraphs: [
          "If visitors can't quickly see what you do, who it's for and why you're different, they leave. Rewrite headlines around the customer's problem and outcome, not your company history.",
          "Ask someone outside your business to look at your homepage for five seconds and tell you what you sell. Their answer is often revealing.",
        ],
      },
      {
        id: "no-next-step",
        heading: "3. There's no obvious next step",
        paragraphs: [
          "Every important page needs a clear call to action that matches the visitor's stage. Someone reading a guide may want a checklist; someone on a pricing page may want a call.",
          "Avoid offering too many options on one page. One primary action and one secondary action is usually enough.",
        ],
      },
      {
        id: "friction",
        heading: "4. Forms and pages create friction",
        paragraphs: ["Common culprits:"],
        list: [
          "Forms with too many required fields",
          "Pages that load slowly on mobile",
          "Phone numbers that aren't tappable",
          "Pop-ups that block content on small screens",
          "CAPTCHAs that are hard to complete",
        ],
      },
      {
        id: "trust",
        heading: "5. Not enough trust",
        paragraphs: [
          "Visitors look for evidence: real work, named people, clear process, genuine reviews and complete contact details. Add what's true and specific. Avoid inflated claims — they reduce trust.",
        ],
      },
      {
        id: "broken-tracking",
        heading: "6. Leads are arriving — but getting lost",
        paragraphs: [
          "Sometimes the leads exist but go to an unmonitored inbox, a broken form or a spam folder. Test every form and check where submissions go. Then connect them to a CRM or automation so each one gets a quick response.",
          "Response time matters. A lead that waits a day for a reply has often already contacted a competitor.",
        ],
      },
      {
        id: "diagnose",
        heading: "How to diagnose it",
        paragraphs: [],
        list: [
          "Set up conversion tracking for forms, calls and bookings.",
          "Compare conversion rates by page and traffic source.",
          "Watch session recordings or run quick user tests on key pages.",
          "Fix the biggest leak first, then measure again.",
        ],
        ordered: true,
      },
      {
        id: "when-to-rebuild",
        heading: "When it's time to rebuild",
        paragraphs: [
          "Most of these problems can be fixed on an existing site. A rebuild makes sense when the platform itself is slow, hard to update or blocks basic improvements — or when your business has changed so much that the structure no longer fits.",
        ],
      },
    ],
    cta: "web",
  },
  {
    slug: "ai-for-small-businesses-practical-uses",
    title: "AI for Small Businesses: Practical Uses That Actually Save Time",
    description:
      "Practical, low-risk ways small businesses can use AI today — drafting, summarizing, sorting, extracting and answering — plus how to avoid common mistakes.",
    category: "AI & Automation",
    date: "2026-10-04",
    author: AUTHOR,
    intro:
      "You don't need a data science team to get value from AI. The most useful applications for small businesses are modest: reading, sorting, summarizing and drafting. Here's where AI helps most today, how to use it safely and how to tell whether it's working.",
    sections: [
      {
        id: "drafting",
        heading: "Drafting routine writing",
        paragraphs: [
          "AI can produce first drafts of emails, proposals, product descriptions and social posts in seconds. Keep a person in charge of editing and sending — AI drafts are a starting point, not the final word.",
          "Drafts improve dramatically when you give the AI examples of your own past writing and a short description of your audience and tone.",
        ],
      },
      {
        id: "summarizing",
        heading: "Summarizing calls, meetings and documents",
        paragraphs: [
          "Meeting and call summaries with action items save time and keep teams aligned. AI can also pull key points from long documents, such as contracts or reports, so people know where to focus.",
          "Always tell meeting participants when calls are being recorded or transcribed, and follow the consent rules that apply where they are.",
        ],
      },
      {
        id: "sorting",
        heading: "Sorting and routing messages",
        paragraphs: [
          "AI can read incoming emails or messages, identify what each person wants and route them to the right place — sales, support or billing — with a priority level.",
          "This works well alongside traditional automation: AI decides what a message is about, and rules decide where it goes.",
        ],
      },
      {
        id: "extracting",
        heading: "Extracting data from documents",
        paragraphs: [
          "Invoices, forms and receipts can be turned into structured data automatically, with uncertain results flagged for a person to check.",
        ],
      },
      {
        id: "answering",
        heading: "Answering common questions",
        paragraphs: [
          "An assistant grounded in your own approved content can answer routine questions about hours, services and processes at any time, and pass complex cases to your team.",
          "The key word is grounded. A general chatbot without access to your content will guess; an assistant connected to your help pages can link to its sources.",
        ],
      },
      {
        id: "mistakes",
        heading: "Mistakes to avoid",
        paragraphs: [],
        list: [
          "Letting AI send customer-facing messages without review on sensitive topics",
          "Using AI-generated content without fact-checking",
          "Pasting confidential data into tools without checking their data policies",
          "Automating a messy process before simplifying it",
          "Expecting AI to fix a problem that's really about missing information",
        ],
      },
      {
        id: "measure",
        heading: "How to tell if it's working",
        paragraphs: [
          "Measure time saved and error rates, not novelty. Compare a sample of AI-assisted work against your team's usual output. If quality holds and time drops, expand; if not, adjust the instructions or choose a different task.",
        ],
      },
      {
        id: "start-small",
        heading: "Start small and build properly",
        paragraphs: [
          "Choose one task that takes real time every week. Pilot AI on it, compare the results with your team's work, and measure time saved. If it works, build it into your tools properly with logging and review steps.",
        ],
      },
    ],
    cta: "ai",
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function categorySlug(name: string) {
  return blogCategories.find((c) => c.name === name)?.slug ?? "business-growth";
}

export function readingMinutes(post: BlogPost) {
  const words = [post.intro, ...post.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])])]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/** Categories that currently have at least one post (avoids empty, thin category pages). */
export function activeCategories() {
  return blogCategories.filter((c) => posts.some((p) => p.category === c.name));
}
