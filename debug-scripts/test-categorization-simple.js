/**
 * Simple test to verify APT products will be categorized correctly
 */

const fs = require('fs');
const path = require('path');

// Load rules
const rulesPath = path.join(__dirname, 'public', 'catalogCategoryRules.json');
const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
const rules = rulesData.rules;

// Test APT product
const aptProduct = {
  'Kod': 'APT',
  'Nazwa': 'APTECZKA DIN',
  'Stawka VAT': '8%'
};

// Find matching rule
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
  let matchedRule = null;
  
  for (const config of rules) {
    const score = calculateMatchScore(row, config);
    if (score > highestScore) {
      highestScore = score;
      bestSlug = config.slug;
      matchedRule = config;
    }
  }
  
  return { slug: bestSlug, score: highestScore, rule: matchedRule };
}

console.log('\n=== TESTING APT PRODUCT CATEGORIZATION ===\n');
console.log('Product:', aptProduct);

const result = getCategoryForRow(aptProduct, rules);

console.log('\nCategorization Result:');
console.log(`  Category Slug: "${result.slug}"`);
console.log(`  Match Score: ${result.score}`);
if (result.rule) {
  console.log(`  Rule TitleKey: ${result.rule.titleKey}`);
  console.log(`  Rule Keywords: ${result.rule.keywords?.join(', ') || 'none'}`);
  console.log(`  Rule Kod Prefixes: ${result.rule.kodPrefixes?.join(', ') || 'none'}`);
}

console.log('\n=== RESULT ===');
if (result.slug === 'firstaid') {
  console.log('✅ SUCCESS: APT product will be categorized as "firstaid"');
} else {
  console.log(`❌ FAIL: APT product categorized as "${result.slug}" instead of "firstaid"`);
}

// Also check the exact slug in rules
console.log('\n=== CHECKING FIRSTAID RULE ===');
const firstAidRule = rules.find(r => r.slug === 'firstaid');
if (firstAidRule) {
  console.log('✅ firstaid rule found (lowercase)');
  console.log(`   Keywords: ${firstAidRule.keywords.join(', ')}`);
  console.log(`   Prefixes: ${firstAidRule.kodPrefixes.join(', ')}`);
} else {
  console.log('❌ firstaid rule NOT FOUND - checking for camelCase...');
  const camelCaseRule = rules.find(r => r.slug === 'firstAid');
  if (camelCaseRule) {
    console.log('⚠️  Found "firstAid" (camelCase) - THIS IS THE PROBLEM!');
    console.log('   The rule needs to be lowercase "firstaid" to match database');
  }
}
