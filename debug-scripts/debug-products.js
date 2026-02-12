/**
 * Debug script to check actual product categorySlugs in database
 */

const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const client = new ConvexHttpClient(CONVEX_URL);

async function debugProducts() {
  try {
    // Query all sections
    const sections = await client.query('catalog:listCatalogSections', {});
    
    console.log('\n=== CHECKING APT PRODUCTS ===\n');
    
    // Find firstaid section
    const firstAidSection = sections.find(s => s.slug === 'firstaid');
    
    if (firstAidSection) {
      console.log(`firstaid category found: ${firstAidSection.items.length} products`);
      if (firstAidSection.items.length > 0) {
        for (const item of firstAidSection.items) {
          console.log(`  - ${item.Kod}: ${item.Nazwa}`);
        }
      }
    } else {
      console.log('firstaid category NOT FOUND in sections');
    }
    
    // Check all categories for APT products
    console.log('\n=== SEARCHING FOR APT/APT1 IN ALL CATEGORIES ===\n');
    
    let foundApt = false;
    for (const section of sections) {
      const aptProducts = section.items.filter(item => 
        item.Kod && (item.Kod.toUpperCase() === 'APT' || item.Kod.toUpperCase() === 'APT1')
      );
      
      if (aptProducts.length > 0) {
        foundApt = true;
        console.log(`Found in category "${section.slug}":`);
        for (const p of aptProducts) {
          console.log(`  - ${p.Kod}: ${p.Nazwa}`);
        }
      }
    }
    
    if (!foundApt) {
      console.log('⚠️  APT products NOT FOUND in any category!');
      console.log('They may have been inserted with a different categorySlug value.');
    }
    
    // List all categories
    console.log('\n=== ALL CATEGORIES ===\n');
    for (const section of sections) {
      console.log(`${section.slug}: ${section.items.length} products`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

debugProducts();
