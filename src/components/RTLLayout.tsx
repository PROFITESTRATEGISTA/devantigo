/**
 * RTL Layout component for handling right-to-left languages
 */
import React, { ReactNode } from 'react';
import { useI18n } from '../lib/i18n';
import { rtlUtils } from '../lib/i18n/rtl';

interface RTLLayoutProps {
  children: ReactNode;
  className?: string;
}

export function RTLLayout({ children, className = '' }: RTLLayoutProps) {
  const { locale, isRTL } = useI18n();

  const layoutClasses = [
    className,
    isRTL ? 'rtl' : 'ltr',
    `locale-${locale}`
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={layoutClasses}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {children}
    </div>
  );
}

// RTL-aware spacing component
interface RTLSpacingProps {
  children: ReactNode;
  className?: string;
  spacing?: 'margin' | 'padding';
  direction?: 'start' | 'end' | 'x' | 'y';
  size?: string;
}

export function RTLSpacing({ 
  children, 
  className = '', 
  spacing = 'margin',
  direction = 'start',
  size = '4'
}: RTLSpacingProps) {
  const { locale } = useI18n();
  
  const getSpacingClass = () => {
    const prefix = spacing === 'margin' ? 'm' : 'p';
    
    switch (direction) {
      case 'start':
        return rtlUtils.getSpacingClass(locale, `${prefix}l-${size}`);
      case 'end':
        return rtlUtils.getSpacingClass(locale, `${prefix}r-${size}`);
      case 'x':
        return `${prefix}x-${size}`;
      case 'y':
        return `${prefix}y-${size}`;
      default:
        return `${prefix}-${size}`;
    }
  };

  return (
    <div className={`${getSpacingClass()} ${className}`}>
      {children}
    </div>
  );
}

// RTL-aware flex component
interface RTLFlexProps {
  children: ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
}

export function RTLFlex({ 
  children, 
  className = '',
  direction = 'row',
  justify = 'start',
  align = 'center'
}: RTLFlexProps) {
  const { locale } = useI18n();
  
  const flexDirection = rtlUtils.getFlexDirection(locale, direction);
  
  const classes = [
    'flex',
    `flex-${flexDirection}`,
    `justify-${justify}`,
    `items-${align}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}