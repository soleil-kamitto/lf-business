// Uploads the content rescued from Vercel Blob into Netlify Blobs.
//
// Run once, after the Netlify site exists:
//   NETLIFY_SITE_ID=... NETLIFY_API_TOKEN=... node scripts/seed-blobs.mjs
//
// Safe to re-run: it overwrites both keys with whatever is in backup-blob/.
import { getStore } from "@netlify/blobs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const backupDir = resolve(here, "../../backup-blob");

const siteID = process.env.NETLIFY_SITE_ID;
const token = process.env.NETLIFY_API_TOKEN;
if (!siteID || !token) {
  console.error("Faltan NETLIFY_SITE_ID y/o NETLIFY_API_TOKEN.");
  process.exit(1);
}

const store = getStore({ name: "site", siteID, token });

for (const file of ["site-content.json", "analytics-history.json"]) {
  const raw = await readFile(resolve(backupDir, file), "utf8");
  await store.setJSON(file, JSON.parse(raw));
  console.log(`subido: ${file} (${raw.length} bytes)`);
}

console.log("listo.");
