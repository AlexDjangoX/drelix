import { DISPLAY_KEYS } from "@/lib/types";

export function CatalogTableColumns() {
  return (
    <thead>
      <tr className="border-b border-border bg-muted/30">
        <th className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase w-20 border-r border-border/50">
          Photo
        </th>
        <th className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase w-32 border-r border-border/50">
          Category
        </th>
        {DISPLAY_KEYS.map(({ label, key }) => (
          <th
            key={key}
            className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase border-r border-border/50"
          >
            {label}
          </th>
        ))}
        <th className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase w-20 border-r border-border/50">
          Delete
        </th>
        <th className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase w-24 text-right">
          Actions
        </th>
      </tr>
    </thead>
  );
}
