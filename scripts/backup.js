const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const backupsDir = path.join(process.cwd(), "backups");
const now = new Date();
const dateStr = now.toISOString().slice(0, 10); // 2025-02-20
const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ""); // 132745
const filename = `backup-${dateStr}-${timeStr}.zip`;
const outPath = path.join(backupsDir, filename);

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

console.log(`Exporting Convex data to ${filename}...`);
const result = spawnSync("npx", ["convex", "export", "--path", outPath], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
