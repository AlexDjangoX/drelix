"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Trash2, Ban, CircleCheckBig } from "lucide-react";
import { toast } from "sonner";

type Props = {
  slug: string;
  disabled: boolean;
};

export function DeleteCategoryButton({ slug, disabled }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deleteCategory = useMutation(api.catalog.deleteCategory);

  const handleConfirm = async () => {
    setDeleting(true);
    const toastId = toast.loading("Usuwanie kategorii...");
    try {
      await deleteCategory({ slug });
      toast.success("Kategoria została usunięta", { id: toastId });
      setConfirming(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Błąd usuwania";
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
