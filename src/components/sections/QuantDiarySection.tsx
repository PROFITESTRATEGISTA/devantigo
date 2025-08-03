import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, MessageSquare, BarChart2, Clock, Hash, TrendingUp, TrendingDown, Minus, Edit2 } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'calendar' | 'graph'>('calendar');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalType, setModalType] = useState<'comment' | 'analysis'>('comment');
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showDayPerformance, setShowDayPerformance] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'positive' | 'negative' | 'neutral',
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
    // Initialize with empty entries - user will add their own data
    setEntries([]);
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
        mood: existingEntry.mood || 'neutral',
        predefinedComments: existingEntry.predefinedComments || []
      });
    } else {
      setNewEntry({
        title: '',
        content: '',
        mood: 'neutral',
        predefinedComments: []
      });
    }
  };

  const openSelectionModal = (date: Date) => {
    const entry = getEntryForDate(date);
    
    if (entry && (entry.pnl !== undefined || entry.trades !== undefined)) {
      // Se tem dados, mostrar performance do dia
      setSelectedDate(date);
      setShowDayPerformance(true);
    } else {
      // Se não tem dados, mostrar seleção para adicionar
      setSelectedDate(date);
      setShowSelectionModal(true);
    }
  };

  const handleSelectionChoice = (type: 'comment' | 'analysis') => {
    setShowSelectionModal(false);
    if (selectedDate) {
      openModal(selectedDate, type);
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
      mood: newEntry.mood,
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
    
    // Métricas avançadas
    const bestDay = entries.length > 0 ? Math.max(...entries.map(e => e.pnl || 0)) : 0;
    const worstDay = entries.length > 0 ? Math.min(...entries.map(e => e.pnl || 0)) : 0;
    const profitableTrades = relevantEntries.reduce((sum, entry) => {
      return sum + (entry.pnl && entry.pnl > 0 ? entry.trades || 0 : 0);
    }, 0);
    const lossTrades = totalTrades - profitableTrades;
    
    // Calcular Profit Factor
    const grossProfit = relevantEntries.reduce((sum, entry) => {
      return sum + (entry.pnl && entry.pnl > 0 ? entry.pnl : 0);
    }, 0);
    const grossLoss = Math.abs(relevantEntries.reduce((sum, entry) => {
      return sum + (entry.pnl && entry.pnl < 0 ? entry.pnl : 0);
    }, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
    
    // Calcular Sharpe Ratio (simplificado)
    const dailyReturns = relevantEntries.map(e => e.pnl || 0);
    const avgReturn = dailyReturns.length > 0 ? totalPnL / dailyReturns.length : 0;
    const variance = dailyReturns.length > 0 ? 
      dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / dailyReturns.length : 0;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0; // Anualizado
    
    // Calcular Drawdown
    let maxDrawdown = 0;
    let peak = 0;
    let cumulativePnL = 0;
    
    for (const entry of relevantEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())) {
      cumulativePnL += entry.pnl || 0;
      if (cumulativePnL > peak) {
        peak = cumulativePnL;
      }
      const drawdown = peak - cumulativePnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return { 
      totalPnL, 
      totalTrades, 
      winRate, 
      totalDays,
      bestDay,
      worstDay,
      profitFactor,
      sharpeRatio,
      maxDrawdown,
      grossProfit,
      grossLoss
    };
  };

  const stats = getStats();

  // Função para renderizar gráfico de P&L
  const renderGraphView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });

    // Criar dados para o gráfico (simulado)
    const graphData = [];
    let cumulativePnL = 0;
    
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const entry = getEntryForDate(date);
      if (entry && entry.pnl !== undefined) {
        cumulativePnL += entry.pnl;
      }
      graphData.push({
        day,
        pnl: entry?.pnl || 0,
        cumulativePnL,
        trades: entry?.trades || 0
      });
    }

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <BarChart2 className="w-5 h-5 text-blue-400 mr-2" />
          {language === 'en' ? 'P&L Chart' : 'Gráfico de P&L'}
        </h3>
        
        {/* Gráfico simulado */}
        <div className="h-64 bg-gray-900 rounded-lg p-4 flex items-end justify-between">
          {graphData.slice(0, 31).map((data, index) => {
            const maxPnL = Math.max(...graphData.map(d => Math.abs(d.pnl)));
            const height = maxPnL > 0 ? Math.abs(data.pnl) / maxPnL * 200 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center group relative">
                <div
                  className={`w-6 rounded-t ${
                    data.pnl > 0 ? 'bg-green-500' : data.pnl < 0 ? 'bg-red-500' : 'bg-gray-600'
                  } transition-all duration-200 hover:opacity-80`}
                  style={{ height: `${height}px` }}
                />
                <span className="text-xs text-gray-400 mt-1">{data.day}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  <div>Dia {data.day}</div>
                  <div>P&L: R$ {data.pnl.toFixed(2)}</div>
                  <div>Trades: {data.trades}</div>
                  <div>Acumulado: R$ {data.cumulativePnL.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legenda */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-400">
              {language === 'en' ? 'Profit' : 'Lucro'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-400">
              {language === 'en' ? 'Loss' : 'Perda'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-600 rounded mr-2"></div>
            <span className="text-sm text-gray-400">
              {language === 'en' ? 'No Trading' : 'Sem Operações'}
            </span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {language === 'en' ? 'Quant Diary' : 'Diário Quant'}
        </h2>
        
        {/* View Mode Switch */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">
            {language === 'en' ? 'View:' : 'Visualização:'}
          </span>
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Calendar' : 'Calendário'}
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                viewMode === 'graph'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Graph' : 'Gráfico'}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Panel */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
            {language === 'en' ? 'Performance Statistics' : 'Estatísticas de Performance'}
          </h3>
          <span className="text-sm text-gray-400">
            {getMonthName(currentDate)} {currentDate.getFullYear()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">
                {language === 'en' ? 'Month P&L' : 'P&L do Mês'}
              </p>
              {stats.totalPnL >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}R$ {stats.totalPnL.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">
                {language === 'en' ? 'Total Trades' : 'Total de Trades'}
              </p>
              <Hash className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.totalTrades}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalDays > 0 ? `${(stats.totalTrades / stats.totalDays).toFixed(1)} por dia` : '0 por dia'}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">
                {language === 'en' ? 'Win Rate' : 'Taxa de Acerto'}
              </p>
              <div className={`w-4 h-4 rounded-full ${
                stats.winRate >= 60 ? 'bg-green-400' : 
                stats.winRate >= 40 ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              stats.winRate >= 60 ? 'text-green-400' : 
              stats.winRate >= 40 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {stats.winRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalDays} {language === 'en' ? 'trading days' : 'dias operados'}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">
                {language === 'en' ? 'Profit Factor' : 'Fator de Lucro'}
              </p>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <p className={`text-2xl font-bold ${
              stats.profitFactor >= 1.5 ? 'text-green-400' : 
              stats.profitFactor >= 1.0 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {stats.profitFactor.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.profitFactor >= 1.0 ? 'Lucrativo' : 'Prejuízo'}
            </p>
          </div>
        </div>
        
        {/* Additional Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">
              {language === 'en' ? 'Sharpe Ratio' : 'Sharpe Ratio'}
            </p>
            <p className={`text-lg font-bold ${
              stats.sharpeRatio >= 1.0 ? 'text-green-400' : 
              stats.sharpeRatio >= 0.5 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {stats.sharpeRatio.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">
              {language === 'en' ? 'Max Drawdown' : 'Drawdown Máximo'}
            </p>
            <p className={`text-lg font-bold ${
              stats.maxDrawdown <= 500 ? 'text-green-400' : 
              stats.maxDrawdown <= 1000 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              R$ {stats.maxDrawdown.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">
              {language === 'en' ? 'Best Day' : 'Melhor Dia'}
            </p>
            <p className="text-lg font-bold text-green-400">
              R$ {stats.bestDay.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">
              {language === 'en' ? 'Worst Day' : 'Pior Dia'}
            </p>
            <p className="text-lg font-bold text-red-400">
              R$ {stats.worstDay.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Third Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">
              {language === 'en' ? 'Avg P&L/Day' : 'P&L Médio/Dia'}
            </p>
            <p className={`text-lg font-bold ${
              stats.totalDays > 0 && stats.totalPnL / stats.totalDays >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              R$ {stats.totalDays > 0 ? (stats.totalPnL / stats.totalDays).toFixed(2) : '0.00'}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">
              {language === 'en' ? 'Profitable Days' : 'Dias Lucrativos'}
            </p>
            <p className="text-lg font-bold text-blue-400">
              {entries.filter(e => (e.pnl || 0) > 0).length}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">
              {language === 'en' ? 'Loss Days' : 'Dias de Perda'}
            </p>
            <p className="text-lg font-bold text-orange-400">
              {entries.filter(e => (e.pnl || 0) < 0).length}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">
              {language === 'en' ? 'Gross Profit' : 'Lucro Bruto'}
            </p>
            <p className="text-lg font-bold text-green-400">
              R$ {stats.grossProfit.toFixed(2)}
            </p>
          </div>
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

      {/* Content based on view mode */}
      {viewMode === 'calendar' ? (
        /* Calendar View */
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
                    ? 'border-transparent bg-transparent cursor-default'
                    : isToday 
                      ? 'border-blue-500 bg-blue-900 bg-opacity-20 cursor-pointer hover:bg-blue-900 hover:bg-opacity-30' 
                      : 'border-gray-700 bg-gray-800 hover:border-blue-500 cursor-pointer hover:bg-gray-700'
                }`}
                onClick={() => day && openSelectionModal(day)}
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
                
                    {entry ? (
                      <div className="space-y-2">
                        {entry.pnl !== undefined && (
                          <div className={`text-sm font-bold text-center ${
                            entry.pnl > 0 ? 'text-green-400' : entry.pnl < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {entry.pnl > 0 ? '+' : ''}R$ {entry.pnl.toFixed(0)}
                          </div>
                        )}
                        
                        {entry.trades !== undefined && entry.trades > 0 && (
                          <div className="text-xs text-blue-400 text-center">
                            {entry.trades} trades
                          </div>
                        )}
                        
                        <div className="text-center">
                          <span className="text-lg">{getMoodEmoji(entry.mood || 'neutral')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-xs text-gray-500 text-center">
                          Clique para adicionar dados
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Graph View */
        renderGraphView()
      )}

      {/* Day Performance Modal */}
      {showDayPerformance && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative">
            <button 
              onClick={() => setShowDayPerformance(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
            
            {(() => {
              const entry = getEntryForDate(selectedDate);
              return (
                <div>
                  <div className="text-center mb-6">
                    <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-100">
                      {language === 'en' ? 'Daily Performance' : 'Performance do Dia'}
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

                  {entry ? (
                    <div className="space-y-6">
                      {/* Performance Summary */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <BarChart2 className="w-5 h-5 text-blue-400 mr-2" />
                          {language === 'en' ? 'Performance Summary' : 'Resumo da Performance'}
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">P&L do Dia</p>
                            <p className={`text-2xl font-bold ${
                              (entry.pnl || 0) > 0 ? 'text-green-400' : 
                              (entry.pnl || 0) < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {(entry.pnl || 0) > 0 ? '+' : ''}R$ {(entry.pnl || 0).toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Total de Trades</p>
                            <p className="text-2xl font-bold text-blue-400">
                              {entry.trades || 0}
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Humor do Dia</p>
                            <div className="text-2xl">
                              {getMoodEmoji(entry.mood || 'neutral')}
                            </div>
                            <p className={`text-sm font-medium ${getMoodColor(entry.mood || 'neutral')}`}>
                              {entry.mood === 'positive' ? 'Positivo' : 
                               entry.mood === 'negative' ? 'Negativo' : 'Neutro'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Session Details */}
                      {entry.title && (
                        <div className="bg-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-2">
                            {language === 'en' ? 'Session Title' : 'Título da Sessão'}
                          </h3>
                          <p className="text-gray-300">{entry.title}</p>
                        </div>
                      )}

                      {/* Comments */}
                      {entry.predefinedComments && entry.predefinedComments.length > 0 && (
                        <div className="bg-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-3">
                            {language === 'en' ? 'Daily Analysis' : 'Análise do Dia'}
                          </h3>
                          <div className="space-y-2">
                            {entry.predefinedComments.map((comment, index) => (
                              <div key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-sm text-gray-300">{comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detailed Notes */}
                      {entry.content && (
                        <div className="bg-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-3">
                            {language === 'en' ? 'Detailed Analysis' : 'Análise Detalhada'}
                          </h3>
                          <p className="text-gray-300 whitespace-pre-line">{entry.content}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-between space-x-3">
                        <button
                          onClick={() => {
                            setShowDayPerformance(false);
                            openModal(selectedDate, 'comment');
                          }}
                          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center justify-center"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          {language === 'en' ? 'Edit Entry' : 'Editar Entrada'}
                        </button>
                        
                        <button
                          onClick={() => setShowDayPerformance(false)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                        >
                          {language === 'en' ? 'Close' : 'Fechar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">
                        {language === 'en' ? 'No data for this day' : 'Nenhum dado para este dia'}
                      </p>
                      <button
                        onClick={() => {
                          setShowDayPerformance(false);
                          setShowSelectionModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                      >
                        {language === 'en' ? 'Add Data' : 'Adicionar Dados'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Selection Modal */}
      {showSelectionModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowSelectionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-100">
                {language === 'en' ? 'What would you like to add?' : 'O que você gostaria de adicionar?'}
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

            <div className="space-y-3">
              <button
                onClick={() => handleSelectionChoice('comment')}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">
                    {language === 'en' ? 'Add Comments' : 'Adicionar Comentários'}
                  </div>
                  <div className="text-sm text-blue-200">
                    {language === 'en' ? 'Daily analysis and operational errors' : 'Análise diária e erros operacionais'}
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleSelectionChoice('analysis')}
                className="w-full p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors flex items-center"
              >
                <BarChart2 className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">
                    {language === 'en' ? 'Import Analysis' : 'Importar Análise'}
                  </div>
                  <div className="text-sm text-green-200">
                    {language === 'en' ? 'Link saved backtest analysis' : 'Vincular análise de backtest salva'}
                  </div>
                </div>
              </button>
              
              {getEntryForDate(selectedDate) && (
                <button
                  onClick={() => handleSelectionChoice('comment')}
                  className="w-full p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors flex items-center"
                >
                  <Edit2 className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">
                      {language === 'en' ? 'Edit Entry' : 'Editar Entrada'}
                    </div>
                    <div className="text-sm text-yellow-200">
                      {language === 'en' ? 'Modify existing data' : 'Modificar dados existentes'}
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
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
                  : (language === 'en' ? 'Import Analysis' : 'Importar Análise')}
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