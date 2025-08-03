/**
 * Custom hooks for i18n functionality
 */
import { useCallback } from 'react';
import { useI18n } from '../lib/i18n';

// Hook for pluralization
export function usePluralization() {
  const { locale, t } = useI18n();

  const pluralize = useCallback((
    key: string, 
    count: number, 
    params?: Record<string, string | number>
  ): string => {
    const pluralKey = count === 1 ? `${key}.singular` : `${key}.plural`;
    return t(pluralKey, { count, ...params });
  }, [t]);

  return { pluralize };
}

// Hook for date formatting with common presets
export function useDateFormatting() {
  const { formatDate, formatRelativeTime, locale } = useI18n();

  const formatters = {
    short: (date: Date | string) => formatDate(date, { 
      month: 'short', 
      day: 'numeric' 
    }),
    
    long: (date: Date | string) => formatDate(date, { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    
    time: (date: Date | string) => formatDate(date, { 
      hour: '2-digit',
      minute: '2-digit'
    }),
    
    datetime: (date: Date | string) => formatDate(date, { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    
    relative: formatRelativeTime
  };

  return formatters;
}

// Hook for number formatting with common presets
export function useNumberFormatting() {
  const { formatNumber, formatCurrency, locale } = useI18n();

  const formatters = {
    integer: (num: number) => formatNumber(num, { maximumFractionDigits: 0 }),
    
    decimal: (num: number, decimals: number = 2) => formatNumber(num, { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }),
    
    percentage: (num: number, decimals: number = 1) => formatNumber(num, { 
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }),
    
    currency: formatCurrency,
    
    compact: (num: number) => formatNumber(num, { 
      notation: 'compact',
      maximumFractionDigits: 1 
    })
  };

  return formatters;
}

// Hook for validation messages
export function useValidationMessages() {
  const { t } = useI18n();

  const getValidationMessage = useCallback((
    field: string, 
    rule: string, 
    params?: Record<string, string | number>
  ): string => {
    const key = `validation.${field}.${rule}`;
    return t(key, params);
  }, [t]);

  return { getValidationMessage };
}

// Hook for loading states
export function useLoadingStates() {
  const { t } = useI18n();

  const loadingMessages = {
    loading: () => t('status.loading'),
    saving: () => t('status.saving'),
    deleting: () => t('status.deleting'),
    uploading: () => t('status.uploading'),
    analyzing: () => t('analysis.analyzing'),
    processing: () => t('status.processing')
  };

  return loadingMessages;
}