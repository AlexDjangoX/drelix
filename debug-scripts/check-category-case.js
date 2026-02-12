/**
 * Check for case sensitivity issues in category slugs
 */

const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const client = new ConvexHttpClient(CONVEX_URL);

async function checkCategories() {
  try {
    const sections = await client.query('catalog:listCatalogSections', {});
    
    console.log('\n=== CURRENT DATABASE CATEGORY SLUGS ===\n');
    
    for (const section of sections) {
      console.log(`${section.slug} (${section.items.length} products) - titleKey: ${section.titleKey}`);
    }
    
    console.log('\n=== CHECKING FOR CASE MISMATCHES ===\n');
    
    const problematicSlugs = sections.filter(s => 
      s.slug !== s.slug.toLowerCase() || 
      s.slug.includes('_') || 
      s.slug.match(/[A-Z]/)
    );
    
    if (problematicSlugs.length > 0) {
      console.log('⚠️  Found categories with uppercase or special characters:');
      for (const s of problematicSlugs) {
        console.log(`  ${s.slug}`);
      }
    } else {
      console.log('✓ All category slugs are lowercase');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkCategories();
