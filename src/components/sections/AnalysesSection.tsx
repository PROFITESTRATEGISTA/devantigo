import React from 'react';
import { BarChart2, Calendar, TrendingUp, FileText, Share2 } from 'lucide-react';

interface Analysis {
  id: string;
  name: string;
  type: string;
  profitFactor: number;
  winRate: number;
  createdAt: string;
}

interface AnalysesSectionProps {
  analyses: Analysis[];
  onNavigate: (path: string) => void;
}

export function AnalysesSection({ analyses, onNavigate }: AnalysesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Análises Recentes</h2>
        <button
          onClick={() => onNavigate('/backtest-analysis')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
        >
          Nova Análise
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">{analysis.type}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(analysis.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-3">{analysis.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400">Profit Factor</p>
                <p className={`text-lg font-bold ${
                  analysis.profitFactor >= 1.5 ? 'text-green-400' : 
                  analysis.profitFactor >= 1.0 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {analysis.profitFactor.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Win Rate</p>
                <p className={`text-lg font-bold ${
                  analysis.winRate >= 60 ? 'text-green-400' : 
                  analysis.winRate >= 45 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {analysis.winRate.toFixed(1)}%
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/backtest-analysis')}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors mb-2"
            >
              Ver Detalhes
            </button>
            
            <button
              onClick={() => {
                // Handle sharing to ranking
                const message = `Compartilhando análise "${analysis.name}" no ranking da comunidade!`;
                alert(message);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar no Ranking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}