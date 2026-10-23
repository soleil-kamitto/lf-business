// The site also answers on its host's own subdomain (today a netlify.app one).
// Canonical URLs must be absolute and point here, otherwise each host declares
// itself the original and Google may rank that copy over Liza's brand domain.
export const SITE_URL = "https://www.lf-business-consulting.com";

export const canonical = (path: string) => `${SITE_URL}${path}`;
