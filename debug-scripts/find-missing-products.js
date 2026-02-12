/**
 * Find products that are in the database but not in Kartoteki2.csv
 * Run with: node find-missing-products.js
 */

const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error('Error: NEXT_PUBLIC_CONVEX_URL not found in .env.local');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function findMissingProducts() {
  try {
    // Get current database catalog
    const sections = await client.query('catalog:listCatalogSections', {});
    
    // Parse Kartoteki2.csv
    const csvPath = path.join(__dirname, 'data', 'Kartoteki2.csv');
    const csvBuffer = fs.readFileSync(csvPath);
    const text = csvBuffer.toString('utf-8');
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(';').map(h => h.replace(/^"|"$/g, '').trim());
    const csvRows = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';').map(v => v.replace(/^"|"$/g, '').trim());
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      csvRows.push(row);
    }
    
    // Create set of product codes in CSV
    const csvKods = new Set(csvRows.map(r => r['Kod']?.trim().toUpperCase()).filter(Boolean));
    
    console.log('\n=== PRODUCTS IN DATABASE BUT NOT IN KARTOTEKI2.CSV ===\n');
    console.log(`Total products in database: ${sections.reduce((sum, s) => sum + s.items.length, 0)}`);
    console.log(`Total products in CSV: ${csvRows.length}`);
    console.log(`Unique product codes in CSV: ${csvKods.size}\n`);
    
    const missingByCategory = {};
    let totalMissing = 0;
    
    for (const section of sections) {
      const missing = [];
      
      for (const item of section.items) {
        const kod = item.Kod?.trim().toUpperCase();
        if (kod && !csvKods.has(kod)) {
          missing.push({
            kod: item.Kod,
            nazwa: item.Nazwa
          });
        }
      }
      
      if (missing.length > 0) {
        missingByCategory[section.slug] = missing;
        totalMissing += missing.length;
      }
    }
    
    if (totalMissing === 0) {
      console.log('✓ No missing products! All database products are in the CSV.');
      return;
    }
    
    console.log(`⚠️  Found ${totalMissing} products in database that are NOT in Kartoteki2.csv:\n`);
    
    const sortedCategories = Object.keys(missingByCategory).sort((a, b) => 
      missingByCategory[b].length - missingByCategory[a].length
    );
    
    for (const slug of sortedCategories) {
      const missing = missingByCategory[slug];
      console.log(`\n${slug} (${missing.length} missing products):`);
      console.log('─'.repeat(80));
      
      for (const { kod, nazwa } of missing) {
        console.log(`  ${kod.padEnd(20)} ${nazwa.substring(0, 55)}`);
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`\nTOTAL MISSING: ${totalMissing} products`);
    console.log('\n⚠️  These products exist in the database but will be DELETED when you upload Kartoteki2.csv');
    console.log('   because they are not present in that CSV file.\n');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

findMissingProducts();
