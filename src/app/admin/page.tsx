"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CsvUploadSection,
  CatalogTable,
  CreateCategorySection,
  AdminHeader,
} from "@/components/admin";
import { useCsvPreview, useCatalogFilter } from "@/components/admin/hooks";

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
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
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <AdminHeader
        totalProductCount={totalProductCount}
        loading={catalogLoading}
        onLogout={logout}
      />

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
