import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DarkToggle from "@/components/reusable/DarkToggle";

type Props = {
  isPreview: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filteredTotalCount: number;
};

export function CatalogTableHeader({
  isPreview,
  searchQuery,
  onSearchChange,
  filteredTotalCount,
}: Props) {
  return (
    <div className="sticky top-0 z-10 bg-background pb-4 pt-2 -mt-2 border-b border-transparent hover:border-border transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            {isPreview ? "Podgląd produktów" : "Produkty w bazie"}
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground text-sm">
            {isPreview
              ? "To są dane, które zostaną zapisane. Możesz je przeszukać przed wysłaniem."
              : "Edytuj wiersz i kliknij Zapisz, aby zaktualizować produkt w Convex."}
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
  );
}
