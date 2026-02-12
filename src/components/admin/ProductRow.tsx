'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pencil,
  Save,
  X,
  Loader2,
  Trash2,
  Ban,
  CircleCheckBig,
} from 'lucide-react';
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
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const updateProduct = useMutation(api.catalog.updateProduct);
  const deleteProduct = useMutation(api.catalog.deleteProduct);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDelete(true);
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDelete(false);
  };

  const handleDeleteConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    const toastId = toast.loading('Usuwanie produktu...');
    try {
      await deleteProduct({ kod });
      toast.success('Produkt został usunięty', { id: toastId });
      setConfirmingDelete(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Błąd usuwania';
      toast.error(msg, { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className="border-b border-border hover:bg-muted/30">
      <td className="p-2 align-middle border-r border-border/50">
        <ImageUploadCell row={row} />
      </td>
      <td className="p-2 align-top border-r border-border/50">
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
        <td key={key} className="p-2 align-top border-r border-border/50">
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
      <td className="p-2 align-middle border-r border-border/50">
        <div className="flex items-center gap-1">
          {confirmingDelete ? (
            <>
              <Button
                size="sm"
                className="h-7 text-xs bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                <CircleCheckBig className="w-3.5 h-3.5 mr-1" />
                Usuń
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                <Ban className="w-3.5 h-3.5 mr-1" />
                Anuluj
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600"
              onClick={handleDeleteClick}
              disabled={editing || deleting}
              title="Usuń produkt"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Usuń produkt
            </Button>
          )}
        </div>
      </td>
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
