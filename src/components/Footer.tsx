import React from 'react';
import { Code2 } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

export function Footer() {
  const { t, language } = useLanguageStore();

  // Force re-render when language changes
  React.useEffect(() => {
    const handleLanguageChange = () => {
      // Force component re-render
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Company */}
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-blue-500" />
            <span className="text-white font-medium">DevHub Trader</span>
          </div>
          
          {/* Links */}
          <div className="flex items-center space-x-6 text-sm">
            <button
              onClick={() => window.location.href = '/robots'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.myRobots')}
            </button>
            <button
              onClick={() => window.location.href = '/backtest-analysis'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.myAnalyses')}
            </button>
            <button
              onClick={() => window.location.href = '/faq'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.faq')}
            </button>
            <button
              onClick={() => window.location.href = '/plans'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.plans')}
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.profile')}
            </button>
            <button
              onClick={() => window.location.href = '/subscription'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.subscription')}
            </button>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-gray-400">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </div>
    </footer>
  );
}