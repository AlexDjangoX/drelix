# Debug Scripts

This folder contains utility scripts for debugging and maintaining the product catalog system.

## Available Scripts

### 1. check-product.js
**Purpose**: Test how a specific product gets categorized based on the rules.

**Usage**:
```bash
node debug-scripts/check-product.js "PRODUCT_KOD"
```

**Example**:
```bash
node debug-scripts/check-product.js "PASTA"
node debug-scripts/check-product.js "BPÓŁ205OB"
```

**Output**: Shows the product details, scores for each category, and the winning category.

---

### 2. check-db-product.js
**Purpose**: Query the database for a specific product and show its current category.

**Usage**:
```bash
node debug-scripts/check-db-product.js "PRODUCT_KOD"
```

**Example**:
```bash
node debug-scripts/check-db-product.js "PASTA DOBUTÓW"
```

**Output**: Shows the product's current category in the database, or reports if not found.

---

### 3. verify-categorization.js
**Purpose**: Validate all products in the CSV against the categorization rules. Identifies products that end up in "other" category or have low confidence scores.

**Usage**:
```bash
node debug-scripts/verify-categorization.js
```

**Output**: 
- List of all products grouped by category
- Products that ended up in "other" category
- Products with low confidence scores
- Summary statistics

**Use this**: After updating `catalogCategoryRules.json` to verify all products are correctly categorized.

---

### 4. extract-exact-kods.js
**Purpose**: Extract all product KODs from the current database and populate the `exactKods` field in `catalogCategoryRules.json` for each category. This makes categorization 100% deterministic for existing products.

**Usage**:
```bash
node debug-scripts/extract-exact-kods.js
```

**⚠️ Warning**: This script overwrites `exactKods` in the rules file based on the **current database state**. Only run this when you're confident the database has correct categorizations.

**Output**: Updates `public/catalogCategoryRules.json` with all current product KODs as exact matches.

**Use this**: 
- After manually fixing miscategorizations in the database
- To lock in current categorizations as the source of truth
- Before deploying to production to ensure consistency

---

### 5. verify-schema.js
**Purpose**: Check that the database schema includes all expected product fields.

**Usage**:
```bash
node debug-scripts/verify-schema.js
```

**Output**: Confirms all product fields exist in the database schema, or reports missing fields.

**Use this**: After adding new product fields to verify the schema was updated correctly.

---

## Requirements

All scripts require:
- Node.js installed
- `npm install` dependencies
- `.env.local` file with `NEXT_PUBLIC_CONVEX_URL` set

## Notes

- Scripts use Windows-1250 encoding for CSV files (matching production behavior)
- `check-product.js` and `verify-categorization.js` read from `data/Kartoteki2.csv`
- `check-db-product.js`, `extract-exact-kods.js`, and `verify-schema.js` query the live Convex database
