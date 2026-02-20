"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  CsvUploadSection,
  CatalogTable,
  CreateCategorySection,
  AdminHeader,
} from "@/components/admin";
import { useCsvPreview, useCatalogFilter } from "@/components/admin/hooks";

// Lazy load Luna (heavy assets, admin-only). No SSR so it never appears in initial HTML or crawler response.
const LunaMascot = dynamic(
  () =>
    import("@/components/admin/LunaMascot").then((m) => ({ default: m.LunaMascot })),
  { ssr: false }
);

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    populated: number;
    total: number;
    error?: boolean;
    firstError?: string | null;
  } | null>(null);
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

  const updateImagesOrder = async () => {
    setOrderUpdating(true);
    setOrderResult(null);
    try {
      const res = await fetch("/api/admin/populate-image-dimensions", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOrderResult({
          populated: 0,
          total: 0,
          error: true,
          firstError: data.error ?? null,
        });
        return;
      }
      setOrderResult({
        populated: data.populated ?? 0,
        total: data.total ?? 0,
        error: false,
        firstError: data.firstError ?? null,
      });
    } finally {
      setOrderUpdating(false);
    }
  };

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      <AdminHeader
        totalProductCount={totalProductCount}
        loading={catalogLoading}
        onLogout={logout}
      />

      <LunaMascot />

      {!previewSections && <CreateCategorySection />}

      <section className="mb-8 rounded-lg border bg-card p-4">
        <h2 className="mb-2 text-lg font-medium">Catalog order</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Catalog order: subcategory → image height (tallest first) → Nazwa. Store image dimensions (thumbnails) so the backend can apply this order. Run after adding or changing product images, or after switching to thumbnail-based sort.
        </p>
        <button
          type="button"
          onClick={updateImagesOrder}
          disabled={orderUpdating}
          className={`cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow ring-2 ring-primary/40 ring-offset-2 ring-offset-background hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:ring-0 ${!orderUpdating ? "animate-pulse" : ""}`}
        >
          {orderUpdating ? "Updating…" : "Update catalog order"}
        </button>
        {orderResult !== null && !orderUpdating && (
          <div className="mt-3 space-y-1">
            <p className={`text-sm ${orderResult.error ? "text-destructive" : "text-muted-foreground"}`}>
              {orderResult.error
                ? "Request failed. Try again or check the console."
                : orderResult.total > 0
                  ? `Stored dimensions for ${orderResult.populated} of ${orderResult.total} images. Catalog order updated.`
                  : "No images to update."}
            </p>
            {orderResult.firstError && orderResult.populated === 0 && orderResult.total > 0 && (
              <p className="text-xs text-muted-foreground">
                First error: {orderResult.firstError}
              </p>
            )}
          </div>
        )}
      </section>

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
