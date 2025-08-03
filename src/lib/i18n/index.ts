/**
 * Main i18n configuration and setup
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from './translations';
import { formatters } from './formatters';
import { rtlLanguages } from './rtl';

export type Locale = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'ar' | 'he' | 'zh' | 'ja';

export interface I18nState {
  locale: Locale;
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatRelativeTime: (date: Date | string) => string;
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'pt',
      isRTL: false,

      setLocale: (locale: Locale) => {
        const isRTL = rtlLanguages.includes(locale);
        
        // Update document direction
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
        
        set({ locale, isRTL });
      },

      t: (key: string, params?: Record<string, string | number>) => {
        const { locale } = get();
        const translation = translations[locale]?.[key] || translations['en'][key] || key;
        
        if (!params) return translation;
        
        // Replace parameters in translation
        return Object.entries(params).reduce((text, [param, value]) => {
          return text.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
        }, translation);
      },

      formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
        const { locale } = get();
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return formatters.formatDate(dateObj, locale, options);
      },

      formatNumber: (number: number, options?: Intl.NumberFormatOptions) => {
        const { locale } = get();
        return formatters.formatNumber(number, locale, options);
      },

      formatCurrency: (amount: number, currency = 'BRL') => {
        const { locale } = get();
        return formatters.formatCurrency(amount, locale, currency);
      },

      formatRelativeTime: (date: Date | string) => {
        const { locale } = get();
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return formatters.formatRelativeTime(dateObj, locale);
      }
    }),
    {
      name: 'i18n-storage',
      partialize: (state) => ({ locale: state.locale })
    }
  )
);

// Initialize locale on app start
export const initializeI18n = () => {
  const { locale, setLocale } = useI18n.getState();
  
  // Detect browser language if no saved preference
  if (!locale) {
    const browserLang = navigator.language.split('-')[0] as Locale;
    const supportedLang = ['en', 'pt', 'es', 'fr', 'de', 'ar', 'he', 'zh', 'ja'].includes(browserLang) 
      ? browserLang 
      : 'en';
    setLocale(supportedLang);
  } else {
    setLocale(locale);
  }
};