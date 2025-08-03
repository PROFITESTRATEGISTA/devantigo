import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, MessageSquare, BarChart2, Clock, Hash, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';
import { useAuthStore } from '../../stores/authStore';

interface DiaryEntry {
  id: string;
  date: string;
  title?: string;
  content?: string;
  pnl?: number;
  trades?: number;
  mood?: 'positive' | 'negative' | 'neutral';
  time?: string;
  predefinedComments?: string[];
}

export function QuantDiarySection() {
  const { language } = useLanguageStore();
  const { profile } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalType, setModalType] = useState<'comment' | 'analysis'>('comment');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    pnl: 0,
    trades: 0,
    mood: 'neutral' as 'positive' | 'negative' | 'neutral',
    time: '',
    predefinedComments: [] as string[]
  });

  // Comentários predefinidos organizados por categoria
  const predefinedComments = {
    positive: [
      'Estratégia executada conforme planejado',
      'Disciplina mantida nas entradas e saídas',
      'Sinais claros e bem interpretados',
      'Gerenciamento de risco respeitado',
      'Análise pré-mercado eficaz',
      'Paciência aguardando setups ideais'
    ],
    negative: [
      'Overtrading - entrei em setups ruins',
      'Não respeitei o stop loss definido',
      'Saí muito cedo por medo/ansiedade',
      'Entrei sem confirmação adequada',
      'Aumentei posição em trade perdedor',
      'Emocional influenciou decisões técnicas',
      'Não segui o plano de trading',
      'Forcei trades em mercado lateral',
      'Ignorei sinais de reversão',
      'Gerenciamento de risco inadequado'
    ],
    neutral: [
      'Mercado sem setups claros',
      'Foco em preservação de capital',
      'Aguardando condições ideais',
      'Revisão e ajuste de estratégias',
      'Análise de performance semanal',
      'Estudo de novos indicadores',
      'Observação de padrões de mercado',
      'Preparação para próxima sessão'
    ]
  };

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentDate(new Date(currentDate));
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, [currentDate]);

  // Mock data for demonstration
  useEffect(() => {
    const mockEntries: DiaryEntry[] = [
      {
        id: '1',
        date: '2025-01-06',
        title: 'Sessão Matinal WINFUT',
        content: 'Operação em tendência de alta. Entrada no rompimento da máxima anterior.',
        pnl: 450.75,
        trades: 3,
        mood: 'positive',
        time: '09:30',
        predefinedComments: ['Excelente execução da estratégia', 'Disciplina mantida durante todo o dia']
      },
      {
        id: '2',
        date: '2025-01-07',
        title: 'Scalping PETR4',
        content: 'Mercado lateral, várias operações pequenas.',
        pnl: -125.50,
        trades: 8,
        mood: 'negative',
        time: '14:15',
        predefinedComments: ['Overtrading prejudicou os resultados', 'Mercado lateral difícil']
      },
      {
        id: '3',
        date: '2025-01-08',
        title: 'Análise e Observação',
        content: 'Dia focado em análise de mercado sem operações.',
        pnl: 0,
        trades: 0,
        mood: 'neutral',
        time: '16:00',
        predefinedComments: ['Dia de observação e aprendizado', 'Foco em preservar capital']
      }
    ];
    setEntries(mockEntries);
  }, []);


  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (direction === 'next') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    
    // Limitar apenas a 2025
    if (newDate.getFullYear() < 2025) {
      return; // Não permitir navegar para antes de 2025
    }
    if (newDate.getFullYear() > 2025) {
      return; // Não permitir navegar para depois de 2025
    }
    
    setCurrentDate(newDate);
  };

  // Função para calcular o número da semana no ano (baseado no CSV)
  const getWeekOfYear = (date: Date) => {
    if (date.getFullYear() !== 2025) return 1;
    
    // 1º de janeiro de 2025 é quarta-feira
    // Semana 1 = 29 dez 2024 (dom) a 4 jan 2025 (sáb)
    // Semana 2 = 5 jan 2025 (dom) a 11 jan 2025 (sáb)
    const jan1 = new Date(2025, 0, 1); // 1º de janeiro de 2025
    
    // Domingo da semana que contém 1º de janeiro (29 dez 2024)
    const firstSundayOfYear = new Date(2025, 0, 1 - jan1.getDay()); // 29 dez 2024
    
    // Calcular diferença em dias desde o primeiro domingo
    const daysDiff = Math.floor((date.getTime() - firstSundayOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.floor(daysDiff / 7) + 1;
  };
  
  // Função para calcular o número da semana no mês (baseado no CSV)
  const getWeekOfMonth = (date: Date) => {
    // Semana 1 do mês = semana que contém o dia 1, começando no domingo
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    
    // Domingo da semana que contém o dia 1 do mês
    const firstSundayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1 - firstDayOfMonth.getDay());
    
    // Calcular diferença em dias desde o primeiro domingo do mês
    const daysDiff = Math.floor((date.getTime() - firstSundayOfMonth.getTime()) / (24 * 60 * 60 * 1000));
    return Math.floor(daysDiff / 7) + 1; // +1 porque a primeira semana é a semana 1
  };


  const getCalendarDays = () => {
    const year = 2025; // Sempre usar 2025
    const month = currentDate.getMonth();
    
    // Primeiro e último dia do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Adicionar apenas os dias do mês atual (sem resquícios de outros meses)
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  // Função para obter o layout do calendário mensal (7 colunas)
  const getCalendarLayout = () => {
    const year = 2025;
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calcular quantos dias vazios no início (domingo = 0, segunda = 1, etc.)
    const dayOfWeek = firstDay.getDay();
    const emptyDaysAtStart = dayOfWeek; // Domingo = 0 dias vazios, Segunda = 1, etc.
    
    const layout = [];
    
    // Adicionar dias vazios no início
    for (let i = 0; i < emptyDaysAtStart; i++) {
      layout.push(null);
    }
    
    // Adicionar todos os dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
      layout.push(new Date(year, month, day));
    }
    
    // Completar a última semana com dias vazios se necessário
    while (layout.length % 7 !== 0) {
      layout.push(null);
    }
    
    return layout;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEntryForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return entries.find(entry => entry.date === dateStr);
  };

  const getDayName = (date: Date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const getMonthName = (date: Date) => {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return months[date.getMonth()];
  };

  const openModal = (date: Date, type: 'comment' | 'analysis') => {
    setSelectedDate(date);
    setModalType(type);
    setShowModal(true);
    
    // Pre-fill with existing entry if available
    const existingEntry = getEntryForDate(date);
    if (existingEntry) {
      setNewEntry({
        title: existingEntry.title || '',
        content: existingEntry.content || '',
        pnl: existingEntry.pnl || 0,
        trades: existingEntry.trades || 0,
        mood: existingEntry.mood || 'neutral',
        time: existingEntry.time || '',
        predefinedComments: existingEntry.predefinedComments || []
      });
    } else {
      setNewEntry({
        title: '',
        content: '',
        pnl: 0,
        trades: 0,
        mood: 'neutral',
        time: '',
        predefinedComments: []
      });
    }
  };

  const saveEntry = () => {
    if (!selectedDate) return;
    
    const dateStr = formatDate(selectedDate);
    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: dateStr,
      title: newEntry.title,
      content: newEntry.content,
      pnl: newEntry.pnl,
      trades: newEntry.trades,
      mood: newEntry.mood,
      time: newEntry.time,
      predefinedComments: newEntry.predefinedComments
    };
    
    setEntries(prev => {
      const filtered = prev.filter(e => e.date !== dateStr);
      return [...filtered, entry];
    });
    
    setShowModal(false);
    setSelectedDate(null);
  };

  const togglePredefinedComment = (comment: string) => {
    setNewEntry(prev => ({
      ...prev,
      predefinedComments: prev.predefinedComments.includes(comment)
        ? prev.predefinedComments.filter(c => c !== comment)
        : [...prev.predefinedComments, comment]
    }));
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '➡️';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Calcular estatísticas
  const getStats = () => {
    let relevantEntries = entries;
    
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    relevantEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });
    
    const totalPnL = relevantEntries.reduce((sum, entry) => sum + (entry.pnl || 0), 0);
    const totalTrades = relevantEntries.reduce((sum, entry) => sum + (entry.trades || 0), 0);
    const profitableDays = relevantEntries.filter(entry => (entry.pnl || 0) > 0).length;
    const totalDays = relevantEntries.filter(entry => (entry.trades || 0) > 0).length;
    const winRate = totalDays > 0 ? (profitableDays / totalDays) * 100 : 0;
    
    return { totalPnL, totalTrades, winRate, totalDays };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {language === 'en' ? 'Quant Diary' : 'Diário Quant'}
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">
            {language === 'en' ? 'Month P&L' : 'P&L Mês'}
          </p>
          <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            R$ {stats.totalPnL.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">
            {language === 'en' ? 'Total Trades' : 'Total Trades'}
          </p>
          <p className="text-2xl font-bold text-blue-400">{stats.totalTrades}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">
            {language === 'en' ? 'Win Rate' : 'Taxa Acerto'}
          </p>
          <p className="text-2xl font-bold text-yellow-400">{stats.winRate.toFixed(1)}%</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">
            {language === 'en' ? 'Trading Days' : 'Dias Operados'}
          </p>
          <p className="text-2xl font-bold text-purple-400">{stats.totalDays}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          title="Mês anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold">
          {`${getMonthName(currentDate)} de ${currentDate.getFullYear()}`}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          title="Próximo mês"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-7 gap-2">
        {/* Header dos dias da semana */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-400 bg-gray-800 rounded-lg">
            {day}
          </div>
        ))}
        
        {/* Dias do calendário */}
        {getCalendarLayout().map((day, index) => {
          const entry = day ? getEntryForDate(day) : null;
          const isToday = day ? formatDate(day) === formatDate(new Date()) : false;
          
          return (
            <div
              key={index}
              className={`min-h-32 p-3 rounded-lg border transition-all duration-300 ${
                !day 
                  ? 'border-transparent bg-transparent cursor-default' // Dias vazios
                  : isToday 
                    ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                    : 'border-gray-700 bg-gray-800 hover:border-blue-500'
              }`}
            >
              {day && (
                <>
                  <div className="text-center mb-2">
                    <span className="text-lg font-bold text-white">
                      {day.getDate()}
                    </span>
                    <div className="text-xs text-gray-400">
                      Sem {getWeekOfMonth(day)} (S{getWeekOfYear(day)})
                    </div>
                  </div>
              
                  {entry && (
                    <div className="space-y-1 mb-3">
               className={`min-h-32 p-3 rounded-lg border transition-all duration-300 group ${
                        <div className={`text-xs font-medium ${
                          entry.pnl > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          R$ {entry.pnl.toFixed(0)}
                     : 'border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-700'
                      )}
                  
                      {entry.trades !== undefined && entry.trades > 0 && (
                        <div className="text-xs text-blue-400">
                          {entry.trades} trades
                        </div>
                      )}
                  
                      <div className="text-center">
                        <span className="text-sm">{getMoodEmoji(entry.mood || 'neutral')}</span>
                      </div>
                    </div>
                  )}
              
                  {/* Botões de ação */}
                  <div className="space-y-1">
                    <button
                      onClick={(e) => {
                     <div className="space-y-1 mb-2">
                        openModal(day, 'comment');
                      }}
                      className="w-full py-1 px-2 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white flex items-center justify-center transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Comentários
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(day, 'analysis');
                      }}
                      className="w-full py-1 px-2 bg-green-600 hover:bg-green-700 rounded text-xs text-white flex items-center justify-center transition-colors"
                    >
                      <BarChart2 className="w-3 h-3 mr-1" />
                      Análise
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {/* Modal */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                {modalType === 'comment' 
                  ? (language === 'en' ? 'Add Comments' : 'Adicionar Comentários')
                  : (language === 'en' ? 'Add Saved Analysis' : 'Adicionar Análise Salva')}
              </h2>
              <p className="mt-2 text-gray-400">
                {selectedDate && selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) + ` - Semana ${getWeekOfMonth(selectedDate)} do mês (Semana ${getWeekOfYear(selectedDate)} do ano)`}
              </p>
            </div>

            {modalType === 'comment' ? (
              <div className="space-y-4">
                {/* Título da sessão */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Session Title' : 'Título da Sessão'}
                  </label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Scalping WINFUT, Swing PETR4..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>


                {/* Humor */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'Mood' : 'Humor do Dia'}
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'positive', emoji: '📈', label: language === 'en' ? 'Positive' : 'Positivo' },
                      { value: 'neutral', emoji: '➡️', label: language === 'en' ? 'Neutral' : 'Neutro' },
                      { value: 'negative', emoji: '📉', label: language === 'en' ? 'Negative' : 'Negativo' }
                   <div className="space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        key={mood.value}
                        onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value as any }))}
                        className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                          newEntry.mood === mood.value
                            ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                            : 'border-gray-600 hover:border-gray-500'
                       className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white flex items-center justify-center transition-colors"
                      >
                       className="w-full py-1.5 px-2 bg-green-600 hover:bg-green-700 rounded text-xs text-white flex items-center justify-center transition-colors"
                          <div className="text-2xl mb-1">{mood.emoji}</div>
                          <div className="text-sm">{mood.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comentários Predefinidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'Daily Analysis & Operational Errors' : 'Análise Diária e Erros Operacionais'}
                  </label>
                  
                  <div className="space-y-3">
                    {Object.entries(predefinedComments).map(([category, comments]) => (
                      <div key={category}>
                        <p className="text-xs text-gray-400 mb-2 capitalize">
                          {category === 'positive' ? 'Pontos Positivos' : 
                           category === 'negative' ? 'Erros e Problemas' : 'Observações Gerais'}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {comments.map(comment => (
                            <button
                              key={comment}
                              onClick={() => togglePredefinedComment(comment)}
                              className={`p-2 rounded-md text-left text-sm transition-colors ${
                                newEntry.predefinedComments.includes(comment)
                                  ? category === 'positive' 
                                    ? 'bg-green-900 bg-opacity-30 border border-green-600 text-green-300'
                                    : category === 'negative'
                                    ? 'bg-red-900 bg-opacity-30 border border-red-600 text-red-300'
                                    : 'bg-blue-900 bg-opacity-30 border border-blue-600 text-blue-300'
                                  : 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {comment}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas livres */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Detailed Analysis & Lessons Learned' : 'Análise Detalhada e Lições Aprendidas'}
                  </label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Análise do dia: O que funcionou? Quais erros foram cometidos? Que ajustes são necessários? Lições aprendidas para próximas operações..."
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Botões do modal */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                  >
                    {language === 'en' ? 'Cancel' : 'Cancelar'}
                  </button>
                  <button
                    onClick={saveEntry}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                  >
                    {language === 'en' ? 'Save' : 'Salvar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <BarChart2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'en' ? 'Import Saved Analysis' : 'Importar Análise Salva'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {language === 'en' 
                      ? 'Select a saved backtest analysis to associate with this day'
                      : 'Selecione uma análise de backtest salva para associar a este dia'}
                  </p>
                  
                  <button
                    onClick={() => {
                      // Navegar para página de análise de backtest
                      window.location.href = '/backtest-analysis';
                    }}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md text-white flex items-center mx-auto"
                  >
                    <BarChart2 className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Go to Backtest Analysis' : 'Ir para Análise de Backtest'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}