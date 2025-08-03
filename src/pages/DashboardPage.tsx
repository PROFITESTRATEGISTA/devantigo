import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { NavigationPanel } from '../components/NavigationPanel';
import { AnalysesSection } from '../components/sections/AnalysesSection';
import { RankingSection } from '../components/sections/RankingSection';
import { TutorialsSection } from '../components/sections/TutorialsSection';
import { MarketplaceSection } from '../components/sections/MarketplaceSection';
import { UsersSection } from '../components/sections/UsersSection';
import { RobotsSection } from '../components/sections/RobotsSection';
import { useLanguageStore } from '../stores/languageStore';
import { 
  mockAnalyses, 
  mockRankingAnalyses,
  mockTutorials, 
  mockMarketplace, 
  mockUsers 
} from '../data/mockData.tsx';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguageStore();
  const [activeSection, setActiveSection] = useState('analyses');

  // Force re-render when language changes
  React.useEffect(() => {
    const handleLanguageChange = () => {
      // Force component re-render
      setActiveSection(prev => prev);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    setActiveSection('robots');
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'robots':
        return (
          <RobotsSection 
            onNavigate={handleNavigate} 
          />
        );
      case 'analyses':
        return (
          <AnalysesSection 
            analyses={mockAnalyses} 
            onNavigate={handleNavigate} 
          />
        );
      case 'ranking':
        return (
          <RankingSection 
            analyses={mockRankingAnalyses}
            onNavigate={handleNavigate}
          />
        );
      case 'tutorials':
        return <TutorialsSection tutorials={mockTutorials} />;
      case 'marketplace':
        return <MarketplaceSection companies={mockMarketplace} />;
      case 'users':
        return <UsersSection users={mockUsers} />;
      default:
        return (
          <AnalysesSection 
            analyses={mockAnalyses} 
            onNavigate={handleNavigate} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-400">{t('dashboard.subtitle')}</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <NavigationPanel 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>

        {/* Main Content */}
        <div>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;