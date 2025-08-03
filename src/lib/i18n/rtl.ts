/**
 * RTL (Right-to-Left) language support configuration
 */
import type { Locale } from './index';

// Languages that use RTL text direction
export const rtlLanguages: Locale[] = ['ar', 'he'];

// RTL-specific CSS classes and utilities
export const rtlUtils = {
  // Get text direction for a locale
  getTextDirection: (locale: Locale): 'ltr' | 'rtl' => {
    return rtlLanguages.includes(locale) ? 'rtl' : 'ltr';
  },

  // Get margin/padding classes for RTL support
  getSpacingClass: (locale: Locale, spacing: string): string => {
    const isRTL = rtlLanguages.includes(locale);
    
    // Convert directional classes to logical ones
    const spacingMap: Record<string, string> = {
      'ml-': isRTL ? 'mr-' : 'ml-',
      'mr-': isRTL ? 'ml-' : 'mr-',
      'pl-': isRTL ? 'pr-' : 'pl-',
      'pr-': isRTL ? 'pl-' : 'pr-',
      'left-': isRTL ? 'right-' : 'left-',
      'right-': isRTL ? 'left-' : 'right-',
    };
    
    let result = spacing;
    Object.entries(spacingMap).forEach(([from, to]) => {
      result = result.replace(new RegExp(from, 'g'), to);
    });
    
    return result;
  },

  // Get flex direction for RTL
  getFlexDirection: (locale: Locale, direction: string = 'row'): string => {
    const isRTL = rtlLanguages.includes(locale);
    
    if (direction === 'row' && isRTL) {
      return 'row-reverse';
    }
    
    return direction;
  },

  // Get text alignment for RTL
  getTextAlign: (locale: Locale, align: string = 'left'): string => {
    const isRTL = rtlLanguages.includes(locale);
    
    if (align === 'left' && isRTL) return 'right';
    if (align === 'right' && isRTL) return 'left';
    
    return align;
  }
};

// RTL-aware Tailwind CSS classes
export const rtlClasses = {
  // Margin classes
  marginStart: 'ms-', // margin-inline-start
  marginEnd: 'me-',   // margin-inline-end
  
  // Padding classes
  paddingStart: 'ps-', // padding-inline-start
  paddingEnd: 'pe-',   // padding-inline-end
  
  // Text alignment
  textStart: 'text-start', // text-align: start
  textEnd: 'text-end',     // text-align: end
  
  // Border classes
  borderStart: 'border-s-', // border-inline-start
  borderEnd: 'border-e-',   // border-inline-end
  
  // Position classes
  start: 'start-', // inset-inline-start
  end: 'end-',     // inset-inline-end
};

// Component-specific RTL configurations
export const rtlComponentConfig = {
  navbar: {
    logoPosition: (locale: Locale) => rtlLanguages.includes(locale) ? 'right' : 'left',
    menuDirection: (locale: Locale) => rtlLanguages.includes(locale) ? 'rtl' : 'ltr',
  },
  
  sidebar: {
    position: (locale: Locale) => rtlLanguages.includes(locale) ? 'right' : 'left',
    iconAlignment: (locale: Locale) => rtlLanguages.includes(locale) ? 'right' : 'left',
  },
  
  modal: {
    closeButtonPosition: (locale: Locale) => rtlLanguages.includes(locale) ? 'left' : 'right',
  },
  
  form: {
    labelAlignment: (locale: Locale) => rtlLanguages.includes(locale) ? 'right' : 'left',
  }
};