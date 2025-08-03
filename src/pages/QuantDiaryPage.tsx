import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, BarChart2, TrendingUp, DollarSign, Hash, Percent, Clock, Target,
  Plus, Edit, Save, X, MessageSquare, AlertTriangle, FileText, PlusCircle, Eye, Edit3, TrendingDown,
  BarChart3, Minus
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

interface DayData {
  pnl: number;
  trades: number;
  notes?: string;
  strategies?: string[];
  analysisId?: string;
}

interface CalendarData {
  [month: string]: {
    [day: number]: DayData;
  };
}

export function QuantDiaryPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('calendar');
  const [calendarViewMode, setCalendarViewMode] = useState<'daily' | 'monthly'>('daily');
  const [showAllTime, setShowAllTime] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode2, setViewMode2] = useState<'daily' | 'monthly'>('daily');
  const [chartView, setChartView] = useState<'daily' | 'monthly'>('daily');
  const [showDayModal, setShowDayModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingDay, setEditingDay] = useState<DayData>({ pnl: 0, trades: 0, notes: '' });
  const [actionType, setActionType] = useState<'analysis' | 'comment' | null>(null);
  const [chartType, setChartType] = useState<'daily' | 'monthly'>('daily');

  // Force re-render when language changes
  useEffect(() => {
    // This will force a re-render when the component mounts
  }, []);

  // Real calendar data - this would come from your database
  // For now, we'll use empty data structure and calculate everything from it
  const calendarData: Record<number, Record<number, Record<number, DayData>>> = {
    // Empty structure - data will be added by user through the interface
    // Structure: calendarData[year][month][day] = { pnl, trades, notes }
  };

  // Calculate all statistics from calendar data
  const calculateYearlyStats = (year: number) => {
    const yearData = calendarData[year] || {};
    let totalPnl = 0;
    let totalTrades = 0;
    let operatedDays = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let bestDay = { pnl: 0, date: '' };
    let worstDay = { pnl: 0, date: '' };

    Object.entries(yearData).forEach(([month, monthData]) => {
      if (monthData) {
        Object.entries(monthData).forEach(([day, dayData]) => {
          if (dayData && dayData.trades > 0) {
            totalPnl += dayData.pnl;
            totalTrades += dayData.trades;
            operatedDays++;
            
            if (dayData.pnl > 0) {
              grossProfit += dayData.pnl;
            } else {
              grossLoss += dayData.pnl;
            }
            
            if (dayData.pnl > bestDay.pnl) {
              bestDay = { pnl: dayData.pnl, date: `${day}/${parseInt(month) + 1}/${year}` };
            }
            
            if (dayData.pnl < worstDay.pnl) {
              worstDay = { pnl: dayData.pnl, date: `${day}/${parseInt(month) + 1}/${year}` };
            }
          }
        });
      }
    });

    return {
      totalPnl,
      totalTrades,
      operatedDays,
      grossProfit,
      grossLoss,
      bestDay,
      worstDay
    };
  };

  // Calculate monthly breakdown for the selected year
  const calculateMonthlyBreakdown = () => {
    const yearData = calendarData[selectedYear] || {};
    const monthlyData = [];
    
    for (let month = 0; month < 12; month++) {
      const monthData = yearData[month] || {};
      let monthPnl = 0;
      let monthTrades = 0;
      let operatedDays = 0;
      
      Object.values(monthData).forEach(dayData => {
        if (dayData && dayData.trades > 0) {
          monthPnl += dayData.pnl;
          monthTrades += dayData.trades;
          operatedDays++;
        }
      });
      
      monthlyData.push({
        month,
        pnl: monthPnl,
        trades: monthTrades,
        days: operatedDays
      });
    }
    
    return monthlyData;
  };

  // Calculate all-time statistics
  const calculateAllTimeStats = () => {
    let totalPnl = 0;
    let totalTrades = 0;
    let totalOperatedDays = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let bestMonth = { pnl: 0, month: '', year: 0 };
    let worstMonth = { pnl: 0, month: '', year: 0 };
    let bestDay = { pnl: 0, date: '' };
    let worstDay = { pnl: 0, date: '' };

    Object.entries(calendarData).forEach(([year, yearData]) => {
      Object.entries(yearData).forEach(([month, monthData]) => {
        let monthPnl = 0;
        let monthTrades = 0;
        
        if (monthData) {
          Object.entries(monthData).forEach(([day, dayData]) => {
            if (dayData && dayData.trades > 0) {
              totalPnl += dayData.pnl;
              totalTrades += dayData.trades;
              totalOperatedDays++;
              monthPnl += dayData.pnl;
              monthTrades += dayData.trades;
              
              if (dayData.pnl > 0) {
                grossProfit += dayData.pnl;
              } else {
                grossLoss += dayData.pnl;
              }
              
              if (dayData.pnl > bestDay.pnl) {
                bestDay = { pnl: dayData.pnl, date: `${day}/${parseInt(month) + 1}/${year}` };
              }
              
              if (dayData.pnl < worstDay.pnl) {
                worstDay = { pnl: dayData.pnl, date: `${day}/${parseInt(month) + 1}/${year}` };
              }
            }
          });
        }
        
        if (monthTrades > 0) {
          const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
          
          if (monthPnl > bestMonth.pnl) {
            bestMonth = { pnl: monthPnl, month: monthNames[parseInt(month)], year: parseInt(year) };
          }
          
          if (monthPnl < worstMonth.pnl) {
            worstMonth = { pnl: monthPnl, month: monthNames[parseInt(month)], year: parseInt(year) };
          }
        }
      });
    });

    return {
      totalPnl,
      totalTrades,
      totalOperatedDays,
      grossProfit,
      grossLoss,
      bestMonth,
      worstMonth,
      bestDay,
      worstDay
    };
  };

  // Get statistics
  const yearStats = calculateYearlyStats(selectedYear);
  const allTimeStats = calculateAllTimeStats();
  const monthlyBreakdown = calculateMonthlyBreakdown();
  const profitFactor = allTimeStats.grossLoss > 0 ? allTimeStats.grossProfit / Math.abs(allTimeStats.grossLoss) : 0;

  // Get current month data for daily view
  const currentMonthData = calendarData[selectedYear]?.[selectedMonth] || {};

  // Month names for display
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
