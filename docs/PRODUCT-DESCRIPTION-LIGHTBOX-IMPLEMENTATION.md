# Product Description & Lightbox Implementation

**Document purpose:** Technical review for senior developers.  
**Scope:** Rich product descriptions (HTML paste, sanitization, admin UX, lightbox display, theme-aware styling); product price display (Brutto).  
**Last updated:** February 2026.

---

## 1. Overview

We implemented end-to-end support for **rich product descriptions** and **Brutto price display**:

- Allow admins to **paste from client product pages** and preserve structure (paragraphs, bold, lists, inline colors).
- Store and use **HTML** in the database; admins see **rendered text** in the edit form, not raw tags.
- Display descriptions in a **product lightbox** with a fixed layout (image top half, scrollable description, orange strip with name and price).
- Respect **dark/light mode** by overriding pasted inline colors so the description block always uses theme foreground/background.
- Show **Brutto** (gross) prices everywhere on the site: computed from **Cena netto** and **Stawka VAT**; admin and data model remain netto + VAT.

No product- or language-specific logic is used; behavior is driven by structure (HTML vs plain text) and clipboard format.

---

## 2. Architecture & Data Flow

### 2.1 Backend (Convex)

- **Schema:** Products table includes optional `Heading`, `Subheading`, `Description` (all strings; `Description` may contain HTML).
- **Catalog:** `productToItem()` spreads full product doc (including these fields) into catalog items; `listCatalogSections` and `getCatalogSection` return items with `Heading`, `Subheading`, `Description`.
- **Admin form data:** `getProductItemByKod({ kod })` returns a single product as a catalog item so the edit form always loads the latest DB state (including description) when the modal opens.

```ts
// convex/catalog.ts – single-product fetch for edit form
export const getProductItemByKod = query({
  args: { kod: v.string() },
  handler: async (ctx, { kod }) => {
    if (!kod.trim()) return null;
    const product = await ctx.db
      .query("products")
      .withIndex("by_kod", (q) => q.eq("Kod", kod.trim()))
      .unique();
    if (!product) return null;
    return productToItem(ctx, product);
  },
});
```

- **Validation:** Convex validators allow optional strings for these fields; no server-side HTML sanitization (handled on input and display).

### 2.2 Frontend Mapping (Catalog → Lightbox)

Product page builds `ProductItem[]` from `getCatalogSection`, maps Convex row keys to camelCase, and sets **price** to the **Brutto** value (see §2.4) for display in grid and lightbox:

```ts
// src/components/products/ProductPage/ProductPageClient.tsx (excerpt)
const items: ProductItem[] = useMemo(() => {
  if (!sectionFromConvex) return [];
  return sectionFromConvex.items.map((row) => {
    const netto = row.CenaNetto ?? "";
    const brutto = computeBruttoPrice(netto, row.StawkaVAT ?? "");
    return {
      id: row[COD] ?? "",
      src: row.thumbnailUrl || row.imageUrl || PLACEHOLDER_PRODUCT_IMAGE,
      largeSrc: row.imageUrl || row.thumbnailUrl || PLACEHOLDER_PRODUCT_IMAGE,
      name: row.Nazwa ?? "",
      price: brutto || netto,
      unit: row.JednostkaMiary ?? "",
      heading: row.Heading?.trim() || undefined,
      subheading: row.Subheading?.trim() || undefined,
      description: row.Description?.trim() || undefined,
    };
  });
}, [sectionFromConvex]);
```

### 2.3 Edit Form (Admin)

- Edit modal uses **`getProductItemByKod`** when open so the form is populated from the DB (avoids stale table data missing Heading/Subheading/Description).
- Description is edited in a **contenteditable** component that displays HTML as rich text and stores HTML in form state; submit sends the same HTML string via `updateProduct`.

### 2.4 Price Display (Brutto)

