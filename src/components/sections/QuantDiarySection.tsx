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
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // Encontrar a segunda-feira da semana atual
    const today = new Date(2025, 0, 8); // 8 de janeiro de 2025 (uma quarta-feira)
    const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    
    // Calcular quantos dias voltar para chegar na segunda-feira
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Se domingo, volta 6 dias
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    
    return monday;
  });
  const [viewType, setViewType] = useState<'calendar' | 'weekly'>('weekly');
  const [showWeekends, setShowWeekends] = useState(false);
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
      'Excelente execução da estratégia',
      'Disciplina mantida durante todo o dia',
      'Sinais claros e bem executados',
      'Gerenciamento de risco eficaz',
      'Lucro dentro do esperado',
      'Paciência recompensada'
    ],
    negative: [
      'Overtrading prejudicou os resultados',
      'Sinais confusos no mercado',
      'Saí muito cedo dos trades',
      'Não respeitei o stop loss',
      'Mercado lateral difícil',
      'Emocional atrapalhou as decisões'
    ],
    neutral: [
      'Dia de observação e aprendizado',
      'Mercado sem oportunidades claras',
      'Foco em preservar capital',
      'Aguardando melhores setups',
      'Revisão de estratégias',
      'Análise de performance'
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

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      const nextWeekStart = new Date(currentWeekStart);
      nextWeekStart.setDate(currentWeekStart.getDate() + 7);
      
      // Verificar se ainda está em 2025
      if (nextWeekStart.getFullYear() <= 2025) {
        setCurrentWeekStart(nextWeekStart);
        setCurrentDate(new Date(nextWeekStart));
      }
      
    } else {
      const prevWeekStart = new Date(currentWeekStart);
      prevWeekStart.setDate(currentWeekStart.getDate() - 7);
      
      // Verificar se ainda está em 2025
      if (prevWeekStart.getFullYear() >= 2025) {
        setCurrentWeekStart(prevWeekStart);
        setCurrentDate(new Date(prevWeekStart));
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const newMonth = currentDate.getMonth() + (direction === 'next' ? 1 : -1);
    const newYear = newMonth < 0 ? currentDate.getFullYear() - 1 : 
                   newMonth > 11 ? currentDate.getFullYear() + 1 : 
                   currentDate.getFullYear();
    
    // Limitar apenas a 2025
    if (newYear < 2025) {
      return; // Não permitir navegar para antes de 2025
    }
    if (newYear > 2025) {
      return; // Não permitir navegar para depois de 2025
    }
    
    newDate.setFullYear(newYear);
    newDate.setMonth(newMonth < 0 ? 11 : newMonth > 11 ? 0 : newMonth);
    setCurrentDate(newDate);
    
    if (viewType === 'weekly') {
      // Calcular a primeira semana do novo mês
      const firstDayOfMonth = new Date(2025, newDate.getMonth(), 1);
      const startOfYear = new Date(2025, 0, 1);
      const dayOfYear = Math.floor((firstDayOfMonth.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
      const weekOfYear = Math.ceil(dayOfYear / 7);
      
      const firstWeekStart = new Date(2025, 0, ((weekOfYear - 1) * 7) + 1);
      setCurrentWeekStart(firstWeekStart);
    }
  };

  // Função para calcular o número da semana no ano (baseado no CSV)
  const getWeekOfYear = (date: Date) => {
    if (date.getFullYear() !== 2025) return 1;
    
    // Primeira semana sempre começa no dia 1 de janeiro
    const jan1 = new Date(2025, 0, 1); // 1º de janeiro de 2025
    
    // Calcular quantos dias se passaram desde 1º de janeiro
    const daysDiff = Math.floor((date.getTime() - jan1.getTime()) / (24 * 60 * 60 * 1000));
    return Math.floor(daysDiff / 7) + 1; // +1 porque a primeira semana é a semana 1
  };
  
  // Função para calcular o número da semana no mês (baseado no CSV)
  const getWeekOfMonth = (date: Date) => {
    // Primeira semana sempre começa no dia 1 do mês
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    
    // Calcular quantos dias se passaram desde o primeiro dia do mês
    const daysDiff = Math.floor((date.getTime() - firstDayOfMonth.getTime()) / (24 * 60 * 60 * 1000));
    return Math.floor(daysDiff / 7) + 1; // +1 porque a primeira semana é a semana 1
  };

  const getWeekDays = () => {
    const days = [];
    
    // Semana SEMPRE começa no domingo (igual ao calendário)
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      
      // Parar se mudou de ano (não permitir ir além de 2025)
      if (date.getFullYear() !== 2025) {
        break;
      }
      
      // Filtrar fins de semana se necessário
      if (!showWeekends) {
        const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
        if (dayOfWeek === 0 || dayOfWeek === 6) { // domingo ou sábado
          continue;
        }
      }
      
      days.push(date);
    }
    
    return days;
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
    
    if (viewType === 'weekly') {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      relevantEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= currentWeekStart && entryDate <= weekEnd;
      });
    } else {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      relevantEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });
    }
    
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
        
        <div className="flex items-center space-x-4">
          {/* View Type Switcher */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewType('weekly')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewType === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Weekly' : 'Semanal'}
            </button>
            <button
              onClick={() => setViewType('calendar')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewType === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {language === 'en' ? 'Calendar' : 'Calendário'}
            </button>
          </div>
          
          {/* Weekend Toggle for Weekly View */}
          {viewType === 'weekly' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {language === 'en' ? 'Weekends' : 'Fins de semana'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showWeekends} 
                  onChange={() => setShowWeekends(!showWeekends)} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">
            {viewType === 'weekly' 
              ? (language === 'en' ? 'Week P&L' : 'P&L Semana')
              : (language === 'en' ? 'Month P&L' : 'P&L Mês')}
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
          onClick={() => viewType === 'weekly' ? navigateWeek('prev') : navigateMonth('prev')}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          title={viewType === 'weekly' ? 'Semana anterior' : 'Mês anterior'}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold">
          {viewType === 'weekly' 
            ? `${getMonthName(currentWeekStart)} de 2025 - Semana ${getWeekOfMonth(currentWeekStart)} (Semana ${getWeekOfYear(currentWeekStart)} do ano)`
            : `${getMonthName(currentDate)} de ${currentDate.getFullYear()}`}
        </h3>
        
        <button
          onClick={() => viewType === 'weekly' ? navigateWeek('next') : navigateMonth('next')}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          title={viewType === 'weekly' ? 'Próxima semana' : 'Próximo mês'}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Views */}
      {viewType === 'weekly' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {getWeekDays().map((day, index) => {
            const entry = getEntryForDate(day);
            const isToday = formatDate(day) === formatDate(new Date());
            
            return (
              <div
                key={index}
                className={`bg-gray-800 rounded-lg p-6 border-2 transition-all duration-300 hover:border-blue-500 min-h-80 flex flex-col ${
                  isToday ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 'border-gray-700'
                }`}
              >
                {/* Header do Card */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400 mb-1">{getDayName(day)}</p>
                  <p className="text-3xl font-bold">{day.getDate()}</p>
                </div>
                
                {/* Conteúdo Principal */}
                <div className="flex-1 space-y-3">
                  {entry ? (
                    <>
                      {/* P&L em destaque */}
                      {entry.pnl !== undefined && entry.pnl !== 0 && (
                        <div className={`p-3 rounded-lg ${
                          entry.pnl > 0 ? 'bg-green-900 bg-opacity-30' : 'bg-red-900 bg-opacity-30'
                        }`}>
                          <p className="text-xs text-gray-400">P&L</p>
                          <p className={`text-lg font-bold ${
                            entry.pnl > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            R$ {entry.pnl.toFixed(2)}
                          </p>
                        </div>
                      )}
                      
                      {/* Título da sessão */}
                      {entry.title && (
                        <div>
                          <p className="text-xs text-gray-400">Sessão</p>
                          <p className="font-medium text-white text-sm">{entry.title}</p>
                        </div>
                      )}
                      
                      {/* Preview do conteúdo */}
                      {entry.content && (
                        <div>
                          <p className="text-xs text-gray-400">Notas</p>
                          <p className="text-sm text-gray-300">
                            {entry.content.length > 80 
                              ? `${entry.content.substring(0, 80)}...` 
                              : entry.content}
                          </p>
                        </div>
                      )}
                      
                      {/* Comentários predefinidos */}
                      {entry.predefinedComments && entry.predefinedComments.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Comentários</p>
                          <div className="space-y-1">
                            {entry.predefinedComments.slice(0, 2).map((comment, idx) => (
                              <div key={idx} className="flex items-start">
                                <Hash className="w-3 h-3 text-blue-400 mr-1 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-gray-300">{comment}</p>
                              </div>
                            ))}
                            {entry.predefinedComments.length > 2 && (
                              <p className="text-xs text-blue-400">
                                +{entry.predefinedComments.length - 2} mais
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Número de trades */}
                      {entry.trades !== undefined && entry.trades > 0 && (
                        <div>
                          <p className="text-xs text-gray-400">Trades</p>
                          <p className="text-sm font-medium text-blue-400">{entry.trades}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-gray-500 text-sm text-center">
                        {language === 'en' ? 'No entries' : 'Sem registros'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Botões de Ação */}
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => openModal(day, 'comment')}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Comentários
                  </button>
                  
                  <button
                    onClick={() => openModal(day, 'analysis')}
                    className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm flex items-center justify-center transition-colors"
                  >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Add Análise Salva
                  </button>
                </div>
                
                {/* Footer com humor e horário */}
                {entry && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                    <span className="text-lg">{getMoodEmoji(entry.mood || 'neutral')}</span>
                    {entry.time && (
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {entry.time}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {/* Header dos dias da semana */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
              {day}
            </div>
          ))}
          
          {/* Dias do calendário */}
          {getCalendarLayout().map((day, index) => {
            const entry = day ? getEntryForDate(day) : null;
            const isCurrentMonth = day ? day.getMonth() === currentDate.getMonth() : false;
            const isToday = day ? formatDate(day) === formatDate(new Date()) : false;
            
            return (
              <div
                key={index}
                className={`min-h-24 p-2 rounded-lg border transition-all duration-300 hover:border-blue-500 cursor-pointer ${
                  !day 
                    ? 'border-transparent bg-transparent cursor-default' // Dias vazios
                    : isToday 
                      ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                      : 'border-gray-700 bg-gray-800'
                }`}
                onClick={() => day && openModal(day, 'comment')}
              >
                {day && (
                  <>
                    <div className="text-center mb-2">
                      <span className="text-sm font-medium text-white">
                        {day.getDate()}
                      </span>
                      <div className="text-xs text-gray-400">
                        Sem {getWeekOfMonth(day)} (S{getWeekOfYear(day)})
                      </div>
                    </div>
                
                    {entry && (
                      <div className="space-y-1">
                        {entry.pnl !== undefined && entry.pnl !== 0 && (
                          <div className={`text-xs font-medium ${
                            entry.pnl > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            R$ {entry.pnl.toFixed(0)}
                          </div>
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
                
                    {!entry && (
                      <div className="flex items-center justify-center h-full">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

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

                {/* P&L e Trades */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">P&L (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newEntry.pnl}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, pnl: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {language === 'en' ? 'Trades' : 'Número de Trades'}
                    </label>
                    <input
                      type="number"
                      value={newEntry.trades}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, trades: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Horário */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {language === 'en' ? 'Time' : 'Horário'}
                  </label>
                  <input
                    type="time"
                    value={newEntry.time}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, time: e.target.value }))}
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
                    ].map(mood => (
                      <button
                        key={mood.value}
                        onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value as any }))}
                        className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                          newEntry.mood === mood.value
                            ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-center">
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
                    {language === 'en' ? 'Quick Comments' : 'Comentários Rápidos'}
                  </label>
                  
                  <div className="space-y-3">
                    {Object.entries(predefinedComments).map(([category, comments]) => (
                      <div key={category}>
                        <p className="text-xs text-gray-400 mb-2 capitalize">
                          {category === 'positive' ? 'Positivos' : 
                           category === 'negative' ? 'Negativos' : 'Neutros'}
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
                    {language === 'en' ? 'Additional Notes' : 'Notas Adicionais'}
                  </label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Observações, lições aprendidas, ajustes para próximas operações..."
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



