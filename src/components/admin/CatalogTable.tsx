'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Loader2,
  AlertCircle,
  Trash2,
  Ban,
  CircleCheckBig,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProductRow } from '@/components/admin/ProductRow';
import { AddProductRow } from '@/components/admin/AddProductRow';
import { CategorySectionTitle } from '@/components/admin/CategorySectionTitle';
import DarkToggle from '@/components/reusable/DarkToggle';
import {
  DISPLAY_KEYS,
  type CatalogRow,
  type CatalogSection,
} from '@/lib/types';

type Props = {
  sections: CatalogSection[] | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredTotalCount: number;
  loading: boolean;
  error: string | null;
  isPreview: boolean;
};

function DeleteCategoryButton({
  slug,
  disabled,
}: {
  slug: string;
  disabled: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deleteCategory = useMutation(api.catalog.deleteCategory);

  const handleConfirm = async () => {
    setDeleting(true);
    const toastId = toast.loading('Usuwanie kategorii...');
    try {
      await deleteCategory({ slug });
      toast.success('Kategoria została usunięta', { id: toastId });
      setConfirming(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Błąd usuwania';
      toast.error(msg, { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          className="h-7 text-xs bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
          onClick={handleConfirm}
          disabled={deleting}
        >
          <CircleCheckBig className="w-3.5 h-3.5 mr-1" />
          Usuń
        </Button>
        <Button
          size="sm"
          className="h-7 text-xs bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
          onClick={() => setConfirming(false)}
          disabled={deleting}
        >
          <Ban className="w-3.5 h-3.5 mr-1" />
          Anuluj
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600"
      onClick={() => setConfirming(true)}
      disabled={disabled}
      title="Usuń kategorię"
    >
      <Trash2 className="w-3.5 h-3.5 mr-1" />
      Usuń kategorię
    </Button>
  );
}

export function CatalogTable({
  sections,
  searchQuery,
  onSearchChange,
  filteredTotalCount,
  loading,
  error,
  isPreview,
}: Props) {
  return (
    <section data-testid="catalog-table">
      <div className="sticky top-0 z-10 bg-background pb-4 pt-2 -mt-2 border-b border-transparent hover:border-border transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {isPreview ? 'Podgląd produktów' : 'Produkty w bazie'}
            </h2>
            <p className="text-gray-600 dark:text-muted-foreground text-sm">
              {isPreview
                ? 'To są dane, które zostaną zapisane. Możesz je przeszukać przed wysłaniem.'
                : 'Edytuj wiersz i kliknij Zapisz, aby zaktualizować produkt w Convex.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-muted-foreground" />
              <Input
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
                data-testid="catalog-search"
              />
              {searchQuery && (
                <p className="absolute -bottom-5 right-0 text-[10px] text-gray-600 dark:text-muted-foreground">
                  Found {filteredTotalCount} products
                </p>
              )}
            </div>
            <DarkToggle />
          </div>
        </div>
      </div>
      <div className="mt-6">

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading catalog…
        </div>
      )}
      {error && (
        <div
          className="flex items-center gap-2 text-destructive py-4"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}
      {!loading && !error && sections && (
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.slug}
              className="rounded-lg border border-border overflow-hidden"
            >
              <div className="bg-muted/50 px-4 py-2 font-medium text-sm flex justify-between items-center text-orange-800 dark:text-foreground">
                <CategorySectionTitle section={section} />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 dark:text-muted-foreground">
                    {section.items.length} products
                  </span>
                  {!isPreview && section.items.length === 0 && (
                    <DeleteCategoryButton
                      slug={section.slug}
                      disabled={loading}
                    />
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase w-20 border-r border-border/50">
                        Photo
                      </th>
                      <th className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase w-32 border-r border-border/50">
                        Category
                      </th>
                      {DISPLAY_KEYS.map(({ label, key }) => (
                        <th
                          key={key}
                          className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase border-r border-border/50"
                        >
                          {label}
                        </th>
                      ))}
                      <th className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase w-20 border-r border-border/50">
                        Delete
                      </th>
                      <th className="p-2 text-xs font-semibold text-gray-700 dark:text-muted-foreground uppercase w-24 text-right">
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
                    {!isPreview && (
                      <AddProductRow
                        categorySlug={section.slug}
                        disabled={loading}
                      />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
