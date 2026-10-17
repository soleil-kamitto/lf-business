import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { put, list } from "@vercel/blob";
import { requireAdmin, SESSION_CONFIG } from "@/lib/adminAuth";

export type SiteContent = {
  published: boolean;
  hero: { badge: string; title: string; subtitle: string };
  about: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    counters: { value: number; suffix: string; label: string }[];
  };
  liza: {
    subheading: string;
    bio1: string;
    bio2: string;
    journey: { year: string; text: string }[];
    expertise: { title: string; text: string }[];
  };
  consultorias: { title: string; phrase: string }[];
  consultoriasHeading: string;
  servicios: {
    heading: string;
    subheading: string;
    services: { title: string; text: string }[];
    spezial: { title: string; text: string }[];
    spezialHeading: string;
    bannerHeading: string;
    bannerText: string;
  };
  neuroContent: {
    heading: string;
    description: string;
    cards: { title: string; text: string }[];
  };
  kiContent: {
    heading: string;
    description: string;
  };
  clientesHeading: string;
  leistungenTeaser: {
    heading: string;
    description: string;
  };
  kontaktCta: {
    label: string;
    heading: string;
  };
  contactoHeading: string;
  branding: { heading: string; paragraph: string };
  contact: { address: string; email: string; phone: string };
  images: {
    lizaPortrait: string | null;
    consultoria1: string | null;
    consultoria2: string | null;
    neuromarketing: string | null;
    serviciosBanner: string | null;
  };
};

export const IMAGE_SLOTS = ["lizaPortrait", "consultoria1", "consultoria2", "neuromarketing", "serviciosBanner"] as const;
export type ImageSlot = (typeof IMAGE_SLOTS)[number];

