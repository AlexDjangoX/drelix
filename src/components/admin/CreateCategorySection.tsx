'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CreateCategorySection() {
  const [expanded, setExpanded] = useState(false);
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const createCategory = useMutation(api.catalog.createCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = slug.trim();
    const d = displayName.trim();
    if (!s || !d) {
      toast.error('Wprowadź slug i nazwę kategorii');
      return;
    }
    setSaving(true);
    const toastId = toast.loading('Tworzenie kategorii...');
    try {
      await createCategory({ slug: s, displayName: d });
      toast.success('Kategoria została utworzona', { id: toastId });
      setSlug('');
      setDisplayName('');
      setExpanded(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Błąd tworzenia';
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setExpanded(false);
    setSlug('');
    setDisplayName('');
  };

  return (
    <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
      {!expanded ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setExpanded(true)}
          className="gap-2 dark:text-orange-400 dark:hover:text-white"
        >
          <Plus className="w-4 h-4" />
          Nowa kategoria
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-40">
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Slug (np. moja-kategoria)
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="moja-kategoria"
                className="h-8 text-sm"
              />
            </div>
            <div className="flex-1 min-w-40">
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Nazwa wyświetlana
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Moja kategoria"
                className="h-8 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="gap-1"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Utwórz
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
              >
                Anuluj
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
