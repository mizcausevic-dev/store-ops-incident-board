// Deploy-time SEO head injection (Claude Code / Platform-SRE lane).
// Post-processes the prerendered site/*.html to add a meta description +
// OpenGraph + Twitter Card tags into <head>, WITHOUT editing src/render.ts.
// Reads the page <title> and the repo's package.json description; og:url from CNAME.
// Usage: node scripts/seo-meta.mjs <domain>   (skips silently if no domain)
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const domain = process.argv[2] || "";
if (!domain) {
  console.log("seo-meta: no domain — skipping");
  process.exit(0);
}

const desc = (() => {
  try {
    return (JSON.parse(readFileSync("package.json", "utf8")).description || "")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
})();

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

if (!existsSync("site")) {
  console.log("seo-meta: no site/ dir");
  process.exit(0);
}

let count = 0;
for (const f of readdirSync("site").filter((x) => x.endsWith(".html"))) {
  const p = `site/${f}`;
  let html = readFileSync(p, "utf8");
  if (html.includes('property="og:title"')) continue; // idempotent
  const m = html.match(/<title>([^<]*)<\/title>/);
  const title = m ? m[1].trim() : domain;
  const page = f === "index.html" ? "" : f;
  const url = `https://${domain}/${page}`;
  const tags = [
    `<meta name="description" content="${esc(desc)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:site_name" content="Kinetic Gain">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`
  ].join("\n  ");
  html = html.replace("</head>", `  ${tags}\n</head>`);
  writeFileSync(p, html);
  count++;
}
console.log(`seo-meta: injected OG/Twitter/description into ${count} pages for ${domain}`);
