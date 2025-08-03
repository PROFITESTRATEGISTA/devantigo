import React, { useState } from 'react';
import { BookOpen, TrendingUp, Calendar, BarChart2, Target, Award, Clock, Plus, Edit3, Trash2 } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'bullish' | 'bearish' | 'neutral';
  pnl: number;
  trades: number;
  tags: string[];
}

export function QuantDiarySection() {
  const { language } = useLanguageStore();
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  // Mock diary entries
  const diaryEntries: DiaryEntry[] = [
    {
      id: '1',
      date: '2024-01-15',
      title: language === 'en' ? 'Strong Trend Day' : 'Dia de Tendência Forte',
      content: language === 'en' 
        ? 'Market showed clear directional movement. My scalping strategy performed exceptionally well with 8 winning trades out of 10. Key lesson: patience during consolidation periods pays off.'
        : 'Mercado mostrou movimento direcional claro. Minha estratégia de scalping performou excepcionalmente bem com 8 trades vencedores de 10. Lição principal: paciência durante períodos de consolidação compensa.',
      mood: 'bullish',
      pnl: 1250.75,
      trades: 10,
      tags: ['scalping', 'trend-following', 'high-volume']
    },
    {
      id: '2',
      date: '2024-01-14',
      title: language === 'en' ? 'Choppy Market Conditions' : 'Condições de Mercado Instáveis',
      content: language === 'en'
        ? 'Sideways market caught me off guard. Multiple false breakouts led to 3 consecutive losses. Need to improve my market condition filters.'
        : 'Mercado lateral me pegou desprevenido. Múltiplos rompimentos falsos levaram a 3 perdas consecutivas. Preciso melhorar meus filtros de condição de mercado.',
      mood: 'bearish',
      pnl: -450.25,
      trades: 6,
      tags: ['sideways', 'false-breakouts', 'learning']
    },
    {
      id: '3',
      date: '2024-01-13',
      title: language === 'en' ? 'Balanced Trading Session' : 'Sessão de Trading Equilibrada',
      content: language === 'en'
        ? 'Mixed results today. Good risk management kept losses small while letting winners run. Overall positive day with steady progress.'
        : 'Resultados mistos hoje. Bom gerenciamento de risco manteve perdas pequenas enquanto deixei vencedores correrem. Dia geral positivo com progresso constante.',
      mood: 'neutral',
      pnl: 320.50,
      trades: 8,
      tags: ['risk-management', 'steady-progress', 'mixed-results']
    }
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'bullish':
        return 'text-green-400 bg-green-900 bg-opacity-20';
      case 'bearish':
        return 'text-red-400 bg-red-900 bg-opacity-20';
      case 'neutral':
        return 'text-yellow-400 bg-yellow-900 bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-900 bg-opacity-20';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4" />;
      case 'bearish':
        return <BarChart2 className="w-4 h-4 rotate-180" />;
      case 'neutral':
        return <Target className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const totalPnL = diaryEntries.reduce((sum, entry) => sum + entry.pnl, 0);
  const totalTrades = diaryEntries.reduce((sum, entry) => sum + entry.trades, 0);
  const winningDays = diaryEntries.filter(entry => entry.pnl > 0).length;
  const winRate = (winningDays / diaryEntries.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Quant Diary' : 'Diário Quant'}
          </h2>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'Track your trading journey and insights'
              : 'Acompanhe sua jornada de trading e insights'}
          </p>
        </div>
        <button
          onClick={() => setShowNewEntryModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'en' ? 'New Entry' : 'Nova Entrada'}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">
              {language === 'en' ? 'Total P&L' : 'P&L Total'}
            </h3>
            <BarChart2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            R$ {totalPnL.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">
            {language === 'en' ? 'This month' : 'Este mês'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">
              {language === 'en' ? 'Win Rate' : 'Taxa de Acerto'}
            </h3>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-400">{winRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">
            {winningDays} {language === 'en' ? 'winning days' : 'dias vencedores'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">
              {language === 'en' ? 'Total Trades' : 'Total de Trades'}
            </h3>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-400">{totalTrades}</p>
          <p className="text-sm text-gray-400">
            {language === 'en' ? 'This month' : 'Este mês'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">
              {language === 'en' ? 'Entries' : 'Entradas'}
            </h3>
            <BookOpen className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{diaryEntries.length}</p>
          <p className="text-sm text-gray-400">
            {language === 'en' ? 'This month' : 'Este mês'}
          </p>
        </div>
      </div>

      {/* Diary Entries */}
      <div className="space-y-4">
        {diaryEntries.map((entry) => (
          <div 
            key={entry.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getMoodColor(entry.mood)}`}>
                  {getMoodIcon(entry.mood)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <BarChart2 className="w-4 h-4 mr-1" />
                      {entry.trades} trades
                    </span>
                    <span className={`flex items-center font-medium ${entry.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      R$ {entry.pnl.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedEntry(entry)}
                  className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white"
                  title={language === 'en' ? 'Edit entry' : 'Editar entrada'}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-red-400"
                  title={language === 'en' ? 'Delete entry' : 'Excluir entrada'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 leading-relaxed">
              {entry.content}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-900 bg-opacity-50 text-blue-300 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {diaryEntries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {language === 'en' ? 'No diary entries yet' : 'Nenhuma entrada no diário ainda'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'en' 
              ? 'Start documenting your trading journey and insights'
              : 'Comece a documentar sua jornada de trading e insights'}
          </p>
          <button
            onClick={() => setShowNewEntryModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Create First Entry' : 'Criar Primeira Entrada'}
          </button>
        </div>
      )}

      {/* New Entry Modal */}
      {showNewEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowNewEntryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">
                {language === 'en' ? 'New Diary Entry' : 'Nova Entrada no Diário'}
              </h2>
              <p className="mt-2 text-gray-400">
                {language === 'en' 
                  ? 'Document your trading insights and lessons learned'
                  : 'documente seus insights de trading e lições aprendidas'}
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Title' : 'Título'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Entry title...' : 'Título da entrada...'}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Date' : 'Data'}
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    P&L
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Trades' : 'Trades'}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Market Mood' : 'Humor do Mercado'}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="mood" value="bullish" className="sr-only" />
                    <div className="px-3 py-2 bg-green-900 bg-opacity-20 text-green-400 rounded-md cursor-pointer hover:bg-opacity-40 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Bullish' : 'Otimista'}
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="mood" value="neutral" className="sr-only" />
                    <div className="px-3 py-2 bg-yellow-900 bg-opacity-20 text-yellow-400 rounded-md cursor-pointer hover:bg-opacity-40 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Neutral' : 'Neutro'}
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="mood" value="bearish" className="sr-only" />
                    <div className="px-3 py-2 bg-red-900 bg-opacity-20 text-red-400 rounded-md cursor-pointer hover:bg-opacity-40 flex items-center">
                      <BarChart2 className="w-4 h-4 mr-2 rotate-180" />
                      {language === 'en' ? 'Bearish' : 'Pessimista'}
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Content' : 'Conteúdo'}
                </label>
                <textarea
                  rows={6}
                  placeholder={language === 'en' 
                    ? 'What happened today? What did you learn? Any insights or observations...'
                    : 'O que aconteceu hoje? O que você aprendeu? Algum insight ou observação...'}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'scalping, trend-following, high-volume...' : 'scalping, seguir-tendencia, alto-volume...'}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewEntryModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                >
                  {language === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Save Entry' : 'Salvar Entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}