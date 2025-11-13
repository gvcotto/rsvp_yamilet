import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SUPPORTED_LANGUAGES = ["es", "en"];
const DEFAULT_LANGUAGE = "es";
const STORAGE_KEY = "xv_invite_language";

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      setLanguage(stored);
    }
  }, []);

  const updateLanguage = (next) => {
    const fallback = SUPPORTED_LANGUAGES.includes(next) ? next : DEFAULT_LANGUAGE;
    setLanguage(fallback);
    if (typeof window !== "undefined") {
      try {
        window.localStorage?.setItem(STORAGE_KEY, fallback);
      } catch {
        // ignore write errors (e.g., private mode)
      }
    }
  };

  const toggleLanguage = () => {
    updateLanguage(language === "es" ? "en" : "es");
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: updateLanguage,
      toggleLanguage,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const LANGUAGE_LABELS = {
  es: "Spanish",
  en: "English",
};

export const LANGUAGE_SHORT_LABELS = {
  es: "ES",
  en: "EN",
};

export const AVAILABLE_LANGUAGES = [...SUPPORTED_LANGUAGES];
