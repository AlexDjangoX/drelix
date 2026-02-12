const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const csvPath = path.join(__dirname, '..', 'data', 'Kartoteki2.csv');
const rulesPath = path.join(__dirname, '..', 'public', 'catalogCategoryRules.json');

function parseCSV(buffer) {
  const text = iconv.decode(buffer, 'win1250');
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

function calculateMatchScore(row, config) {
  const nazwaUpper = (row['Nazwa'] || '').toUpperCase();
  const kodUpper = (row['Kod'] || '').trim().toUpperCase();
  let score = 0;
  
  if (config.exactKods?.length) {
    const match = config.exactKods.some(k => {
      const trimmedK = k.trim().toUpperCase();
      const matches = trimmedK === kodUpper;
      if (config.slug === 'other' && kodUpper.includes('PASTA')) {
        console.log(`  [DEBUG] Checking "${k}" === "${row['Kod']}" -> ${matches}`);
      }
      return matches;
    });
    if (match) {
      if (config.slug === 'other') {
        console.log(`  [DEBUG] ✓ EXACT MATCH for ${config.slug}!`);
      }
      return 1000;
    }
  }
  
  if (config.slug === 'other') return 0.1;
  
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
        score += kwScore;
      }
    }
  }
  return score;
}

const kod = process.argv[2] || 'BPÓŁ205OB';

const csvBuffer = fs.readFileSync(csvPath);
const rows = parseCSV(csvBuffer);
const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
const rules = rulesData.rules;

const product = rows.find(r => r['Kod'].includes(kod));

if (!product) {
  console.log(`Product ${kod} not found`);
  process.exit(1);
}

console.log('\nProduct:', product['Kod'], '-', product['Nazwa']);
console.log('\nScores per category:\n');

let bestSlug = 'other';
let bestScore = 0;

for (const config of rules) {
  const score = calculateMatchScore(product, config);
  if (score > 0) {
    console.log(`${config.slug.padEnd(25)} ${score}`);
  }
  if (score > bestScore) {
    bestScore = score;
    bestSlug = config.slug;
  }
}

console.log(`\n>>> Winner: ${bestSlug} (score: ${bestScore})`);
