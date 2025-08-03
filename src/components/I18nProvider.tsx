/**
 * I18n Provider component for managing internationalization context
 */
import React, { useEffect, ReactNode } from 'react';
import { useI18n, initializeI18n } from '../lib/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { locale, isRTL, setLocale } = useI18n();

  useEffect(() => {
    // Initialize i18n on app start
    initializeI18n();
  }, []);

  useEffect(() => {
    // Update document attributes when locale changes
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Add locale-specific CSS classes
    document.documentElement.className = document.documentElement.className
      .replace(/locale-\w+/g, '')
      .replace(/dir-\w+/g, '') + ` locale-${locale} dir-${isRTL ? 'rtl' : 'ltr'}`;
  }, [locale, isRTL]);

  return <>{children}</>;
}

// Hook for accessing i18n in components
export function useTranslation() {
  const { t, locale, isRTL, formatDate, formatNumber, formatCurrency, formatRelativeTime } = useI18n();
  
  return {
    t,
    locale,
    isRTL,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime
  };
}

// Higher-order component for i18n
export function withI18n<P extends object>(Component: React.ComponentType<P>) {
  return function I18nComponent(props: P) {
    const i18n = useTranslation();
    return <Component {...props} {...i18n} />;
  };
}