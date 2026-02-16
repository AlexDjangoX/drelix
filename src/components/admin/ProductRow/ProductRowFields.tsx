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
      {DISPLAY_KEYS.map(({ key }) => {
        const isPriceWithUnit = key === "CenaNetto";
        const source = editing ? draft : row;
        const displayValue = isPriceWithUnit
          ? (source.CenaNetto ?? "—") + (source.JednostkaMiary ? " / " + source.JednostkaMiary : "")
          : source[key] ?? "—";
        return (
          <td
            key={key}
            className="p-2 align-middle border-r border-border/50 text-center"
          >
            {editing && !isPriceWithUnit ? (
              <Input
                value={draft[key] ?? ""}
                onChange={(e) => onFieldChange(key, e.target.value)}
                className="h-8 text-sm"
                disabled={saving}
              />
            ) : (
              <span className="text-sm">{displayValue}</span>
            )}
          </td>
        );
      })}
    </>
  );
}
