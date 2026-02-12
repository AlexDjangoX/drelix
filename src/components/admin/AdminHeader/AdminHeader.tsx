import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type Props = {
  totalProductCount: number;
  loading: boolean;
  onLogout: () => void;
};

export function AdminHeader({ totalProductCount, loading, onLogout }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold">Admin – Catalog</h1>
        {!loading && (
          <p className="text-sm text-muted-foreground">
            Total: {totalProductCount} products
          </p>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onLogout}
        className="gap-2 dark:text-orange-400 dark:hover:text-white"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </Button>
    </div>
  );
}
