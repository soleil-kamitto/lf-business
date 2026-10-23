import { createServerFn } from "@tanstack/react-start";
import { getJson, putJson } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";

// Vercel only guarantees a 30-day reporting window on the current plan, so every
// run copies the recent days into our own archive. The archive is what the admin
// panel reads, which also keeps the panel working if the Vercel API is down.
const ARCHIVE_KEY = "analytics-history.json";

// Re-pulling days we already have corrects figures Vercel revises late, and costs
// nothing because days are keyed by date.
const IMPORT_DAYS = 14;

const PROJECT_ID = "prj_Tw6VqEhQcVW4mfDlA6mKmxiFNPBe";
const TEAM_ID = "team_DMOlI98jE7Iy1qVHQEbkubJS";
const API = "https://api.vercel.com/v1/query/web-analytics";

export type DayRow = { date: string; pageviews: number; visitors: number };
export type NamedRow = { name: string; pageviews: number; visitors: number };

export type AnalyticsArchive = {
  days: Record<string, { pageviews: number; visitors: number }>;
  topPages: NamedRow[];
  topCountries: NamedRow[];
  topReferrers: NamedRow[];
  lastImport: string | null;
};

export type AnalyticsView = {
  status: "ok" | "no-token" | "no-data" | "token-invalid" | "error";
  message?: string;
  days: DayRow[];
  topPages: NamedRow[];
  topCountries: NamedRow[];
  topReferrers: NamedRow[];
  totals: { pageviews: number; visitors: number };
  last30: { pageviews: number; visitors: number };
  lastImport: string | null;
};

const emptyArchive: AnalyticsArchive = {
  days: {},
  topPages: [],
  topCountries: [],
  topReferrers: [],
  lastImport: null,
};

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function readArchive(): Promise<AnalyticsArchive> {
  try {
    const stored = await getJson<Partial<AnalyticsArchive>>(ARCHIVE_KEY);
    if (!stored) return emptyArchive;
    return { ...emptyArchive, ...stored };
  } catch {
    return emptyArchive;
  }
}

async function writeArchive(archive: AnalyticsArchive) {
  await putJson(ARCHIVE_KEY, archive);
}

async function vercelQuery(params: Record<string, string>) {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) throw new Error("NO_TOKEN");

  const url = new URL(`${API}/visits/aggregate`);
  url.searchParams.set("projectId", PROJECT_ID);
  url.searchParams.set("teamId", TEAM_ID);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    // Vercel explains auth failures in the body (scope, team mismatch, expiry).
    // Without it a 403 is indistinguishable from an expired token.
    const detail = await res.text().catch(() => "");
    throw new Error(`VERCEL_${res.status}: ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as { data?: Record<string, unknown>[] };
}

function toNamedRows(data: Record<string, unknown>[] | undefined, key: string): NamedRow[] {
  return (data ?? [])
    .map((r) => ({
      name: String(r[key] ?? "–"),
      pageviews: Number(r.pageviews ?? 0),
      visitors: Number(r.visitors ?? 0),
    }))
    .filter((r) => r.pageviews > 0);
}

/** Pulls the recent window from Vercel and merges it into the archive. */
async function importFromVercel(): Promise<AnalyticsArchive> {
  const until = new Date();
  const since = new Date(until.getTime() - IMPORT_DAYS * 86400_000);
  const range = { since: ymd(since), until: ymd(until) };

  const [daily, pages, countries, referrers] = await Promise.all([
    vercelQuery({ ...range, by: "day" }),
    vercelQuery({ ...range, by: "requestPath", limit: "10" }),
    vercelQuery({ ...range, by: "country", limit: "10" }),
    vercelQuery({ ...range, by: "referrerHostname", limit: "10" }),
  ]);

  const archive = await readArchive();

  for (const row of daily.data ?? []) {
    const ts = row.timestamp as string | undefined;
    if (!ts) continue;
    archive.days[ts.slice(0, 10)] = {
      pageviews: Number(row.pageviews ?? 0),
      visitors: Number(row.visitors ?? 0),
    };
  }

  archive.topPages = toNamedRows(pages.data, "requestPath");
  archive.topCountries = toNamedRows(countries.data, "country");
  archive.topReferrers = toNamedRows(referrers.data, "referrerHostname");
  archive.lastImport = new Date().toISOString();

  await writeArchive(archive);
  return archive;
}

function buildView(archive: AnalyticsArchive, status: AnalyticsView["status"], message?: string): AnalyticsView {
  const days: DayRow[] = Object.entries(archive.days)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const cutoff = ymd(new Date(Date.now() - 30 * 86400_000));
  const recent = days.filter((d) => d.date >= cutoff);
  const sum = (rows: DayRow[]) => ({
    pageviews: rows.reduce((n, d) => n + d.pageviews, 0),
    visitors: rows.reduce((n, d) => n + d.visitors, 0),
  });

  return {
    status: status === "ok" && days.length === 0 ? "no-data" : status,
    message,
    days,
    topPages: archive.topPages,
    topCountries: archive.topCountries,
    topReferrers: archive.topReferrers,
    totals: sum(days),
    last30: sum(recent),
    lastImport: archive.lastImport,
  };
}

/**
 * Admin panel data. Refreshes from Vercel opportunistically so the archive keeps
 * growing even if the daily cron stops running; a failed refresh still returns
 * whatever the archive already holds.
 */
export const getAnalytics = createServerFn({ method: "GET" }).handler(async (): Promise<AnalyticsView> => {
  await requireAdmin();
  try {
    return buildView(await importFromVercel(), "ok");
  } catch (err) {
    const code = err instanceof Error ? err.message : "error";
    const archive = await readArchive();
    if (code === "NO_TOKEN") {
      return buildView(archive, "no-token", "VERCEL_API_TOKEN ist nicht gesetzt.");
    }
    if (code.startsWith("VERCEL_401") || code.startsWith("VERCEL_403")) {
      return buildView(archive, "token-invalid", code);
    }
    return buildView(archive, "error", code);
  }
});

/** Called by the daily cron so the archive outlives Vercel's reporting window. */
export async function runAnalyticsImport() {
  const archive = await importFromVercel();
  return { ok: true, days: Object.keys(archive.days).length, lastImport: archive.lastImport };
}
