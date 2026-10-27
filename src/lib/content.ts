import { createServerFn } from "@tanstack/react-start";
import { getJson, putJson, putObject, publicUrl } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";

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
  consultoriasText: string;
  servicios: {
    heading: string;
    subheading: string;
    services: { title: string; text: string; bullets?: string[] }[];
    spezial: { title: string; text: string }[];
    spezialHeading: string;
    bannerHeading: string;
    bannerText: string;
  };
  kiContent: {
    heading: string;
    description: string;
  };
  clientesHeading: string;
  clientesText: string;
  leistungenTeaser: {
    heading: string;
    description: string;
  };
  kontaktCta: {
    label: string;
    heading: string;
  };
  contactoHeading: string;
  /** The small amber labels above each section heading. */
  sectionLabels: Record<string, string>;
  branding: { heading: string; paragraph: string };
  contact: { address: string; email: string; phone: string; instagram: string; linkedin: string };
  /** CSS object-position per image slot, so Liza can reframe a crop herself. */
  imagePositions: Record<string, string>;
  images: {
    lizaPortrait: string | null;
    consultoria1: string | null;
    consultoria2: string | null;
    serviciosBanner: string | null;
    service1: string | null;
    service2: string | null;
    service3: string | null;
    spezial1: string | null;
    spezial2: string | null;
    spezial3: string | null;
    spezial4: string | null;
    bannerVideo: string | null;
  };
};

export const IMAGE_SLOTS = ["lizaPortrait", "consultoria1", "consultoria2", "serviciosBanner", "service1", "service2", "service3", "spezial1", "spezial2", "spezial3", "spezial4", "bannerVideo"] as const;
export type ImageSlot = (typeof IMAGE_SLOTS)[number];

export const defaultContent: SiteContent = {
  published: true,
  hero: {
    badge: "Teufen, Schweiz",
    title: "Gemeinsam stellen wir uns Ihr Unternehmen vor, inspirieren und gestalten es neu",
    subtitle:
      "Kostenlose Beratung für Unternehmer. Wir kümmern uns um Kundenservice, digitales Marketing und Branding, damit sich Ihr Unternehmen wirklich abhebt.",
  },
  about: {
    heading: "Von der Idee bis zur Positionierung - Strategie, Marketing und Kommunikation *aus einer Hand*.",
    paragraph1:
      "Bei LF Marketing & Business Consulting helfen wir bestehenden und zukünftigen Unternehmen, ihren Kundenservice zu verbessern und sich von anderen Anbietern abzuheben.",
    paragraph2:
      "Wir verbinden strategische Beratung, digitales Marketing und Branding, um Unternehmen mit eigener Identität, menschlichem Fokus und messbaren Ergebnissen aufzubauen.",
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
  consultoriasText: "Personal, Strategisch und praxisnah.",
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
      {
        title: "Digitale Lösungen, die Ihr Unternehmen weiterbringen",
        text: "Ich unterstütze Unternehmen dabei, passende digitale Lösungen für ihre individuellen Anforderungen zu finden. Ich verstehe Ihre Ziele, berate Sie zu den Möglichkeiten und koordiniere die Zusammenarbeit mit meinem Entwicklerteam – von der ersten Idee bis zur fertigen Lösung.",
      },
    ],
  },
  kiContent: {
    heading: "Die *digitale Zukunft* für Unternehmen im Appenzellerland.",
    description: "Wir bringen künstliche Intelligenz und moderne Software zu Unternehmen in Appenzell und der Ostschweiz. Sehen Sie im Video, wie wir Ideen mit Technologie verbinden.",
  },
  clientesHeading: "Marken, die uns bereits vertrauen.",
  clientesText:
    "Ich unterstütze Unternehmen dabei, ihre Identität sichtbar zu machen – von der Logoentwicklung bis zur individuellen Marketing- und Kommunikationslösung.",
  leistungenTeaser: {
    heading: "Alles, was Ihre Marke braucht.",
    description: "Von digitalem Marketing bis Geschäftsstrategie: integrierte Lösungen für nachhaltiges Wachstum.",
  },
  kontaktCta: {
    label: "Bereit für den nächsten Schritt?",
    heading: "Lassen Sie uns über Ihr Unternehmen sprechen.",
  },
  contactoHeading: "Sprechen wir über Ihren *nächsten Schritt*.",
  sectionLabels: {
    about: "Über mich",
    liza: "Die Gründerin",
    beratung: "Beratung",
    leistungen: "Leistungen",
    branding: "Branding",
    clientes: "Kunden, Partner & Referenzen",
    kontakt: "Kontakt",
  },
  branding: {
    heading: "Wir gestalten nicht nur Anzeigen. Wir bauen *Marken mit Seele*.",
    paragraph:
      "Wir betrachten Ihr Unternehmen als Ganzes. Dabei prüfen wir, was Ihre Zielgruppe braucht, welche Trends wichtig sind und wohin Sie sich entwickeln möchten. So stellen wir das passende Paket für Sie zusammen, mit Texten, Bildern und Videos, mit der Planung von Kampagnen und mit der Pflege Ihrer Gemeinschaft in den sozialen Netzwerken.",
  },
  contact: {
    address: "Gfell 1002, 9053 Teufen, Schweiz",
    email: "info@lf-business-consulting.com",
    phone: "+41 77 471 70 06",
    instagram: "",
    linkedin: "",
  },
  imagePositions: {},
  images: {
    lizaPortrait: null,
    consultoria1: null,
    consultoria2: null,
    serviciosBanner: null,
    service1: null,
    service2: null,
    service3: null,
    spezial1: null,
    spezial2: null,
    spezial3: null,
    spezial4: null,
    bannerVideo: null,
  },
};

const CONTENT_KEY = "site-content.json";

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

async function loadDevFixture(): Promise<Partial<SiteContent> | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    return JSON.parse(await readFile("content-live.json", "utf8")) as Partial<SiteContent>;
  } catch {
    return null; // not exported yet — fall through to defaults
  }
}

export const getContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  try {
    // In dev the blob store is unreachable (no read-only token exists, and we
    // deliberately keep a writable one off the laptop). content-live.json is a
    // read-only export of the live site, so local pages show Liza's real text.
    if (import.meta.env?.DEV) {
      const fixture = await loadDevFixture();
      if (fixture) return mergeDeep(defaultContent, fixture);
    }
    // R2 reads are authenticated and uncached, so a save is visible on the very
    // next request — no admin/visitor split and no cache busting needed.
    const stored = await getJson<Partial<SiteContent>>(CONTENT_KEY);
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
    await putJson(CONTENT_KEY, data);
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
    const isVideo = file.type.startsWith("video/");
    if (!file.type.startsWith("image/") && !isVideo) throw new Error("Bitte eine Bild- oder Videodatei hochladen.");
    if (file.size > MAX_IMAGE_BYTES) throw new Error("Datei ist zu gross (max. 8 MB).");

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const key = `images/${slot}-${Date.now()}.${ext}`;
    await putObject(key, await file.arrayBuffer(), file.type);
    return { url: publicUrl(key) };
  });
