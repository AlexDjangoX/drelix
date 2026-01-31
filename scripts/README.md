# Scripts

## Shop catalog pipeline

The shop owner provides a CSV export; these scripts turn it into JSON used by the site.

### 1. Replace the CSV

Put the new file at **`src/data/Kartoteki.csv`** (overwrite the existing one).  
Encoding: Windows-1250 (Polish) is expected; the script decodes it to UTF-8.

### 2. Run the pipeline

From the project root:

```bash
npm run build-catalog
```

This runs:

1. **`csv-to-json`** – Reads `src/data/Kartoteki.csv`, writes `src/data/Kartoteki.json` (full catalog, UTF-8).
2. **`split-catalog`** – Reads `Kartoteki.json` + `scripts/catalogCategoryRules.json`, writes:
   - `src/data/catalog/categories.json` – list of `{ slug, titleKey }` in display order
   - `src/data/catalog/{slug}.json` – one file per category (e.g. `gloves.json`, `footwear.json`)

### 3. Commit

Commit the updated `Kartoteki.csv`, `Kartoteki.json`, and `src/data/catalog/*.json`.

---

### Individual commands

- **`npm run csv-to-json`** – CSV → `Kartoteki.json` only.
- **`npm run split-catalog`** – `Kartoteki.json` → `catalog/*.json` (run after csv-to-json).

---

### Changing categories

Edit **`scripts/catalogCategoryRules.json`**. Each entry has:

- **`slug`** – filename and key (e.g. `gloves`, `footwear`).
- **`titleKey`** – translation key for the section title (e.g. `productNames.gloves`).
- **`keywords`** – strings to match in the product name (`Nazwa`). First matching category wins.
- **`kodPrefixes`** (optional) – product code (`Kod`) prefixes that assign to this category.

Order of entries = display order. Re-run **`npm run split-catalog`** after changing rules.

---

### Product images

By convention, image path = **`public/{categorySlug}/{Kod}.jpg`** (e.g. `public/gloves/R-BAW.jpg`). Name files after the product Kod and put them in the category folder under `public/`. Missing images show a placeholder.

---

### How the app uses it

- **Full catalog page** (`/products`): imports `getCatalogGroupedByCategory()` from `@/data/catalog` (reads all category JSONs; image path = `/{categorySlug}/{Kod}.jpg`).
- **Single category**: import `getCatalogBySlug('gloves')` from `@/data/catalog`, or import `@/data/catalog/gloves.json` directly for that category only.
