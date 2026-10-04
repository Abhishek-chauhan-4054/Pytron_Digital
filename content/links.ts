/**
 * ============================================================
 *  LINKS & MEDIA — the one file to edit for links and images
 * ============================================================
 *
 *  • Paste a URL between the quotes. Leave "" (empty) if not ready.
 *  • Products: an empty url keeps the card on "Coming Soon".
 *    Paste the live URL and the card switches to "Live" + "Try It Free →".
 *  • Images: put the file in /public (e.g. /public/products/driveready.png)
 *    and write the path starting with "/" (e.g. "/products/driveready.png").
 *    Empty = the built-in illustration is used.
 *  • After editing: commit + push → Vercel redeploys automatically.
 */

export const productLinks = {
  driveReady: { url: "", image: "" },
  citizenshipTestPrep: { url: "", image: "" },
  homeGrantFinder: { url: "", image: "" },
  visaMatch: { url: "", image: "" },
  bizPermitFinder: { url: "", image: "" },
};

export const projectLinks = {
  nachwalSolar: { url: "", image: "" },
  himalayanRoutes: { url: "", image: "" },
  driveReady: { url: "", image: "" },
  pytronDigital: { url: "https://digital.pytron.in", image: "" },
};

/** Social profiles — empty ones are hidden from the footer. */
export const socialLinks = {
  linkedin: "",
  instagram: "",
  facebook: "",
  x: "",
  youtube: "",
};

/**
 * Booking link (Calendly, Cal.com, Google Calendar booking page…).
 * When set, every "Book a Free Consultation →" button opens it.
 * Empty = buttons go to the contact page.
 */
export const bookingUrl = "";

/** Founder photo, e.g. "/team/pardeep-kumar.jpg". Empty = icon placeholder. */
export const founderPhoto = "";