export const defaultContent: SiteContent = {
  published: true,
  hero: {
    badge: "Teufen, Schweiz",
    title: "Gemeinsam stellen wir uns Ihr Unternehmen vor, inspirieren und gestalten es neu",
    subtitle:
      "Kostenlose Beratung für Unternehmer. Wir kümmern uns um Kundenservice, digitales Marketing, Branding und Neuromarketing, damit sich Ihr Unternehmen wirklich abhebt.",
  },
  about: {
    heading: "Von der Idee bis zur Positionierung - Strategie, Marketing und Kommunikation *aus einer Hand*.",
    paragraph1:
      "Bei LF Marketing & Business Consulting helfen wir bestehenden und zukünftigen Unternehmen, ihren Kundenservice zu verbessern und sich von anderen Anbietern abzuheben.",
    paragraph2:
      "Wir verbinden strategische Beratung, digitales Marketing, Branding und Neuromarketing, um Unternehmen mit eigener Identität, menschlichem Fokus und messbaren Ergebnissen aufzubauen.",
    counters: [
      { value: 10, suffix: "+", label: "Jahre Erfahrung" },
      { value: 60, suffix: "+", label: "Begleitete Marken" },
      { value: 100, suffix: "%", label: "Menschlicher Fokus" },
    ],
  },
  liza: {
    subheading: "Internationale Unternehmerin · Strategin",
    bio1:
      "Liza verwandelt seit über zehn Jahren Ideen in Projekte mit Wirkung. Sie arbeitet strategisch zwischen Lateinamerika und Europa und verbindet strategisches Marketing, Geschäftsentwicklung und die Führung komplexer Projekte.",
    bio2:
      "Sie führt Unternehmen von der ersten Idee bis zur Skalierung. Ihre Initiativen schaffen heute echten Wert: von innovativen Räumen für gemeinsames Arbeiten bis zu Bildungsplattformen für MINT, die ganze Gemeinschaften erreichen. Ihr Gespür für starke Marken, kluge Verhandlungen und strategische Netzwerke zeichnet sie aus.",
    journey: [
      { year: "Peru", text: "Ich wurde in Peru geboren und legte dort meine ersten beruflichen Schritte." },
      { year: "Brasilien", text: "Leitung kultureller Events und erste unternehmerische Schritte." },
      { year: "Schweiz", text: "Aufbau der eigenen Praxis als unabhängige Beraterin für Unternehmen und Gründer." },
      { year: "Heute", text: "Gründerin von miniMINTwelt und strategische Begleiterin für Wachstum und Nachhaltigkeit." },
    ],
    expertise: [
      {
        title: "Strategie & Transformation",
        text: "Nachhaltige Geschäftsmodelle für Unternehmer, Startups und KMU. Expertin für Markenpositionierung und klare Differenzierung im Wettbewerb.",
      },
      {
        title: "Projekte mit Wirkung",
        text: "Führung multidisziplinärer Projekte, von Bildungsinnovation mit miniMINTwelt bis zu kollaborativen Arbeitsräumen wie Coworking Teufen.",
      },
      {
        title: "Strategische Kommunikation",
        text: "Narrative, die Emotionen mit Resultaten verbinden. Zuhause in lateinamerikanischen und europäischen Märkten.",
      },
      {
        title: "Netzwerke & Allianzen",
        text: "Aufbau von Ökosystemen der Zusammenarbeit zwischen Bildung, Technologie und Industrie.",
      },
    ],
  },
  consultoriasHeading: "Wir begleiten jede Phase.",
  consultorias: [
    {
      title: "Gründer & Selbstständige",
      phrase: "Ein Unternehmen aufzubauen muss kein einsamer Weg sein. Wir begleiten Sie von der Idee bis zum Wachstum.",
    },
    {
      title: "Kleine Unternehmen",
      phrase: "Ein erfolgreiches Geschäft entsteht aus Tagen voller Arbeit, Leidenschaft und Hingabe.",
    },
  ],
  servicios: {
    heading: "Alles, was Ihre Marke braucht, an einem Ort.",
    subheading: "Integrierte Lösungen für Wachstum mit Identität, Klarheit und nachhaltigen Ergebnissen.",
    services: [
      { title: "Digitales Marketing", text: "Wirkungsvolle Strategien, um Kunden zu gewinnen und zu überzeugen." },
      { title: "Design", text: "Visuelle Identität mit Zweck und Emotion." },
      { title: "Werbung", text: "Kampagnen, die Aufmerksamkeit in Kunden verwandeln." },
    ],
    spezialHeading: "Beratung, die über Marketing hinausgeht.",
    bannerHeading: "Bereit zu wachsen?",
    bannerText: "Erzählen Sie uns von Ihrem Projekt. Wir entwickeln gemeinsam die passende Strategie.",
    spezial: [
      {
        title: "Geschäftsstrategie",
        text: "Wir analysieren Ihr Geschäft, erkennen Potenziale und zeigen Ihnen, auf welche Produkte Sie sich konzentrieren sollten und wie Sie mehr verkaufen. Vom Handwerksbetrieb bis zum jungen Unternehmen.",
      },
      {
        title: "Kursdesign",
        text: "Sie sind Experte auf Ihrem Gebiet und möchten Ihr Wissen weitergeben? Wir entwickeln die Strategie und den Aufbau Ihres Kurses, angepasst an Sie und Ihr Publikum.",
      },
    ],
  },
  neuroContent: {
    heading: "Wie *Neurowissenschaft* und Design Konsumenten beeinflussen.",
    description: "Steigern Sie die Bindung Ihrer Marke mit Techniken, die emotional und kognitiv verbinden.",
    cards: [
      { title: "Social Media", text: "Erkennen Sie Ihr Kundenprofil und entdecken Sie, wie man in sozialen Netzwerken verkauft." },
      { title: "Design", text: "Gestalten Sie wie eine Fachperson. Nutzen Sie Neuromarketing, das Blicke einfängt und Verkäufe abschliesst." },
      { title: "Kommunikation", text: "Kommunizieren Sie empathisch und überzeugend, um Menschen wirklich zu erreichen." },
      { title: "Marketing", text: "Erkennen Sie die digitalen und klassischen Strategien, die Ihre Marke zum Erfolg führen." },
    ],
  },
  kiContent: {
    heading: "Die *digitale Zukunft* für Unternehmen im Appenzellerland.",
    description: "Wir bringen künstliche Intelligenz und moderne Software zu Unternehmen in Appenzell und der Ostschweiz. Sehen Sie im Video, wie wir Ideen mit Technologie verbinden.",
  },
  clientesHeading: "Marken, die uns bereits vertrauen.",
  leistungenTeaser: {
    heading: "Alles, was Ihre Marke braucht.",
    description: "Von digitalem Marketing bis Geschäftsstrategie: integrierte Lösungen für nachhaltiges Wachstum.",
  },
  kontaktCta: {
    label: "Bereit für den nächsten Schritt?",
    heading: "Lassen Sie uns über Ihr Unternehmen sprechen.",
  },
  contactoHeading: "Sprechen wir über Ihren *nächsten Schritt*.",
  branding: {
    heading: "Wir gestalten nicht nur Anzeigen. Wir bauen *Marken mit Seele*.",
    paragraph:
      "Wir betrachten Ihr Unternehmen als Ganzes. Dabei prüfen wir, was Ihre Zielgruppe braucht, welche Trends wichtig sind und wohin Sie sich entwickeln möchten. So stellen wir das passende Paket für Sie zusammen, mit Texten, Bildern und Videos, mit der Planung von Kampagnen und mit der Pflege Ihrer Gemeinschaft in den sozialen Netzwerken.",
  },
  contact: {
    address: "Gfell 1002, 9053 Teufen, Schweiz",
    email: "info@lf-business-consulting.com",
    phone: "+41 77 471 70 06",
  },
  images: {
    lizaPortrait: null,
    consultoria1: null,
    consultoria2: null,
    neuromarketing: null,
    serviciosBanner: null,
  },
};

