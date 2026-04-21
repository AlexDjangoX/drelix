"use client";

import { OBUWIE_WARIANT_OPTIONS } from "@/lib/obuwieWariant";

type Props = {
  /** Same pattern as CategorySelect: current value + setter. */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  "data-testid"?: string;
};

/**
 * Admin footwear variant — native `<select>` like CategorySelect / SubcategorySelect.
 */
export function ObuwieWariantSelect({
  value,
  onChange,
  disabled,
  id,
  "data-testid": dataTestId,
}: Props) {
  return (
    <select
      id={id}
      data-testid={dataTestId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">— brak</option>
      {OBUWIE_WARIANT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.short} — {opt.label}
        </option>
      ))}
    </select>
  );
}
