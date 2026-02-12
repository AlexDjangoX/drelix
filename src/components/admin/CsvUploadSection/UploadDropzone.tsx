import { Upload, CheckCircle } from "lucide-react";

type Props = {
  file: File | null;
  dragOver: boolean;
  loading: boolean;
  previewSections: unknown[] | null;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function UploadDropzone({
  file,
  dragOver,
  loading,
  previewSections,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
}: Props) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragOver
          ? "border-primary bg-primary/5"
          : previewSections
            ? "border-green-500/50 bg-green-500/5"
            : "border-muted-foreground/30"
      }`}
    >
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={onFileChange}
        className="sr-only"
        id="csv-upload"
        disabled={loading}
      />
      <label
        htmlFor="csv-upload"
        className={
          loading
            ? "cursor-not-allowed"
            : "cursor-pointer block hover:opacity-90"
        }
      >
        {previewSections ? (
          <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-3" />
        ) : (
          <Upload className="w-10 h-10 mx-auto text-muted-foreground dark:text-orange-400 dark:hover:text-white mb-3 transition-colors" />
        )}
        <span className="text-foreground dark:text-orange-400 dark:hover:text-white font-medium transition-colors">
          {previewSections
            ? "Plik wczytany pomyślnie"
            : file
              ? file.name
              : "Przeciągnij i upuść plik CSV lub kliknij, aby wybrać"}
        </span>
        {previewSections && (
          <p className="text-xs text-muted-foreground mt-1">{file?.name}</p>
        )}
      </label>
    </div>
  );
}
