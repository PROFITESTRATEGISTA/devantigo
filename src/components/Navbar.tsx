import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Code2, Menu, X, User, LogOut, Settings, 
  BarChart2, Users, Crown, Zap, HelpCircle, 
  Briefcase, Building, ExternalLink, Package,
  FileSpreadsheet, BarChart
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { TokenDisplay } from './TokenDisplay';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguageStore } from '../stores/languageStore';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { signOut, profile } = useAuthStore();
  const { t, language } = useLanguageStore();
  
  // Force re-render when language changes
  React.useEffect(() => {
    const handleLanguageChange = () => {
      // Force component re-render
      setIsMenuOpen(false);
      setShowUserMenu(false);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  // Check if user is authorized for admin panel
  const authorizedEmails = ['pedropardal04@gmail.com', 'profitestrategista@gmail.com'];
  const isAdminAuthorized = profile?.email && authorizedEmails.includes(profile.email);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleExternalLink = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening external link:', error);
      // Fallback: try to navigate directly
      window.location.href = url;
    }
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" />, external: false },
    { path: '/robots', label: t('nav.robots') || 'Robôs', icon: <Code2 className="w-5 h-5" />, external: false },
    { path: '/backtest-analysis', label: t('analysis.backtest') || 'Backtest', icon: <FileSpreadsheet className="w-5 h-5" />, external: false },
    { path: '/faq', label: t('nav.faq') || 'FAQ', icon: <HelpCircle className="w-5 h-5" />, external: false },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/robots')}>
              <Code2 className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">DevHub Trader</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={(e) => {
                      if (item.external) {
                        handleExternalLink(item.path, e);
                      } else {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }
                    }}
                    className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 lg:space-x-2 ${
                      isActive(item.path) && !item.external
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                    {item.external && <ExternalLink className="w-3 h-3 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right side items */}
          <div className="flex items-center space-x-4">

            
            {/* Token Display */}
            <div className="hidden md:flex">
              <TokenDisplay />
            </div>
            
            {/* Earn Tokens Button */}
            <div className="hidden md:flex">
              <button
                onClick={() => navigate('/challenges')}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm text-white transition-colors"
                title="Complete desafios para ganhar tokens"
              >
                <span className="text-xs">🏆</span>
                <span>{t('nav.earnTokens')}</span>
              </button>
            </div>
            
            {/* Language Switcher */}
            <div className="hidden md:flex">
              <LanguageSwitcher />
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-2 lg:px-3 py-2 rounded-md"
              >
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                  )}
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <div className="hidden md:flex bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs items-center">
                      <span className="text-blue-400 font-medium mr-1">Q</span>
                      <span className="font-medium">87</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('nav.profile')}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/subscription');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {t('nav.subscription')}
                  </button>
                  {isAdminAuthorized && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.signOut')}
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={(e) => {
                  if (item.external) {
                    handleExternalLink(item.path, e);
                  } else {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 ${
                  isActive(item.path) && !item.external
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.external && <ExternalLink className="w-3 h-3 ml-1" />}
              </button>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="grid grid-cols-1 gap-3 px-3">
                <TokenDisplay />
                <button
                  onClick={() => navigate('/challenges')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-md text-base font-medium text-white transition-colors"
                >
                  <span className="text-base">🏆</span>
                  <span>{t('nav.earnTokens')}</span>
                </button>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}