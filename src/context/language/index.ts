/**
 * Language context – public API. Re-exports provider, hook, and types.
 */
export {
  LanguageProvider,
  useLanguage,
} from "@/context/language/LanguageContext";
export type {
  Language,
  Translations,
  LanguageContextValue,
} from "@/context/language/types";
