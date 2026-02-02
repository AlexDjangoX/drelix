'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import {
  CsvUploadSection,
  CatalogTable,
  CreateCategorySection,
} from '@/components/admin';
import { useCsvPreview, useCatalogFilter } from '@/components/admin/hooks';

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    file,
    dragOver,
    loading,
    previewSections,
    onDrop,
    onDragOver,
    onDragLeave,
    onFileChange,
    processUpload,
    cancelPreview,
    setFile,
  } = useCsvPreview();

  const {
    catalogLoading,
    catalogError,
    totalProductCount,
    filteredSections,
    filteredTotalCount,
  } = useCatalogFilter(previewSections, searchQuery);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/';
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

      {!previewSections && <CreateCategorySection />}

      <CsvUploadSection
        file={file}
        dragOver={dragOver}
        loading={loading}
        previewSections={previewSections}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onFileChange={onFileChange}
        onProcessUpload={processUpload}
        onCancelPreview={cancelPreview}
        onClearFile={() => setFile(null)}
      />

      <CatalogTable
        sections={filteredSections}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredTotalCount={filteredTotalCount}
        loading={catalogLoading}
        error={catalogError}
        isPreview={!!previewSections}
      />

      <p className="mt-12 text-sm text-muted-foreground">
        <Link href="/" className="underline hover:text-foreground">
          ← Back to site
        </Link>
      </p>
    </main>
  );
}
