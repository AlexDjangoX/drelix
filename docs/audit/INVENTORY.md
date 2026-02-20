# React Audit — Phase 1 Inventory

**Generated:** 2025-02-20

## Client files (`'use client'` / `"use client"`)

### By feature/route

| Route / Feature | Entry / Root | Client files |
|-----------------|--------------|--------------|
| **Admin** | `src/app/admin/page.tsx` | admin/page.tsx, EditProductModal, SubcategoryManager, AddProductRow, SubcategorySelect, ImageUploadCell, ProductRow, DeleteProductButton, DescriptionRichField, CategorySelect, CatalogTable, CsvUploadSection, DeleteCategoryButton, CategoryLabel, CategorySectionTitle, CreateCategorySection, LoginSubmitButton, LoginForm, AdminLoginSection, LunaMascot, useCsvPreview, useCatalogFilter |
| **Products** | `src/app/products/[slug]/...` | ProductSectionNav, ProductPageClient, ProductCardImage, ProductCard, ProductLightbox, ProductSectionCategoryGrid, ProductSection, ProductSectionHeader, ProductSectionCategoryCard, ProductsCatalogClient, ProductsCatalogContent |
| **Hero / Landing** | (layout + home) | ContactSection, ContactMap, ContactForm, ContactSubmitButton, WhyUsSection, WhyUsHeader, WhyUsFeatureGrid, WhyUsFeatureCard, HeroSection, AnimateText, LanguageSelector, TwoToneHeading, DarkToggle |
| **Navbar** | (layout) | useNavbarScroll, NavLink, NavbarScrollProgress, NavbarMobileMenu, NavbarMenuButton, NavbarDesktopLinks, Navbar |
| **Context / Providers** | — | LanguageContext, ConvexClientProvider |
| **UI (shared)** | — | form.tsx, label.tsx, dialog.tsx, sonner.tsx |
| **Hooks (standalone)** | — | useImageDimensions (`src/hooks/useImageDimensions.ts`) |

### Full file list (path from `src/`)

- `app/admin/page.tsx`
- `components/admin/AddProductRow.tsx`
- `components/admin/CatalogTable/CatalogTable.tsx`
- `components/admin/CatalogTable/DeleteCategoryButton.tsx`
- `components/admin/CategoryLabel.tsx`
- `components/admin/CategorySectionTitle.tsx`
- `components/admin/CategorySelect.tsx`
- `components/admin/CreateCategorySection.tsx`
- `components/admin/CsvUploadSection/CsvUploadSection.tsx`
- `components/admin/EditProductModal/EditProductModal.tsx`
- `components/admin/EditProductModal/DescriptionRichField.tsx`
- `components/admin/ImageUploadCell.tsx`
- `components/admin/LunaMascot/LunaMascot.tsx`
- `components/admin/LoginSubmitButton.tsx`
- `components/admin/ProductRow/ProductRow.tsx`
- `components/admin/ProductRow/DeleteProductButton.tsx`
- `components/admin/SubcategoryManager.tsx`
- `components/admin/SubcategorySelect.tsx`
- `components/admin/hooks/useCatalogFilter.ts`
- `components/admin/hooks/useCsvPreview.ts`
- `components/hero/contact/ContactSection.tsx`
- `components/hero/contact/ContactForm.tsx`
- `components/hero/contact/ContactMap.tsx`
- `components/hero/contact/ContactSubmitButton.tsx`
- `components/hero/hero-section/HeroSection.tsx`
- `components/hero/why-us/WhyUsSection.tsx`
- `components/hero/why-us/WhyUsHeader.tsx`
- `components/hero/why-us/WhyUsFeatureGrid.tsx`
- `components/hero/why-us/WhyUsFeatureCard.tsx`
- `components/navbar/useNavbarScroll.ts`
- `components/navbar/NavLink.tsx`
- `components/navbar/NavbarScrollProgress.tsx`
- `components/navbar/NavbarMobileMenu.tsx`
- `components/navbar/NavbarMenuButton.tsx`
- `components/navbar/NavbarDesktopLinks.tsx`
- `components/navbar/Navbar.tsx`
- `components/products/ProductPage/ProductSectionNav.tsx`
- `components/products/ProductPage/ProductPageClient.tsx`
- `components/products/ProductCardImage.tsx`
- `components/products/ProductsCatalog/ProductCard.tsx`
- `components/products/ProductsCatalog/ProductsCatalogClient.tsx`
- `components/products/ProductsCatalog/ProductsCatalogContent.tsx`
- `components/products/ProductLightbox/ProductLightbox.tsx`
- `components/products/ProductSection/ProductSection.tsx`
- `components/products/ProductSection/ProductSectionCategoryGrid.tsx`
- `components/products/ProductSection/ProductSectionHeader.tsx`
- `components/products/ProductSection/ProductSectionCategoryCard.tsx`
- `components/reusable/AnimateText.tsx`
- `components/reusable/LanguageSelector.tsx`
- `components/reusable/TwoToneHeading.tsx`
- `components/reusable/DarkToggle.tsx`
- `components/ui/form.tsx`
- `components/ui/label.tsx`
- `components/ui/dialog.tsx`
- `components/ui/sonner.tsx`
- `context/language/LanguageContext.tsx`
- `context/ConvexClientProvider.tsx`
- `hooks/useImageDimensions.ts`

**Total client files:** 54

## Custom hooks (name starts with `use`)

| Hook | File | Notes |
|------|------|------|
| `useFormField` | `components/ui/form.tsx` | From form context |
| `useImageDimensions` | `hooks/useImageDimensions.ts` | Image dimension cache |
| `useCatalogFilter` | `components/admin/hooks/useCatalogFilter.ts` | Admin catalog filtering |
| `useCsvPreview` | `components/admin/hooks/useCsvPreview.ts` | CSV upload preview |
| `useNavbarScroll` | `components/navbar/useNavbarScroll.ts` | Scroll state + scroll spy |
| `useLanguage` | `context/language/LanguageContext.tsx` | Language context consumer |

External/third-party hooks used (not audited as custom): `useQuery`, `useMutation`, `useForm`, `useInView`, `useReducedMotion`, `useScroll`, `useSpring`, `useFormStatus`, `useActionState`, `usePathname`, `useRouter`, `useTheme`, `useOptimistic`, `useEffectEvent`, `useContext`, `useRef`, `useState`, `useMemo`, `useCallback`, `useId`.
