import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguageStore } from '../stores/languageStore';
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

interface CalendarDay {
  date: string;
  pnl: number;
  trades: number;
  hasData: boolean;
}

interface MonthlyData {
  totalPnL: number;
  totalTrades: number;
  winRate: number;
  tradingDays: number;
  bestDay: number;
  worstDay: number;
  avgDailyPnL: number;
  consistency: number;
}

export function QuantDiaryPage() {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showDayDetailsModal, setShowDayDetailsModal] = useState(false);
  const [diaryData, setDiaryData] = useState<Record<string, DayData>>({});

  useEffect(() => {
    const savedData = localStorage.getItem('quantDiary');
    if (savedData) {
      setDiaryData(JSON.parse(savedData));
    }
  }, []);

  const getEmptyDayData = (date: string): DayData => ({
    date,
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
  });

  const getDayData = (date: string): DayData => {
    return diaryData[date] || getEmptyDayData(date);
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateString = currentDay.toISOString().split('T')[0];
      const dayData = diaryData[dateString];
      
      days.push({
        date: dateString,
        pnl: dayData?.pnl || 0,
        trades: dayData?.trades.length || 0,
        hasData: !!dayData && dayData.trades.length > 0
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const calculateMonthlyData = (): MonthlyData => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthlyEntries = Object.entries(diaryData).filter(([date]) => {
      const entryDate = new Date(date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
    
    const totalPnL = monthlyEntries.reduce((sum, [, data]) => sum + data.pnl, 0);
    const totalTrades = monthlyEntries.reduce((sum, [, data]) => sum + data.trades.length, 0);
    const tradingDays = monthlyEntries.filter(([, data]) => data.trades.length > 0).length;
    
    const winningTrades = monthlyEntries.reduce((count, [, data]) => {
      return count + data.trades.filter(trade => trade.pnl > 0).length;
    }, 0);
    
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    const dailyPnLs = monthlyEntries
      .filter(([, data]) => data.trades.length > 0)
      .map(([, data]) => data.pnl);
    
    const bestDay = dailyPnLs.length > 0 ? Math.max(...dailyPnLs) : 0;
    const worstDay = dailyPnLs.length > 0 ? Math.min(...dailyPnLs) : 0;
    const avgDailyPnL = tradingDays > 0 ? totalPnL / tradingDays : 0;
    
    const profitableDays = dailyPnLs.filter(pnl => pnl > 0).length;
    const consistency = tradingDays > 0 ? (profitableDays / tradingDays) * 100 : 0;
    
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

  const calendarDays = generateCalendarDays();
  const monthlyData = calculateMonthlyData();

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const handleAddAnalysis = () => {
    console.log('Add analysis for date:', selectedDate);
    setShowDayModal(false);
  };

  const handleAddComments = () => {
    console.log('Add comments for date:', selectedDate);
    setShowDayModal(false);
  };

  const handleViewDay = () => {
    console.log('handleViewDay called for date:', selectedDate);
    setShowDayModal(false);
    setShowDayDetailsModal(true);
  };

  const saveDayData = (dayData: DayData) => {
    const updatedDiaryData = {
      ...diaryData,
      [dayData.date]: dayData
    };
    
    setDiaryData(updatedDiaryData);
    localStorage.setItem('quantDiary', JSON.stringify(updatedDiaryData));
    setDiaryData(updatedDiaryData);
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'en' ? 'Quant Diary' : 'Diário Quant'}
            </h1>
            <p className="text-gray-400 mt-1">
              {language === 'en' 
                ? 'Track your trading performance and insights' 
                : 'Acompanhe sua performance e insights de trading'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {currentDate.toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

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
              monthlyData={monthlyData}
            />
          </div>
        </div>
      </div>

      {/* Day Options Modal */}
      <DayOptionsModal
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        selectedDate={selectedDate || ''}
        onAddAnalysis={handleAddAnalysis}
        onAddComments={handleAddComments}
        onViewDay={handleViewDay}
      />

      {/* Day Details Modal */}
      <DayDetailsModal
        isOpen={showDayDetailsModal}
        onClose={() => setShowDayDetailsModal(false)}
        selectedDate={selectedDate || ''}
        dayData={selectedDate ? getDayData(selectedDate) : getEmptyDayData('')}
        onSave={saveDayData}
      />
    </div>
  );
}

export default QuantDiaryPage;