const BLOB_PATHNAME = "site-content.json";

// The content blob has a fixed pathname and no random suffix, so its public URL
// never changes. Reading that URL is a free Blob operation; list() is a billed
// "advanced" one, and this runs on every page view.
const CONTENT_URL = `https://vb02dmjvh7tv9bkr.public.blob.vercel-storage.com/${BLOB_PATHNAME}`;

function mergeDeep<T>(base: T, override: Partial<T> | undefined): T {
  if (override === undefined) return base;
  if (Array.isArray(base)) return (override as unknown as T) ?? base;
  if (typeof base === "object" && base !== null) {
    const result: any = { ...base };
    for (const key of Object.keys(override as object)) {
      const overrideValue = (override as any)[key];
      if (overrideValue !== undefined) {
        result[key] = mergeDeep((base as any)[key], overrideValue);
      }
    }
    return result;
  }
  return (override as unknown as T) ?? base;
}

async function isAdminRequest(): Promise<boolean> {
  try {
    const session = await useSession<{ authed?: boolean }>({
      password: process.env.SESSION_SECRET!,
      ...SESSION_CONFIG,
    });
    return !!session.data.authed;
  } catch {
    return false;
  }
}

/** Always current, but costs one advanced Blob operation per call. */
async function readViaList(): Promise<Partial<SiteContent> | null> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
  const found = blobs.find((b) => b.pathname === BLOB_PATHNAME);
  if (!found) return null;
  // Vercel Blob's CDN enforces a minimum ~60s edge cache regardless of
  // cacheControlMaxAge, so busting with the blob's own upload timestamp is what
  // makes a save visible immediately.
  const bust = new Date(found.uploadedAt).getTime();
  const res = await fetch(`${found.url}?v=${bust}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as Partial<SiteContent>;
}

/** Free, but can be up to one CDN cache window (~60s) behind the latest save. */
async function readDirect(): Promise<Partial<SiteContent> | null> {
  const res = await fetch(CONTENT_URL);
  if (!res.ok) return null;
  return (await res.json()) as Partial<SiteContent>;
}

export const getContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  try {
    // Admins — including the preview pane inside /admin, which carries the same
    // session cookie — must see a save straight away. Visitors can be a cache
    // window behind, which keeps page views off the billed operation quota.
    const stored = (await isAdminRequest())
      ? await readViaList()
      : // Falling back keeps the site rendering if the fixed URL ever stops
        // resolving, at the cost of one operation.
        ((await readDirect()) ?? (await readViaList()));
    if (!stored) return defaultContent;
    return mergeDeep(defaultContent, stored);
  } catch (err) {
    console.error("getContent failed, falling back to defaults", err);
    return defaultContent;
  }
});

export const saveContent = createServerFn({ method: "POST" })
  .validator((data: SiteContent) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });
    return { ok: true };
  });

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export const uploadImage = createServerFn({ method: "POST" })
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const file = data.get("file");
    const slot = data.get("slot");
    if (!(file instanceof File)) throw new Error("Keine Datei erhalten.");
    if (typeof slot !== "string" || !slot) throw new Error("Kein Bildplatz angegeben.");
    if (!file.type.startsWith("image/")) throw new Error("Bitte eine Bilddatei hochladen.");
    if (file.size > MAX_IMAGE_BYTES) throw new Error("Bild ist zu gross (max. 8 MB).");

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const blob = await put(`images/${slot}-${Date.now()}.${ext}`, file, {
      access: "public",
      contentType: file.type,
    });
    return { url: blob.url };
  });
