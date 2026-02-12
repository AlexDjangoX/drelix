'use client';

import { useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { categorizeCatalog } from '@/lib/process-csv/catalogCategorize';
import type { CategoryRule, CatalogSection } from '@/lib/types';
import { csvToRows } from '@/lib/process-csv/csvParseClient';
import { toast } from 'sonner';
import { uploadLogger } from '@/lib/upload-logger';

export function useCsvPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewSections, setPreviewSections] = useState<
    CatalogSection[] | null
  >(null);
  const replaceCatalog = useMutation(api.catalog.replaceCatalogFromSections);

  const handleFileSelect = useCallback(async (f: File) => {
    if (!f.name.endsWith('.csv') && f.type !== 'text/csv') {
      toast.error('Proszę wybrać plik CSV');
      uploadLogger.error('preview', 'Invalid file type', { fileName: f.name, fileType: f.type });
      return;
    }
    
    uploadLogger.info('preview', '=== STARTING CSV PREVIEW ===');
    uploadLogger.info('preview', `File selected: ${f.name}`, { size: f.size, type: f.type });
    
    setFile(f);
    setLoading(true);
    const toastId = toast.loading('Parsowanie pliku...');

    try {
      uploadLogger.info('preview', 'Reading file buffer...');
      const buffer = await f.arrayBuffer();
      uploadLogger.info('preview', 'Parsing CSV rows...');
      const rawRows = csvToRows(buffer);
      uploadLogger.info('preview', `Parsed ${rawRows.length} raw rows from CSV`);

      uploadLogger.info('preview', 'Normalizing row data...');
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
      uploadLogger.info('preview', `Normalized ${rows.length} rows`);

      uploadLogger.info('preview', 'Loading category rules...');
      const rulesRes = await fetch('/catalogCategoryRules.json');
      if (!rulesRes.ok) {
        uploadLogger.error('preview', 'Failed to load category rules', { status: rulesRes.status });
        throw new Error('Nie udało się załadować reguł kategorii');
      }
      const rulesData = (await rulesRes.json()) as
        | CategoryRule[]
        | { rules: CategoryRule[]; excludeKods?: string[] };
      const rules = Array.isArray(rulesData) ? rulesData : rulesData.rules;
      const excludeKods = Array.isArray(rulesData)
        ? []
        : (rulesData.excludeKods ?? []);
      
      uploadLogger.info('preview', 'Category rules loaded', { 
        totalRules: rules.length,
        excludeCount: excludeKods.length,
        excludedKods: excludeKods
      });

      uploadLogger.info('preview', 'Starting categorization...');
      const categorized = categorizeCatalog(rows, rules, excludeKods);

      // Log categorization results
      uploadLogger.info('preview', 'Categorization complete', {
        totalRows: rows.length,
        totalCategories: categorized.length,
        categorySummary: categorized.map(s => ({ slug: s.slug, count: s.items.length }))
      });
      
      // Check for APT products specifically
      const aptProducts = rows.filter(r => r.Kod?.toUpperCase().startsWith('APT'));
      uploadLogger.info('preview', `Found ${aptProducts.length} APT products in CSV`, 
        aptProducts.map(p => ({ kod: p.Kod, nazwa: p.Nazwa }))
      );
      
      // Check where APT products ended up
      for (const section of categorized) {
        const aptInSection = section.items.filter(item => item.Kod?.toUpperCase().startsWith('APT'));
        if (aptInSection.length > 0) {
          uploadLogger.info('preview', `*** APT Products categorized to "${section.slug}"`, 
            aptInSection.map(p => ({
              kod: p.Kod,
              nazwa: p.Nazwa,
              categorySlug: (p as any).categorySlug
            }))
          );
        }
      }
      
      // Verify APT categorization
      const aptInFirstaid = categorized.find(s => s.slug === 'firstaid')?.items.filter(
        item => item.Kod?.toUpperCase().startsWith('APT')
      );
      if (aptProducts.length > 0 && (!aptInFirstaid || aptInFirstaid.length === 0)) {
        uploadLogger.warning('preview', 'APT products NOT in firstaid category!', {
          totalAptProducts: aptProducts.length,
          firstaidCategory: categorized.find(s => s.slug === 'firstaid') ? 'exists' : 'missing'
        });
      } else if (aptInFirstaid && aptInFirstaid.length > 0) {
        uploadLogger.info('preview', `✓ ${aptInFirstaid.length} APT products correctly in firstaid category`);
      }

      setPreviewSections(categorized);
      uploadLogger.info('preview', '=== PREVIEW COMPLETE ===', { 
        summary: uploadLogger.getLogsSummary() 
      });
      toast.success(
        `Plik wczytany: ${rows.length} produktów w ${categorized.length} kategoriach`,
        { id: toastId }
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Błąd parsowania';
      uploadLogger.error('preview', 'Preview failed', { error: msg, stack: e instanceof Error ? e.stack : undefined });
      toast.error(msg, { id: toastId });
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const processUpload = useCallback(async () => {
    if (!previewSections) return;
    
    uploadLogger.info('upload', '=== STARTING UPLOAD TO DATABASE ===');
    uploadLogger.info('upload', `Sections to upload: ${previewSections.length}`);
    
    setLoading(true);
    const toastId = toast.loading('Aktualizacja bazy danych...');
    
    // Log details of what we're sending
    for (const section of previewSections) {
      uploadLogger.info('upload', `Section "${section.slug}": ${section.items.length} items`, {
        titleKey: section.titleKey,
        firstItem: section.items[0] ? {
          kod: (section.items[0] as any).Kod,
          categorySlug: (section.items[0] as any).categorySlug
        } : null
      });
      
      const aptInSection = section.items.filter(item => 
        (item as any).Kod?.toUpperCase().startsWith('APT')
      );
      if (aptInSection.length > 0) {
        uploadLogger.info('upload', `*** APT Products in section "${section.slug}"`, 
          aptInSection.map(p => ({
            kod: (p as any).Kod,
            nazwa: (p as any).Nazwa,
            categorySlug: (p as any).categorySlug
          }))
        );
      }
    }
    
    try {
      uploadLogger.info('upload', 'Calling replaceCatalog mutation...');
      const result = await replaceCatalog({ sections: previewSections as never });
      uploadLogger.info('upload', '✓ Upload mutation completed', result);
      
      toast.success('Katalog został zaktualizowany pomyślnie', {
        id: toastId,
      });
      
      uploadLogger.info('upload', '=== UPLOAD COMPLETE ===');
      uploadLogger.info('upload', 'Downloading logs...');
      
      // Auto-download logs after successful upload
      setTimeout(() => {
        uploadLogger.downloadLogs();
      }, 1000);
      
      setPreviewSections(null);
      setFile(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Błąd serwera';
      uploadLogger.error('upload', 'Upload failed', { 
        error: msg, 
        stack: e instanceof Error ? e.stack : undefined 
      });
      toast.error(msg, { id: toastId });
      
      // Download logs even on failure
      setTimeout(() => {
        uploadLogger.downloadLogs();
      }, 1000);
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
