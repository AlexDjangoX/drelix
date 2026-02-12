/**
 * Verification script to test categorization of Kartoteki2.csv
 * Run with: node verify-categorization.js
 */

const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, 'data', 'Kartoteki2.csv');
const rulesPath = path.join(__dirname, 'public', 'catalogCategoryRules.json');

// Simple CSV parser for semicolon-separated values
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

// Categorization logic (copied from catalogCategorize.ts)
function calculateMatchScore(row, config) {
  if (config.slug === 'other') return 0.1;

  const nazwaUpper = (row['Nazwa'] || '').toUpperCase();
  const kodUpper = (row['Kod'] || '').trim().toUpperCase();
  let score = 0;

  // Exact Kod match
  if (config.exactKods?.length) {
    if (config.exactKods.some(k => k.trim().toUpperCase() === kodUpper)) {
      return 1000;
    }
  }

  // KOD Prefix Match
  if (config.kodPrefixes?.length) {
    for (const prefix of config.kodPrefixes) {
      const pUpper = prefix.toUpperCase();
      if (kodUpper.startsWith(pUpper)) {
        score += 10 + pUpper.length;
      }
    }
  }

  // NAZWA Keyword Match
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

  return { slug: bestSlug, score: highestScore };
}

// Main verification
try {
  const csvBuffer = fs.readFileSync(csvPath);
  const rows = parseCSV(csvBuffer);
  
  const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
  const rules = rulesData.rules;
  const excludeKods = rulesData.excludeKods || [];
  
  const excludeSet = new Set(excludeKods.map(k => k.trim().toUpperCase()));
  
  // Filter excluded products
  const includedRows = rows.filter(row => {
    const kod = (row['Kod'] || '').trim().toUpperCase();
    return !excludeSet.has(kod);
  });
  
  // Categorize all products
  const categoryCounts = {};
  const uncategorizedProducts = [];
  const lowScoreProducts = [];
  
  for (const row of includedRows) {
    const { slug, score } = getCategoryForRow(row, rules);
    
    categoryCounts[slug] = (categoryCounts[slug] || 0) + 1;
    
    if (slug === 'other') {
      uncategorizedProducts.push({
        kod: row['Kod'],
        nazwa: row['Nazwa'],
        score
      });
    } else if (score < 15) {
      lowScoreProducts.push({
        kod: row['Kod'],
        nazwa: row['Nazwa'],
        category: slug,
        score
      });
    }
  }
  
  console.log('\n=== CATEGORIZATION REPORT FOR KARTOTEKI2.CSV ===\n');
  console.log(`Total products in CSV: ${rows.length}`);
  console.log(`Excluded products: ${rows.length - includedRows.length}`);
  console.log(`Products to categorize: ${includedRows.length}\n`);
  
  console.log('Products per category:');
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  for (const [slug, count] of sortedCategories) {
    console.log(`  ${slug}: ${count} products`);
  }
  
  console.log(`\n=== PRODUCTS IN "OTHER" CATEGORY (${uncategorizedProducts.length}) ===`);
  if (uncategorizedProducts.length > 0) {
    uncategorizedProducts.slice(0, 20).forEach(p => {
      console.log(`  ${p.kod} - ${p.nazwa.substring(0, 60)}`);
    });
    if (uncategorizedProducts.length > 20) {
      console.log(`  ... and ${uncategorizedProducts.length - 20} more`);
    }
  } else {
    console.log('  None! All products are categorized.');
  }
  
  console.log(`\n=== LOW CONFIDENCE MATCHES (score < 15, ${lowScoreProducts.length}) ===`);
  if (lowScoreProducts.length > 0) {
    lowScoreProducts.slice(0, 20).forEach(p => {
      console.log(`  ${p.kod} → ${p.category} (score: ${p.score}) - ${p.nazwa.substring(0, 50)}`);
    });
    if (lowScoreProducts.length > 20) {
      console.log(`  ... and ${lowScoreProducts.length - 20} more`);
    }
  } else {
    console.log('  None! All categorized products have good confidence.');
  }
  
  console.log('\n=== SUMMARY ===');
  const otherPercent = ((categoryCounts['other'] || 0) / includedRows.length * 100).toFixed(1);
  console.log(`✓ ${includedRows.length - (categoryCounts['other'] || 0)} products properly categorized`);
  console.log(`⚠ ${categoryCounts['other'] || 0} products in "other" (${otherPercent}%)`);
  
  if (otherPercent > 5) {
    console.log('\n⚠️  WARNING: More than 5% of products are in "other" category.');
    console.log('   Consider adding more category rules to improve categorization.');
  } else {
    console.log('\n✅ Categorization looks good!');
  }
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
