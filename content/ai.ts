import type { ServiceHub, ServicePage } from "./types";

export const aiHub: ServiceHub = {
  slug: "ai-solutions",
  pillar: "ai",
  meta: {
    title: "AI Solutions & Business Automation Services | Pytron Digital",
    description:
      "Practical AI solutions and business automation: lead routing, document data extraction, AI assistants, system integrations and automated reporting that save hours every week.",
  },
  eyebrow: "AI & Automation",
  h1: "Practical AI and Automation That Remove Manual Work",
  intro:
    "Remove repetitive work and connect your tools with practical, reliable automation. We focus on specific jobs — routing leads, extracting data from documents, answering routine questions, producing reports — and build automations you can trust and inspect.",
  pillars: [
    { title: "Reduce manual work", text: "Stop copying data between tools and retyping documents." },
    { title: "Faster operations", text: "Requests, approvals and updates move without waiting on someone." },
    { title: "Lead routing", text: "Every inquiry reaches the right person in seconds, with context." },
    { title: "Document & data extraction", text: "Turn PDFs, scans and emails into structured data." },
    { title: "AI assistants", text: "Answer routine questions from your own approved content." },
    { title: "System integrations", text: "Connect your CRM, store, accounting and support tools." },
    { title: "Automated reporting", text: "Reports assembled and delivered on schedule." },
    { title: "Decision support", text: "Summaries and flags that help people decide faster." },
  ],
  approach: {
    heading: "Our approach: useful, reliable, inspectable",
    body: [
      "We start with a specific task and measure how long it takes today. If AI or automation can do it reliably, we build it with logging, error alerts and a human review step wherever mistakes would be costly.",
      "We choose the simplest tool that works. Sometimes that's a large language model; often it's a well-designed integration or a few rules. Your data stays in systems you control, and we document how every automation works.",
    ],
  },
  workflows: [
    { title: "New website inquiry", before: "A form email sits in a shared inbox until someone notices it.", after: "The lead is enriched, scored, added to the CRM and assigned to the right person, who gets an instant alert." },
    { title: "Supplier invoices", before: "Staff type invoice details into accounting software by hand.", after: "Invoice data is extracted automatically and queued for one-click approval." },
    { title: "Monday reporting", before: "Two hours of exports and copy-pasting into slides.", after: "A summary report arrives in your inbox every Monday at 9 a.m." },
    { title: "Routine customer questions", before: "Staff answer the same questions about hours, pricing and process all day.", after: "An assistant answers from your approved content and hands complex cases to a person." },
  ],
  faqs: [
    { q: "Is AI reliable enough for business processes?", a: "For the right tasks, with the right safeguards, yes. We design automations with validation checks, logging and human review where needed, and we test with your real data before launch." },
    { q: "What happens to our data?", a: "We use providers and settings that don't train models on your data where that option exists, keep data in systems you control and limit access to what each automation needs." },
    { q: "Which tools do you use?", a: "It depends on the job: platforms like Make, Zapier or n8n for integrations; custom code for complex logic; and AI models from leading providers for language and document tasks." },
    { q: "How do we know what to automate first?", a: "Look for tasks that are frequent, repetitive and rule-based. We run a short workflow review and rank opportunities by time saved and risk." },
    { q: "Will automation replace our staff?", a: "Our goal is to remove repetitive work so your team can spend time on customers and decisions. Most clients use the time saved to do more of the work that grows the business." },
  ],
};

