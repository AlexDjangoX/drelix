"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Save, X, Loader2 } from "lucide-react";
import type { CatalogSection } from "@/lib/types";

type Props = {
  file: File | null;
  dragOver: boolean;
  loading: boolean;
  previewSections: CatalogSection[] | null;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessUpload: () => void;
  onCancelPreview: () => void;
  onClearFile: () => void;
};

export function CsvUploadSection({
  file,
  dragOver,
  loading,
  previewSections,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
  onProcessUpload,
  onCancelPreview,
  onClearFile,
}: Props) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold mb-3">
        {previewSections ? "Podgląd nowego katalogu" : "Procesuj nowy plik CSV"}
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        {previewSections
          ? 'Przejrzyj poniższą listę. Jeśli wszystko się zgadza, kliknij "Zatwierdź i wyślij".'
          : "Wgraj plik CSV (eksport Kartoteki, Windows-1250, średnik). Zastąpi on obecny katalog w Convex."}
      </p>

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

      <div className="mt-4 flex gap-3">
        {previewSections ? (
          <>
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
          </>
        ) : (
          file && (
            <Button
              variant="outline"
              onClick={onClearFile}
              className="cursor-pointer"
            >
              Wyczyść
            </Button>
          )
        )}
      </div>
    </section>
  );
}
