import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Locale, LocalizedText } from '../../types/menu';
import { uiTranslations, type TranslationKey } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  getLocalizedText: (text?: LocalizedText) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'restaurant_menu_locale';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'km' || saved === 'en') {
        return saved;
      }
    } catch {
      // fallback to default if localStorage is disabled
    }
    return 'km';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: TranslationKey): string => {
    const entry = uiTranslations[key];
    if (!entry) return key;
    return entry[locale] || entry.km || key;
  };

  const getLocalizedText = (text?: LocalizedText): string => {
    if (!text) return '';
    if (locale === 'en' && text.en && text.en.trim() !== '') {
      return text.en;
    }
    // Fall back to Khmer
    return text.km || '';
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, getLocalizedText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
