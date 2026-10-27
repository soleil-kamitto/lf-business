// Read-only export of the live content into a local fixture.
//
//   node scripts/snapshot-content.mjs
//
// Netlify offers no read-only token (a Personal Access Token can also write,
// across the whole account) and `netlify dev` deliberately uses an empty local
// store, so exporting to a fixture is the documented way to develop against
// real data. Nothing here can write to the store: it only reads the HTML the
// server already sends to every visitor.
//
// Writes content-live.json (gitignored). getContent() picks it up in dev only.
import { writeFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const SITE = "https://www.lf-business-consulting.com";

const html = await (await fetch(SITE + "/leistungen", { cache: "no-store" })).text();

// TanStack serialises the loader payload as `$_TSR.router=(($R)=>...)($R["tsr"])`
// with back-references, so rebuilding it by eval in a sandbox is far more
// reliable than pattern-matching the nested objects.
const start = html.indexOf("$_TSR.router=");
if (start === -1) throw new Error("Kein Router-Payload gefunden.");
const expr = html.slice(start + "$_TSR.router=".length, html.indexOf(")($R[", start) + 1);

const sandbox = { $R: {} };
let router;
try {
  router = runInNewContext(`(${expr})({})`, sandbox);
} catch (err) {
  throw new Error(`Payload liess sich nicht lesen: ${err.message}`);
}

// The content object is whichever loader result carries `hero`.
const seen = new Set();
function findContent(node) {
  if (!node || typeof node !== "object" || seen.has(node)) return null;
  seen.add(node);
  if (node.hero && node.contact && node.images) return node;
  for (const v of Object.values(node)) {
    const hit = findContent(v);
    if (hit) return hit;
  }
  return null;
}

const content = findContent(router);
if (!content) throw new Error("Inhalt im Payload nicht gefunden.");

await writeFile("content-live.json", JSON.stringify(content, null, 2), "utf8");
console.log("content-live.json geschrieben.");
console.log("Hero:", content.hero?.title?.slice(0, 60));
console.log("Spezialgebiete:", (content.servicios?.spezial || []).map((s) => s.title).join(" | "));
