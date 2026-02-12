/**
 * Language persistence (localStorage). Client-only; no React.
 */
import type { Language } from "@/context/language/types";

export const LANGUAGE_STORAGE_KEY = "drelix-language";

export const DEFAULT_LANGUAGE: Language = "pl";

/**
 * Returns the language to use. On the server always returns DEFAULT_LANGUAGE
 * so SSR and first client render match (avoids hydration mismatch).
 * On the client reads from localStorage.
 */
export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "pl" || stored === "en") return stored;
  return DEFAULT_LANGUAGE;
}

/**
 * Persists the selected language to localStorage. Call only on the client.
 */
export function persistLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}
