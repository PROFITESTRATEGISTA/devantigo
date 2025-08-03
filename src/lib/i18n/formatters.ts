/**
 * Locale-specific formatters for dates, numbers, and currencies
 */
import type { Locale } from './index';

export const formatters = {
  formatDate: (
    date: Date, 
    locale: Locale, 
    options: Intl.DateTimeFormatOptions = {}
  ): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    try {
      return new Intl.DateTimeFormat(getIntlLocale(locale), defaultOptions).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toLocaleDateString();
    }
  },

  formatNumber: (
    number: number, 
    locale: Locale, 
    options: Intl.NumberFormatOptions = {}
  ): string => {
    try {
      return new Intl.NumberFormat(getIntlLocale(locale), options).format(number);
    } catch (error) {
      console.error('Number formatting error:', error);
      return number.toString();
    }
  },

  formatCurrency: (
    amount: number, 
    locale: Locale, 
    currency: string = 'BRL'
  ): string => {
    // Map locales to their preferred currencies
    const currencyMap: Record<Locale, string> = {
      'pt': 'BRL',
      'en': 'USD',
      'es': 'EUR',
      'fr': 'EUR',
      'de': 'EUR',
      'ar': 'USD',
      'he': 'ILS',
      'zh': 'CNY',
      'ja': 'JPY'
    };

    const preferredCurrency = currency || currencyMap[locale] || 'USD';
    
    try {
      return new Intl.NumberFormat(getIntlLocale(locale), {
        style: 'currency',
        currency: preferredCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `${preferredCurrency} ${amount.toFixed(2)}`;
    }
  },

  formatRelativeTime: (date: Date, locale: Locale): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    try {
      const rtf = new Intl.RelativeTimeFormat(getIntlLocale(locale), { 
        numeric: 'auto',
        style: 'short'
      });
      
      if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
      } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
      } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
      } else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
      } else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
      } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
      }
    } catch (error) {
      console.error('Relative time formatting error:', error);
      return formatFallbackRelativeTime(diffInSeconds, locale);
    }
  },

  formatPercentage: (value: number, locale: Locale, decimals: number = 2): string => {
    try {
      return new Intl.NumberFormat(getIntlLocale(locale), {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value / 100);
    } catch (error) {
      console.error('Percentage formatting error:', error);
      return `${value.toFixed(decimals)}%`;
    }
  }
};

// Helper function to convert our locale to Intl locale
function getIntlLocale(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    'en': 'en-US',
    'pt': 'pt-BR',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'ar': 'ar-SA',
    'he': 'he-IL',
    'zh': 'zh-CN',
    'ja': 'ja-JP'
  };
  
  return localeMap[locale] || 'en-US';
}

// Fallback relative time formatting for unsupported browsers
function formatFallbackRelativeTime(diffInSeconds: number, locale: Locale): string {
  const translations = {
    en: {
      now: 'just now',
      minutesAgo: (n: number) => `${n} minute${n !== 1 ? 's' : ''} ago`,
      hoursAgo: (n: number) => `${n} hour${n !== 1 ? 's' : ''} ago`,
      daysAgo: (n: number) => `${n} day${n !== 1 ? 's' : ''} ago`
    },
    pt: {
      now: 'agora mesmo',
      minutesAgo: (n: number) => `há ${n} minuto${n !== 1 ? 's' : ''}`,
      hoursAgo: (n: number) => `há ${n} hora${n !== 1 ? 's' : ''}`,
      daysAgo: (n: number) => `há ${n} dia${n !== 1 ? 's' : ''}`
    }
  };
  
  const t = translations[locale] || translations.en;
  
  if (diffInSeconds < 60) {
    return t.now;
  } else if (diffInSeconds < 3600) {
    return t.minutesAgo(Math.floor(diffInSeconds / 60));
  } else if (diffInSeconds < 86400) {
    return t.hoursAgo(Math.floor(diffInSeconds / 3600));
  } else {
    return t.daysAgo(Math.floor(diffInSeconds / 86400));
  }
}