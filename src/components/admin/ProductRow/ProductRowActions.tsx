import { Button } from "@/components/ui/button";
import { Pencil, Save, X, Loader2 } from "lucide-react";

type Props = {
  editing: boolean;
  saving: boolean;
  error: string | null;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ProductRowActions({
  editing,
  saving,
  error,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  return (
    <td className="p-2 align-top text-right">
      {error && (
        <span className="text-xs text-destructive mr-2" role="alert">
          {error}
        </span>
      )}
      {editing ? (
        <span className="flex gap-1 justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={saving}
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={saving}
            className="gap-1"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </Button>
        </span>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          aria-label="Edit"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      )}
    </td>
  );
}
