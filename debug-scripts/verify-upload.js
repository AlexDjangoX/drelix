/**
 * Post-Upload Verification Script
 * Run immediately after upload to verify APT products were inserted correctly
 * 
 * Usage: node verify-upload.js
 */

const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error('Error: NEXT_PUBLIC_CONVEX_URL not found in .env.local');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function verifyUpload() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('POST-UPLOAD VERIFICATION');
    console.log('='.repeat(80) + '\n');
    
    const sections = await client.query('catalog:listCatalogSections', {});
    
    // Find firstaid section
    const firstaidSection = sections.find(s => s.slug === 'firstaid');
    
    console.log('=== FIRSTAID CATEGORY ===\n');
    if (!firstaidSection) {
      console.log('❌ CRITICAL: "firstaid" category NOT FOUND in database!');
      console.log('   Available categories:', sections.map(s => s.slug).join(', '));
    } else {
      console.log(`✓ Category found: ${firstaidSection.items.length} products`);
      if (firstaidSection.items.length > 0) {
        for (const item of firstaidSection.items) {
          console.log(`  - ${item.Kod}: ${item.Nazwa}`);
        }
      } else {
        console.log('  ⚠️  Category exists but is EMPTY');
      }
    }
    
    // Search for APT products across ALL categories
    console.log('\n=== SEARCHING FOR APT PRODUCTS ACROSS ALL CATEGORIES ===\n');
    
    let totalAptProducts = 0;
    const aptLocations = [];
    
    for (const section of sections) {
      const aptProducts = section.items.filter(item => 
        item.Kod && item.Kod.toUpperCase().startsWith('APT')
      );
      
      if (aptProducts.length > 0) {
        totalAptProducts += aptProducts.length;
        for (const p of aptProducts) {
          aptLocations.push({
            category: section.slug,
            kod: p.Kod,
            nazwa: p.Nazwa
          });
        }
      }
    }
    
    if (totalAptProducts === 0) {
      console.log('❌ CRITICAL: NO APT PRODUCTS FOUND IN DATABASE!');
      console.log('   Expected: APT, APT1');
      console.log('   The products were lost during upload.');
    } else {
      console.log(`✓ Found ${totalAptProducts} APT products:`);
      for (const loc of aptLocations) {
        const isCorrect = loc.category === 'firstaid';
        const marker = isCorrect ? '✓' : '❌';
        console.log(`  ${marker} ${loc.kod} in category "${loc.category}" - ${loc.nazwa}`);
      }
      
      if (aptLocations.every(loc => loc.category === 'firstaid')) {
        console.log('\n✅ SUCCESS: All APT products are in the correct category!');
      } else {
        console.log('\n⚠️  WARNING: Some APT products are in the wrong category!');
      }
    }
    
    // Summary
    console.log('\n=== UPLOAD SUMMARY ===\n');
    console.log(`Total categories: ${sections.length}`);
    console.log(`Total products: ${sections.reduce((sum, s) => sum + s.items.length, 0)}`);
    console.log(`APT products found: ${totalAptProducts}`);
    console.log(`Expected APT products: 2 (APT, APT1)`);
    
    if (totalAptProducts === 2 && aptLocations.every(loc => loc.category === 'firstaid')) {
      console.log('\n✅✅✅ UPLOAD SUCCESSFUL! All APT products correctly categorized. ✅✅✅');
    } else {
      console.log('\n❌❌❌ UPLOAD FAILED! APT products missing or miscategorized. ❌❌❌');
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

verifyUpload();
