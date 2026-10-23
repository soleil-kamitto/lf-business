import { getStore, type Store } from "@netlify/blobs";

/**
 * Object storage on Netlify Blobs.
 *
 * Reads here are plain store reads, not a billed "advanced operation" the way
 * Vercel Blob's list() was, so there is no quota reason to route reads through
 * a cached public URL. Every read is current, which is why the admin/visitor
 * split and the cache-busting the Vercel version needed are gone.
 *
 * Blobs are private: unlike Vercel Blob there is no public URL per object, so
 * images are served through the /api/media route below (see publicUrl).
 */

const STORE_NAME = "site";

let store: Store | null = null;

function getBlobStore(): Store {
  if (store) return store;
  // Inside the Netlify runtime the store configures itself. Outside it — `vite
  // dev` on this laptop — it needs explicit credentials.
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  store = siteID && token ? getStore({ name: STORE_NAME, siteID, token }) : getStore(STORE_NAME);
  return store;
}

/** URL the browser uses to fetch a stored image. */
export function publicUrl(key: string): string {
  return `/api/media/${key}`;
}

/** Reads a stored object as bytes. Returns null when it does not exist. */
export async function getBytes(key: string): Promise<ArrayBuffer | null> {
  return (await getBlobStore().get(key, { type: "arrayBuffer" })) ?? null;
}

/** Reads the content type stored alongside an object. */
export async function getContentType(key: string): Promise<string | null> {
  const meta = await getBlobStore().getMetadata(key);
  const type = meta?.metadata?.contentType;
  return typeof type === "string" ? type : null;
}

/** Reads and parses a JSON object. Returns null when absent or unparseable. */
export async function getJson<T>(key: string): Promise<T | null> {
  try {
    return (await getBlobStore().get(key, { type: "json" })) ?? null;
  } catch {
    return null;
  }
}

export async function putJson(key: string, value: unknown): Promise<void> {
  await getBlobStore().setJSON(key, value);
}

export async function putObject(key: string, body: ArrayBuffer, contentType: string): Promise<void> {
  // The content type is not inferred on read, so it rides along as metadata and
  // /api/media hands it back.
  await getBlobStore().set(key, body, { metadata: { contentType } });
}
