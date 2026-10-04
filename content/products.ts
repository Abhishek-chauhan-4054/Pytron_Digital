import type { Product } from "./types";

import { productLinks } from "./links";

/** A product is "live" only when its URL is filled in content/links.ts. */
function link(key: keyof typeof productLinks) {
  const l = productLinks[key];
  return {
    status: (l.url ? "live" : "coming-soon") as Product["status"],
    url: l.url || undefined,
    image: l.image || undefined,
  };
}

export const products: Product[] = [
  {
    name: "DriveReady",
    description: "State-by-state DMV permit test practice built on official state handbook content.",
    markets: ["USA"],
    icon: "graduation-cap",
    visual: "quiz",
    ...link("driveReady"),
  },
  {
    name: "Citizenship Test Prep",
    description: "Prepare for the US and Canadian citizenship tests with official-source study material.",
    markets: ["USA", "Canada"],
    icon: "book-open",
    visual: "flashcards",
    ...link("citizenshipTestPrep"),
  },
  {
    name: "HomeGrant Finder",
    description: "Find homebuyer grants and down-payment assistance programs faster.",
    markets: ["USA", "Canada", "UK"],
    icon: "house",
    visual: "grants",
    ...link("homeGrantFinder"),
  },
  {
    name: "VisaMatch",
    description: "Check visa eligibility and points with a clear, interactive calculator.",
    markets: ["UK", "Canada", "Australia"],
    icon: "globe",
    visual: "points",
    ...link("visaMatch"),
  },
  {
    name: "BizPermit Finder",
    description: "Find the business licenses and permits your new venture needs.",
    markets: ["USA"],
    icon: "briefcase",
    visual: "checklist",
    ...link("bizPermitFinder"),
  },
];

export const productsPage = {
  meta: {
    title: "Our Products — Free Web Tools Built by Pytron Digital",
    description:
      "DriveReady, Citizenship Test Prep, HomeGrant Finder, VisaMatch and BizPermit Finder — free, practical web tools designed, built and marketed in-house by Pytron Digital.",
  },
  h1: "We Don't Just Build for Clients. We Build Our Own Products.",
  intro:
    "Free, practical web tools that solve real problems for real people — and prove what our team can design, build and grow.",
  principles: [
    { title: "Official sources only", text: "Tools that touch tests, grants, visas or permits are built from official government and program sources, and say so clearly." },
    { title: "Free and fast", text: "No sign-up walls for core features. Pages load quickly on any phone, anywhere." },
    { title: "Built like client work", text: "Each product goes through the same discovery, design, development, launch and growth process we run for clients." },
  ],
  why: {
    heading: "Why a growth agency builds its own products",
    body: [
      "Building our own products keeps us honest. We make the same decisions our clients make — what to build first, how to explain it, how to get it found, what to measure — and we live with the results.",
      "It also means the product thinking, engineering, SEO and automation we bring to client projects has been tested on products we own.",
    ],
  },
  invitation: {
    heading: "Have an idea for a tool like ours? We build those too.",
    text: "Calculators, finders, eligibility checkers, test-prep platforms and internal tools — if it helps your customers make a decision, we can design, build and market it.",
  },
};
