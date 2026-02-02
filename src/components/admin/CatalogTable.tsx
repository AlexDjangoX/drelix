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
          variant="destructive"
          size="sm"
          className="h-7 text-xs"
          onClick={handleConfirm}
          disabled={deleting}
        >
          <CircleCheckBig className="w-3.5 h-3.5 mr-1" />
          Usuń
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
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
      variant="ghost"
      size="sm"
      className="h-7 text-xs text-muted-foreground hover:text-destructive"
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
    <section>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">
            {isPreview ? 'Podgląd produktów' : 'Produkty w bazie'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isPreview
              ? 'To są dane, które zostaną zapisane. Możesz je przeszukać przed wysłaniem.'
              : 'Edytuj wiersz i kliknij Zapisz, aby zaktualizować produkt w Convex.'}
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <p className="absolute -bottom-5 right-0 text-[10px] text-muted-foreground">
              Found {filteredTotalCount} products
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
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
              <div className="bg-muted/50 px-4 py-2 font-medium text-sm flex justify-between items-center">
                <CategorySectionTitle section={section} />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
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
                      <th className="p-2 text-xs font-semibold text-muted-foreground uppercase w-20">
                        Delete
                      </th>
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
    </section>
  );
}
