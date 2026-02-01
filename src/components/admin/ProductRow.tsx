'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploadCell } from '@/components/admin/ImageUploadCell';
import { CategorySelect } from '@/components/admin/CategorySelect';
import { CategoryLabel } from '@/components/admin/CategoryLabel';
import { DISPLAY_KEYS, type CatalogRow } from '@/lib/types';

type Props = { row: CatalogRow };

export function ProductRow({ row }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CatalogRow>(() => ({ ...row }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProduct = useMutation(api.catalog.updateProduct);

  const kod = row['Kod'] ?? '';

  useEffect(() => {
    if (!editing) setDraft({ ...row });
  }, [row, editing]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const toastId = toast.loading('Zapisywanie zmian...');
    try {
      const updates: Record<string, string> = {};
      for (const { key } of DISPLAY_KEYS) {
        if (draft[key] !== row[key]) updates[key] = draft[key] ?? '';
      }
      if (draft.categorySlug !== row.categorySlug) {
        updates.categorySlug = draft.categorySlug ?? '';
      }
      if (Object.keys(updates).length === 0) {
        setEditing(false);
        toast.dismiss(toastId);
        return;
      }
      await updateProduct({ kod, updates });
      setEditing(false);
      toast.success('Produkt został zaktualizowany', { id: toastId });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Błąd zapisu';
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

  return (
    <tr className="border-b border-border hover:bg-muted/30">
      <td className="p-2 align-middle">
        <ImageUploadCell row={row} />
      </td>
      <td className="p-2 align-top">
        {editing ? (
          <CategorySelect
            currentSlug={draft.categorySlug ?? ''}
            onSelect={(slug) => setDraft((d) => ({ ...d, categorySlug: slug }))}
            disabled={saving}
          />
        ) : (
          <CategoryLabel slug={row.categorySlug ?? ''} />
        )}
      </td>
      {DISPLAY_KEYS.map(({ key }) => (
        <td key={key} className="p-2 align-top">
          {editing ? (
            <Input
              value={draft[key] ?? ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, [key]: e.target.value }))
              }
              className="h-8 text-sm"
            />
          ) : (
            <span className="text-sm">{row[key] ?? '—'}</span>
          )}
        </td>
      ))}
      <td className="p-2 align-top text-right">
        {error && (
          <span className="text-xs text-destructive mr-2" role="alert">
            {error}
          </span>
        )}
        {editing ? (
          <span className="flex gap-1 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={saving}
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-1"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </Button>
          </span>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing(true)}
            aria-label="Edit"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </td>
    </tr>
  );
}
