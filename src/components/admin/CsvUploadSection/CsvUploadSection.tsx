"use client";

import React from "react";
import type { CatalogSection } from "@/lib/types";
import { UploadDropzone } from "@/components/admin/CsvUploadSection/UploadDropzone";
import { UploadActions } from "@/components/admin/CsvUploadSection/UploadActions";

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

      <UploadDropzone
        file={file}
        dragOver={dragOver}
        loading={loading}
        previewSections={previewSections}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onFileChange={onFileChange}
      />

      <UploadActions
        file={file}
        loading={loading}
        previewSections={previewSections}
        onProcessUpload={onProcessUpload}
        onCancelPreview={onCancelPreview}
        onClearFile={onClearFile}
      />
    </section>
  );
}
