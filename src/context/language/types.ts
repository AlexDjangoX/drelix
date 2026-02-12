/**
 * Language and translation types. Shared by context, translations, and storage.
 */

export type Language = "pl" | "en";

export interface Translations {
  nav: {
    about: string;
    products: string;
    whyUs: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    scrollToMap: string;
    trust1: string;
    trust2: string;
    trust3: string;
  };
  about: {
    title: string;
    description: string;
    experience: string;
    quality: string;
    trust: string;
    storePhoto: string;
  };
  products: {
    title: string;
    subtitle: string;
    viewAll: string;
    catalogTitle: string;
    catalogSubtitle: string;
    catalogCount: string;
    catalogOther: string;
    catalogCustomCategory: string;
    viewFullCatalog: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
    quality: { title: string; description: string };
    range: { title: string; description: string };
    expert: { title: string; description: string };
    prices: { title: string; description: string };
    local: { title: string; description: string };
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    emailCta: string;
    emailCtaValue: string;
    hours: string;
    hoursValue: string;
    form: {
      name: string;
      email: string;
      message: string;
      send: string;
      success: string;
      error: string;
      placeholderMessage: string;
      sending: string;
    };
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    quickLinksTitle: string;
    followUs: string;
  };
  productNames: {
    helmets: string;
    vests: string;
    gloves: string;
    polbuty: string;
    trzewiki: string;
    sandaly: string;
    kalosze: string;
    footwear: string;
    clothing: string;
    koszula: string;
    caps: string;
    aprons: string;
    sweatshirts: string;
    jackets: string;
    eyewear: string;
    earProtection: string;
    masks: string;
    harnesses: string;
    firstAid: string;
    rainwear: string;
    thermalWear: string;
    kneeProtection: string;
    signage: string;
    accessories: string;
    wkladki: string;
    polar: string;
    reczniki: string;
    klapki: string;
    kurtkiSoftshell: string;
    spodnieKrotkie: string;
    spodnieOcieplane: string;
    kamizelkiOcieplane: string;
    odziezGastronomiczna: string;
    tShirt: string;
    ogrodniczki: string;
  };
}

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}
