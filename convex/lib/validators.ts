import { v } from 'convex/values';

/** Convex validators for product fields (CSV row shape). Must be explicit for Convex defineTable. */
export const productFieldValidators = {
  Rodzaj: v.string(),
  JednostkaMiary: v.string(),
  StawkaVAT: v.string(),
  Kod: v.string(),
  Nazwa: v.string(),
  Opis: v.optional(v.string()),
  CenaNetto: v.string(),
  KodKlasyfikacji: v.string(),
  Uwagi: v.string(),
  OstatniaCenaZakupu: v.string(),
  OstatniaDataZakupu: v.string(),
};

/** Single product row from CSV or "Add product" form. */
export const productRowValidator = v.object(productFieldValidators);

/** Section shape for catalog UI and CSV replace. */
export const sectionValidator = v.object({
  slug: v.string(),
  titleKey: v.string(),
  items: v.array(
    v.object({
      ...productFieldValidators,
      categorySlug: v.optional(v.string()),
    })
  ),
});

/** Category seed: slug + titleKey. */
export const categorySeedValidator = v.object({
  slug: v.string(),
  titleKey: v.string(),
});
