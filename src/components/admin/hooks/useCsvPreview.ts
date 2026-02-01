'use client';

import { useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { categorizeCatalog } from '@/lib/catalogCategorize';
import type { CategoryRule, CatalogSection } from '@/lib/types';
import { csvToRows } from '@/lib/csvParseClient';
import { toast } from 'sonner';

export function useCsvPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewSections, setPreviewSections] = useState<CatalogSection[] | null>(
    null
  );
  const replaceCatalog = useMutation(api.catalog.replaceCatalogFromSections);

  const handleFileSelect = useCallback(async (f: File) => {
    if (!f.name.endsWith('.csv') && f.type !== 'text/csv') {
      toast.error('Proszę wybrać plik CSV');
      return;
    }
    setFile(f);
    setLoading(true);
    const toastId = toast.loading('Parsowanie pliku...');

    try {
      const buffer = await f.arrayBuffer();
      const rawRows = csvToRows(buffer);

      const rows = rawRows.map((row) => ({
        Rodzaj: row['Rodzaj'] ?? '',
        JednostkaMiary: row['Jednostka miary'] ?? '',
        StawkaVAT: row['Stawka VAT'] ?? '',
        Kod: row['Kod'] ?? '',
        Nazwa: row['Nazwa'] ?? '',
        CenaNetto: row['Cena netto'] ?? '',
        KodKlasyfikacji: row['Kod klasyfikacji'] ?? '',
        Uwagi: row['Uwagi'] ?? '',
        OstatniaCenaZakupu: row['Ostatnia cena zakupu'] ?? '',
        OstatniaDataZakupu: row['Ostatnia data zakupu'] ?? '',
      }));

      const rulesRes = await fetch('/catalogCategoryRules.json');
      if (!rulesRes.ok)
        throw new Error('Nie udało się załadować reguł kategorii');
      const rules = (await rulesRes.json()) as CategoryRule[];
      const categorized = categorizeCatalog(rows, rules);

      setPreviewSections(categorized);
      toast.success(
        `Plik wczytany: ${rows.length} produktów w ${categorized.length} kategoriach`,
        { id: toastId }
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Błąd parsowania';
      toast.error(msg, { id: toastId });
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const processUpload = useCallback(async () => {
    if (!previewSections) return;
    setLoading(true);
    const toastId = toast.loading('Aktualizacja bazy danych...');
    try {
      await replaceCatalog({ sections: previewSections as never });
      toast.success('Katalog został zaktualizowany pomyślnie', {
        id: toastId,
      });
      setPreviewSections(null);
      setFile(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Błąd serwera';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  }, [previewSections, replaceCatalog]);

  const cancelPreview = useCallback(() => {
    setPreviewSections(null);
    setFile(null);
    toast.info('Podgląd anulowany');
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFileSelect(f);
    },
    [handleFileSelect]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFileSelect(f);
    },
    [handleFileSelect]
  );

  return {
    file,
    dragOver,
    loading,
    previewSections,
    handleFileSelect,
    onDrop,
    onDragOver,
    onDragLeave,
    onFileChange,
    processUpload,
    cancelPreview,
    setFile,
  };
}
