'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload,
  LogOut,
  Loader2,
  CheckCircle,
  AlertCircle,
  Pencil,
  Save,
  X,
  Image as ImageIcon,
  Search,
} from 'lucide-react';
import { categorizeCatalog } from '@/lib/catalogCategorize';
import type { CategoryRule, CatalogSection } from '@/lib/catalogCategorize';
import { csvToRows } from '@/lib/csvParseClient';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

type CatalogRow = Record<string, string>;

const DISPLAY_KEYS = [
  { label: 'Kod', key: 'Kod' },
  { label: 'Nazwa', key: 'Nazwa' },
  { label: 'Cena netto', key: 'CenaNetto' },
  { label: 'Jednostka miary', key: 'JednostkaMiary' },
  { label: 'Stawka VAT', key: 'StawkaVAT' },
] as const;

function CategorySelect({
  currentSlug,
  onSelect,
  disabled,
}: {
  currentSlug: string;
  onSelect: (slug: string) => void;
  disabled?: boolean;
}) {
  const categories = useQuery(api.catalog.listCategories);
  const { t } = useLanguage();

  if (!categories)
    return <div className="h-8 w-32 bg-muted animate-pulse rounded" />;

  return (
    <select
      value={currentSlug}
      onChange={(e) => onSelect(e.target.value)}
      disabled={disabled}
      className="h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {categories.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {(() => {
            const keys = cat.titleKey.split('.');
            let current: unknown = t;
            for (const key of keys) {
              current = (current as Record<string, unknown>)?.[key];
            }
            return typeof current === 'string' ? current : cat.slug;
          })()}
        </option>
      ))}
    </select>
  );
}

