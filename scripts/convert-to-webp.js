/**
 * Converts all images in backups/product-images/more-images-homepage
 * to WebP format and saves them in backups/product-images/webp.
 *
 * Usage: node scripts/convert-to-webp.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_DIR = path.join(
  process.cwd(),
  "backups",
  "product-images",
  "more-images-homepage"
);
const OUT_DIR = path.join(process.cwd(), "backups", "product-images", "webp");

const SUPPORTED_EXT = [".jpg", ".jpeg", ".png", ".gif", ".JPG", ".PNG", ".GIF"];

async function convertToWebp() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error("Source directory not found:", SOURCE_DIR);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => {
    const ext = path.extname(f);
    return SUPPORTED_EXT.includes(ext);
  });

  if (files.length === 0) {
    console.log("No images to convert in", SOURCE_DIR);
    return;
  }

  console.log(`Converting ${files.length} images to WebP...`);

  for (const file of files) {
    const srcPath = path.join(SOURCE_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const outPath = path.join(OUT_DIR, `${baseName}.webp`);

    try {
      await sharp(srcPath)
        .webp({ quality: 85, lossless: false })
        .toFile(outPath);
      console.log(`  ✓ ${file} → ${baseName}.webp`);
    } catch (err) {
      console.error(`  ✗ ${file}:`, err.message);
    }
  }

  console.log("Done.");
}

convertToWebp().catch((err) => {
  console.error(err);
  process.exit(1);
});
