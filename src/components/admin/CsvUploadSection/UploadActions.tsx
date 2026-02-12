import { Button } from "@/components/ui/button";
import { Save, X, Loader2 } from "lucide-react";

type Props = {
  file: File | null;
  loading: boolean;
  previewSections: unknown[] | null;
  onProcessUpload: () => void;
  onCancelPreview: () => void;
  onClearFile: () => void;
};

export function UploadActions({
  file,
  loading,
  previewSections,
  onProcessUpload,
  onCancelPreview,
  onClearFile,
}: Props) {
  if (previewSections) {
    return (
      <div className="mt-4 flex gap-3">
        <Button
          onClick={onProcessUpload}
          disabled={loading}
          className="gap-2 bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Zatwierdź i wyślij do bazy
        </Button>
        <Button
          variant="outline"
          onClick={onCancelPreview}
          disabled={loading}
          className="gap-2 cursor-pointer"
        >
          <X className="w-4 h-4" />
          Anuluj
        </Button>
      </div>
    );
  }

  if (file) {
    return (
      <div className="mt-4 flex gap-3">
        <Button
          variant="outline"
          onClick={onClearFile}
          className="cursor-pointer"
        >
          Wyczyść
        </Button>
      </div>
    );
  }

  return null;
}
