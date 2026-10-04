import { absoluteUrl } from "./seo";

/** hreflang map for the regional location hub pages (distinct, market-specific content). */
const hreflang: Record<string, string> = {
  usa: "en-US",
  uk: "en-GB",
  canada: "en-CA",
  australia: "en-AU",
  uae: "en-AE",
  india: "en-IN",
};

export function locationAlternates() {
  const map: Record<string, string> = {};
  for (const [slug, lang] of Object.entries(hreflang)) map[lang] = absoluteUrl(`/locations/${slug}/`);
  map["x-default"] = absoluteUrl("/locations/");
  return map;
}
