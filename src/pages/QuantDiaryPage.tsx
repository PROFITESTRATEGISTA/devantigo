import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, ChevronLeft, ChevronRight, 
  TrendingUp, DollarSign, Hash, Percent, BarChart2, 
  Target, Award, Zap
} from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';
import { Navbar } from '../components/Navbar';
import { CalendarGrid } from '../components/diary/CalendarGrid';
import { MonthlyStats } from '../components/diary/MonthlyStats';
import { DayOptionsModal } from '../components/diary/DayOptionsModal';
import { DayDetailsModal } from '../components/diary/DayDetailsModal';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  entryTime: string;
  exitTime: string;
  strategy: string;
  notes?: string;
}

interface DayData {
  date: string;
  pnl: number;
  trades: Trade[];
  comments: string;
  checklist: {
    planejamento: boolean;
    analise: boolean;
    risco: boolean;
    emocional: boolean;
    revisao: boolean;
  };
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  marketConditions: string;
  lessons: string;
}

export function QuantDiaryPage() {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDayOptionsModal, setShowDayOptionsModal] = useState(false);
  const [showDayDetailsModal, setShowDayDetailsModal] = useState(false);
  const [diaryData, setDiaryData] = useState<Record<string, DayData>>({});

  useEffect(() => {
    loadDiaryData();
  }, []);

  const loadDiaryData = () => {
    const savedData = localStorage.getItem('quantDiary');
    if (savedData) {
      setDiaryData(JSON.parse(savedData));
    }
  };

  const saveDiaryData = (data: Record<string, DayData>) => {
    localStorage.setItem('quantDiary', JSON.stringify(data));
    setDiaryData(data);
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateString = currentDay.toISOString().split('T')[0];
      const dayData = diaryData[dateString];
      
      days.push({
        date: dateString,
        pnl: dayData?.pnl || 0,
        trades: dayData?.trades?.length || 0,
        hasData: !!dayData
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Calculate monthly statistics
  const calculateMonthlyStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthlyEntries = Object.entries(diaryData).filter(([date]) => {
      const entryDate = new Date(date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
    
    const totalPnL = monthlyEntries.reduce((sum, [, data]) => sum + data.pnl, 0);
    const totalTrades = monthlyEntries.reduce((sum, [, data]) => sum + data.trades.length, 0);
    const tradingDays = monthlyEntries.filter(([, data]) => data.trades.length > 0).length;
    
    const winningTrades = monthlyEntries.reduce((sum, [, data]) => 
      sum + data.trades.filter(trade => trade.pnl > 0).length, 0
    );
    
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    const dailyPnLs = monthlyEntries.map(([, data]) => data.pnl);
    const bestDay = dailyPnLs.length > 0 ? Math.max(...dailyPnLs) : 0;
    const worstDay = dailyPnLs.length > 0 ? Math.min(...dailyPnLs) : 0;
    const avgDailyPnL = tradingDays > 0 ? totalPnL / tradingDays : 0;
    
    const positiveDays = dailyPnLs.filter(pnl => pnl > 0).length;
    const consistency = tradingDays > 0 ? (positiveDays / tradingDays) * 100 : 0;
    
    return {
      totalPnL,
      totalTrades,
      winRate,
      tradingDays,
      bestDay,
      worstDay,
      avgDailyPnL,
      consistency
    };
  };

  // Calculate general metrics (all time)
  const calculateGeneralMetrics = () => {
    const allEntries = Object.values(diaryData);
    
    const totalPnL = allEntries.reduce((sum, data) => sum + data.pnl, 0);
    const totalTrades = allEntries.reduce((sum, data) => sum + data.trades.length, 0);
    const tradingDays = allEntries.filter(data => data.trades.length > 0).length;
    
    const allTrades = allEntries.flatMap(data => data.trades);
    const winningTrades = allTrades.filter(trade => trade.pnl > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    // Best day of week analysis
    const dayOfWeekPnL: Record<string, number[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };
    
    Object.entries(diaryData).forEach(([date, data]) => {
      if (data.trades.length > 0) {
        const dayOfWeek = new Date(date).getDay();
        dayOfWeekPnL[dayOfWeek].push(data.pnl);
      }
    });
    
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    let bestDayOfWeek = 'Segunda';
    let bestDayAvg = 0;
    
    Object.entries(dayOfWeekPnL).forEach(([day, pnls]) => {
      if (pnls.length > 0) {
        const avg = pnls.reduce((sum, pnl) => sum + pnl, 0) / pnls.length;
        if (avg > bestDayAvg) {
          bestDayAvg = avg;
          bestDayOfWeek = dayNames[parseInt(day)];
        }
      }
    });
    
    // Best strategy analysis
    const strategyPnL: Record<string, number[]> = {};
    
    allTrades.forEach(trade => {
      if (!strategyPnL[trade.strategy]) {
        strategyPnL[trade.strategy] = [];
      }
      strategyPnL[trade.strategy].push(trade.pnl);
    });
    
    let bestStrategy = 'Scalping';
    let bestStrategyAvg = 0;
    
    Object.entries(strategyPnL).forEach(([strategy, pnls]) => {
      if (pnls.length > 0) {
        const avg = pnls.reduce((sum, pnl) => sum + pnl, 0) / pnls.length;
        if (avg > bestStrategyAvg) {
          bestStrategyAvg = avg;
          bestStrategy = strategy;
        }
      }
    });
    
    // Current streak
    const sortedDates = Object.keys(diaryData)
      .filter(date => diaryData[date].trades.length > 0)
      .sort()
      .reverse();
    
    let currentStreak = 0;
    let streakType: 'positive' | 'negative' | 'none' = 'none';
    
    for (const date of sortedDates) {
      const dayPnL = diaryData[date].pnl;
      
      if (currentStreak === 0) {
        currentStreak = 1;
        streakType = dayPnL > 0 ? 'positive' : 'negative';
      } else {
        const isPositive = dayPnL > 0;
        if ((streakType === 'positive' && isPositive) || (streakType === 'negative' && !isPositive)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    return {
      totalPnL,
      totalTrades,
      winRate,
      tradingDays,
      bestDayOfWeek,
      bestDayAvg,
      bestStrategy,
      bestStrategyAvg,
      currentStreak,
      streakType
    };
  };

  // Generate chart data for last 7 days
  const generateLast7DaysData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayData = diaryData[dateString];
      
      days.push({
        date: dateString,
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        pnl: dayData?.pnl || 0
      });
    }
    
    return days;
  };

  // Generate chart data for last 6 months
  const generateLast6MonthsData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const monthlyEntries = Object.entries(diaryData).filter(([dateStr]) => {
        const entryDate = new Date(dateStr);
        return entryDate.getFullYear() === year && entryDate.getMonth() === month;
      });
      
      const monthlyPnL = monthlyEntries.reduce((sum, [, data]) => sum + data.pnl, 0);
      
      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        pnl: monthlyPnL
      });
    }
    
    return months;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setShowDayOptionsModal(true);
  };

  const handleViewDay = () => {
    setShowDayOptionsModal(false);
    setShowDayDetailsModal(true);
  };

  const handleAddAnalysis = () => {
    setShowDayOptionsModal(false);
    navigate('/backtest-analysis');
  };

  const handleAddComments = () => {
    setShowDayOptionsModal(false);
    // Open day details modal in edit mode
    setShowDayDetailsModal(true);
  };

  const handleSaveDayData = (data: DayData) => {
    const updatedDiaryData = {
      ...diaryData,
      [data.date]: data
    };
    saveDiaryData(updatedDiaryData);
  };

  const calendarDays = generateCalendarDays();
  const monthlyStats = calculateMonthlyStats();
  const generalMetrics = calculateGeneralMetrics();
  const last7DaysData = generateLast7DaysData();
  const last6MonthsData = generateLast6MonthsData();

  const selectedDayData: DayData = selectedDate ? (diaryData[selectedDate] || {
    date: selectedDate,
    pnl: 0,
    trades: [],
    comments: '',
    checklist: {
      planejamento: false,
      analise: false,
      risco: false,
      emocional: false,
      revisao: false
    },
    mood: 'neutral',
    marketConditions: '',
    lessons: ''
  }) : {
    date: '',
    pnl: 0,
    trades: [],
    comments: '',
    checklist: {
      planejamento: false,
      analise: false,
      risco: false,
      emocional: false,
      revisao: false
    },
    mood: 'neutral',
    marketConditions: '',
    lessons: ''
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              title="Voltar ao dashboard"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'en' ? 'Quant Diary' : 'Diário Quant'}
              </h1>
              <p className="text-gray-400">
                {language === 'en' 
                  ? 'Track your performance and trading insights'
                  : 'Acompanhe sua performance e insights de trading'}
              </p>
            </div>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* General Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">P&L Total</span>
              <DollarSign className={`w-5 h-5 ${generalMetrics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className={`text-3xl font-bold ${generalMetrics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {generalMetrics.totalPnL >= 0 ? '+' : ''}R$ {generalMetrics.totalPnL.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Todos os tempos</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total de Trades</span>
              <Hash className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-500">{generalMetrics.totalTrades}</p>
            <p className="text-xs text-gray-400 mt-1">Todas as operações</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Taxa de Acerto</span>
              <Percent className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-500">{generalMetrics.winRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-400 mt-1">Média geral</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Dias Operados</span>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-500">{generalMetrics.tradingDays}</p>
            <p className="text-xs text-gray-400 mt-1">Total de dias</p>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Last 7 Days Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart2 className="w-5 h-5 text-blue-500 mr-2" />
              Últimos 7 Dias
            </h3>
            
            <div className="h-48 flex items-end justify-between space-x-2">
              {last7DaysData.map((day, index) => {
                const maxPnL = Math.max(...last7DaysData.map(d => Math.abs(d.pnl)));
                const height = maxPnL > 0 ? Math.abs(day.pnl) / maxPnL * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-md ${
                          day.pnl > 0 ? 'bg-green-500' : day.pnl < 0 ? 'bg-red-500' : 'bg-gray-600'
                        }`}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs text-gray-400">{day.day}</p>
                      <p className={`text-xs font-medium ${
                        day.pnl > 0 ? 'text-green-400' : day.pnl < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {day.pnl >= 0 ? '+' : ''}R$ {day.pnl.toFixed(0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Last 6 Months Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
              Últimos 6 Meses
            </h3>
            
            <div className="h-48 flex items-end justify-between space-x-2">
              {last6MonthsData.map((month, index) => {
                const maxPnL = Math.max(...last6MonthsData.map(m => Math.abs(m.pnl)));
                const height = maxPnL > 0 ? Math.abs(month.pnl) / maxPnL * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-md ${
                          month.pnl > 0 ? 'bg-green-500' : month.pnl < 0 ? 'bg-red-500' : 'bg-gray-600'
                        }`}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs text-gray-400">{month.month}</p>
                      <p className={`text-xs font-medium ${
                        month.pnl > 0 ? 'text-green-400' : month.pnl < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {month.pnl >= 0 ? '+' : ''}R$ {month.pnl.toFixed(0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pattern Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium flex items-center">
                <Target className="w-4 h-4 text-green-400 mr-2" />
                Melhor Dia da Semana
              </h4>
            </div>
            <p className="text-2xl font-bold text-green-400">{generalMetrics.bestDayOfWeek}</p>
            <p className="text-sm text-gray-400 mt-1">
              Média: +R$ {generalMetrics.bestDayAvg.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium flex items-center">
                <Award className="w-4 h-4 text-blue-400 mr-2" />
                Melhor Estratégia
              </h4>
            </div>
            <p className="text-2xl font-bold text-blue-400">{generalMetrics.bestStrategy}</p>
            <p className="text-sm text-gray-400 mt-1">
              Média: +R$ {generalMetrics.bestStrategyAvg.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium flex items-center">
                <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                Sequência Atual
              </h4>
            </div>
            <p className={`text-2xl font-bold ${
              generalMetrics.streakType === 'positive' ? 'text-green-400' : 
              generalMetrics.streakType === 'negative' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {generalMetrics.currentStreak} dias
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {generalMetrics.streakType === 'positive' ? 'Positiva' : 
               generalMetrics.streakType === 'negative' ? 'Negativa' : 'Neutra'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <CalendarGrid
              currentDate={currentDate}
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
            />
          </div>
          
          {/* Monthly Stats */}
          <div>
            <MonthlyStats
              currentDate={currentDate}
              monthlyData={monthlyStats}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <DayOptionsModal
        isOpen={showDayOptionsModal}
        onClose={() => setShowDayOptionsModal(false)}
        selectedDate={selectedDate || ''}
        onAddAnalysis={handleAddAnalysis}
        onAddComments={handleAddComments}
        onViewDay={handleViewDay}
      />

      <DayDetailsModal
        isOpen={showDayDetailsModal}
        onClose={() => setShowDayDetailsModal(false)}
        selectedDate={selectedDate || ''}
        dayData={selectedDayData}
        onSave={handleSaveDayData}
      />
    </div>
  );
}