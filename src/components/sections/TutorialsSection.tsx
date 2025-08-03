import React from 'react';
import { BookOpen, Play, Clock, User } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  author: string;
  difficulty: string;
  thumbnail: string;
}

interface TutorialsSectionProps {
  tutorials: Tutorial[];
}

export function TutorialsSection({ tutorials }: TutorialsSectionProps) {
  const { t } = useLanguageStore();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'iniciante':
      case 'beginner':
        return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'intermediário':
      case 'intermediate':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'avançado':
      case 'advanced':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{t('tutorials.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="aspect-video bg-gray-700 flex items-center justify-center">
              <Play className="w-12 h-12 text-blue-400" />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                  {t(`tutorials.${tutorial.difficulty.toLowerCase()}`)}
                </span>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {tutorial.duration}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{tutorial.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{tutorial.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <User className="w-3 h-3 mr-1" />
                  {tutorial.author}
                </div>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white">
                  {t('tutorials.watch')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}