- **Stored data:** Products store **Cena netto** and **Stawka VAT** (percentage, e.g. `"23"`). No Brutto field is stored.
- **Display:** All customer-facing product UIs show **Brutto** (gross) price: `Brutto = Netto × (1 + StawkaVAT/100)`, formatted to 2 decimal places.
- **Helper:** `src/lib/price.ts` exports `computeBruttoPrice(netto: string, vatRatePercent: string): string`. It parses numeric strings (comma or dot), applies the formula, and returns a formatted string or `""` if netto is invalid; missing or invalid VAT is treated as 0%.
- **Where used:** (1) **ProductPageClient** — when building `ProductItem[]`, `price` is set to Brutto (fallback to netto if Brutto is empty); (2) **ProductGridCard** and **LightboxContent** — display `item.price` with label "brutto"; (3) **ProductCard** (catalog on homepage) — computes Brutto from `row.CenaNetto` and `row.StawkaVAT` and displays it with "brutto".

---

## 3. HTML Sanitization (`src/lib/sanitizeHtml.ts`)

All description HTML is passed through one public function before display or after paste.

### 3.1 Strategy

- **If the string contains HTML tags** (regex: `/<[a-z][\s\S]*>/i`): sanitize only; structure and allowed inline styles are preserved.
- **If plain text:** convert to minimal HTML using structure-only rules (paragraphs, bullet/numbered lines, `**bold**`), then sanitize.

No product- or language-specific keywords (e.g. no special handling for “Charakterystyka” or “Kolor”).

### 3.2 Allowed Tags & Attributes

```ts
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i",
  "ul", "ol", "li", "sub", "sup", "span",
  "h2", "h3",
];

// DOMPurify config
DOMPurify.sanitize(toSanitize, {
  ALLOWED_TAGS,
  ALLOWED_ATTR: ["style"],
});
```

- **`style`** is allowed so pasted inline colors/styles are preserved in storage; display-time overrides (see §6) then force theme colors for the description block.
- Script, iframe, event handlers, etc. are stripped by DOMPurify’s default behavior.

### 3.3 Plain-Text Conversion Rules

When input has no HTML tags:

- **Paragraphs:** Blocks separated by blank lines → `<p>...</p>`; single newlines within a block → `<br>`.
- **Lists:** Lines that start with `-`, `*`, `•`, `·`, or `1.` (etc.) → `<ul><li>...</li></ul>`; leading bullet/number is stripped from the visible text.
- **Bold:** `**text**` → `<strong>text</strong>`.

All user content is HTML-escaped before inserting into tags; then the result is sanitized.

### 3.4 Dependencies

- **isomorphic-dompurify:** Used so the same sanitizer runs on server and client and avoids hydration mismatch when description is rendered in the lightbox (and in admin).

### 3.5 Code Example (Public API)

```ts
// src/lib/sanitizeHtml.ts

export function sanitizeProductDescriptionHtml(html: string): string {
  if (!html || typeof html !== "string") return "";
  const trimmed = html.trim();
  const hasTags = /<[a-z][\s\S]*>/i.test(trimmed);
  const toSanitize = hasTags ? trimmed : plainTextToStructuredHtml(trimmed);
  try {
    return DOMPurify.sanitize(toSanitize, {
      ALLOWED_TAGS,
      ALLOWED_ATTR: ["style"],
    });
  } catch {
    return stripTags(toSanitize);
  }
}
```

---

## 4. Admin: Rich Description Field

### 4.1 Requirement

Admins should see the description as **normal formatted text** (paragraphs, bold, lists, colors) while we **store and submit HTML**.

### 4.2 Implementation: `DescriptionRichField`

- **Component:** `src/components/admin/EditProductModal/DescriptionRichField.tsx`
- **Behavior:**
  - A **contenteditable** `div` displays the current value as HTML (`innerHTML`).
  - Form state holds the same HTML string; `value` / `onChange` are the single source of truth.
  - **Sync:** `useEffect` updates the div’s `innerHTML` when `value` changes (e.g. when modal opens or product is loaded via `getProductItemByKod`), and only when the current `innerHTML` differs from the next value to avoid cursor thrash.
  - **Paste:** `onPaste` reads `text/html` from the clipboard; if present, we prevent default, sanitize with `sanitizeProductDescriptionHtml`, insert at the current selection (or replace content if selection is not in the field), then call `onChange` with the div’s updated `innerHTML`.

