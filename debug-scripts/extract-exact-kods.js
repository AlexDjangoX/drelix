/**
 * Extract all product KODs from database and generate exactKods for each category
 */

const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const client = new ConvexHttpClient(CONVEX_URL);

async function extractExactKods() {
  try {
    console.log("\n=== EXTRACTING EXACT KODS FROM DATABASE ===\n");

    const sections = await client.query("catalog:listCatalogSections", {});

    const categoryKods = {};

    for (const section of sections) {
      if (section.items.length === 0) continue;

      const kods = section.items.map((item) => item.Kod).sort();
      categoryKods[section.slug] = kods;

      console.log(`${section.slug}: ${kods.length} products`);
    }

    console.log(
      `\nTotal categories with products: ${Object.keys(categoryKods).length}`,
    );
    console.log(`Total products: ${Object.values(categoryKods).flat().length}`);

    // Load current rules
    const rulesPath = path.join(
      __dirname,
      "..",
      "public",
      "catalogCategoryRules.json",
    );
    const rulesData = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

    // Update rules with exactKods
    for (const rule of rulesData.rules) {
      if (categoryKods[rule.slug]) {
        rule.exactKods = categoryKods[rule.slug];
      }
    }

    // Save updated rules
    fs.writeFileSync(rulesPath, JSON.stringify(rulesData, null, 2), "utf-8");

    console.log(
      "\n✅ Updated catalogCategoryRules.json with exactKods for all products",
    );
    console.log("   Categorization is now 100% deterministic!");

    // Print summary
    console.log("\n=== SUMMARY BY CATEGORY ===\n");
    for (const rule of rulesData.rules) {
      if (rule.exactKods && rule.exactKods.length > 0) {
        console.log(
          `${rule.slug.padEnd(30)} ${rule.exactKods.length} exactKods`,
        );
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

extractExactKods();
