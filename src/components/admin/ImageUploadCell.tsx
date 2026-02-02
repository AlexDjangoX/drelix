'use client';

import React, {
  startTransition,
  useState,
  useOptimistic,
  useRef,
  useEffect,
} from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import Image from 'next/image';
import { Ban, CircleCheckBig, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { base64ToBlob, PLACEHOLDER_PRODUCT_IMAGE } from '@/utils/utils';
import type { CatalogRow } from '@/lib/types/types';

type ImageDisplayState = { thumbnailUrl: string; imageUrl: string };

type Props = { row: CatalogRow };

export function ImageUploadCell({ row }: Props) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const optimisticBlobUrlRef = useRef<string | null>(null);
  const generateUploadUrl = useMutation(api.catalog.generateUploadUrl);
  const updateProductImage = useMutation(api.catalog.updateProductImage);
  const clearProductImage = useMutation(api.catalog.clearProductImage);

  const kod = row['Kod'] ?? '';
  const nazwa = row['Nazwa'] ?? '';
  const imageUrl = row['imageUrl'];
  const thumbnailUrl = row['thumbnailUrl'];
  const hasImage = !!(thumbnailUrl || imageUrl);

  const actualState: ImageDisplayState = {
    thumbnailUrl: thumbnailUrl ?? '',
    imageUrl: imageUrl ?? '',
  };
  const [optimisticState, addOptimistic] = useOptimistic(
    actualState,
    (state, opt: Partial<ImageDisplayState>) => ({ ...state, ...opt })
  );
  const displayThumb =
    optimisticState.thumbnailUrl ||
    optimisticState.imageUrl ||
    PLACEHOLDER_PRODUCT_IMAGE;

  useEffect(() => {
    return () => {
      if (optimisticBlobUrlRef.current) {
        URL.revokeObjectURL(optimisticBlobUrlRef.current);
      }
    };
  }, []);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Proszę wybrać plik graficzny');
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    optimisticBlobUrlRef.current = blobUrl;
    startTransition(() => {
      addOptimistic({ thumbnailUrl: blobUrl, imageUrl: blobUrl });
    });
    setUploading(true);
    const toastId = toast.loading('Przesyłanie zdjęcia...');
    try {
      const formData = new FormData();
      formData.set('image', file);
      if (kod) formData.set('kod', kod);
      if (nazwa) formData.set('nazwa', nazwa);
      const processRes = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });
      if (!processRes.ok) {
        const text = await processRes.text();
        toast.error(text || 'Błąd przetwarzania obrazu', { id: toastId });
        return;
      }
      const { thumbnail, large } = (await processRes.json()) as {
        thumbnail: { base64: string; filename: string };
        large: { base64: string; filename: string };
      };
      const thumbnailBlob = base64ToBlob(thumbnail.base64, 'image/webp');
      const largeBlob = base64ToBlob(large.base64, 'image/webp');

      const [thumbUrl, largeUrl] = await Promise.all([
        generateUploadUrl(),
        generateUploadUrl(),
      ]);
      const [thumbUploadRes, largeUploadRes] = await Promise.all([
        fetch(thumbUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'image/webp' },
          body: thumbnailBlob,
        }),
        fetch(largeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'image/webp' },
          body: largeBlob,
        }),
      ]);
      if (!thumbUploadRes.ok || !largeUploadRes.ok) {
        toast.error('Nie udało się przesłać plików do magazynu', {
          id: toastId,
        });
        return;
      }
      const { storageId: thumbnailStorageId } = await thumbUploadRes.json();
      const { storageId } = await largeUploadRes.json();

      await updateProductImage({
        kod,
        storageId,
        thumbnailStorageId,
      });
      toast.success('Zdjęcie zostało zaktualizowane', { id: toastId });
    } catch (e) {
      console.error('Upload failed', e);
      toast.error('Nie udało się przesłać zdjęcia', { id: toastId });
    } finally {
      setUploading(false);
      setDragOver(false);
      if (optimisticBlobUrlRef.current) {
        URL.revokeObjectURL(optimisticBlobUrlRef.current);
        optimisticBlobUrlRef.current = null;
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasImage) setConfirmingDelete(true);
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDelete(false);
  };

  const handleDeleteConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDelete(false);
    setDeleting(true);
    const toastId = toast.loading('Usuwanie zdjęcia...');
    try {
      await clearProductImage({ kod });
      toast.success('Zdjęcie zostało usunięte', { id: toastId });
    } catch (err) {
      console.error('Delete image failed', err);
      toast.error('Nie udało się usunąć zdjęcia', { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
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
        className={`relative w-16 h-16 shrink-0 rounded border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
          dragOver
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/30'
        }`}
      >
        {uploading || deleting ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <Image src={displayThumb} alt={nazwa} fill className="object-cover" />
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>
      {hasImage && (
        <div className="flex min-w-20 items-center gap-1.5 shrink-0">
          {confirmingDelete ? (
            <>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteCancel}
                className="rounded cursor-pointer p-1.5 text-green-600 hover:bg-green-600/20 disabled:opacity-50 transition-colors dark:text-green-400 dark:hover:bg-green-400/20"
                title="Anuluj"
                aria-label="Anuluj"
              >
                <Ban className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="rounded cursor-pointer p-1.5 text-destructive hover:bg-destructive/20 disabled:opacity-50 transition-colors"
                title="Potwierdź usunięcie"
                aria-label="Potwierdź usunięcie"
              >
                <CircleCheckBig className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="rounded cursor-pointer p-1.5 bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors"
              title="Usuń zdjęcie"
              aria-label="Usuń zdjęcie"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
