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
import type { CategoryRule } from '@/lib/catalogCategorize';
import { csvToRows } from '@/lib/csvParseClient';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

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
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
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
    } catch (e) {
      console.error('Upload failed', e);
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
        return;
      }
      await updateProduct({ kod, updates });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
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
          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
            {row.categorySlug}
          </span>
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
  const [result, setResult] = useState<{
    ok: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const sectionsFromConvex = useQuery(api.catalog.listCatalogSections);
  const replaceCatalog = useMutation(api.catalog.replaceCatalogFromSections);
  const catalogLoading = sectionsFromConvex === undefined;
  const catalogError = sectionsFromConvex === undefined ? null : null;

  const filteredSections = useMemo(() => {
    if (!sectionsFromConvex) return null;
    if (!searchQuery.trim()) return sectionsFromConvex;

    const query = searchQuery.toLowerCase();
    return sectionsFromConvex
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            (item.Nazwa ?? '').toLowerCase().includes(query) ||
            (item.Kod ?? '').toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [sectionsFromConvex, searchQuery]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.name.endsWith('.csv') || f.type === 'text/csv')) {
      setFile(f);
      setResult(null);
    }
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
    if (f) {
      setFile(f);
      setResult(null);
    }
  }, []);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const buffer = await file.arrayBuffer();
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
      if (!rulesRes.ok) throw new Error('Failed to load category rules');
      const rules = (await rulesRes.json()) as CategoryRule[];
      const sectionsToSend = categorizeCatalog(rows, rules);
      await replaceCatalog({ sections: sectionsToSend as never });
      setResult({
        ok: true,
        message: `Catalog updated: ${rows.length} products`,
      });
      setFile(null);
    } catch (e) {
      setResult({
        ok: false,
        error: e instanceof Error ? e.message : 'Network error',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin – Catalog</h1>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </div>

      {/* CSV upload */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-3">Process new CSV</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Upload a CSV (Kartoteki export, Windows-1250, semicolon-delimited). It
          will replace the Convex catalog. Image paths unchanged (convention:{' '}
          <code className="bg-muted px-1 rounded">/category/Kod.jpg</code>).
        </p>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/30'
          }`}
        >
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={onFileChange}
            className="sr-only"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer block">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <span className="text-foreground font-medium">
              {file ? file.name : 'Drag & drop CSV or click to choose'}
            </span>
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <Button
            onClick={process}
            disabled={!file || loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </>
            ) : (
              'Process'
            )}
          </Button>
          {file && !loading && (
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
            >
              Clear
            </Button>
          )}
        </div>
        {result && (
          <div
            className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm ${
              result.ok
                ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                : 'bg-destructive/10 text-destructive'
            }`}
            role="alert"
          >
            {result.ok ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{result.ok ? result.message : result.error}</span>
          </div>
        )}
      </section>

      {/* Catalog table by category */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">Products by category</h2>
            <p className="text-muted-foreground text-sm">
              Edit a row and click Save to update the product in Convex.
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
                      {section.items.map((row, index) => (
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
