"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { toast } from "sonner";
import { ImageUploadCell } from "@/components/admin/ImageUploadCell";
import { CategorySelect } from "@/components/admin/CategorySelect";
import { CategoryLabel } from "@/components/admin/CategoryLabel";
import { DeleteProductButton } from "@/components/admin/ProductRow/DeleteProductButton";
import { ProductRowActions } from "@/components/admin/ProductRow/ProductRowActions";
import { ProductRowFields } from "@/components/admin/ProductRow/ProductRowFields";
import { DISPLAY_KEYS, type CatalogRow } from "@/lib/types";

type Props = { row: CatalogRow };

export function ProductRow({ row }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CatalogRow>(() => ({ ...row }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProduct = useMutation(api.catalog.updateProduct);

  const kod = row["Kod"] ?? "";

  useEffect(() => {
    if (!editing) setDraft({ ...row });
  }, [row, editing]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const toastId = toast.loading("Zapisywanie zmian...");
    try {
      const updates: Record<string, string> = {};
      for (const { key } of DISPLAY_KEYS) {
        if (draft[key] !== row[key]) updates[key] = draft[key] ?? "";
      }
      if (draft.categorySlug !== row.categorySlug) {
        updates.categorySlug = draft.categorySlug ?? "";
      }
      if (Object.keys(updates).length === 0) {
        setEditing(false);
        toast.dismiss(toastId);
        return;
      }
      await updateProduct({ kod, updates });
      setEditing(false);
      toast.success("Produkt został zaktualizowany", { id: toastId });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Błąd zapisu";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft({ ...row });
    setEditing(false);
    setError(null);
  };

  const handleFieldChange = (key: string, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  return (
    <tr className="border-b border-border hover:bg-muted/30">
      <td className="p-2 align-middle border-r border-border/50">
        <ImageUploadCell row={row} />
      </td>
      <td className="p-2 align-top border-r border-border/50">
        {editing ? (
          <CategorySelect
            currentSlug={draft.categorySlug ?? ""}
            onSelect={(slug) => setDraft((d) => ({ ...d, categorySlug: slug }))}
            disabled={saving}
          />
        ) : (
          <CategoryLabel slug={row.categorySlug ?? ""} />
        )}
      </td>
      <ProductRowFields
        editing={editing}
        row={row}
        draft={draft}
        saving={saving}
        onFieldChange={handleFieldChange}
      />
      <td className="p-2 align-middle border-r border-border/50">
        <DeleteProductButton kod={kod} disabled={editing} />
      </td>
      <ProductRowActions
        editing={editing}
        saving={saving}
        error={error}
        onEdit={() => setEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </tr>
  );
}