```tsx
// Paste: prefer clipboard HTML so structure is preserved (e.g. from client product page)
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
  const rangeInEl = range && (el.contains(range.commonAncestorContainer) || el === range.commonAncestorContainer);
  if (rangeInEl && range) {
    try {
      range.deleteContents();
      const frag = range.createContextualFragment(sanitized);
      range.insertNode(frag);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    } catch {
      el.innerHTML += sanitized;
    }
  } else {
    el.innerHTML = sanitized;
  }
  onChange(el.innerHTML);
};
```

- **Theme:** The contenteditable (and its contents) use the `theme-override-rich` class so pasted inline colors/backgrounds are overridden by theme foreground/background (see §6).

### 4.3 Integration in Edit Modal

The Description form field uses `DescriptionRichField` instead of a plain textarea; the hint tells admins to paste from the product page to keep formatting.

```tsx
// src/components/admin/EditProductModal/EditProductModal.tsx (excerpt)
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
```

### 4.4 Validation (Zod)

- **Description** max length: **100,000 characters** (to support long pasted HTML; Convex document size limit allows it).
- Other product string fields remain at 500 (or similar) as in `editProductSchema.ts`.

---

## 5. Lightbox Layout & Content

### 5.1 Structure

- **Top half:** Product image (fixed 50% height, `object-contain`).
- **Middle:** Scrollable area; **only rendered when `description` is non-empty.** When present, it shows only the description HTML (sanitized and rendered). No subheading or price in the middle.
- **Bottom:** Fixed orange strip with heading (name or custom) and price line (**Brutto** + unit when present).

When Description is empty, the middle block is empty and the price appears only in the orange strip.

### 5.2 Content Logic

- **Heading** for the strip: `item.heading ?? item.name`.
- **Price line:** `item.price` (Brutto from ProductPageClient) is shown as `"{price} zł brutto"` with optional `" / {unit}"`. No price/subheading in the scrollable description block.
- **Middle section:** Only when `item.description` is non-empty, a single scrollable div renders the sanitized description HTML with the theme-override class.

```ts
// src/components/products/ProductLightbox/LightboxContent.tsx (excerpt)

const heading = item.heading?.trim() || item.name;
const description = item.description?.trim() || "";

// Middle: only description (no subheading/price; price is in the orange strip)
{description ? (
  <div className="... overflow-y-auto ...">
    <div
      className="theme-override-rich product-description ..."
      dangerouslySetInnerHTML={{
        __html: sanitizeProductDescriptionHtml(description),
      }}
    />
  </div>
) : null}

// Orange strip at bottom (name + price)
{(item.price || item.unit) && (
  <p className="...">
    {item.price ? `${item.price} zł brutto${item.unit ? ` / ${item.unit}` : ""}` : item.unit}
  </p>
)}
```

- Description is **always** sanitized at render time (no assumption that stored HTML is already safe).
- Typography (lists, headings, strong, sub/sup) is styled via Tailwind `[&_...]` selectors on the wrapper.

### 5.3 Scrollability

The middle section uses `flex-1 min-h-0 overflow-y-auto` so it takes remaining space and scrolls when content is long.

---

## 6. Theme Override (Dark/Light Mode)

### 6.1 Problem

Pasted HTML can include inline `color` and `background` (e.g. from client sites). Those would otherwise ignore the app theme and break contrast in dark or light mode.

### 6.2 Solution: `.theme-override-rich`

A single utility class in **`src/app/globals.css`** forces the description block and all descendants to use theme foreground and no pasted backgrounds:

```css
@layer utilities {
  .theme-override-rich,
  .theme-override-rich * {
    color: hsl(var(--foreground)) !important;
    background-color: transparent !important;
    background-image: none !important;
  }
  .theme-override-rich *::before,
  .theme-override-rich *::after {
    background-color: transparent !important;
  }
}
```

- **Where used:** (1) Lightbox description wrapper (`LightboxContent`), (2) Admin `DescriptionRichField` contenteditable.
- **Effect:** All text in the description follows `--foreground`; backgrounds are transparent so the container’s theme background shows. Inline pasted colors are overridden by design so the block always respects dark/light mode.

