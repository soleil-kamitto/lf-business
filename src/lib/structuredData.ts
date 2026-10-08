import type { SiteContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * Splits "Gfell 1002, 9053 Teufen, Schweiz" into schema.org PostalAddress parts.
 * Liza edits this as one free-text line in /admin, so anything that does not match
 * falls back to the whole string rather than inventing a wrong locality.
 */
function postalAddress(address: string) {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  const plzCity = parts[1]?.match(/^(\d{4,5})\s+(.+)$/);
  if (parts.length < 2 || !plzCity) {
    return { "@type": "PostalAddress", streetAddress: address };
  }
  return {
    "@type": "PostalAddress",
    streetAddress: parts[0],
    postalCode: plzCity[1],
    addressLocality: plzCity[2],
    addressCountry: parts[2] ?? "Schweiz",
  };
}

/** Helps Google show the business in local results and on the map. */
export function localBusinessJsonLd(content: SiteContent) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "LF Marketing & Business Consulting",
    description: content.hero.subtitle,
    url: SITE_URL,
    email: content.contact.email,
    telephone: content.contact.phone,
    address: postalAddress(content.contact.address),
    founder: { "@type": "Person", name: "Liza Fässler" },
    areaServed: [
      { "@type": "Place", name: "Appenzell Ausserrhoden" },
      { "@type": "Place", name: "Ostschweiz" },
      { "@type": "Country", name: "Schweiz" },
    ],
    knowsLanguage: ["de-CH", "es", "pt"],
  });
}
