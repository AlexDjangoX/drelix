"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Language, LanguageContextValue } from "@/context/language/types";
import { translations } from "@/context/language/translations";
import {
  DEFAULT_LANGUAGE,
  getStoredLanguage,
  persistLanguage,
} from "@/context/language/storage";

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Fixed default so server and first client render match (avoids hydration mismatch).
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  React.useEffect(() => {
    setLanguageState(getStoredLanguage());
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    persistLanguage(lang);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
