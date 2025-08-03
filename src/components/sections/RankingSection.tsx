import React from 'react';
import { Trophy, Medal, Award, TrendingUp, Filter, ChevronDown } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

interface RankingAnalysis {
  id: string;
  name: string;
  profitFactor: number;
  winRate: number;
  rank: number;
  author: string;
  sharpeRatio?: number;
  recoveryFactor?: number;
  maxDrawdown?: number;
  totalTrades?: number;
}

interface RankingSectionProps {
  analyses: RankingAnalysis[];
  onNavigate: (path: string) => void;
}

export function RankingSection({ analyses, onNavigate }: RankingSectionProps) {
  const { t, language } = useLanguageStore();
  const [filterBy, setFilterBy] = React.useState<'profitFactor' | 'winRate' | 'sharpeRatio' | 'recoveryFactor' | 'maxDrawdown' | 'totalTrades'>('profitFactor');
  const [sortOrder, setSortOrder] = React.useState<'desc' | 'asc'>('desc');
  const [timeFilter, setTimeFilter] = React.useState<'all' | 'week' | 'month' | 'year'>('all');

  // If no analyses provided, show empty state
  const hasAnalyses = analyses && analyses.length > 0;

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

  // Filter and sort analyses
  const filteredAndSortedAnalyses = React.useMemo(() => {
    let filtered = [...analyses];
    
    // Sort by selected metric
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (filterBy) {
        case 'profitFactor':
          aValue = a.profitFactor;
          bValue = b.profitFactor;
          break;
        case 'winRate':
          aValue = a.winRate;
          bValue = b.winRate;
          break;
        case 'sharpeRatio':
          aValue = a.sharpeRatio || 0;
          bValue = b.sharpeRatio || 0;
          break;
        case 'recoveryFactor':
          aValue = a.recoveryFactor || 0;
          bValue = b.recoveryFactor || 0;
          break;
        case 'maxDrawdown':
          aValue = a.maxDrawdown || 0;
          bValue = b.maxDrawdown || 0;
          break;
        case 'totalTrades':
          aValue = a.totalTrades || 0;
          bValue = b.totalTrades || 0;
          break;
        default:
          aValue = a.profitFactor;
          bValue = b.profitFactor;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    
    return filtered;
  }, [analyses, filterBy, sortOrder, timeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('ranking.title')}</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('/backtest-analysis')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            {language === 'en' ? 'Join Ranking' : 'Entrar no Ranking'}
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-white">{t('ranking.filters')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {language === 'en' ? 'Rank by' : 'Classificar por'}
            </label>
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'profitFactor' | 'winRate' | 'sharpeRatio' | 'recoveryFactor' | 'maxDrawdown' | 'totalTrades')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="profitFactor">{language === 'en' ? 'Profitability' : 'Lucratividade'}</option>
                <option value="winRate">{language === 'en' ? 'Success Rate' : 'Taxa de Sucesso'}</option>
                <option value="sharpeRatio">{language === 'en' ? 'Risk-Return Ratio' : 'Relação Risco-Retorno'}</option>
                <option value="recoveryFactor">{language === 'en' ? 'Recovery Speed' : 'Velocidade de Recuperação'}</option>
                <option value="maxDrawdown">{language === 'en' ? 'Maximum Loss' : 'Perda Máxima'}</option>
                <option value="totalTrades">{language === 'en' ? 'Trading Activity' : 'Atividade de Trading'}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {language === 'en' ? 'Order' : 'Ordem'}
            </label>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="desc">{language === 'en' ? 'Best to Worst' : 'Melhor para Pior'}</option>
                <option value="asc">{language === 'en' ? 'Worst to Best' : 'Pior para Melhor'}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {language === 'en' ? 'Time Period' : 'Período'}
            </label>
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as 'all' | 'week' | 'month' | 'year')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">{language === 'en' ? 'All Time' : 'Todos os Tempos'}</option>
                <option value="week">{language === 'en' ? 'This Week' : 'Esta Semana'}</option>
                <option value="month">{language === 'en' ? 'This Month' : 'Este Mês'}</option>
                <option value="year">{language === 'en' ? 'This Year' : 'Este Ano'}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Active Filters Display */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filterBy && filterBy !== 'profitFactor' && (
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
              {language === 'en' ? 'Ranking by: ' : 'Classificando por: '}{
                filterBy === 'winRate' ? (language === 'en' ? 'Success Rate' : 'Taxa de Sucesso') : 
                filterBy === 'sharpeRatio' ? (language === 'en' ? 'Risk-Return' : 'Risco-Retorno') :
                filterBy === 'recoveryFactor' ? (language === 'en' ? 'Recovery Speed' : 'Velocidade de Recuperação') :
                filterBy === 'maxDrawdown' ? (language === 'en' ? 'Maximum Loss' : 'Perda Máxima') :
                filterBy === 'totalTrades' ? (language === 'en' ? 'Trading Activity' : 'Atividade de Trading') : filterBy
              }
            </span>
          )}
          {sortOrder !== 'desc' && (
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
              {language === 'en' ? 'Order: Worst to Best' : 'Ordem: Pior para Melhor'}
            </span>
          )}
          {timeFilter !== 'all' && (
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
              {language === 'en' ? 'Period: ' : 'Período: '}{
                timeFilter === 'week' ? (language === 'en' ? 'This Week' : 'Esta Semana') : 
                timeFilter === 'month' ? (language === 'en' ? 'This Month' : 'Este Mês') : 
                timeFilter === 'year' ? (language === 'en' ? 'This Year' : 'Este Ano') : timeFilter
              }
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {hasAnalyses ? filteredAndSortedAnalyses.map((analysis) => (
          <div key={analysis.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
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
                  <p className="text-xs text-gray-400">{t('analyses.profitFactor')}</p>
                  <p className={`text-lg font-bold ${
                    analysis.profitFactor >= 1.5 ? 'text-green-400' : 
                    analysis.profitFactor >= 1.0 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {analysis.profitFactor.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">{t('analyses.winRate')}</p>
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
                  {language === 'en' ? 'View Details' : 'Ver Detalhes'}
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {language === 'en' ? 'No strategies in ranking yet' : 'Nenhuma estratégia no ranking ainda'}
            </h3>
            <p className="text-gray-500">
              {language === 'en' 
                ? 'Complete a backtest analysis to join the community ranking'
                : 'Complete uma análise de backtest para entrar no ranking da comunidade'}
            </p>
            <button
              onClick={() => onNavigate('/backtest-analysis')}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
            >
              {language === 'en' ? 'Create First Analysis' : 'Criar Primeira Análise'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}