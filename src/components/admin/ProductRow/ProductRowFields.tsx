import { Input } from "@/components/ui/input";
import { DISPLAY_KEYS, type CatalogRow } from "@/lib/types";

type Props = {
  editing: boolean;
  row: CatalogRow;
  draft: CatalogRow;
  saving: boolean;
  onFieldChange: (key: string, value: string) => void;
};

export function ProductRowFields({
  editing,
  row,
  draft,
  saving,
  onFieldChange,
}: Props) {
  return (
    <>
      {DISPLAY_KEYS.map(({ key }) => (
        <td key={key} className="p-2 align-top border-r border-border/50">
          {editing ? (
            <Input
              value={draft[key] ?? ""}
              onChange={(e) => onFieldChange(key, e.target.value)}
              className="h-8 text-sm"
              disabled={saving}
            />
          ) : (
            <span className="text-sm">{row[key] ?? "—"}</span>
          )}
        </td>
      ))}
    </>
  );
}
