/**
 * Download all data and images from Convex, persisting images into
 * backups/product-images/Large/ and backups/product-images/Thumbnails/.
 *
 * Prerequisites:
 *   - .env.local with NEXT_PUBLIC_CONVEX_URL
 *   - Convex deployment must be running (npx convex dev or deployed)
 *
 * Usage:
 *   node scripts/download-export.js
 *   # or with dotenv:
 *   npx dotenv -e .env.local -- node scripts/download-export.js
 *
 * Output:
 *   - backups/export-YYYY-MM-DD-HHMMSS/data.json (products, categories, subcategories)
 *   - backups/export-YYYY-MM-DD-HHMMSS/manifest.json (image-to-product mapping)
 *   - backups/product-images/Large/*.webp
 *   - backups/product-images/Thumbnails/*.webp
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

try {
  require("dotenv").config({ path: ".env.local" });
} catch {
  // dotenv optional
}

const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error(
    "Error: NEXT_PUBLIC_CONVEX_URL or CONVEX_URL must be set (e.g. in .env.local)"
  );
  process.exit(1);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function downloadToFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath, { flags: "w" });
    protocol
      .get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          const redirect = res.headers.location;
          file.close();
          fs.unlinkSync(destPath);
          resolve(downloadToFile(redirect, destPath));
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        file.close();
        try {
          fs.unlinkSync(destPath);
        } catch {}
        reject(err);
      });
  });
}

async function main() {
  const { ConvexHttpClient } = require("convex/browser");

  const client = new ConvexHttpClient(CONVEX_URL);

  console.log("Fetching export data from Convex...");
  const result = await client.action("export:exportAllData", {});

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const exportDir = path.join(
    process.cwd(),
    "backups",
    `export-${dateStr}-${timeStr}`
  );
  const dataDir = path.join(exportDir, "data");
  const largeDir = path.join(process.cwd(), "backups", "product-images", "Large");
  const thumbDir = path.join(
    process.cwd(),
    "backups",
    "product-images",
    "Thumbnails"
  );

  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(largeDir, { recursive: true });
  fs.mkdirSync(thumbDir, { recursive: true });

  // Write data JSON
  const dataPayload = {
    exportedAt: new Date().toISOString(),
    products: result.products,
    categories: result.categories,
    subcategories: result.subcategories,
  };
  fs.writeFileSync(
    path.join(dataDir, "data.json"),
    JSON.stringify(dataPayload, null, 2),
    "utf8"
  );
  console.log(`  Wrote ${dataDir}/data.json`);

  // Write manifest
  fs.writeFileSync(
    path.join(exportDir, "manifest.json"),
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        imageCount: result.imageManifest.length,
        manifest: result.imageManifest,
      },
      null,
      2
    ),
    "utf8"
  );
  console.log(`  Wrote ${exportDir}/manifest.json`);

  // Download images
  const manifest = result.imageManifest;
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < manifest.length; i++) {
    const entry = manifest[i];
    const dir = entry.variant === "large" ? largeDir : thumbDir;
    const destPath = path.join(dir, entry.filename);

    try {
      await downloadToFile(entry.url, destPath);
      ok++;
      if ((i + 1) % 10 === 0 || i === manifest.length - 1) {
        process.stdout.write(`\r  Downloaded ${i + 1}/${manifest.length} images`);
      }
    } catch (err) {
      fail++;
      console.error(`\n  Failed: ${entry.filename} - ${err.message}`);
    }
  }

  console.log(`\n\nDone.`);
  console.log(`  Data: ${dataDir}/data.json`);
  console.log(`  Manifest: ${exportDir}/manifest.json`);
  console.log(`  Images: ${ok} saved to backups/product-images/{Large,Thumbnails}/`);
  if (fail > 0) {
    console.log(`  Failed: ${fail} images`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
