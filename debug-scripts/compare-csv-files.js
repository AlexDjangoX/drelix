/**
 * Compare Kartoteki_1.csv and Kartoteki2.csv
 * Run with: node compare-csv-files.js
 */

const fs = require('fs');
const path = require('path');

function parseCSV(filePath) {
  const buffer = fs.readFileSync(filePath);
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

const csv1Path = path.join(__dirname, 'data', 'Kartoteki_1.csv');
const csv2Path = path.join(__dirname, 'data', 'Kartoteki2.csv');

const csv1Rows = parseCSV(csv1Path);
const csv2Rows = parseCSV(csv2Path);

const csv1Kods = new Set(csv1Rows.map(r => r['Kod']?.trim().toUpperCase()).filter(Boolean));
const csv2Kods = new Set(csv2Rows.map(r => r['Kod']?.trim().toUpperCase()).filter(Boolean));

console.log('\n=== CSV FILE COMPARISON ===\n');
console.log(`Kartoteki_1.csv: ${csv1Rows.length} products (${csv1Kods.size} unique codes)`);
console.log(`Kartoteki2.csv: ${csv2Rows.length} products (${csv2Kods.size} unique codes)`);

// Products in CSV1 but not in CSV2
const inCsv1NotInCsv2 = [];
for (const row of csv1Rows) {
  const kod = row['Kod']?.trim().toUpperCase();
  if (kod && !csv2Kods.has(kod)) {
    inCsv1NotInCsv2.push(row);
  }
}

// Products in CSV2 but not in CSV1
const inCsv2NotInCsv1 = [];
for (const row of csv2Rows) {
  const kod = row['Kod']?.trim().toUpperCase();
  if (kod && !csv1Kods.has(kod)) {
    inCsv2NotInCsv1.push(row);
  }
}

console.log(`\n✓ Products in BOTH files: ${csv1Kods.size - inCsv1NotInCsv2.length}`);
console.log(`⚠  Only in Kartoteki_1.csv: ${inCsv1NotInCsv2.length}`);
console.log(`⚠  Only in Kartoteki2.csv: ${inCsv2NotInCsv1.length}`);

if (inCsv1NotInCsv2.length > 0) {
  console.log('\n=== PRODUCTS ONLY IN KARTOTEKI_1.CSV ===\n');
  for (const row of inCsv1NotInCsv2.slice(0, 20)) {
    console.log(`  ${row['Kod'].padEnd(20)} ${row['Nazwa'].substring(0, 50)}`);
  }
  if (inCsv1NotInCsv2.length > 20) {
    console.log(`  ... and ${inCsv1NotInCsv2.length - 20} more`);
  }
}

if (inCsv2NotInCsv1.length > 0) {
  console.log('\n=== PRODUCTS ONLY IN KARTOTEKI2.CSV ===\n');
  for (const row of inCsv2NotInCsv1.slice(0, 20)) {
    console.log(`  ${row['Kod'].padEnd(20)} ${row['Nazwa'].substring(0, 50)}`);
  }
  if (inCsv2NotInCsv1.length > 20) {
    console.log(`  ... and ${inCsv2NotInCsv1.length - 20} more`);
  }
}

// Check for the missing products from database
const missingFromDb = [
  'BPÓŁU207SB', 'BPÓŁHARBOR', 'BPÓŁAIRVENT', 'BPÓŁBP', 'BPÓŁFLUO', 'BPÓŁMAXPOP',
  'BPÓŁ205OB', 'BPÓŁ216', 'BPÓŁ250S1', 'BPÓŁ203S1', 'BPÓŁ212', 'BPÓŁ224',
  'BPÓŁ261S1', 'BPÓŁ212OB', 'BPÓŁ203OB', 'BPÓŁ214', 'BPÓŁ201OB', 'BPÓŁ9010',
  'BPÓŁ241', 'BPÓŁRAZOR', 'BPÓŁ246', 'BPÓŁ249', 'BPÓŁ252OB', 'BPÓŁ261OB',
  'BPÓŁBTEX', 'BPÓŁLONGLIFE', 'BPÓŁ234', 'BPÓŁANTYS1', 'BPOŁ318', 'BPÓŁ1171',
  'WKŁ FILC', 'PASTA DOBUTÓW', 'WKŁADKI', 'WKŁADKI PLASTIK', 'WKŁADKI MROZOOD',
  'WKŁWĘGIEL', 'WKŁADKI ANBA', 'RĘCZ70/140 1', 'RĘCZ50/90', 'RĘCZ70/140',
  'R-NITŻDABSTER', 'R-NITŻ', 'R-RLŻ', 'R-ŻABA', 'CZAPDOĆ', 'FPŁB'
];

console.log('\n=== CHECKING MISSING DB PRODUCTS ===\n');

let foundInCsv1 = 0;
let foundInCsv2 = 0;
let notInEither = 0;

for (const kod of missingFromDb) {
  const kodUpper = kod.trim().toUpperCase();
  const inCsv1 = csv1Kods.has(kodUpper);
  const inCsv2 = csv2Kods.has(kodUpper);
  
  if (inCsv1 && !inCsv2) foundInCsv1++;
  if (inCsv2 && !inCsv1) foundInCsv2++;
  if (!inCsv1 && !inCsv2) notInEither++;
}

console.log(`✓ Found in Kartoteki_1.csv but not in Kartoteki2.csv: ${foundInCsv1} products`);
console.log(`✗ Found in Kartoteki2.csv but not in Kartoteki_1.csv: ${foundInCsv2} products`);
console.log(`✗ Not found in either CSV file: ${notInEither} products`);

console.log('\n=== RECOMMENDATION ===\n');

if (foundInCsv1 > 30) {
  console.log('✅ SOLUTION: Use Kartoteki_1.csv instead of Kartoteki2.csv');
  console.log('   Kartoteki_1.csv contains most of the missing products.');
  console.log(`   This will preserve ${foundInCsv1} products that would otherwise be lost.`);
} else {
  console.log('⚠️  Neither CSV file contains all your database products.');
  console.log('   You may need to merge both CSV files or update your data source.');
}
