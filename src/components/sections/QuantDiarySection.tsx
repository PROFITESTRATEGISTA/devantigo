import React, { useState, useEffect } from 'react';
import { 
  Calendar, TrendingUp, TrendingDown, Target, BarChart2, 
  Plus, Edit3, Trash2, MessageSquare, Bot, ChevronLeft, 
  ChevronRight, Clock, DollarSign, Activity, Zap, Send,
  RefreshCw, AlertTriangle, Check, X, FileText, Download
} from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'bullish' | 'bearish' | 'neutral';
  pnl: number;
  trades: number;
  tags: string[];
  analysis_data?: any;
  ai_insights?: string;
  created_at: string;
  updated_at: string;
}

interface TradeComment {
  id: string;
  trade_index: number;
  comment: string;
  created_at: string;
}

export function QuantDiarySection() {
  const { language } = useLanguageStore();
  const { profile } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [showAIAnalysisModal, setShowAIAnalysisModal] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [showTradeComments, setShowTradeComments] = useState(false);
  const [tradeComments, setTradeComments] = useState<TradeComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedTradeIndex, setSelectedTradeIndex] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'bullish' | 'bearish' | 'neutral',
    pnl: 0,
    trades: 0,
    tags: [] as string[]
  });

  useEffect(() => {
    loadDiaryEntries();
  }, [currentMonth]);

  const loadDiaryEntries = async () => {
    try {
      setIsLoadingEntries(true);
      
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('Supabase not available');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get entries for current month
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('strategy_analyses')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to diary entries
      const entries: DiaryEntry[] = (data || []).map(item => ({
        id: item.id,
        date: item.created_at.split('T')[0],
        title: item.analysis_data?.title || `Sessão ${new Date(item.created_at).toLocaleDateString()}`,
        content: item.analysis_data?.content || 'Entrada do diário',
        mood: item.analysis_data?.mood || 'neutral',
        pnl: item.analysis_data?.pnl || 0,
        trades: item.analysis_data?.trades || 0,
        tags: item.analysis_data?.tags || [],
        analysis_data: item.analysis_data,
        ai_insights: item.analysis_data?.ai_insights,
        created_at: item.created_at,
        updated_at: item.updated_at || item.created_at
      }));

      setDiaryEntries(entries);
    } catch (error) {
      console.error('Error loading diary entries:', error);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const saveDiaryEntry = async () => {
    try {
      if (!supabase || typeof supabase.from !== 'function') {
        throw new Error('Supabase not available');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const entryData = {
        ...formData,
        date: selectedDate.toISOString().split('T')[0],
        title: formData.title || `Sessão ${selectedDate.toLocaleDateString()}`,
        tag: 'diary' // Tag especial para identificar entradas do diário
      };

      const { error } = await supabase
        .from('strategy_analyses')
        .insert({
          user_id: user.id,
          analysis_data: entryData
        });

      if (error) throw error;

      setShowNewEntryModal(false);
      resetForm();
      await loadDiaryEntries();

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50 flex items-center';
      successMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Entrada do diário salva com sucesso!
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);

    } catch (error) {
      console.error('Error saving diary entry:', error);
      alert('Erro ao salvar entrada do diário');
    }
  };

  const analyzeWithAI = async (entry: DiaryEntry) => {
    try {
      setIsAnalyzing(true);
      setShowAIAnalysisModal(true);

      // Check token balance
      const tokenBalance = profile?.token_balance || 0;
      if (tokenBalance < 500) {
        throw new Error('Saldo de tokens insuficiente. Esta análise requer 500 tokens.');
      }

      // Simulate AI analysis (replace with actual OpenAI call)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const aiInsight = `
## Análise do Mentor Quant - ${entry.date}

### Performance do Dia
- **P&L**: ${entry.pnl >= 0 ? 'Positivo' : 'Negativo'} (R$ ${entry.pnl.toFixed(2)})
- **Trades**: ${entry.trades} operações realizadas
- **Humor do Mercado**: ${entry.mood === 'bullish' ? 'Otimista' : entry.mood === 'bearish' ? 'Pessimista' : 'Neutro'}

### Insights Psicológicos
${entry.mood === 'bullish' 
  ? 'Dia de confiança alta. Cuidado para não se tornar overconfident. Mantenha a disciplina mesmo em dias positivos.'
  : entry.mood === 'bearish'
  ? 'Dia desafiador. É normal ter dias ruins. Foque no processo, não apenas no resultado. Revise suas regras de stop loss.'
  : 'Dia equilibrado. Boa gestão emocional. Continue mantendo a consistência e disciplina.'
}

### Recomendações
1. **Gestão de Risco**: ${entry.pnl < 0 ? 'Revise o tamanho das posições para o próximo dia' : 'Mantenha o mesmo tamanho de posição que funcionou hoje'}
2. **Horários**: Analise em quais horários você teve melhor performance hoje
3. **Padrões**: ${entry.trades > 10 ? 'Muitas operações - considere ser mais seletivo' : 'Boa seletividade nas operações'}

### Próximos Passos
- Continue documentando suas operações
- Foque na consistência do processo
- ${entry.pnl >= 0 ? 'Replique as condições que funcionaram hoje' : 'Identifique o que pode ser melhorado amanhã'}
`;

      setAiResponse(aiInsight);

      // Update entry with AI insights
      await supabase
        .from('strategy_analyses')
        .update({
          analysis_data: {
            ...entry.analysis_data,
            ai_insights: aiInsight
          }
        })
        .eq('id', entry.id);

      // Update token balance (simulate)
      // await updateTokenBalance(-500);

    } catch (error) {
      console.error('Error analyzing with AI:', error);
      alert(error instanceof Error ? error.message : 'Erro na análise com IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      mood: 'neutral',
      pnl: 0,
      trades: 0,
      tags: []
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEntryForDate = (date: Date | null) => {
    if (!date) return null;
    const dateString = date.toISOString().split('T')[0];
    return diaryEntries.find(entry => entry.date === dateString);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'bullish':
        return 'bg-green-500';
      case 'bearish':
        return 'bg-red-500';
      case 'neutral':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const totalPnL = diaryEntries.reduce((sum, entry) => sum + entry.pnl, 0);
  const totalTrades = diaryEntries.reduce((sum, entry) => sum + entry.trades, 0);
  const winningDays = diaryEntries.filter(entry => entry.pnl > 0).length;
  const winRate = diaryEntries.length > 0 ? (winningDays / diaryEntries.length) * 100 : 0;

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
          onClick={() => {
            setSelectedDate(new Date());
            setShowNewEntryModal(true);
          }}
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
            <Activity className="w-5 h-5 text-purple-500" />
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
            <FileText className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{diaryEntries.length}</p>
          <p className="text-sm text-gray-400">
            {language === 'en' ? 'This month' : 'Este mês'}
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium">
            {language === 'en' ? 'Trading Calendar' : 'Calendário de Trading'}
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-medium min-w-[200px] text-center">
              {currentMonth.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h4>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {(language === 'en' 
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
          ).map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {getDaysInMonth(currentMonth).map((date, index) => {
            if (!date) {
              return <div key={index} className="p-2 h-16"></div>;
            }

            const entry = getEntryForDate(date);
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const isTodayDate = isToday(date);
            const isPast = isPastDate(date);

            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(date);
                  if (entry) {
                    setSelectedEntry(entry);
                  }
                }}
                className={`p-2 h-16 rounded-lg border-2 transition-all relative ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-900 bg-opacity-50' 
                    : 'border-transparent hover:border-gray-600'
                } ${
                  isTodayDate 
                    ? 'bg-blue-600 bg-opacity-20' 
                    : isPast 
                    ? 'bg-gray-700 bg-opacity-50' 
                    : 'bg-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{date.getDate()}</div>
                
                {entry && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className={`w-full h-1 rounded ${getMoodColor(entry.mood)}`}></div>
                    <div className="text-xs mt-1">
                      <span className={entry.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {entry.pnl >= 0 ? '+' : ''}R$ {entry.pnl.toFixed(0)}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Entry Details */}
      {selectedEntry && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">{selectedEntry.title}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => analyzeWithAI(selectedEntry)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-md text-sm flex items-center"
                disabled={isAnalyzing}
              >
                <Bot className="w-4 h-4 mr-1" />
                {language === 'en' ? 'AI Analysis' : 'Análise IA'}
              </button>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-400">P&L</p>
              <p className={`text-xl font-bold ${selectedEntry.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R$ {selectedEntry.pnl.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Trades</p>
              <p className="text-xl font-bold">{selectedEntry.trades}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Humor</p>
              <div className="flex items-center">
                {selectedEntry.mood === 'bullish' ? (
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                ) : selectedEntry.mood === 'bearish' ? (
                  <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
                ) : (
                  <Target className="w-5 h-5 text-yellow-400 mr-2" />
                )}
                <span className="capitalize">
                  {selectedEntry.mood === 'bullish' ? 'Otimista' : 
                   selectedEntry.mood === 'bearish' ? 'Pessimista' : 'Neutro'}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-300 whitespace-pre-line">{selectedEntry.content}</p>
          </div>

          {selectedEntry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedEntry.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-900 bg-opacity-50 text-blue-300 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* AI Insights */}
          {selectedEntry.ai_insights && (
            <div className="mt-4 p-4 bg-purple-900 bg-opacity-20 border border-purple-800 rounded-lg">
              <h4 className="text-lg font-medium mb-2 flex items-center text-purple-300">
                <Bot className="w-5 h-5 mr-2" />
                {language === 'en' ? 'AI Mentor Insights' : 'Insights do Mentor IA'}
              </h4>
              <div className="text-gray-300 whitespace-pre-line text-sm">
                {selectedEntry.ai_insights}
              </div>
            </div>
          )}
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
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                {language === 'en' ? 'New Diary Entry' : 'Nova Entrada no Diário'}
              </h2>
              <p className="mt-2 text-gray-400">
                {selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Title' : 'Título'}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={language === 'en' ? 'Trading session title...' : 'Título da sessão...'}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    P&L (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pnl}
                    onChange={(e) => setFormData({...formData, pnl: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Trades
                  </label>
                  <input
                    type="number"
                    value={formData.trades}
                    onChange={(e) => setFormData({...formData, trades: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Market Mood' : 'Humor do Mercado'}
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => setFormData({...formData, mood: e.target.value as 'bullish' | 'bearish' | 'neutral'})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bullish">{language === 'en' ? 'Bullish' : 'Otimista'}</option>
                    <option value="neutral">{language === 'en' ? 'Neutral' : 'Neutro'}</option>
                    <option value="bearish">{language === 'en' ? 'Bearish' : 'Pessimista'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Content' : 'Conteúdo'}
                </label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder={language === 'en' 
                    ? 'What happened today? What did you learn? Any insights or observations...'
                    : 'O que aconteceu hoje? O que você aprendeu? Algum insight ou observação...'}
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
                  type="button"
                  onClick={saveDiaryEntry}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Save Entry' : 'Salvar Entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAIAnalysisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAIAnalysisModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <Bot className="w-12 h-12 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">
                {language === 'en' ? 'AI Quant Mentor' : 'Mentor Quant IA'}
              </h2>
              <p className="mt-2 text-gray-400">
                {language === 'en' 
                  ? 'Performance analysis and psychological insights'
                  : 'Análise de performance e insights psicológicos'}
              </p>
            </div>

            {isAnalyzing ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-300">
                  {language === 'en' ? 'Analyzing your trading session...' : 'Analisando sua sessão de trading...'}
                </p>
              </div>
            ) : aiResponse ? (
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                    {aiResponse}
                  </pre>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      const blob = new Blob([aiResponse], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `analise-mentor-${selectedEntry?.date}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Download Analysis' : 'Baixar Análise'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  {language === 'en' ? 'Click analyze to get AI insights' : 'Clique em analisar para obter insights da IA'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {diaryEntries.length === 0 && !isLoadingEntries && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {language === 'en' ? 'No diary entries yet' : 'Nenhuma entrada no diário ainda'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'en' 
              ? 'Start documenting your trading journey and insights'
              : 'Comece a documentar sua jornada de trading e insights'}
          </p>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowNewEntryModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Create First Entry' : 'Criar Primeira Entrada'}
          </button>
        </div>
      )}
    </div>
  );
}