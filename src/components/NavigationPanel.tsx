import React from 'react';
import { BarChart2, TrendingUp, BookOpen, Store, Users, Code2 } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

interface NavigationPanelProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function NavigationPanel({ activeSection, onSectionChange }: NavigationPanelProps) {
  const { t } = useLanguageStore();

  const sections = [
    {
      id: 'robots',
      name: t('dashboard.myRobots'),
      icon: <Code2 className="w-5 h-5" />,
      description: t('dashboard.myRobotsDesc')
    },
    {
      id: 'analyses',
      name: t('dashboard.analyses'),
      icon: <BarChart2 className="w-5 h-5" />,
      description: t('dashboard.analysesDesc')
    },
    {
      id: 'ranking',
      name: t('dashboard.ranking'),
      icon: <TrendingUp className="w-5 h-5" />,
      description: t('dashboard.rankingDesc')
    },
    {
      id: 'tutorials',
      name: t('dashboard.tutorials'),
      icon: <BookOpen className="w-5 h-5" />,
      description: t('dashboard.tutorialsDesc')
    },
    {
      id: 'marketplace',
      name: t('dashboard.marketplace'),
      icon: <Store className="w-5 h-5" />,
      description: t('dashboard.marketplaceDesc')
    },
    {
      id: 'quant-diary',
      name: language === 'en' ? 'Quant Diary' : 'Diário Quant',
      icon: <Users className="w-5 h-5" />,
      description: language === 'en' ? 'Your trading journal and insights' : 'Seu diário de trading e insights'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`group relative p-3 lg:p-4 rounded-lg transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            <div className="flex flex-col items-center space-y-1 lg:space-y-2">
              <div className={`p-2 rounded-lg ${
                activeSection === section.id
                  ? 'bg-white/20'
                  : 'bg-gray-600 group-hover:bg-gray-500'
              }`}>
                {section.icon}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-xs lg:text-sm">{section.name}</h3>
                <p className="text-xs opacity-75 mt-0.5 lg:mt-1 hidden sm:block">{section.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}