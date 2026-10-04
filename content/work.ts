import type { CaseStudy } from "./types";
import { projectLinks } from "./links";

const media = (key: keyof typeof projectLinks) => ({
  url: projectLinks[key].url || undefined,
  image: projectLinks[key].image || undefined,
});

/**
 * Selected work. Outcome rules: only verified numbers. If there is no verified
 * result, describe the work qualitatively or use outcomeType "coming-soon".
 * Leave `technology` empty when the stack has not been confirmed for publication.
 */
export const caseStudies: CaseStudy[] = [
  {
    project: "Nachwal Solar Agency",
    industry: "Renewable Energy / Local Business",
    solution: "Business website",
    services: ["Web Design", "Web Development"],
    technology: [],
    outcome:
      "A business website that presents the agency's solar services clearly and gives prospective customers a simple way to make contact. Full case study coming soon.",
    outcomeType: "qualitative",
    icon: "zap",
    cover: "solar",
    ...media("nachwalSolar"),
  },
  {
    project: "HimalayanRoutes",
    industry: "Travel & Tourism",
    solution: "Travel portal",
    services: ["Web Design", "Web Development"],
    technology: [],
    outcome:
      "A travel portal that brings routes and trip information together in one place for people planning Himalayan travel. Full case study coming soon.",
    outcomeType: "qualitative",
    icon: "compass",
    cover: "travel",
    ...media("himalayanRoutes"),
  },
  {
    project: "DriveReady",
    industry: "EdTech / Consumer Tool",
    solution: "Own product — state-by-state DMV permit test practice",
    services: ["Product Design", "Development", "SEO"],
    technology: ["Next.js", "TypeScript", "Vercel"],
    outcome:
      "In development. Built on content verified against official state handbooks, with a state-by-state structure designed for search. Case study coming after launch.",
    outcomeType: "coming-soon",
    icon: "graduation-cap",
    cover: "quiz",
    ...media("driveReady"),
  },
  {
    project: "Pytron Digital (this site)",
    industry: "Professional Services",
    solution: "Brand, design and website",
    services: ["Brand", "UI/UX Design", "Next.js Build", "Technical SEO"],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    outcome:
      "A statically generated, accessible site with structured data, a central content system and no inflated claims — the same standard we bring to client builds.",
    outcomeType: "qualitative",
    icon: "layers",
    cover: "site",
    ...media("pytronDigital"),
  },
];

export const workPage = {
  meta: {
    title: "Our Work — Websites, Portals and Products by Pytron Digital",
    description:
      "Selected work from Pytron Digital: business websites, a travel portal, our own DriveReady product and this site. Real projects, described honestly.",
  },
  h1: "Digital Experiences Built to Perform",
  intro:
    "Real projects, described honestly. Where we have verified results, we share them. Where we don't yet, we describe the work and publish the full case study later.",
};
