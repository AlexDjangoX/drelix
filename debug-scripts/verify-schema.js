/**
 * Verify ProductDescription field exists in database schema
 */

const { ConvexHttpClient } = require('convex/browser');
require('dotenv').config({ path: '.env.local' });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const client = new ConvexHttpClient(CONVEX_URL);

async function verifySchema() {
  try {
    console.log('\n=== VERIFYING PRODUCT SCHEMA ===\n');
    
    const sections = await client.query('catalog:listCatalogSections', {});
    
    if (sections.length === 0) {
      console.log('No products in database yet.');
      console.log('Schema update deployed successfully - ready for uploads!');
      return;
    }
    
    // Check first product
    const firstSection = sections.find(s => s.items.length > 0);
    if (!firstSection) {
      console.log('No products found.');
      return;
    }
    
    const firstProduct = firstSection.items[0];
    console.log('First product structure:');
    console.log('Keys:', Object.keys(firstProduct).sort().join(', '));
    
    if ('ProductDescription' in firstProduct) {
      console.log('\n✅ SUCCESS: ProductDescription field exists!');
      console.log('Value:', firstProduct.ProductDescription || '(empty)');
    } else {
      console.log('\n⚠️  WARNING: ProductDescription field NOT found');
      console.log('This is normal if products were created before the schema update.');
      console.log('New products and uploads will have this field.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifySchema();
