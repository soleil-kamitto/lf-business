// The site answers on both lf-business.vercel.app and the real domain. Canonical
// URLs must be absolute and point here, otherwise each host declares itself the
// original and Google may rank the vercel.app copy over Liza's brand domain.
export const SITE_URL = "https://www.lf-business-consulting.com";

export const canonical = (path: string) => `${SITE_URL}${path}`;
