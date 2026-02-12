/**
 * Check if product exists in database and its current category
 */

const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const client = new ConvexHttpClient(CONVEX_URL);

async function checkProduct() {
  try {
    const kod = process.argv[2] || 'BPÓŁ205OB';
    
    console.log(`\nSearching for product: ${kod}\n`);
    
    const sections = await client.query('catalog:listCatalogSections', {});
    
    let found = false;
    
    for (const section of sections) {
      const product = section.items.find(item => item.Kod === kod);
      
      if (product) {
        found = true;
        console.log(`✓ FOUND in category: "${section.slug}"`);
        console.log(`  Kod: ${product.Kod}`);
        console.log(`  Nazwa: ${product.Nazwa}`);
        console.log(`  Category: ${section.slug} (${section.titleKey})`);
        break;
      }
    }
    
    if (!found) {
      console.log(`✗ Product "${kod}" NOT FOUND in database`);
      console.log('\nThis product is not in the current upload.');
      console.log('It may have been in a previous upload but not in Kartoteki2.csv');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkProduct();
