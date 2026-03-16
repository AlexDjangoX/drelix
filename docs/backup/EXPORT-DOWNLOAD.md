# Export data and download images

Create a local backup of all Convex data (products, categories, subcategories) and download all product images into `public/product-images/`. Non-destructive: read-only, does not modify Convex.

## Prerequisites

- `npx convex dev` running (or deployment already up to date)
- `.env.local` with `NEXT_PUBLIC_CONVEX_URL`

## Commands

### 1. Ensure Convex is deployed

```bash
npx convex dev
```

Leave it running briefly so the export action is pushed, or run `npx convex dev --once` if you prefer a one-off push.

### 2. Run the export + download script

```bash
npm run export:download
```

Or directly:

```bash
node scripts/download-export.js
```

## What it does

1. **Convex action** `exportAllData` – reads all products, categories, subcategories; generates temporary URLs for each image in storage.
2. **Script** – fetches the data, downloads each image via HTTP, saves to disk.

## Output

| Location | Contents |
|----------|----------|
| `backups/export-YYYY-MM-DD-HHMMSS/data/data.json` | Products, categories, subcategories (JSON) |
| `backups/export-YYYY-MM-DD-HHMMSS/manifest.json` | Image-to-product mapping (storageId → Kod, filename, etc.) |
| `public/product-images/large/*.webp` | Large images (1920px) |
| `public/product-images/thumbnails/*.webp` | Thumbnails (640px) |

## Incremental vs full download

**Current behavior: the script re-downloads all images every time.** It does not check for existing files or skip ones you already have. Each run overwrites the `large/` and `thumbnails/` folders with a fresh full set.

If you only added a few new products since the last run, you will still re-download everything. For ~480 images this takes about 2 minutes. If you need incremental downloads (only new images), the script would need to be updated to skip files that already exist.

## Where things live

- **`backups/`** – gitignored. Local only, not on GitHub or Vercel.
- **`public/product-images/large` and `thumbnails`** – in `.vercelignore` only. On GitHub, but excluded from Vercel deployments. The app uses Convex URLs, not these local files.
