"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploadCell } from "@/components/admin/ImageUploadCell";
import { CategorySelect } from "@/components/admin/CategorySelect";
import { SubcategorySelect } from "@/components/admin/SubcategorySelect";
import { editProductSchema, type EditProductFormValues } from "./editProductSchema";
import type { CatalogRow } from "@/lib/types";
import { DISPLAY_KEYS } from "@/lib/types";
import { DescriptionRichField } from "@/components/admin/EditProductModal/DescriptionRichField";

type Props = {
  row: CatalogRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

const FORM_KEYS = [
  ...DISPLAY_KEYS.map(({ key }) => key),
  "JednostkaMiary",
  "ProductDescription",
  "categorySlug",
  "subcategorySlug",
  "Heading",
  "Subheading",
  "Description",
] as const;

function rowToDefaultValues(row: CatalogRow): EditProductFormValues {
  return {
    Kod: row["Kod"] ?? "",
    Nazwa: row["Nazwa"] ?? "",
    ProductDescription: row["ProductDescription"] ?? "",
    CenaNetto: row["CenaNetto"] ?? "",
    JednostkaMiary: row["JednostkaMiary"] ?? "",
    StawkaVAT: row["StawkaVAT"] ?? "",
    categorySlug: row["categorySlug"] ?? "",
    subcategorySlug: row["subcategorySlug"] ?? "",
    Heading: row["Heading"] ?? "",
    Subheading: row["Subheading"] ?? "",
    Description: row["Description"] ?? row["Opis"] ?? "",
  };
}

export function EditProductModal({
  row,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const kod = row["Kod"] ?? "";
  const productItem = useQuery(
    api.catalog.getProductItemByKod,
    open && kod ? { kod } : "skip",
  );
  const updateProduct = useMutation(api.catalog.updateProduct);
  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: rowToDefaultValues(row),
  });

  const sourceRow = (productItem ?? row) as CatalogRow;

  useEffect(() => {
    if (!open) return;
    form.reset(rowToDefaultValues(sourceRow));
  }, [open, sourceRow, form]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: EditProductFormValues) => {
    const updates: Record<string, string> = {};
    for (const key of FORM_KEYS) {
      if (key === "Kod") continue;
      const val = data[key as keyof EditProductFormValues];
      const current =
        key === "categorySlug"
          ? sourceRow.categorySlug
          : key === "subcategorySlug"
            ? sourceRow.subcategorySlug
            : sourceRow[key];
      if (String(val ?? "") !== String(current ?? "")) {
        updates[key] = String(val ?? "");
      }
    }
    if (Object.keys(updates).length === 0) {
      onOpenChange(false);
      onSuccess?.();
      return;
    }
    const toastId = toast.loading("Zapisywanie zmian...");
    try {
      await updateProduct({ kod, updates });
      toast.success("Produkt został zaktualizowany", { id: toastId });
      onOpenChange(false);
      onSuccess?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Błąd zapisu";
      toast.error(msg, { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>Edytuj produkt</DialogTitle>
          <DialogDescription>
            Formularz edycji danych produktu: zdjęcia, kategoria, ceny i opisy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Zdjęcie produktu
              </p>
              <ImageUploadCell row={sourceRow} />
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                form="edit-product-form"
                disabled={isSubmitting}
                className="gap-1"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Zapisz
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="edit-product-form"
            >
              <FormField
                control={form.control}
                name="CenaNetto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cena netto</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categorySlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoria</FormLabel>
                    <FormControl>
                      <CategorySelect
                        currentSlug={field.value}
                        onSelect={(slug) => {
                          field.onChange(slug);
                          form.setValue("subcategorySlug", "");
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subcategorySlug"
                render={({ field }) => (
                  <FormItem data-testid="edit-product-subcategory-field">
                    <FormLabel>Podkategoria</FormLabel>
                    <FormControl>
                      <SubcategorySelect
                        id="edit-product-subcategory"
                        categorySlug={form.watch("categorySlug")}
                        currentSlug={field.value ?? ""}
                        onSelect={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <p className="text-xs text-muted-foreground mb-1">
                      Wyświetlana jako sformatowany tekst. Wklej z strony
                      produktu (Ctrl+V), aby zachować formatowanie.
                    </p>
                    <FormControl>
                      <DescriptionRichField
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        className="resize-y min-h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Kod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kod</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="h-9 bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(["Nazwa", "JednostkaMiary", "StawkaVAT"] as const).map(
                (name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {name === "JednostkaMiary"
                            ? "Jednostka miary"
                            : name === "StawkaVAT"
                              ? "Stawka VAT"
                              : "Nazwa"}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ),
              )}
              <FormField
                control={form.control}
                name="ProductDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heading</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Subheading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subheading</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
