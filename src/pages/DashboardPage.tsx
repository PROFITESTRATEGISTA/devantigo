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
import { 
  mockAnalyses, 
  mockRankingAnalyses,
  mockTutorials, 
  mockMarketplace, 
  mockUsers 
} from '../data/mockData.tsx';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('analyses');

  useEffect(() => {
    setActiveSection('analyses');
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-black"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-gray-800/50 bg-gray-900/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                <BarChart2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1">
                  DevHub <span className="text-blue-400">Trader</span>
                </h1>
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Plataforma avançada de trading algorítmico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationPanel 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;