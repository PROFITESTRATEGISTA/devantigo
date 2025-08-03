import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface RankingAnalysis {
  id: string;
  name: string;
  profitFactor: number;
  winRate: number;
  rank: number;
  author: string;
}

interface RankingSectionProps {
  analyses: RankingAnalysis[];
  onNavigate: (path: string) => void;
}

export function RankingSection({ analyses, onNavigate }: RankingSectionProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Ranking de Performance</h2>
        <button
          onClick={() => onNavigate('/backtest-analysis')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
        >
          Participar
        </button>
      </div>
      
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getRankIcon(analysis.rank)}
                <div>
                  <h3 className="text-lg font-semibold text-white">{analysis.name}</h3>
                  <p className="text-sm text-gray-400">por {analysis.author}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Profit Factor</p>
                  <p className={`text-lg font-bold ${
                    analysis.profitFactor >= 1.5 ? 'text-green-400' : 
                    analysis.profitFactor >= 1.0 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {analysis.profitFactor.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Win Rate</p>
                  <p className={`text-lg font-bold ${
                    analysis.winRate >= 60 ? 'text-green-400' : 
                    analysis.winRate >= 45 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {analysis.winRate.toFixed(1)}%
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/backtest-analysis')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                >
                  Ver Estratégia
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}