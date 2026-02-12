import { CategorySectionTitle } from "@/components/admin/CategorySectionTitle";
import { ProductRow } from "@/components/admin/ProductRow";
import { AddProductRow } from "@/components/admin/AddProductRow";
import { CatalogTableColumns } from "@/components/admin/CatalogTable/CatalogTableColumns";
import { DeleteCategoryButton } from "@/components/admin/CatalogTable/DeleteCategoryButton";
import type { CatalogSection, CatalogRow } from "@/lib/types";

type Props = {
  section: CatalogSection;
  isPreview: boolean;
  loading: boolean;
};

export function CategorySection({ section, isPreview, loading }: Props) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="bg-muted/50 px-4 py-2 font-medium text-sm flex justify-between items-center text-orange-800 dark:text-foreground">
        <CategorySectionTitle section={section} />
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 dark:text-muted-foreground">
            {section.items.length} products
          </span>
          {!isPreview && section.items.length === 0 && (
            <DeleteCategoryButton slug={section.slug} disabled={loading} />
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <CatalogTableColumns />
          <tbody>
            {section.items.map((row: CatalogRow, index: number) => (
              <ProductRow
                key={`${section.slug}-${row["Kod"] ?? index}`}
                row={row}
              />
            ))}
            {!isPreview && (
              <AddProductRow categorySlug={section.slug} disabled={loading} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
