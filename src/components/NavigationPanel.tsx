import React from 'react';
import { BarChart2, TrendingUp, BookOpen, Store, Users } from 'lucide-react';

interface NavigationPanelProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function NavigationPanel({ activeSection, onSectionChange }: NavigationPanelProps) {
  const sections = [
    {
      id: 'analyses',
      name: 'Análises',
      icon: <BarChart2 className="w-5 h-5" />,
      description: 'Análises de backtest e estratégias'
    },
    {
      id: 'ranking',
      name: 'Ranking',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Ranking de performance'
    },
    {
      id: 'tutorials',
      name: 'Tutoriais',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Tutoriais e guias'
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      icon: <Store className="w-5 h-5" />,
      description: 'Marketplace de estratégias'
    },
    {
      id: 'users',
      name: 'Usuários',
      icon: <Users className="w-5 h-5" />,
      description: 'Comunidade de usuários'
    }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`group relative p-4 rounded-xl transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/25 scale-105'
                : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-102'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`p-2 rounded-lg ${
                activeSection === section.id
                  ? 'bg-white/20'
                  : 'bg-gray-700/50 group-hover:bg-gray-600/50'
              }`}>
                {section.icon}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">{section.name}</h3>
                <p className="text-xs opacity-75 mt-1">{section.description}</p>
              </div>
            </div>
            
            {activeSection === section.id && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-400/20 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}