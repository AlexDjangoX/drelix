"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  categorySlug: string;
  disabled?: boolean;
};

export function SubcategoryManager({ categorySlug, disabled }: Props) {
  const subcategories = useQuery(
    api.catalog.listSubcategories,
    categorySlug ? { categorySlug } : "skip",
  );
  const createSubcategory = useMutation(api.catalog.createSubcategory);
  const deleteSubcategory = useMutation(api.catalog.deleteSubcategory);
  const seedGloves = useMutation(api.catalog.seedGlovesSubcategories);

  const [adding, setAdding] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = displayName.trim();
    if (!name) {
      toast.error("Nazwa podkategorii jest wymagana");
      return;
    }
    setSaving(true);
    const toastId = toast.loading("Dodawanie podkategorii...");
    try {
      await createSubcategory({
        categorySlug,
        displayName: name,
      });
      toast.success("Podkategoria dodana", { id: toastId });
      setDisplayName("");
      setAdding(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleSeedGloves = async () => {
    if (categorySlug !== "gloves") return;
    setSeeding(true);
    const toastId = toast.loading("Ładowanie podkategorii...");
    try {
      const result = await seedGloves({});
      const created = (result as { created?: number }).created ?? 0;
      toast.success(
        created > 0 ? `Dodano ${created} podkategorii` : "Podkategorie już istnieją",
        { id: toastId },
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd", { id: toastId });
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (subSlug: string) => {
    const toastId = toast.loading("Usuwanie...");
    try {
      await deleteSubcategory({ categorySlug, slug: subSlug });
      toast.success("Podkategoria usunięta", { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd", { id: toastId });
    }
  };

  if (!categorySlug) return null;

  return (
    <div
      data-testid="subcategory-manager"
      className="px-4 py-2 border-b border-border bg-muted/30"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Podkategorie:
        </span>
        {subcategories?.length === 0 && !adding && (
          <>
            <span data-testid="subcategory-manager-empty" className="text-xs text-muted-foreground">
              Brak
            </span>
            {categorySlug === "gloves" && !disabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSeedGloves}
                disabled={seeding}
                data-testid="subcategory-manager-seed-gloves"
                className="h-6 text-xs"
              >
                {seeding ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Załaduj domyślne (rękawice)"
                )}
              </Button>
            )}
          </>
        )}
        {subcategories?.map((sub) => (
          <span
            key={sub.slug}
            data-testid={`subcategory-manager-tag-${sub.slug}`}
            className="inline-flex items-center gap-1 rounded bg-background border border-border px-2 py-0.5 text-xs"
          >
            {sub.displayName}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleDelete(sub.slug)}
                data-testid={`subcategory-manager-delete-${sub.slug}`}
                className="text-muted-foreground hover:text-destructive p-0.5"
                aria-label={`Usuń ${sub.displayName}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        {!adding ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAdding(true)}
            disabled={disabled}
            data-testid="subcategory-manager-add-btn"
            className="h-6 text-xs gap-1"
          >
            <Plus className="w-3 h-3" />
            Dodaj podkategorię
          </Button>
        ) : (
          <form
            data-testid="subcategory-manager-add-form"
            onSubmit={handleAdd}
            className="inline-flex flex-wrap gap-2 items-center"
          >
            <Input
              data-testid="subcategory-manager-input-display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nazwa (np. Gumowe)"
              className="h-7 w-40 text-xs"
              autoFocus
            />
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              data-testid="subcategory-manager-submit"
              className="h-7 gap-1"
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              Zapisz
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setAdding(false);
                setDisplayName("");
              }}
              disabled={saving}
              data-testid="subcategory-manager-cancel"
              className="h-7"
            >
              Anuluj
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
