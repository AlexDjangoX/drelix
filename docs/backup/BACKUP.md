# Convex database backup

Back up your Convex database so admin work (products, categories, images metadata) is safe and restorable.

## Option 1: Dashboard (one-off backup)

1. Open [Convex Dashboard](https://dashboard.convex.dev) and select your deployment.
2. Go to **Settings → Backups** (or **Deployment settings → Backups**).
3. Click **Backup Now**.
4. When it finishes, use **Download** to get the ZIP.

- Manual backups are kept **7 days**.
- On Free/Starter, you can have **up to 2 backups** per deployment at a time.
- The ZIP is named `snapshot_{timestamp}.zip` and contains all table data (e.g. `documents.jsonl`) and optionally file storage.

## Option 2: Command line (scriptable / local folder)

From the project root:

```bash
npm run backup
```

This runs a script that exports Convex data into the `backups/` folder with a clear name: **`backup-YYYY-MM-DD-HHMMSS.zip`** (e.g. `backup-2025-02-20-132745.zip`). The folder is gitignored.

To use a different directory:

```bash
npx convex export --path ./my-backups
# or
npx convex export --path ~/Downloads
```

Use the same deployment as your current Convex config (e.g. `.env.local` / `CONVEX_DEPLOYMENT`). For production, run from a machine that has the production Convex project linked.

## What’s in the backup

- **Included:** All table documents (products, categories, subcategories, imageDimensions, etc.) in JSONL form; optionally file storage (images) if you enable it.
- **Not included:** Environment variables, scheduled functions, and your code (those live in the repo and dashboard).

## Restore

- **From the dashboard:** Open **Settings → Backups**, open the backup’s menu, choose **Restore**. Restore replaces current data with the backup.
- **From a ZIP file:**  
  `npx convex import --path ./backups/snapshot_1234567890.zip`  
  (see [Convex import docs](https://docs.convex.dev/database/import-export/import)).

Always take a fresh backup before restoring; restore is destructive.

## Automatic backups (Convex Pro)

On a **Convex Pro** plan you can turn on **Settings → Backups → Backup automatically** (daily or weekly, with retention). This is the best option for ongoing safety without manual runs.
