import React from 'react';
import { Trophy, Medal, Award, TrendingUp, Filter, ChevronDown } from 'lucide-react';

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
  const [filterBy, setFilterBy] = React.useState<'profitFactor' | 'winRate' | 'all'>('profitFactor');
  const [sortOrder, setSortOrder] = React.useState<'desc' | 'asc'>('desc');
  const [timeFilter, setTimeFilter] = React.useState<'all' | 'week' | 'month' | 'year'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<'all' | 'scalping' | 'swing' | 'trend'>('all');

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
    
    // Apply category filter (mock implementation)
    if (categoryFilter !== 'all') {
      // In a real app, this would filter based on strategy category
      filtered = filtered.filter(analysis => 
        analysis.name.toLowerCase().includes(categoryFilter)
      );
    }
    
    // Sort by selected metric
    filtered.sort((a, b) => {
      const aValue = filterBy === 'profitFactor' ? a.profitFactor : a.winRate;
      const bValue = filterBy === 'profitFactor' ? b.profitFactor : b.winRate;
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    
    return filtered;
  }, [analyses, filterBy, sortOrder, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Ranking de Performance</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('/backtest-analysis')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            Participar
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Metric Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ordenar por
            </label>
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'profitFactor' | 'winRate' | 'all')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="profitFactor">Profit Factor</option>
                <option value="winRate">Win Rate</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ordem
            </label>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="desc">Maior para Menor</option>
                <option value="asc">Menor para Maior</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Período
            </label>
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as 'all' | 'week' | 'month' | 'year')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">Todos os Tempos</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="year">Este Ano</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Categoria
            </label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'scalping' | 'swing' | 'trend')}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">Todas as Categorias</option>
                <option value="scalping">Scalping</option>
                <option value="swing">Swing Trading</option>
                <option value="trend">Trend Following</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Active Filters Display */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filterBy !== 'profitFactor' && (
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
              Ordenado por: {filterBy === 'winRate' ? 'Win Rate' : 'Profit Factor'}
            </span>
          )}
          {sortOrder !== 'desc' && (
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
              Ordem: Crescente
            </span>
          )}
          {timeFilter !== 'all' && (
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
              Período: {timeFilter === 'week' ? 'Esta Semana' : timeFilter === 'month' ? 'Este Mês' : 'Este Ano'}
            </span>
          )}
          {categoryFilter !== 'all' && (
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
              Categoria: {categoryFilter === 'scalping' ? 'Scalping' : categoryFilter === 'swing' ? 'Swing Trading' : 'Trend Following'}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAndSortedAnalyses.map((analysis) => (
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
        
        {filteredAndSortedAnalyses.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma estratégia encontrada</h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou participe do ranking com sua estratégia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}