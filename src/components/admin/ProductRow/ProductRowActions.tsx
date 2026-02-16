import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type Props = {
  onEdit: () => void;
};

export function ProductRowActions({ onEdit }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 text-xs border-green-300 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white dark:hover:border-green-600 dark:hover:shadow-md"
      onClick={onEdit}
      title="Edytuj produkt"
    >
      <Pencil className="w-3.5 h-3.5 mr-1" />
      Edytuj
    </Button>
  );
}
