/**
 * Utility functions for i18n operations
 */
import type { Locale } from '../lib/i18n';

// Detect user's preferred language
export function detectUserLocale(): Locale {
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang') as Locale;
  if (urlLang && isValidLocale(urlLang)) {
    return urlLang;
  }

  // Check localStorage
  const savedLang = localStorage.getItem('preferred-language') as Locale;
  if (savedLang && isValidLocale(savedLang)) {
    return savedLang;
  }

  // Check browser language
  const browserLang = navigator.language.split('-')[0] as Locale;
  if (isValidLocale(browserLang)) {
    return browserLang;
  }

  // Default fallback
  return 'en';
}

// Validate if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
  const validLocales: Locale[] = ['en', 'pt', 'es', 'fr', 'de', 'ar', 'he', 'zh', 'ja'];
  return validLocales.includes(locale as Locale);
}

// Get locale display name
export function getLocaleDisplayName(locale: Locale, displayLocale?: Locale): string {
  const displayNames: Record<Locale, Record<Locale, string>> = {
    en: {
      en: 'English',
      pt: 'Portuguese',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      ar: 'Arabic',
      he: 'Hebrew',
      zh: 'Chinese',
      ja: 'Japanese'
    },
    pt: {
      en: 'Inglês',
      pt: 'Português',
      es: 'Espanhol',
      fr: 'Francês',
      de: 'Alemão',
      ar: 'Árabe',
      he: 'Hebraico',
      zh: 'Chinês',
      ja: 'Japonês'
    },
    es: {
      en: 'Inglés',
      pt: 'Portugués',
      es: 'Español',
      fr: 'Francés',
      de: 'Alemán',
      ar: 'Árabe',
      he: 'Hebreo',
      zh: 'Chino',
      ja: 'Japonés'
    },
    // Add more display names for other locales...
  };

  const currentDisplayLocale = displayLocale || locale;
  return displayNames[currentDisplayLocale]?.[locale] || locale.toUpperCase();
}

// Generate translation keys from nested objects
export function flattenTranslations(
  obj: Record<string, any>, 
  prefix: string = ''
): Record<string, string> {
  const flattened: Record<string, string> = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      Object.assign(flattened, flattenTranslations(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  });
  
  return flattened;
}

// Extract missing translation keys
export function findMissingTranslations(
  sourceLocale: Record<string, string>,
  targetLocale: Record<string, string>
): string[] {
  const sourceKeys = Object.keys(sourceLocale);
  const targetKeys = Object.keys(targetLocale);
  
  return sourceKeys.filter(key => !targetKeys.includes(key));
}

// Validate translation completeness
export function validateTranslations(translations: Record<Locale, Record<string, string>>) {
  const locales = Object.keys(translations) as Locale[];
  const baseLocale = 'en';
  const baseKeys = Object.keys(translations[baseLocale]);
  
  const report: Record<Locale, { missing: string[]; extra: string[] }> = {} as any;
  
  locales.forEach(locale => {
    if (locale === baseLocale) return;
    
    const localeKeys = Object.keys(translations[locale]);
    const missing = baseKeys.filter(key => !localeKeys.includes(key));
    const extra = localeKeys.filter(key => !baseKeys.includes(key));
    
    report[locale] = { missing, extra };
  });
  
  return report;
}

// Format file size with locale-aware units
export function formatFileSize(bytes: number, locale: Locale): string {
  const units = {
    en: ['B', 'KB', 'MB', 'GB', 'TB'],
    pt: ['B', 'KB', 'MB', 'GB', 'TB'],
    es: ['B', 'KB', 'MB', 'GB', 'TB'],
    // Add more locale-specific units if needed
  };
  
  const localeUnits = units[locale] || units.en;
  
  if (bytes === 0) return `0 ${localeUnits[0]}`;
  
  const k = 1024;
  const dm = 2;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${localeUnits[i]}`;
}

// Get appropriate input direction for locale
export function getInputDirection(locale: Locale): 'ltr' | 'rtl' {
  const rtlLocales: Locale[] = ['ar', 'he'];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

// Format trading-specific terms
export function formatTradingTerm(term: string, locale: Locale): string {
  const tradingTerms: Record<Locale, Record<string, string>> = {
    en: {
      'profit-factor': 'Profit Factor',
      'win-rate': 'Win Rate',
      'drawdown': 'Drawdown',
      'sharpe-ratio': 'Sharpe Ratio',
      'backtest': 'Backtest',
      'strategy': 'Strategy',
      'robot': 'Robot',
      'analysis': 'Analysis'
    },
    pt: {
      'profit-factor': 'Fator de Lucro',
      'win-rate': 'Taxa de Acerto',
      'drawdown': 'Drawdown',
      'sharpe-ratio': 'Índice Sharpe',
      'backtest': 'Backtest',
      'strategy': 'Estratégia',
      'robot': 'Robô',
      'analysis': 'Análise'
    }
  };
  
  return tradingTerms[locale]?.[term] || term;
}