export const aiPages: ServicePage[] = [
  {
    slug: "ai-automation",
    label: "AI Automation",
    icon: "bot",
    summary: "AI steps inside everyday workflows.",
    meta: {
      title: "AI Automation Services — AI in Everyday Workflows | Pytron Digital",
      description:
        "AI automation that adds language and judgment steps to everyday workflows: classify inquiries, draft replies, summarize calls and route work — with human review built in.",
    },
    h1: "AI Automation for the Work Rules Alone Can't Handle",
    intro:
      "Some tasks need a little judgment — reading an email to understand what someone wants, summarizing a long document, drafting a reply. We build AI steps into your workflows for exactly those tasks, with checks and human review where it matters.",
    problem: {
      heading: "The problem: hours spent reading, sorting and summarizing",
      body: [
        "Traditional automation handles structured data well, but much of a team's day is unstructured: emails, messages, notes and documents. Someone has to read each one and decide what to do.",
      ],
      points: [
        "Shared inboxes sorted by hand",
        "Call and meeting notes that never get written up",
        "First-draft replies written from scratch every time",
        "Long documents read just to find a few facts",
      ],
    },
    solution: {
      heading: "How we build AI automation",
      body: [
        "We identify the judgment step, give an AI model clear instructions and examples from your business, and wrap it in a workflow with validation. Outputs that are uncertain or high-stakes go to a person for approval.",
        "Every automation logs what it did and why, so you can review decisions and improve them over time.",
      ],
    },
    benefits: [
      { title: "Hours back every week", text: "Reading, sorting and drafting handled in seconds." },
      { title: "Consistent quality", text: "The same rules and tone applied every time." },
      { title: "Human control", text: "Review steps where accuracy matters most." },
      { title: "Transparent", text: "Logs and audit trails for every action." },
    ],
    process: [
      { title: "Task review", text: "Pick high-volume tasks and measure today's effort." },
      { title: "Design", text: "Workflow, prompts, checks and review points." },
      { title: "Pilot", text: "Test on real examples and compare with your team." },
      { title: "Deploy", text: "Go live with monitoring and alerts." },
      { title: "Improve", text: "Tune instructions based on reviewed results." },
    ],
    included: [
      "Workflow analysis and opportunity ranking",
      "AI classification, extraction and summarization steps",
      "Draft generation for emails and responses",
      "Human-in-the-loop approval steps",
      "Integration with email, CRM, chat and helpdesk",
      "Logging, monitoring and error alerts",
    ],
    workflows: [
      { title: "Inbox triage", before: "Someone reads every email in a shared inbox and forwards it.", after: "Emails are classified by intent and urgency, tagged and routed automatically." },
      { title: "Sales call follow-up", before: "Reps write up notes and follow-up emails after every call.", after: "A summary and draft follow-up are ready in the CRM minutes after the call." },
      { title: "Support replies", before: "Agents write similar answers from scratch.", after: "AI drafts a reply from your help content; the agent reviews and sends." },
      { title: "Review monitoring", before: "Nobody notices a negative review for days.", after: "New reviews are summarized, scored for sentiment and flagged for quick response." },
    ],
    industries: ["professional-services", "ecommerce", "real-estate", "healthcare", "startups"],
    faqs: [
      { q: "Will the AI send messages to customers without review?", a: "Only if you want it to, and only for low-risk cases. By default we draft and route; a person approves anything sensitive." },
      { q: "What if the AI gets something wrong?", a: "We design for it: validation rules catch obvious errors, uncertain cases go to review, and logs make issues easy to trace and fix." },
      { q: "Do we need lots of data to start?", a: "No. Most AI automation works from clear instructions and a few dozen good examples from your business." },
      { q: "Which AI models do you use?", a: "We use models from leading providers and choose based on the task, cost and data requirements. We avoid locking you into one vendor where possible." },
    ],
    related: [
      { label: "Business Automation", href: "/ai-solutions/business-automation/" },
      { label: "AI Integrations", href: "/ai-solutions/ai-integrations/" },
      { label: "Blog: AI for small businesses", href: "/blog/ai-for-small-businesses-practical-uses/" },
    ],
  },
  {
    slug: "business-automation",
    label: "Business Automation",
    icon: "workflow",
    summary: "Connect tools and stop copy-pasting.",
    meta: {
      title: "Business Automation Services — Workflow & CRM Automation | Pytron Digital",
      description:
        "Business automation that connects your CRM, forms, store, accounting and chat tools: lead routing, follow-ups, approvals and reports that run without manual work.",
    },
    h1: "Business Automation That Connects Your Tools",
    intro:
      "Most teams lose hours to copying data between tools, chasing updates and sending the same messages. We connect your systems so information moves on its own — and every lead, order and request gets handled on time.",
    problem: {
      heading: "The problem: people acting as the glue between tools",
      body: [
        "As a business grows, it adds tools: a CRM, a store, an accounting system, a booking tool, chat. Each works fine alone, but people end up moving information between them by hand.",
      ],
      points: [
        "Leads copied from forms into a CRM",
        "Follow-ups that depend on someone remembering",
        "Order details retyped into accounting or shipping tools",
        "Approvals stuck in email threads",
      ],
    },
    solution: {
      heading: "How we automate",
      body: [
        "We map each workflow step by step, then connect the tools using integration platforms or custom code — whichever is more reliable and cost-effective for you. Every automation has error handling and alerts so failures don't go unnoticed.",
        "Lead routing gets special attention: a fast, consistent response to new inquiries is one of the simplest ways to win more business from the marketing you already pay for.",
      ],
    },
    benefits: [
      { title: "Instant lead response", text: "New inquiries assigned and acknowledged in seconds." },
      { title: "No more retyping", text: "Data entered once and synced everywhere it's needed." },
      { title: "Nothing forgotten", text: "Follow-ups and reminders sent on schedule." },
      { title: "Visible operations", text: "Status updates and reports generated automatically." },
    ],
    process: [
      { title: "Map", text: "Document current workflows and tools." },
      { title: "Prioritize", text: "Rank automations by time saved and risk." },
      { title: "Build", text: "Integrations, logic, error handling and alerts." },
      { title: "Test", text: "Run with real data in parallel before switching." },
      { title: "Hand over", text: "Documentation, training and monitoring." },
    ],
    included: [
      "Lead capture and routing automation",
      "CRM setup and integration (HubSpot, Zoho, Pipedrive and others)",
      "Order, invoice and fulfillment workflows",
      "Approval and notification flows",
      "Scheduled reports and alerts",
      "WhatsApp, Slack and email notifications",
      "Documentation and monitoring",
    ],
    workflows: [
      { title: "Lead routing", before: "Leads from forms, ads and WhatsApp collected manually each evening.", after: "Every lead lands in the CRM with its source, is assigned by region and gets an instant acknowledgment." },
      { title: "Quote to invoice", before: "Accepted quotes retyped into accounting software.", after: "An accepted quote creates the invoice and project tasks automatically." },
      { title: "Appointment reminders", before: "Staff call clients the day before to confirm.", after: "Automatic reminders by email or message, with one-tap rescheduling." },
      { title: "Stock alerts", before: "Low stock noticed when a customer complains.", after: "Low-stock alerts sent to the team with a pre-filled reorder." },
    ],
    industries: ["local-business", "professional-services", "real-estate", "ecommerce", "hospitality"],
    faqs: [
      { q: "Do we need to replace our existing tools?", a: "Usually not. Most automation connects the tools you already use. We'll suggest changes only where a tool can't be integrated reliably." },
      { q: "Zapier, Make, n8n or custom code?", a: "Integration platforms are fast and easy to maintain for many workflows. Custom code makes sense for complex logic, high volumes or strict data requirements. We often combine both." },
      { q: "What happens if an automation fails?", a: "Every automation has error handling and alerts, so the right person knows immediately and nothing is silently lost." },
      { q: "Can you automate WhatsApp messages?", a: "Yes, using the official WhatsApp Business Platform and approved message templates, in line with WhatsApp's policies." },
    ],
    related: [
      { label: "AI Automation", href: "/ai-solutions/ai-automation/" },
      { label: "Custom Solutions & Dashboards", href: "/web-development/custom-solutions/" },
      { label: "Blog: 7 tasks to automate this month", href: "/blog/repetitive-business-tasks-to-automate/" },
    ],
  },
  {
    slug: "document-processing",
    label: "Document Processing",
    icon: "scan-text",
    summary: "Extract data from PDFs, scans and forms.",
    meta: {
      title: "AI Document Processing — Data Extraction from PDFs & Scans | Pytron Digital",
      description:
        "AI document processing that extracts data from invoices, forms, IDs, contracts and scanned PDFs, validates it and sends it to your systems — with review where needed.",
    },
    h1: "Document Processing That Turns Paperwork Into Data",
    intro:
      "Invoices, application forms, contracts, certificates, scanned records — if your team reads documents to type information into another system, we can automate most of that work with OCR and AI extraction, plus validation and review.",
    problem: {
      heading: "The problem: documents in, typing out",
      body: [
        "Document-heavy work is slow and error-prone. Staff open each file, find the right fields and type them into a system — and mistakes are hard to catch later.",
      ],
      points: [
        "Invoices and receipts keyed in manually",
        "Application forms checked line by line",
        "Scanned records that can't be searched",
        "Contracts read just to find dates and amounts",
      ],
    },
    solution: {
      heading: "How we build document processing",
      body: [
        "We combine OCR for scanned and photographed documents with AI models that understand layout and context. Extracted fields are validated against rules — totals add up, dates are valid, required fields exist — before anything reaches your systems.",
        "Low-confidence results go to a simple review screen where a person confirms or corrects them in seconds, and those corrections improve the process over time.",
      ],
    },
    benefits: [
      { title: "Faster processing", text: "Documents handled in seconds instead of minutes." },
      { title: "Fewer errors", text: "Validation rules catch mistakes before they spread." },
      { title: "Searchable archives", text: "Scanned files become searchable text and data." },
      { title: "Scales with volume", text: "Handle peaks without hiring temporary staff." },
    ],
    process: [
      { title: "Sample", text: "Collect real documents and the fields you need." },
      { title: "Prototype", text: "Measure extraction accuracy on your samples." },
      { title: "Validate", text: "Rules, confidence thresholds and review flow." },
      { title: "Integrate", text: "Send clean data to your systems." },
      { title: "Monitor", text: "Track accuracy and review rates over time." },
    ],
    included: [
      "OCR for scanned and photographed documents",
      "AI field extraction for invoices, forms and contracts",
      "Classification of mixed document types",
      "Validation rules and confidence thresholds",
      "Human review interface",
      "Export to accounting, CRM, ERP or databases",
      "Searchable document archive",
    ],
    workflows: [
      { title: "Accounts payable", before: "Each supplier invoice is opened and typed into accounting software.", after: "Supplier, amounts, tax and due date are extracted and queued for approval." },
      { title: "Application intake", before: "Staff check application forms and supporting documents by hand.", after: "Fields are extracted, missing items are flagged and complete applications move straight to review." },
      { title: "Contract key dates", before: "Renewal dates live in people's memories and calendars.", after: "Dates, parties and values are extracted into a register with reminders." },
      { title: "Records digitization", before: "Boxes of paper records that nobody can search.", after: "A searchable digital archive with key fields indexed." },
    ],
    industries: ["healthcare", "professional-services", "real-estate", "education", "travel"],
    faqs: [
      { q: "How accurate is document extraction?", a: "It depends on document quality and consistency. We measure accuracy on your own samples before building, and set confidence thresholds so uncertain results go to a person." },
      { q: "Can it handle handwriting?", a: "Clear handwriting can often be read, but accuracy is lower than for printed text. We test with your documents and design the review step accordingly." },
      { q: "Is sensitive data safe?", a: "We process documents in secure cloud environments, encrypt data in transit and at rest, and follow your data-retention requirements. For regulated data we design around the applicable rules." },
      { q: "What document types can you process?", a: "Invoices, receipts, purchase orders, forms, IDs, certificates, bank statements, contracts and more, in PDF, image or scanned formats." },
    ],
    related: [
      { label: "AI Automation", href: "/ai-solutions/ai-automation/" },
      { label: "Healthcare", href: "/industries/healthcare/" },
      { label: "Professional Services", href: "/industries/professional-services/" },
    ],
  },
  {
    slug: "ai-integrations",
    label: "AI Integrations",
    icon: "plug",
    summary: "Assistants and AI features in your product.",
    meta: {
      title: "AI Integrations — Assistants, Chatbots & AI Features | Pytron Digital",
      description:
        "AI integrations for websites and products: assistants that answer from your own content, AI features inside your app and connections between AI models and your systems.",
    },
    h1: "AI Integrations That Make Your Product and Website More Useful",
    intro:
      "We add AI where it genuinely helps your customers or team: assistants that answer from your own approved content, AI features inside your web app, and secure connections between AI models and the systems you already run.",
    problem: {
      heading: "The problem: AI features that don't earn their place",
      body: [
        "Generic chatbots that give vague or wrong answers damage trust. The value of AI comes from connecting it to your real content, data and processes — safely.",
      ],
      points: [
        "Chatbots that answer from guesswork, not your content",
        "Customers waiting for answers that already exist in your help docs",
        "Product data that users can't search naturally",
        "Concerns about privacy and data leaks",
      ],
    },
    solution: {
      heading: "How we integrate AI",
      body: [
        "We ground assistants in your approved content using retrieval, so answers cite your own pages and documents. Clear limits define what the assistant should and shouldn't answer, with an easy handoff to a person.",
        "Inside products, we build AI features — search, summaries, recommendations, drafting — with the same engineering standards as the rest of your app: testing, monitoring, cost controls and access permissions.",
      ],
    },
    benefits: [
      { title: "Answers from your content", text: "Grounded responses with links to sources." },
      { title: "Always available", text: "Routine questions answered at any hour." },
      { title: "Smarter products", text: "AI features that save your users time." },
      { title: "Controlled costs", text: "Usage limits, caching and model choice tuned to budget." },
    ],
    process: [
      { title: "Use case", text: "Define the questions or tasks and success criteria." },
      { title: "Content & data", text: "Prepare and connect the right sources." },
      { title: "Build", text: "Assistant or feature with guardrails and handoff." },
      { title: "Evaluate", text: "Test against real questions before launch." },
      { title: "Monitor", text: "Track answer quality, usage and cost." },
    ],
    included: [
      "Website and in-app assistants grounded in your content",
      "Retrieval over documents, help centers and databases",
      "AI search and recommendations",
      "Summarization and drafting features",
      "Integration with CRM, helpdesk and messaging",
      "Evaluation, monitoring and cost controls",
    ],
    workflows: [
      { title: "Website questions", before: "Visitors email simple questions and wait a day for a reply.", after: "An assistant answers instantly from your website content and books a call when needed." },
      { title: "Internal knowledge", before: "New staff ask colleagues where to find policies and process docs.", after: "An internal assistant answers from approved documents and links to the source." },
      { title: "Product search", before: "Customers struggle with keyword search across a large catalog.", after: "Natural-language search finds the right product or article by meaning." },
    ],
    industries: ["education", "ecommerce", "startups", "travel", "professional-services"],
    faqs: [
      { q: "Will an AI assistant make things up?", a: "We reduce that risk by grounding answers in your content, instructing the assistant to say when it doesn't know, and testing with real questions before launch. Sensitive topics are routed to a person." },
      { q: "Can the assistant hand off to a human?", a: "Yes. It can collect details and pass the conversation to your team via email, CRM, WhatsApp or live chat." },
      { q: "Is our data used to train AI models?", a: "We configure providers so your data isn't used for training where that option exists, and we keep your content in systems you control." },
      { q: "Can you add AI features to our existing app?", a: "Yes. We integrate with existing codebases and APIs and follow your engineering and security standards." },
    ],
    related: [
      { label: "AI Automation", href: "/ai-solutions/ai-automation/" },
      { label: "Web Applications", href: "/web-development/web-applications/" },
      { label: "Education", href: "/industries/education/" },
    ],
  },
];
