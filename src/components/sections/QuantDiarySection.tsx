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
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
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
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeekStart);
    setCurrentDate(new Date(newWeekStart));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
    
    if (viewType === 'weekly') {
      // Ajustar currentWeekStart para a primeira semana do novo mês
      const firstDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      const dayOfWeek = firstDayOfMonth.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const firstMonday = new Date(firstDayOfMonth);
      firstMonday.setDate(firstDayOfMonth.getDate() + mondayOffset);
      firstMonday.setHours(0, 0, 0, 0);
      setCurrentWeekStart(firstMonday);
    }
  };

  // Função para calcular o número da semana no mês
  const getWeekOfMonth = (date: Date) => {
    // Pega a primeira segunda-feira do mês ou antes
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    // Calcula quantos dias até a primeira segunda-feira
    const daysToFirstMonday = firstDayOfWeek === 0 ? 1 : (8 - firstDayOfWeek);
    const firstMonday = new Date(date.getFullYear(), date.getMonth(), daysToFirstMonday);
    
    // Se a data é antes da primeira segunda-feira, é semana 1
    if (date < firstMonday) {
      return 1;
    }
    
    // Calcula quantos dias desde a primeira segunda-feira
    const daysDiff = Math.floor((date.getTime() - firstMonday.getTime()) / (24 * 60 * 60 * 1000));
    
    // Calcula a semana (primeira segunda-feira é semana 1, então +1)
    return Math.floor(daysDiff / 7) + 1;
  };

  // Função para calcular o número da semana no ano (ISO 8601)
  const getWeekOfYear = (date: Date) => {
    // Cria uma cópia da data para não modificar a original
    const tempDate = new Date(date.getTime());
    
    // Define para quinta-feira da semana atual
    const dayOfWeek = (tempDate.getDay() + 6) % 7; // Segunda = 0, Terça = 1, etc.
    tempDate.setDate(tempDate.getDate() - dayOfWeek + 3); // +3 para quinta-feira
    
    // Pega o ano da quinta-feira (pode ser diferente do ano da data original)
    const yearOfThursday = tempDate.getFullYear();
    
    // Primeira quinta-feira do ano
    const firstThursday = new Date(yearOfThursday, 0, 4); // 4 de janeiro é sempre na primeira semana
    const firstThursdayDayOfWeek = (firstThursday.getDay() + 6) % 7;
    firstThursday.setDate(firstThursday.getDate() - firstThursdayDayOfWeek + 3);
    
    // Calcula a diferença em semanas
    const diffTime = tempDate.getTime() - firstThursday.getTime();
    const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
    
    return diffWeeks + 1;
  };

  const getWeekDays = () => {
    const days = [];
    
    // Get the current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Calculate which week of the month we're viewing
    const weekOfMonth = getWeekOfMonth(currentWeekStart);
    
    // Get all days of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Find the start of the week we want to show
    let weekStartDay = 1;
    
    // Calculate the start day for each week of the month
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = firstDayOfWeek === 0 ? 1 : (2 - firstDayOfWeek); // Days to first Monday
    
    if (weekOfMonth === 1) {
      // First week starts on day 1
      weekStartDay = 1;
    } else {
      // Calculate start day for subsequent weeks
      const firstMondayDay = mondayOffset > 0 ? mondayOffset : mondayOffset + 7;
      weekStartDay = firstMondayDay + ((weekOfMonth - 2) * 7);
    }
    
    // Generate days for this week, only within the current month
    let currentDay = weekStartDay;
    const maxDaysToShow = showWeekends ? 7 : 5;
    
    for (let i = 0; i < maxDaysToShow && currentDay <= lastDayOfMonth.getDate(); i++) {
      const day = new Date(currentYear, currentMonth, currentDay);
      
      // Only add if it's a valid day of the month
      if (day.getMonth() === currentMonth) {
        // Check if we should include weekends
        const dayOfWeek = day.getDay();
        if (showWeekends || (dayOfWeek >= 1 && dayOfWeek <= 5)) {
          days.push(day);
        }
      }
      
      currentDay++;
    }
    
    return days;
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Ajustar para começar na segunda-feira
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(firstDay.getDate() + mondayOffset);
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Gerar 42 dias (6 semanas)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEntryForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return entries.find(entry => entry.date === dateStr);
  };

  const getDayName = (date: Date) => {
    const days = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
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
            ? `${getMonthName(currentWeekStart)} de ${currentWeekStart.getFullYear()} - Semana ${getWeekOfMonth(currentWeekStart)} (Semana ${getWeekOfYear(currentWeekStart)} do ano)`
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
        <div className="grid grid-cols-7 gap-2">
          {/* Header dos dias da semana */}
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
              {day}
            </div>
          ))}
          
          {/* Dias do calendário */}
          {getCalendarDays().map((day, index) => {
            const entry = getEntryForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = formatDate(day) === formatDate(new Date());
            
            return (
              <div
                key={index}
                className={`min-h-24 p-2 rounded-lg border transition-all duration-300 hover:border-blue-500 cursor-pointer ${
                  isToday 
                    ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
                    : isCurrentMonth 
                      ? 'border-gray-700 bg-gray-800' 
                      : 'border-gray-800 bg-gray-900 opacity-50'
                }`}
                onClick={() => openModal(day, 'comment')}
              >
                <div className="text-center mb-2">
                  <span className={`text-sm font-medium ${
                    isCurrentMonth ? 'text-white' : 'text-gray-500'
                  }`}>
                    {day.getDate()}
                  </span>
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
                
                {!entry && isCurrentMonth && (
                  <div className="flex items-center justify-center h-full">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
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
                {selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
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