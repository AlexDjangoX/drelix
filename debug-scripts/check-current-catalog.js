/**
 * Check current catalog in database
 * Run with: node check-current-catalog.js
 */

const { ConvexHttpClient } = require('convex/browser');
const fs = require('fs');
const path = require('path');

// Load environment
require('dotenv').config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error('Error: NEXT_PUBLIC_CONVEX_URL not found in .env.local');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function checkCatalog() {
  try {
    console.log('\n=== CHECKING CURRENT DATABASE CATALOG ===\n');
    
    // Query current catalog sections
    const sections = await client.query('catalog:listCatalogSections', {});
    
    console.log(`Total categories in database: ${sections.length}\n`);
    
    const categoryCounts = {};
    let totalProducts = 0;
    
    for (const section of sections) {
      const count = section.items.length;
      categoryCounts[section.slug] = count;
      totalProducts += count;
      
      console.log(`${section.slug}: ${count} products`);
      if (section.displayName) {
        console.log(`  (Custom category: "${section.displayName}")`);
      }
    }
    
    console.log(`\nTotal products in database: ${totalProducts}`);
    
    // Now parse Kartoteki2.csv to see what we'll get
    console.log('\n=== COMPARING WITH KARTOTEKI2.CSV ===\n');
    
    const csvPath = path.join(__dirname, 'data', 'Kartoteki2.csv');
    const csvBuffer = fs.readFileSync(csvPath);
    const rulesPath = path.join(__dirname, 'public', 'catalogCategoryRules.json');
    const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
    
    // Simple CSV parser
    function parseCSV(buffer) {
      const text = buffer.toString('utf-8');
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(';').map(h => h.replace(/^"|"$/g, '').trim());
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';').map(v => v.replace(/^"|"$/g, '').trim());
        const row = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });
        rows.push(row);
      }
      return rows;
    }
    
    // Categorization logic
    function calculateMatchScore(row, config) {
      if (config.slug === 'other') return 0.1;
      const nazwaUpper = (row['Nazwa'] || '').toUpperCase();
      const kodUpper = (row['Kod'] || '').trim().toUpperCase();
      let score = 0;
      
      if (config.exactKods?.length) {
        if (config.exactKods.some(k => k.trim().toUpperCase() === kodUpper)) {
          return 1000;
        }
      }
      
      if (config.kodPrefixes?.length) {
        for (const prefix of config.kodPrefixes) {
          const pUpper = prefix.toUpperCase();
          if (kodUpper.startsWith(pUpper)) {
            score += 10 + pUpper.length;
          }
        }
      }
      
      if (config.keywords?.length) {
        for (const kw of config.keywords) {
          const kwUpper = kw.toUpperCase();
          if (nazwaUpper.includes(kwUpper)) {
            let kwScore = kwUpper.length * 5;
            const escapedKw = kwUpper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const wordRegex = new RegExp(
              `(?:^|[^A-ZĄĆĘŁŃÓŚŹŻ])(${escapedKw})(?:$|[^A-ZĄĆĘŁŃÓŚŹŻ])`,
              'i'
            );
            if (wordRegex.test(nazwaUpper)) {
              kwScore += 50;
            }
            score += kwScore;
          }
        }
      }
      return score;
    }
    
    function getCategoryForRow(row, rules) {
      let bestSlug = 'other';
      let highestScore = 0;
      for (const config of rules) {
        const score = calculateMatchScore(row, config);
        if (score > highestScore) {
          highestScore = score;
          bestSlug = config.slug;
        }
      }
      return bestSlug;
    }
    
    const rows = parseCSV(csvBuffer);
    const rules = rulesData.rules;
    const excludeKods = rulesData.excludeKods || [];
    const excludeSet = new Set(excludeKods.map(k => k.trim().toUpperCase()));
    
    const includedRows = rows.filter(row => {
      const kod = (row['Kod'] || '').trim().toUpperCase();
      return !excludeSet.has(kod);
    });
    
    const csvCategoryCounts = {};
    for (const row of includedRows) {
      const slug = getCategoryForRow(row, rules);
      csvCategoryCounts[slug] = (csvCategoryCounts[slug] || 0) + 1;
    }
    
    console.log('Categories that will have products after upload:');
    const csvCategories = Object.keys(csvCategoryCounts).sort((a, b) => 
      csvCategoryCounts[b] - csvCategoryCounts[a]
    );
    
    for (const slug of csvCategories) {
      console.log(`  ${slug}: ${csvCategoryCounts[slug]} products`);
    }
    
    // Find categories that will lose products
    console.log('\n=== CATEGORIES THAT WILL LOSE PRODUCTS ===\n');
    
    const categoriesLosingProducts = [];
    const categoriesGainingProducts = [];
    const categoriesUnchanged = [];
    
    for (const slug of Object.keys(categoryCounts)) {
      const currentCount = categoryCounts[slug];
      const newCount = csvCategoryCounts[slug] || 0;
      
      if (newCount === 0 && currentCount > 0) {
        categoriesLosingProducts.push({ slug, currentCount, newCount });
      } else if (newCount !== currentCount) {
        if (newCount > currentCount) {
          categoriesGainingProducts.push({ slug, currentCount, newCount });
        } else {
          categoriesLosingProducts.push({ slug, currentCount, newCount });
        }
      } else {
        categoriesUnchanged.push({ slug, count: currentCount });
      }
    }
    
    if (categoriesLosingProducts.length > 0) {
      console.log('⚠️  Categories losing products:');
      for (const { slug, currentCount, newCount } of categoriesLosingProducts) {
        console.log(`  ${slug}: ${currentCount} → ${newCount} (${newCount === 0 ? 'EMPTY!' : 'loss of ' + (currentCount - newCount)})`);
      }
    } else {
      console.log('✓ No categories will lose products');
    }
    
    if (categoriesGainingProducts.length > 0) {
      console.log('\n✓ Categories gaining products:');
      for (const { slug, currentCount, newCount } of categoriesGainingProducts) {
        console.log(`  ${slug}: ${currentCount} → ${newCount} (+${newCount - currentCount})`);
      }
    }
    
    // Check for new categories from CSV
    console.log('\n=== NEW CATEGORIES FROM CSV ===\n');
    const newCategories = csvCategories.filter(slug => !categoryCounts.hasOwnProperty(slug));
    if (newCategories.length > 0) {
      console.log('New categories that will be added:');
      for (const slug of newCategories) {
        console.log(`  ${slug}: ${csvCategoryCounts[slug]} products`);
      }
    } else {
      console.log('No new categories will be added');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  } finally {
    client.close();
  }
}

checkCatalog();
