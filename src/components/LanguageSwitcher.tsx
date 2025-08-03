import React from 'react';
import { useLanguageStore } from '../stores/languageStore';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguageStore();

  // Flag components as SVG
  const USFlag = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 16" fill="none">
      <rect width="24" height="16" fill="#B22234"/>
      <rect width="24" height="1.23" y="1.23" fill="white"/>
      <rect width="24" height="1.23" y="3.69" fill="white"/>
      <rect width="24" height="1.23" y="6.15" fill="white"/>
      <rect width="24" height="1.23" y="8.62" fill="white"/>
      <rect width="24" height="1.23" y="11.08" fill="white"/>
      <rect width="24" height="1.23" y="13.54" fill="white"/>
      <rect width="9.6" height="8.62" fill="#3C3B6E"/>
    </svg>
  );

  const BrazilFlag = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 16" fill="none">
      <rect width="24" height="16" fill="#009739"/>
      <polygon points="12,2 22,8 12,14 2,8" fill="#FEDD00"/>
      <circle cx="12" cy="8" r="3" fill="#012169"/>
    </svg>
  );

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'pt' : 'en';
    setLanguage(newLanguage);
    
    // Force re-render of all components by triggering a storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'preferredLanguage',
      newValue: newLanguage,
      oldValue: language
    }));
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-md text-base font-medium text-gray-300 transition-colors md:px-3 md:py-1.5 md:text-sm ${className}`}
      title={language === 'en' ? 'Switch to Portuguese' : 'Switch to English'}
    >
      {language === 'en' ? <USFlag /> : <BrazilFlag />}
      <span>{language === 'en' ? 'EN' : 'PT'}</span>
    </button>
  );
}