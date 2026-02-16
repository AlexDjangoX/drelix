"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { sanitizeProductDescriptionHtml } from "@/lib/sanitizeHtml";

type Props = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
};

/**
 * Renders product description as rich text (admin sees formatted content).
 * Stores and submits HTML. Paste from webpage keeps structure and styles.
 */
export function DescriptionRichField({
  value,
  onChange,
  disabled,
  className,
  "data-testid": testId,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const currentHtml = ref.current.innerHTML;
    const next = value ?? "";
    if (currentHtml === next) return;
    ref.current.innerHTML = next;
  }, [value]);

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const html = e.clipboardData?.getData("text/html");
    if (!html) return;
    e.preventDefault();
    const sanitized = sanitizeProductDescriptionHtml(html);
    if (!sanitized) return;
    const el = ref.current;
    if (!el) return;
    const sel = window.getSelection();
    const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
    const rangeInEl =
      range &&
      (el.contains(range.commonAncestorContainer) ||
        el === range.commonAncestorContainer);
    if (rangeInEl && range) {
      try {
        range.deleteContents();
        const frag = range.createContextualFragment(sanitized);
        range.insertNode(frag);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      } catch {
        // Fallback if Selection API fails (e.g. in some browsers)
        el.innerHTML += sanitized;
      }
    } else {
      el.innerHTML = sanitized;
    }
    onChange(el.innerHTML);
  };

  return (
    <div
      ref={ref}
      role="textbox"
      aria-multiline="true"
      aria-label="Opis produktu"
      data-slot="description-rich"
      data-testid={testId}
      contentEditable={!disabled}
      suppressContentEditableWarning
      className={cn(
        "theme-override-rich border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] overflow-y-auto",
        "prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_p]:my-1 [&_strong]:font-semibold",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onInput={handleInput}
      onPaste={handlePaste}
    />
  );
}
