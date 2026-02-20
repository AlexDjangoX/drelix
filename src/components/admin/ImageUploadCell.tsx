"use client";

import React, {
  startTransition,
  useState,
  useOptimistic,
  useRef,
  useEffect,
} from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import Image from "next/image";
import { Ban, CircleCheckBig, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { base64ToBlob, PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/utils";
import type { CatalogRow, ProductImageUrl } from "@/lib/types";

function parseImagesJson(row: CatalogRow): ProductImageUrl[] {
  const raw = row["imagesJson"];
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is ProductImageUrl =>
        x != null &&
        typeof x === "object" &&
        typeof (x as ProductImageUrl).imageUrl === "string" &&
        typeof (x as ProductImageUrl).thumbnailUrl === "string",
    );
  } catch {
    return [];
  }
}

/** Fallback: first image from legacy imageUrl/thumbnailUrl */
function imagesFromRow(row: CatalogRow): ProductImageUrl[] {
  const fromJson = parseImagesJson(row);
  if (fromJson.length > 0) return fromJson;
  const imageUrl = row["imageUrl"];
  const thumbnailUrl = row["thumbnailUrl"];
  if (imageUrl || thumbnailUrl) {
    return [
      {
        imageUrl: imageUrl ?? thumbnailUrl ?? "",
        thumbnailUrl: thumbnailUrl ?? imageUrl ?? "",
      },
    ];
  }
  return [];
}

type Props = { row: CatalogRow };

export function ImageUploadCell({ row }: Props) {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [confirmingDeleteIndex, setConfirmingDeleteIndex] = useState<
    number | null
  >(null);
  const optimisticBlobUrlRef = useRef<string | null>(null);
  const generateUploadUrl = useMutation(api.catalog.generateUploadUrl);
  const addProductImage = useMutation(api.catalog.addProductImage);
  const removeProductImage = useMutation(api.catalog.removeProductImage);
  const clearProductImage = useMutation(api.catalog.clearProductImage);

  const kod = row["Kod"] ?? "";
  const nazwa = row["Nazwa"] ?? "";
  const actualImages = imagesFromRow(row);
  const [optimisticImages, setOptimisticImages] = useOptimistic(
    actualImages,
    (
      state: ProductImageUrl[],
      action: { type: "add"; url: ProductImageUrl } | { type: "remove"; index: number },
    ) => {
      if (action.type === "add") return [...state, action.url];
      return state.filter((_, i) => i !== action.index);
    },
  );
  useEffect(() => {
    return () => {
      if (optimisticBlobUrlRef.current) {
        URL.revokeObjectURL(optimisticBlobUrlRef.current);
      }
    };
  }, []);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Proszę wybrać plik graficzny");
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    optimisticBlobUrlRef.current = blobUrl;
    const optUrl: ProductImageUrl = { imageUrl: blobUrl, thumbnailUrl: blobUrl };
    startTransition(() => setOptimisticImages({ type: "add", url: optUrl }));
    setUploading(true);
    const toastId = toast.loading("Przesyłanie zdjęcia...");
    try {
      const formData = new FormData();
      formData.set("image", file);
      if (kod) formData.set("kod", kod);
      if (nazwa) formData.set("nazwa", nazwa);
      const processRes = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });
      if (!processRes.ok) {
        const text = await processRes.text();
        toast.error(text || "Błąd przetwarzania obrazu", { id: toastId });
        return;
      }
      const { thumbnail, large } = (await processRes.json()) as {
        thumbnail: { base64: string; filename: string };
        large: { base64: string; filename: string };
      };
      const thumbnailBlob = base64ToBlob(thumbnail.base64, "image/webp");
      const largeBlob = base64ToBlob(large.base64, "image/webp");

      const [thumbUrl, largeUrl] = await Promise.all([
        generateUploadUrl(),
        generateUploadUrl(),
      ]);
      const [thumbUploadRes, largeUploadRes] = await Promise.all([
        fetch(thumbUrl, {
          method: "POST",
          headers: { "Content-Type": "image/webp" },
          body: thumbnailBlob,
        }),
        fetch(largeUrl, {
          method: "POST",
          headers: { "Content-Type": "image/webp" },
          body: largeBlob,
        }),
      ]);
      if (!thumbUploadRes.ok || !largeUploadRes.ok) {
        toast.error("Nie udało się przesłać plików do magazynu", {
          id: toastId,
        });
        return;
      }
      const { storageId: thumbnailStorageId } = await thumbUploadRes.json();
      const { storageId } = await largeUploadRes.json();

      await addProductImage({
        kod,
        storageId,
        thumbnailStorageId,
      });
      toast.success("Zdjęcie zostało dodane", { id: toastId });
    } catch (e) {
      console.error("Upload failed", e);
      toast.error("Nie udało się przesłać zdjęcia", { id: toastId });
    } finally {
      setUploading(false);
      setDragOver(false);
      if (optimisticBlobUrlRef.current) {
        URL.revokeObjectURL(optimisticBlobUrlRef.current);
        optimisticBlobUrlRef.current = null;
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDeleteIndex(index);
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDeleteIndex(null);
  };

  const handleDeleteConfirm = async (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDeleteIndex(null);
    setDeletingIndex(index);
    const toastId = toast.loading("Usuwanie zdjęcia...");
    try {
      if (optimisticImages.length <= 1) {
        await clearProductImage({ kod });
      } else {
        await removeProductImage({ kod, index });
      }
      toast.success("Zdjęcie zostało usunięte", { id: toastId });
    } catch (err) {
      console.error("Delete image failed", err);
      toast.error("Nie udało się usunąć zdjęcia", { id: toastId });
    } finally {
      setDeletingIndex(null);
    }
  };

  const boxClass =
    "relative w-24 h-24 shrink-0 rounded border border-border overflow-hidden bg-muted/30 flex items-center justify-center";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {optimisticImages.map((img, index) => (
        <div key={index} className={boxClass}>
          <Image
            src={img.thumbnailUrl || img.imageUrl || PLACEHOLDER_PRODUCT_IMAGE}
            alt={`${nazwa} ${index + 1}`}
            fill
            className="object-cover"
          />
          {confirmingDeleteIndex === index ? (
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-background/90">
              <button
                type="button"
                disabled={deletingIndex !== null}
                onClick={(ev) => handleDeleteCancel(ev)}
                className="rounded p-1.5 text-green-600 hover:bg-green-600/20 disabled:opacity-50 dark:text-green-400"
                title="Anuluj"
                aria-label="Anuluj"
              >
                <Ban className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={deletingIndex !== null}
                onClick={(ev) => handleDeleteConfirm(ev, index)}
                className="rounded p-1.5 text-destructive hover:bg-destructive/20 disabled:opacity-50"
                title="Potwierdź usunięcie"
                aria-label="Potwierdź usunięcie"
              >
                <CircleCheckBig className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => handleDeleteClick(e, index)}
              disabled={deletingIndex !== null}
              className="absolute right-1 top-1 rounded p-1 bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors disabled:opacity-50"
              title="Usuń zdjęcie"
              aria-label="Usuń zdjęcie"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleUpload(file);
        }}
        className={`${boxClass} w-24 h-24 border-2 border-dashed cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-primary/10" : "border-muted-foreground/30"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Plus className="h-8 w-8 text-muted-foreground" aria-hidden />
            <input
              type="file"
              accept="image/*"
              aria-label="Dodaj zdjęcie produktu"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