function ImageUploadCell({ row }: { row: CatalogRow }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const generateUploadUrl = useMutation(api.catalog.generateUploadUrl);
  const updateProductImage = useMutation(api.catalog.updateProductImage);
  const kod = row['Kod'] ?? '';
  const imageUrl = row['imageUrl'];

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Proszę wybrać plik graficzny');
      return;
    }
    setUploading(true);
    const toastId = toast.loading('Przesyłanie zdjęcia...');
    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();
      // 2. Upload file
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await result.json();
      // 3. Save storageId to product
      await updateProductImage({ kod, storageId });
      toast.success('Zdjęcie zostało zaktualizowane', { id: toastId });
    } catch (e) {
      console.error('Upload failed', e);
      toast.error('Nie udało się przesłać zdjęcia', { id: toastId });
    } finally {
      setUploading(false);
      setDragOver(false);
    }
  };

  return (
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
      className={`relative w-16 h-16 rounded border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
        dragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
      }`}
    >
      {uploading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : imageUrl ? (
        <Image src={imageUrl} alt="" fill className="object-cover" />
      ) : (
        <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
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
  );
}

function CategoryLabel({ slug }: { slug: string }) {
  const categories = useQuery(api.catalog.listCategories);
  const { t } = useLanguage();
  if (!categories) return <span className="text-xs animate-pulse">...</span>;
  const cat = categories.find(c => c.slug === slug);
  if (!cat) return <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{slug}</span>;
  
  const label = (() => {
    const keys = cat.titleKey.split('.');
    let current: unknown = t;
    for (const key of keys) {
      current = (current as Record<string, unknown>)?.[key];
    }
    return typeof current === 'string' ? current : slug;
  })();
  return (
    <span className="text-xs font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
      {label}
    </span>
  );
}

function ProductRow({ row }: { row: CatalogRow }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CatalogRow>(() => ({ ...row }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProduct = useMutation(api.catalog.updateProduct);

  const kod = row['Kod'] ?? '';

  React.useEffect(() => {
    if (!editing) setDraft({ ...row });
  }, [row, editing]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const toastId = toast.loading('Zapisywanie zmian...');
    try {
      const updates: Record<string, string> = {};
      for (const { key } of DISPLAY_KEYS) {
        if (draft[key] !== row[key]) updates[key] = draft[key] ?? '';
      }
      if (draft.categorySlug !== row.categorySlug) {
        updates.categorySlug = draft.categorySlug ?? '';
      }
      if (Object.keys(updates).length === 0) {
        setEditing(false);
        toast.dismiss(toastId);
        return;
      }
      await updateProduct({ kod, updates });
      setEditing(false);
      toast.success('Produkt został zaktualizowany', { id: toastId });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Błąd zapisu';
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft({ ...row });
    setEditing(false);
    setError(null);
  };

  return (
    <tr className="border-b border-border hover:bg-muted/30">
      <td className="p-2 align-middle">
        <ImageUploadCell row={row} />
      </td>
      <td className="p-2 align-top">
        {editing ? (
          <CategorySelect
            currentSlug={draft.categorySlug ?? ''}
            onSelect={(slug) => setDraft((d) => ({ ...d, categorySlug: slug }))}
            disabled={saving}
          />
        ) : (
          <CategoryLabel slug={row.categorySlug ?? ''} />
        )}
      </td>
      {DISPLAY_KEYS.map(({ key }) => (
        <td key={key} className="p-2 align-top">
          {editing ? (
            <Input
              value={draft[key] ?? ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, [key]: e.target.value }))
              }
              className="h-8 text-sm"
            />
          ) : (
            <span className="text-sm">{row[key] ?? '—'}</span>
          )}
        </td>
      ))}
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
              onClick={handleCancel}
              disabled={saving}
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
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
            onClick={() => setEditing(true)}
            aria-label="Edit"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </td>
    </tr>
  );
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewSections, setPreviewSections] = useState<CatalogSection[] | null>(null);

  const sectionsFromConvex = useQuery(api.catalog.listCatalogSections);
  const replaceCatalog = useMutation(api.catalog.replaceCatalogFromSections);
  const catalogLoading = sectionsFromConvex === undefined;
  const catalogError = sectionsFromConvex === undefined ? null : null;

  const activeSections = previewSections || sectionsFromConvex;

  const totalProductCount = useMemo(() => {
    if (!activeSections) return 0;
    return activeSections.reduce((sum, section) => sum + section.items.length, 0);
  }, [activeSections]);

  const filteredSections = useMemo(() => {
    if (!activeSections) return null;
    if (!searchQuery.trim()) return activeSections;

    const query = searchQuery.toLowerCase();
    return activeSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item: CatalogRow) =>
            (item.Nazwa ?? '').toLowerCase().includes(query) ||
            (item.Kod ?? '').toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeSections, searchQuery]);

  const filteredTotalCount = useMemo(() => {
    if (!filteredSections) return 0;
    return filteredSections.reduce((sum, section) => sum + section.items.length, 0);
  }, [filteredSections]);

  const handleFileSelect = async (f: File) => {
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
      
      // Map CSV headers to Convex-safe field names
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
      if (!rulesRes.ok) throw new Error('Nie udało się załadować reguł kategorii');
      const rules = (await rulesRes.json()) as CategoryRule[];
      const categorized = categorizeCatalog(rows, rules);
      
      setPreviewSections(categorized);
      toast.success(`Plik wczytany: ${rows.length} produktów w ${categorized.length} kategoriach`, { id: toastId });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Błąd parsowania';
      toast.error(msg, { id: toastId });
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
  }, []);

  const processUpload = async () => {
    if (!previewSections) return;
    setLoading(true);
    const toastId = toast.loading('Aktualizacja bazy danych...');
    try {
      await replaceCatalog({ sections: previewSections as never });
      toast.success('Katalog został zaktualizowany pomyślnie', { id: toastId });
      setPreviewSections(null);
      setFile(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Błąd serwera';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const cancelPreview = () => {
    setPreviewSections(null);
    setFile(null);
    toast.info('Podgląd anulowany');
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin – Catalog</h1>
          {!catalogLoading && (
            <p className="text-sm text-muted-foreground">
              Total: {totalProductCount} products
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </div>

      {/* CSV upload */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-3">
          {previewSections ? 'Podgląd nowego katalogu' : 'Procesuj nowy plik CSV'}
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          {previewSections 
            ? 'Przejrzyj poniższą listę. Jeśli wszystko się zgadza, kliknij "Zatwierdź i wyślij".' 
            : 'Wgraj plik CSV (eksport Kartoteki, Windows-1250, średnik). Zastąpi on obecny katalog w Convex.'}
        </p>
        
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : previewSections 
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-muted-foreground/30'
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
          <label htmlFor="csv-upload" className={loading ? 'cursor-not-allowed' : 'cursor-pointer block'}>
            {previewSections ? (
              <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-3" />
            ) : (
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            )}
            <span className="text-foreground font-medium">
              {previewSections 
                ? 'Plik wczytany pomyślnie' 
                : file 
                  ? file.name 
                  : 'Przeciągnij i upuść plik CSV lub kliknij, aby wybrać'}
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
                onClick={processUpload}
                disabled={loading}
                className="gap-2 bg-green-600 hover:bg-green-700"
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
                onClick={cancelPreview}
                disabled={loading}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Anuluj
              </Button>
            </>
          ) : (
            file && (
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                }}
              >
                Wyczyść
              </Button>
            )
          )}
        </div>
      </section>

      {/* Catalog table by category */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">
              {previewSections ? 'Podgląd produktów' : 'Produkty w bazie'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {previewSections 
                ? 'To są dane, które zostaną zapisane. Możesz je przeszukać przed wysłaniem.'
                : 'Edytuj wiersz i kliknij Zapisz, aby zaktualizować produkt w Convex.'}
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <p className="absolute -bottom-5 right-0 text-[10px] text-muted-foreground">
                Found {filteredTotalCount} products
              </p>
            )}
          </div>
        </div>

        {catalogLoading && (
          <div className="flex items-center gap-2 text-muted-foreground py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading catalog…
          </div>
        )}
        {catalogError && (
          <div
            className="flex items-center gap-2 text-destructive py-4"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {catalogError}
          </div>
        )}
        {!catalogLoading && !catalogError && filteredSections && (
          <div className="space-y-8">
            {filteredSections.map((section) => (
              <div
                key={section.slug}
                className="rounded-lg border border-border overflow-hidden"
              >
                <div className="bg-muted/50 px-4 py-2 font-medium text-sm flex justify-between items-center">
                  <span>{section.slug}</span>
                  <span className="text-xs text-muted-foreground">
                    {section.items.length} products
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="p-2 text-xs font-semibold text-muted-foreground uppercase w-20">
                          Photo
                        </th>
                        <th className="p-2 text-xs font-semibold text-muted-foreground uppercase w-32">
                          Category
                        </th>
                        {DISPLAY_KEYS.map(({ label, key }) => (
                          <th
                            key={key}
                            className="p-2 text-xs font-semibold text-muted-foreground uppercase"
                          >
                            {label}
                          </th>
                        ))}
                        <th className="p-2 text-xs font-semibold text-muted-foreground uppercase w-24 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.items.map((row: CatalogRow, index: number) => (
                        <ProductRow
                          key={`${section.slug}-${row['Kod'] ?? index}`}
                          row={row}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="mt-12 text-sm text-muted-foreground">
        <Link href="/" className="underline hover:text-foreground">
          ← Back to site
        </Link>
      </p>
    </main>
  );
}
