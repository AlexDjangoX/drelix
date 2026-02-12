'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { DISPLAY_KEYS } from '@/lib/types';

const EMPTY_ROW = {
  Rodzaj: '',
  JednostkaMiary: 'szt',
  StawkaVAT: '23',
  Kod: '',
  Nazwa: '',
  Opis: '',
  ProductDescription: '',
  CenaNetto: '',
  KodKlasyfikacji: '',
  Uwagi: '',
  OstatniaCenaZakupu: '',
  OstatniaDataZakupu: '',
};

type Props = {
  categorySlug: string;
  disabled?: boolean;
};

export function AddProductRow({ categorySlug, disabled }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [row, setRow] = useState(EMPTY_ROW);
  const [saving, setSaving] = useState(false);
  const createProduct = useMutation(api.catalog.createProduct);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const kod = row.Kod.trim();
    const nazwa = row.Nazwa.trim();
    if (!kod || !nazwa) {
      toast.error('Kod i Nazwa są wymagane');
      return;
    }
    setSaving(true);
    const toastId = toast.loading('Dodawanie produktu...');
    try {
      await createProduct({
        categorySlug,
        row: {
          ...row,
          Kod: kod,
          Nazwa: nazwa,
        },
      });
      toast.success('Produkt został dodany', { id: toastId });
      setRow(EMPTY_ROW);
      setExpanded(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Błąd dodawania';
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setExpanded(false);
    setRow(EMPTY_ROW);
  };

  const colCount = 2 + DISPLAY_KEYS.length + 2; // Photo, Category, DISPLAY_KEYS, Delete, Actions

  if (!expanded) {
    return (
      <tr className="border-b border-border bg-muted/20 hover:bg-muted/30">
        <td colSpan={colCount} className="p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(true)}
            disabled={disabled}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
            Dodaj produkt
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border bg-muted/30">
      <td colSpan={colCount} className="p-2">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex flex-wrap gap-2 items-end">
            {DISPLAY_KEYS.map(({ key }) => (
              <div key={key} className="min-w-24">
                <label className="text-[10px] text-muted-foreground block mb-0.5">
                  {key}
                </label>
                <Input
                  value={row[key as keyof typeof row] ?? ''}
                  onChange={(e) =>
                    setRow((r) => ({ ...r, [key]: e.target.value }))
                  }
                  placeholder={key === 'Kod' ? 'np. ABC123' : ''}
                  className="h-7 text-xs"
                />
              </div>
            ))}
            <div className="flex gap-1 ml-2">
              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="gap-1 h-7"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                Zapisz
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
                className="h-7"
              >
                Anuluj
              </Button>
            </div>
          </div>
        </form>
      </td>
    </tr>
  );
}