---

## 7. Security Notes

- **XSS:** All description HTML is sanitized with DOMPurify (allowlist tags + `style` only) before being rendered with `dangerouslySetInnerHTML`. No scripts, iframes, or event attributes are allowed.
- **Storage:** Convex stores the string as-is; no server-side HTML parsing. Sanitization is applied on paste (admin) and on display (admin + lightbox).
- **Paste:** Only `text/html` from the clipboard is used when present; otherwise the browser’s default paste behavior applies (plain text in contenteditable).

---

## 8. File Summary

| Path | Role |
|------|------|
| `src/lib/sanitizeHtml.ts` | Sanitize + optional plain-text→HTML; DOMPurify config; `sanitizeProductDescriptionHtml`, `isHtml` |
| `src/lib/price.ts` | `computeBruttoPrice(netto, vatRatePercent)` — Brutto from netto + VAT %; used for all product price display |
| `src/components/admin/EditProductModal/DescriptionRichField.tsx` | Contenteditable description field: display HTML, store HTML, paste HTML from clipboard |
| `src/components/admin/EditProductModal/EditProductModal.tsx` | Uses `DescriptionRichField` for Description; loads row from `getProductItemByKod` when modal open |
| `src/components/products/ProductLightbox/LightboxContent.tsx` | Lightbox layout; image / scrollable description (when present) / orange strip (name + Brutto price); sanitize + theme class |
| `src/app/globals.css` | `.theme-override-rich` for theme-aware description text/background |
| `src/components/products/ProductPage/ProductPageClient.tsx` | Maps Convex catalog items to `ProductItem`; sets `price` to Brutto; `heading`, `subheading`, `description` |
| `src/components/products/ProductGrid/ProductGridCard.tsx` | Grid card; displays `item.price` as Brutto with unit |
| `src/components/products/ProductsCatalog/ProductCard.tsx` | Catalog card (e.g. homepage); computes and displays Brutto from row CenaNetto + StawkaVAT |
| `convex/catalog.ts` | `getProductItemByKod`; catalog queries return items with `Heading`, `Subheading`, `Description`, `CenaNetto`, `StawkaVAT` |
| `convex/lib/validators.ts` | Optional string validators for product fields |
| `convex/lib/constants.ts` | `PRODUCT_FIELD_KEYS` / `ALLOWED_UPDATE_KEYS` include Description |
| `src/components/admin/EditProductModal/editProductSchema.ts` | Zod schema; `Description` max 100_000 |

---

## 9. Testing Suggestions

- **Paste from client product page:** Copy a product description from the client site, paste into admin Description; confirm structure (paragraphs, lists, bold) and that stored value is HTML; confirm lightbox shows same structure and theme colors.
- **Plain-text paste:** Paste plain text with bullets (`-` or `*`) and `**bold**`; confirm conversion to lists and `<strong>`.
- **Empty description:** Confirm lightbox middle section is empty and price appears only in the orange strip.
- **Theme toggle:** In both admin and lightbox, switch dark/light mode; confirm description text and background follow theme (no stuck white/black from pasted styles).
- **XSS:** Try pasting or saving HTML with `<script>`, `onerror=`, etc.; confirm it is stripped and not executed.
- **Brutto price:** For a product with Cena netto and Stawka VAT set, confirm catalog cards, product grid, and lightbox show the Brutto value (e.g. netto 100, VAT 23% → 123.00 zł brutto) and label "brutto" (not "netto").

---

## 10. Possible Follow-Ups

- **Allow specific accent colors:** If needed, narrow `.theme-override-rich` so only block-level elements (e.g. `p`, `li`, `h2`) get forced theme color and `span[style]` can keep a limited allowlist of colors.
- **Admin “raw HTML” view:** Optional toggle to show/edit the stored HTML source for power users.
- **Convex length check:** Optional server-side length check for `Description` (e.g. 100k) to fail fast on oversized payloads.

---

*End of implementation document.*
