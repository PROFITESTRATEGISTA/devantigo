import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, BarChart2, TrendingUp, DollarSign, Hash, Percent, Clock, Target,
  Plus, Edit, Save, X, MessageSquare, AlertTriangle, FileText, PlusCircle, Eye, Edit3, TrendingDown, Check, Edit2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

interface DayData {
  pnl: number;
  trades: number;
  comment?: string;
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
  const [currentMonth, setCurrentMonth] = useState('agosto');
  const [currentYear, setCurrentYear] = useState(2025);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingDay, setEditingDay] = useState<DayData>({ pnl: 0, trades: 0, comment: '' });
  const [actionType, setActionType] = useState<'analysis' | 'comment' | null>(null);
  const [chartType, setChartType] = useState<'daily' | 'monthly'>('daily');
  const [userPatrimony, setUserPatrimony] = useState<number>(10000); // Patrimônio inicial padrão
  const [isEditingPatrimony, setIsEditingPatrimony] = useState(false);
  const [patrimonyInput, setPatrimonyInput] = useState('10000');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(true);
  
  // Dados por ano - agora organizados por ano
  const [calendarData, setCalendarData] = useState<{[year: number]: CalendarData}>({
    2024: {
      dezembro: {
        5: { pnl: 320.50, trades: 6, comment: 'Fim de ano positivo' },
        12: { pnl: 450.75, trades: 8, comment: 'Boa performance' },
        18: { pnl: -120.50, trades: 3, comment: 'Mercado instável' },
        23: { pnl: 280.25, trades: 5, comment: 'Recuperação' }
      },
      novembro: {
        8: { pnl: 560.75, trades: 9, comment: 'Excelente dia' },
        15: { pnl: -180.50, trades: 4, comment: 'Volatilidade alta' },
        22: { pnl: 720.25, trades: 11, comment: 'Estratégia funcionou' }
      }
    },
    2025: {
      agosto: {
        5: { pnl: 450.75, trades: 8, comment: 'Ótimo dia! Estratégia de scalping funcionou muito bem.' },
        12: { pnl: -120.50, trades: 3, comment: 'Mercado lateral, muitos falsos sinais.' },
        18: { pnl: 890.25, trades: 12, comment: 'Excelente performance com trend following.' },
        23: { pnl: -45.00, trades: 2, comment: 'Parei cedo devido à volatilidade.' }
      },
      julho: {
        3: { pnl: 320.50, trades: 6, comment: 'Bom início de mês' },
        10: { pnl: 675.25, trades: 9, comment: 'Estratégia otimizada funcionou' },
        15: { pnl: -200.75, trades: 4, comment: 'Mercado instável' },
        22: { pnl: 540.00, trades: 7, comment: 'Recuperação consistente' },
        28: { pnl: 890.75, trades: 11, comment: 'Melhor dia do mês!' }
      },
      junho: {
        5: { pnl: 380.50, trades: 7, comment: 'Bom início de junho' },
        12: { pnl: 520.75, trades: 9, comment: 'Estratégia consistente' },
        19: { pnl: -150.25, trades: 3, comment: 'Dia difícil' },
        26: { pnl: 690.25, trades: 10, comment: 'Fechamento forte' }
      },
      maio: {
        8: { pnl: 420.75, trades: 8, comment: 'Maio começou bem' },
        15: { pnl: 780.50, trades: 12, comment: 'Excelente performance' },
        22: { pnl: -90.25, trades: 2, comment: 'Mercado lateral' },
        29: { pnl: 650.00, trades: 9, comment: 'Fechamento positivo' }
      }
    }
  });

  // Mock data para demonstração
  // Função para calcular dados mensais baseado nos dados do calendário
  const calculateMonthlyBreakdown = (year: number) => {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    return months.map(month => {
      const monthData = calendarData[year]?.[month] || {};
      const days = Object.values(monthData);
      
      const totalPnl = days.reduce((sum, day) => sum + day.pnl, 0);
      const totalTrades = days.reduce((sum, day) => sum + day.trades, 0);
      const diasOperados = days.filter(day => day.trades > 0).length;
      
      // Calcular lucro bruto e prejuízo bruto
      const lucroBruto = days.filter(day => day.pnl > 0).reduce((sum, day) => sum + day.pnl, 0);
      const prejuizoBruto = Math.abs(days.filter(day => day.pnl < 0).reduce((sum, day) => sum + day.pnl, 0));
      
      return {
        month,
        trades: totalTrades,
        dias: diasOperados,
        pnl: totalPnl,
        lucroBruto,
        prejuizoBruto
      };
    });
  };
  
  // Calcular dados mensais para o ano atual
  const monthlyBreakdown = calculateMonthlyBreakdown(currentYear);

  // Estatísticas gerais
  // Calcular estatísticas gerais baseado nos dados reais
  const calculateAllTimeStats = () => {
    let totalPnL = 0;
    let totalTrades = 0;
    let totalDaysTraded = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let totalWinningDays = 0;
    let totalLosingDays = 0;
    let totalWinningDaysAmount = 0;
    let totalLosingDaysAmount = 0;
    let maxDailyGain = 0;
    let maxDailyLoss = 0;
    let maxDailyGainDate = '';
    let maxDailyLossDate = '';
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    
    // Drawdown calculation variables
    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    let maxDrawdownAmount = 0;
    let drawdownStartDate = '';
    let drawdownEndDate = '';
    let currentDrawdownStart = '';
    
    // Collect all days with data for chronological processing
    const allDaysWithData: Array<{date: Date, pnl: number}> = [];
    let lastDayPnL = null;
    
    Object.keys(calendarData).forEach(year => {
      Object.keys(calendarData[parseInt(year)]).forEach(month => {
        Object.keys(calendarData[parseInt(year)][month]).forEach(day => {
          const dayData = calendarData[parseInt(year)][month][parseInt(day)];
          if (dayData.trades > 0) {
            const dayDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            allDaysWithData.push({ date: dayDate, pnl: dayData.pnl });
            
            totalPnL += dayData.pnl;
            totalTrades += dayData.trades;
            totalDaysTraded++;
            
            if (dayData.pnl > 0) {
              grossProfit += dayData.pnl;
              totalWinningDays++;
              totalWinningDaysAmount += dayData.pnl;
              
              // Check for max daily gain
              if (dayData.pnl > maxDailyGain) {
                maxDailyGain = dayData.pnl;
                maxDailyGainDate = dayDate.toLocaleDateString('pt-BR');
              }
              
              // Update streaks
              if (lastDayPnL !== null && lastDayPnL > 0) {
                currentWinStreak++;
              } else {
                currentWinStreak = 1;
              }
              currentLossStreak = 0;
            } else if (dayData.pnl < 0) {
              grossLoss += Math.abs(dayData.pnl);
              totalLosingDays++;
              totalLosingDaysAmount += Math.abs(dayData.pnl);
              
              // Check for max daily loss
              if (Math.abs(dayData.pnl) > Math.abs(maxDailyLoss)) {
                maxDailyLoss = dayData.pnl;
                maxDailyLossDate = dayDate.toLocaleDateString('pt-BR');
              }
    // Calculate drawdown with user's initial capital
              // Update streaks
              if (lastDayPnL !== null && lastDayPnL < 0) {
                currentLossStreak++;
              } else {
                currentLossStreak = 1;
              }
              currentWinStreak = 0;
            }
            
            // Update max streaks
            maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
            maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
            lastDayPnL = dayData.pnl;
          }
        });
      });
    });
    
    // Sort days chronologically for drawdown calculation
    allDaysWithData.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate drawdown chronologically
    allDaysWithData.forEach(dayData => {
      runningPnL += dayData.pnl;
      
      // Update peak if we reached a new high
      if (runningPnL > peak) {
        peak = runningPnL;
        // Reset drawdown tracking when we reach a new peak
        currentDrawdownStart = '';
      }
      
      // Calculate current drawdown
      const currentDrawdown = peak - runningPnL;
      
      // Track drawdown start
      if (currentDrawdown > 0 && !currentDrawdownStart) {
        currentDrawdownStart = dayData.date.toLocaleDateString('pt-BR');
      }
      
      // Update maximum drawdown if current is larger
      if (currentDrawdown > maxDrawdownAmount) {
        maxDrawdownAmount = currentDrawdown;
        drawdownStartDate = currentDrawdownStart;
        drawdownEndDate = dayData.date.toLocaleDateString('pt-BR');
        
        // Calculate percentage drawdown
        maxDrawdown = peak > 0 ? (currentDrawdown / peak) * 100 : 0;
      }
    });
    
    // Calculate averages
    const avgDailyGain = totalWinningDays > 0 ? totalWinningDaysAmount / totalWinningDays : 0;
    const avgDailyLoss = totalLosingDays > 0 ? totalLosingDaysAmount / totalLosingDays : 0;
    const payoffRatio = avgDailyLoss > 0 ? avgDailyGain / avgDailyLoss : 0;
    
    return {
      totalPnL,
      totalTrades,
      totalDaysTraded,
      grossProfit,
      grossLoss,
      profitFactor: grossLoss > 0 ? grossProfit / grossLoss : 0,
      avgDailyGain,
      avgDailyLoss,
      maxDailyGain,
      maxDailyLoss,
      maxDailyGainDate,
      maxDailyLossDate,
      payoffRatio,
      maxWinStreak,
      maxLossStreak,
      totalWinningDays,
      totalLosingDays,
      maxDrawdown,
      maxDrawdownAmount,
      drawdownStartDate,
      drawdownEndDate
    };
  };

  // Calculate drawdown based on user's initial capital (patrimony)
  const calculateDrawdownMetrics = () => {
    // Collect all days with P&L data and sort chronologically
    const allDays: Array<{ date: string; pnl: number; runningTotal: number }> = [];
    
    Object.keys(calendarData).forEach(year => {
      Object.keys(calendarData[parseInt(year)]).forEach(month => {
        Object.keys(calendarData[parseInt(year)][month]).forEach(day => {
          const dayData = calendarData[parseInt(year)][month][parseInt(day)];
          if (dayData.trades > 0) {
            allDays.push({
              date: `${year}-${month}-${day}`,
              pnl: dayData.pnl,
              runningTotal: 0 // Will be calculated below
            });
          }
        });
      });
    });

    if (allDays.length === 0) {
      return { 
        maxDrawdownPercent: 0, 
        maxDrawdownAmount: 0, 
        drawdownPeriod: null,
        recoveryFactor: 0,
        sharpeRatio: 0,
        calmarRatio: 0
      };
    }

    // Sort chronologically
    allDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningPnL = userPatrimony; // Start with user's initial capital
    let peak = userPatrimony;
    let maxDrawdown = 0;
    let maxDrawdownAmount = 0;
    let drawdownStart: string | null = null;
    let drawdownEnd: string | null = null;
    const dailyReturns: number[] = [];
    let previousValue = userPatrimony;

    // Calculate running totals for each day
    allDays.forEach((day, index) => {
      runningPnL += day.pnl;
      day.runningTotal = runningPnL;
      
      // Calculate daily return as percentage of previous day's capital
      if (index > 0) {
        const previousCapital = allDays[index - 1].runningTotal;
        if (previousCapital > 0) {
          const dailyReturn = day.pnl / previousCapital;
          dailyReturns.push(dailyReturn);
        }
      } else {
        // First day return
        if (userPatrimony > 0) {
          const dailyReturn = day.pnl / userPatrimony;
          dailyReturns.push(dailyReturn);
        }
      }
    });

    // Calculate drawdown: (peak - current) / patrimony
    allDays.forEach((day) => {
      const currentCapital = day.runningTotal;
      
      // Update peak if current capital is higher
      if (currentCapital > peak) {
        peak = currentCapital;
      }
      
      // Calculate current drawdown using the formula: (peak - current) / patrimony
      const currentDrawdownAmount = peak - currentCapital;
      const currentDrawdownPercent = userPatrimony > 0 ? (currentDrawdownAmount / userPatrimony) * 100 : 0;
      
      // Track maximum drawdown 
      if (currentDrawdownAmount > maxDrawdownAmount) {
        maxDrawdownAmount = currentDrawdownAmount;
        maxDrawdown = currentDrawdownPercent;
        drawdownStart = day.date;
        drawdownEnd = day.date;
      } else if (currentDrawdownAmount === maxDrawdownAmount && drawdownStart) {
        drawdownEnd = day.date;
      }
    });

    // Calculate Sharpe Ratio (Calmar Index)
    const avgDailyReturn = dailyReturns.length > 0 ? 
      dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length : 0;
    
    const dailyReturnStd = dailyReturns.length > 1 ? 
      Math.sqrt(dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgDailyReturn, 2), 0) / (dailyReturns.length - 1)) : 0;
    
    // Annualized Sharpe Ratio (assuming 252 trading days per year)
    const annualizedReturn = avgDailyReturn * 252;
    const annualizedVolatility = dailyReturnStd * Math.sqrt(252);
    const sharpeRatio = annualizedVolatility > 0 ? annualizedReturn / annualizedVolatility : 0;
    
    // Calmar Ratio (Annual Return / Max Drawdown)
    const calmarRatio = maxDrawdown > 0 ? (annualizedReturn * 100) / maxDrawdown : 0;
    
    // Recovery Factor (Net Profit / Max Drawdown Amount)
    const totalPnL = runningPnL - userPatrimony;
    const recoveryFactor = maxDrawdownAmount > 0 ? totalPnL / maxDrawdownAmount : 0;
    
    return {
      maxDrawdownPercent: maxDrawdown,
      maxDrawdownAmount,
      recoveryFactor,
      sharpeRatio,
      calmarRatio,
      drawdownPeriod: drawdownStart && drawdownEnd ? {
        start: drawdownStart,
        end: drawdownEnd
      } : null
    };
  };

  const allTimeStats = calculateAllTimeStats();
  const drawdownMetrics = calculateDrawdownMetrics();

  // Função para obter o número de dias no mês
  const getDaysInMonth = (month: string, year: number) => {
    const monthIndex = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ].indexOf(month);
    
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  // Função para obter o primeiro dia da semana do mês (0 = domingo)
  const getFirstDayOfMonth = (month: string, year: number) => {
    const monthIndex = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ].indexOf(month);
    
    return new Date(year, monthIndex, 1).getDay();
  };

  // Função para calcular P&L semanal
  // Função para calcular P&L semanal baseado nos dias da semana atual
  const getWeeklyPnL = (weekDays: number[]) => {
    let weeklyPnL = 0;
    let weeklyTrades = 0;
    
    weekDays.forEach(day => {
      if (day > 0) { // Apenas dias válidos
        const dayData = calendarData[currentYear]?.[currentMonth]?.[day];
        if (dayData) {
          weeklyPnL += dayData.pnl;
          weeklyTrades += dayData.trades;
        }
      }
    });
    
    return { pnl: weeklyPnL, trades: weeklyTrades };
  };

  // Função para calcular métricas semanais automaticamente
  const calculateWeeklyMetrics = () => {
    const weeks = [];
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);
    
    let currentWeekDays = [];
    
    // Adicionar dias vazios no início
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeekDays.push(0); // 0 = dia vazio
    }
    
    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeekDays.push(day);
      
      // Se chegou ao sábado (7 dias) ou é o último dia do mês
      if (currentWeekDays.length === 7 || day === daysInMonth) {
        // Completar a semana com zeros se necessário
        while (currentWeekDays.length < 7) {
          currentWeekDays.push(0);
        }
        
        const weekMetrics = getWeeklyPnL(currentWeekDays);
        weeks.push({
          days: currentWeekDays,
          pnl: weekMetrics.pnl,
          trades: weekMetrics.trades
        });
        
        currentWeekDays = [];
      }
    }
    
    return weeks;
  };

  // Função para calcular métricas semanais
  const calculateWeeklyStats = () => {
    const weeklyData = calculateWeeklyMetrics();
    const weeklyPnLs = weeklyData.map(week => week.pnl).filter(pnl => pnl !== 0);
    
    const ganhosSemanais = weeklyPnLs.filter(pnl => pnl > 0);
    const perdasSemanais = weeklyPnLs.filter(pnl => pnl < 0);
    
    return {
      ganhoMedioSemanal: ganhosSemanais.length > 0 ? ganhosSemanais.reduce((a, b) => a + b, 0) / ganhosSemanais.length : 0,
      perdaMediaSemanal: perdasSemanais.length > 0 ? perdasSemanais.reduce((a, b) => a + b, 0) / perdasSemanais.length : 0,
      ganhoMaximoSemanal: ganhosSemanais.length > 0 ? Math.max(...ganhosSemanais) : 0,
      perdaMaximaSemanal: perdasSemanais.length > 0 ? Math.min(...perdasSemanais) : 0
    };
  };

  // Função para calcular estatísticas específicas do ano
  const calculateYearlyStats = (year: number) => {
    const yearData = calendarData[year] || {};
    let totalPnl = 0;
    let diasOperados = 0;
    let totalLucroBruto = 0;
    let totalPrejuizoBruto = 0;
    
    Object.values(yearData).forEach(monthData => {
      const days = Object.values(monthData);
      totalPnl += days.reduce((sum, day) => sum + day.pnl, 0);
      diasOperados += days.filter(day => day.trades > 0).length;
      totalLucroBruto += days.filter(day => day.pnl > 0).reduce((sum, day) => sum + day.pnl, 0);
      totalPrejuizoBruto += Math.abs(days.filter(day => day.pnl < 0).reduce((sum, day) => sum + day.pnl, 0));
    });
    
    const fatorLucro = totalPrejuizoBruto > 0 ? totalLucroBruto / totalPrejuizoBruto : 0;
    const mediaPnlDia = diasOperados > 0 ? totalPnl / diasOperados : 0;
    
    return {
      totalPnl,
      diasOperados,
      totalLucroBruto,
      totalPrejuizoBruto,
      fatorLucro,
      mediaPnlDia
    };
  };

  const weeklyStats = calculateWeeklyStats();

  const handleDayClick = (day: number) => {
    if (calendarViewMode === 'monthly') return;
    
    setSelectedDay(day);
    const existingData = calendarData[currentYear]?.[currentMonth]?.[day] || { pnl: 0, trades: 0, comment: '' };
    setEditingDay(existingData);
    setShowActionModal(true);
  };

  const handleActionSelect = (action: 'analysis' | 'comment') => {
    setActionType(action);
    setShowActionModal(false);
    setShowDayModal(true);
  };

  const handleSaveDay = () => {
    if (!selectedDay) return;

    setCalendarData(prev => ({
      ...prev,
      [currentYear]: {
        ...prev[currentYear],
        [currentMonth]: {
          ...prev[currentYear]?.[currentMonth],
          [selectedDay]: { ...editingDay }
        }
      }
    }));

    setShowDayModal(false);
    setSelectedDay(null);
    setActionType(null);
  };

  const handleDeleteDay = () => {
    if (!selectedDay) return;

    setCalendarData(prev => {
      const newData = { ...prev };
      if (newData[currentYear]?.[currentMonth]?.[selectedDay]) {
        delete newData[currentYear][currentMonth][selectedDay];
      }
      return newData;
    });

    setShowDayModal(false);
    setSelectedDay(null);
    setActionType(null);
  };

  const renderCalendar = () => {
    // Se estiver em modo mensal, mostrar grid de meses
    if (calendarViewMode === 'monthly') {
      return renderMonthlyView();
    }
    
    // Calcular semanas com métricas automáticas
    const weeklyData = calculateWeeklyMetrics();

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Calendar className="w-5 h-5 text-blue-400 mr-2" />
            Calendário de Trading - {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} {currentYear}
          </h3>
          <div className="flex items-center space-x-4">
            {/* Switch para visão diária/mensal */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Diária</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={calendarViewMode === 'monthly'} 
                  onChange={() => setCalendarViewMode(calendarViewMode === 'daily' ? 'monthly' : 'daily')} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm text-gray-400">Mensal</span>
            </div>
            
            <button
              onClick={() => {
                const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
                const currentIndex = months.indexOf(currentMonth);
                if (currentIndex > 0) {
                  setCurrentMonth(months[currentIndex - 1]);
                }
              }}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              ←
            </button>
            <span className="text-sm text-gray-300 min-w-[120px] text-center">
              {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} {currentYear}
            </span>
            <button
              onClick={() => {
                const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
                const currentIndex = months.indexOf(currentMonth);
                if (currentIndex < months.length - 1) {
                  setCurrentMonth(months[currentIndex + 1]);
                }
              }}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              →
            </button>
          </div>
        </div>

        {/* Cabeçalho do calendário com soma semanal */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
              {day}
            </div>
          ))}
          <div className="text-center text-sm font-medium text-blue-400 p-2">
            Semana
          </div>
        </div>

        {/* Grid do calendário com totais semanais */}
        <div className="space-y-2">
          {weeklyData.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="grid grid-cols-8 gap-2 mb-2">
              {week.days.map((day, dayIndex) => {
                if (day === 0) {
                  // Célula vazia
                  return <div key={`empty-${weekIndex}-${dayIndex}`} className="aspect-square"></div>;
                }
                
                const dayData = calendarData[currentYear]?.[currentMonth]?.[day] || { pnl: 0, trades: 0 };
                const hasData = dayData.trades > 0;
                const isPositive = dayData.pnl > 0;
                const isClickable = calendarViewMode === 'daily';
                
                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => handleDayClick(day)}
                    disabled={!isClickable}
                    className={`aspect-square p-2 rounded-lg border text-center transition-all ${
                      isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
                    } ${
                      hasData
                        ? isPositive
                          ? 'bg-green-900 border-green-700 text-green-300 hover:bg-green-800'
                          : 'bg-red-900 border-red-700 text-red-300 hover:bg-red-800'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                    } ${!isClickable ? 'opacity-75' : ''}`}
                  >
                    <div className="text-sm font-medium">{day}</div>
                    {hasData && (
                      <div className="text-xs mt-1">
                        R$ {dayData.pnl.toFixed(0)}
                      </div>
                    )}
                    {dayData.comment && (
                      <div className="text-xs mt-1">
                        <MessageSquare className="w-3 h-3 mx-auto" />
                      </div>
                    )}
                  </button>
                );
              })}
              
              {/* Coluna do total semanal */}
              <div className="aspect-square flex items-center justify-center bg-gray-900 rounded-lg border border-gray-600">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Semana</div>
                  <div className={`text-sm font-bold ${
                    week.pnl > 0 ? 'text-green-400' : week.pnl < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {week.pnl > 0 ? '+' : ''}R$ {week.pnl.toFixed(0)}
                  </div>
                  {week.trades > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {week.trades} trades
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-400">
              {calendarViewMode === 'daily' ? 'Visão Diária (clique para editar)' : 'Visão Mensal (somente leitura)'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-400">Dias Lucrativos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-400">Dias de Perda</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-400">Sem Operações</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="w-3 h-3 text-blue-400 mr-2" />
            <span className="text-sm text-gray-400">Com Comentários</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Calendar className="w-5 h-5 text-blue-400 mr-2" />
            Visão Anual - {currentYear}
          </h3>
          <div className="flex items-center space-x-4">
            {/* Switch para visão diária/mensal */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Diária</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={calendarViewMode === 'monthly'} 
                  onChange={() => setCalendarViewMode(calendarViewMode === 'daily' ? 'monthly' : 'daily')} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm text-gray-400">Mensal</span>
            </div>
            
            <button
              onClick={() => setCurrentYear(prev => prev - 1)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              ←
            </button>
            <span className="text-sm text-gray-300 min-w-[80px] text-center">
              {currentYear}
            </span>
            <button
              onClick={() => setCurrentYear(prev => prev + 1)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              →
            </button>
          </div>
        </div>

        {/* Grid de meses 4x3 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {months.map((month, index) => {
            const monthData = monthlyBreakdown.find(m => m.month === month);
            const monthPnL = monthData?.pnl || 0;
            const monthTrades = monthData?.trades || 0;
            const monthDays = monthData?.dias || 0;
            const hasData = monthTrades > 0;
            const isPositive = monthPnL > 0;
            const isCurrentMonth = month === currentMonth;
            
            return (
              <button
                key={month}
                onClick={() => {
                  setCurrentMonth(month);
                  setCalendarViewMode('daily');
                }}
                className={`p-4 rounded-lg border text-center transition-all hover:scale-105 cursor-pointer ${
                  isCurrentMonth
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : hasData
                      ? isPositive
                        ? 'bg-green-900 border-green-700 text-green-300 hover:bg-green-800'
                        : 'bg-red-900 border-red-700 text-red-300 hover:bg-red-800'
                      : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <div className="text-lg font-bold capitalize mb-2">{month}</div>
                {hasData ? (
                  <>
                    <div className="text-sm mb-1">
                      {monthPnL >= 0 ? '+' : ''}R$ {Math.abs(monthPnL).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {monthTrades} trades • {monthDays} dias
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500">Sem dados</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Resumo do Ano */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-4 text-center">Resumo do Ano {currentYear}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">P&L Total</p>
              <p className={`text-xl font-bold ${
                calculateYearlyStats(currentYear).totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {calculateYearlyStats(currentYear).totalPnl >= 0 ? '+' : ''}R$ {calculateYearlyStats(currentYear).totalPnl.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Dias Operados</p>
              <p className="text-xl font-bold text-blue-400">{calculateYearlyStats(currentYear).diasOperados}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Fator de Lucro</p>
              <p className="text-xl font-bold text-purple-400">{calculateYearlyStats(currentYear).fatorLucro.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Média P&L/Dia</p>
              <p className="text-xl font-bold text-yellow-400">R$ {calculateYearlyStats(currentYear).mediaPnlDia.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-400">Visão Mensal (clique para ver detalhes)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-400">Meses Lucrativos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-400">Meses de Perda</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStatistics = () => {
    // Calcular estatísticas operacionais baseadas nos dados reais
    const grossProfit = allTimeStats.grossProfit;
    const grossLoss = allTimeStats.grossLoss;
    
    const operationalStats = {
      sharpeRatio: {
        value: 0.00,
        label: 'Não calculado'
      },
      profitFactor: {
        value: grossProfit > 0 && Math.abs(grossLoss) > 0 ? grossProfit / Math.abs(grossLoss) : 0,
        label: grossProfit > 0 && Math.abs(grossLoss) > 0 ? 
          (grossProfit / Math.abs(grossLoss) >= 2 ? 'Excelente' : 
           grossProfit / Math.abs(grossLoss) >= 1.5 ? 'Muito bom' : 
           grossProfit / Math.abs(grossLoss) >= 1 ? 'Bom' : 'Ruim') : 'Sem dados'
      },
      recoveryFactor: {
        value: 0.00,
        label: 'Não calculado'
      },
      maxDrawdown: {
        value: 12.5,
        label: 'R$ 2.275'
      }
    };

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <BarChart2 className="w-5 h-5 text-blue-400 mr-2" />
            Métricas de Performance
          </h3>
        </div>

        {/* Métricas de Performance */}
        {/* Resultado Financeiro */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">
            💰 Resultado Financeiro
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* P&L Total */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">P&L Total</span>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className={`text-2xl font-bold ${
              allTimeStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {allTimeStats.totalPnL >= 0 ? '+' : ''}R$ {allTimeStats.totalPnL.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Todos os tempos</p>
          </div>
          
          {/* Lucro Bruto */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Lucro Bruto</span>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              +R$ {allTimeStats.grossProfit.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Todos os ganhos</p>
          </div>
          
          {/* Prejuízo Bruto */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Prejuízo Bruto</span>
              <DollarSign className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">
              -R$ {allTimeStats.grossLoss.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Todas as perdas</p>
          </div>
          
          {/* Melhor Mês */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Melhor Mês</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">R$ 2.225.75</p>
            <p className="text-xs text-gray-500">julho 2025</p>
          </div>
          </div>
        </div>
        
        {/* Análise Operacional */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">
            ⚙️ Análise Operacional
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Sharpe Ratio */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Sharpe Ratio</span>
              <BarChart2 className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {drawdownMetrics.sharpeRatio.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {drawdownMetrics.sharpeRatio > 1 ? 'Excelente' : 
               drawdownMetrics.sharpeRatio > 0.5 ? 'Bom' : 
               drawdownMetrics.sharpeRatio > 0 ? 'Regular' : 'Baixo'}
            </p>
          </div>
          
          {/* Fator de Lucro */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Fator de Lucro</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{operationalStats.profitFactor.value.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{operationalStats.profitFactor.label}</p>
          </div>
          
          {/* Fator de Recuperação */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Fator Recuperação</span>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {drawdownMetrics.recoveryFactor.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {drawdownMetrics.recoveryFactor > 3 ? 'Excelente' : 
               drawdownMetrics.recoveryFactor > 1 ? 'Bom' : 
               drawdownMetrics.recoveryFactor > 0 ? 'Regular' : 'Baixo'}
            </p>
          </div>
          
          {/* Índice Calmar */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Índice Calmar</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              {drawdownMetrics.calmarRatio.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {drawdownMetrics.calmarRatio > 1 ? 'Excelente' : 
               drawdownMetrics.calmarRatio > 0.5 ? 'Bom' : 
               drawdownMetrics.calmarRatio > 0 ? 'Regular' : 'Baixo'}
            </p>
          </div>
          
          {/* Drawdown Máximo */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Drawdown Máximo</span>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-orange-400">
              {drawdownMetrics.maxDrawdownPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400">
              R$ {drawdownMetrics.maxDrawdownAmount.toFixed(2)}
            </p>
            {drawdownMetrics.drawdownPeriod && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(drawdownMetrics.drawdownPeriod.start).toLocaleDateString()} - {new Date(drawdownMetrics.drawdownPeriod.end).toLocaleDateString()}
              </p>
            )}
          </div>
          </div>
        </div>
        
        {/* Análise Diária */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">
            📊 Análise Diária
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Dias Operados */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Dias Operados</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">{allTimeStats.totalDaysTraded}</p>
            <p className="text-xs text-gray-500">Todos os tempos</p>
          </div>
          
          {/* Ganho Médio Diário */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Ganho Médio Diário</span>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              R$ {allTimeStats.avgDailyGain.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {allTimeStats.totalWinningDays} dias lucrativos
            </p>
          </div>
          
          {/* Perda Média Diária */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Perda Média Diária</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">
              R$ -{allTimeStats.avgDailyLoss.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {allTimeStats.totalLosingDays} dias negativos
            </p>
          </div>
          
          {/* Maior Ganho Diário */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Maior Ganho Diário</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              R$ {allTimeStats.maxDailyGain.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">{allTimeStats.maxDailyGainDate}</p>
          </div>
          
          {/* Maior Perda Diária */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Maior Perda Diária</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">
              R$ {allTimeStats.maxDailyLoss.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">{allTimeStats.maxDailyLossDate}</p>
          </div>
          
          {/* Payoff Diário */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Payoff Diário</span>
              <Percent className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">
              {allTimeStats.payoffRatio.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">Ganho/Perda</p>
          </div>
          
          {/* Perdas Consecutivas */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Perdas Consecutivas</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">
              {allTimeStats.maxLossStreak} dias
            </p>
            <p className="text-xs text-gray-400">Máximo</p>
          </div>
          
          {/* Ganhos Consecutivos */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Ganhos Consecutivos</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              {allTimeStats.maxWinStreak} dias
            </p>
            <p className="text-xs text-gray-400">Máximo</p>
          </div>
          </div>
        </div>
        
        {/* Análise Semanal */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">
            📅 Análise Semanal
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Ganho Médio Semanal */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Ganho Médio Semanal</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              R$ {weeklyStats.ganhoMedioSemanal.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Por semana lucrativa</p>
          </div>
          
          {/* Perda Média Semanal */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Perda Média Semanal</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">
              R$ {weeklyStats.perdaMediaSemanal.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Por semana negativa</p>
          </div>
          
          {/* Ganho Máximo Semanal */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Ganho Máximo Semanal</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              R$ {weeklyStats.ganhoMaximoSemanal.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Melhor semana</p>
          </div>
          
          {/* Perda Máxima Semanal */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Perda Máxima Semanal</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">
              R$ {weeklyStats.perdaMaximaSemanal.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Pior semana</p>
          </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
        Gráficos de Performance
      </h3>
      
      {/* Tabs para alternar entre gráficos */}
      <div className="flex items-center mb-6 bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setChartType('daily')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            chartType === 'daily'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Gráfico Diário
        </button>
        <button
          onClick={() => setChartType('monthly')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            chartType === 'monthly'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Gráfico Mensal
        </button>
      </div>
      
      {chartType === 'daily' ? renderDailyChart() : renderMonthlyChart()}

      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-400">P&L Positivo</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-400">P&L Negativo</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-400">P&L Acumulado</span>
        </div>
      </div>
    </div>
  );

  // Função para renderizar gráfico diário
  const renderDailyChart = () => {
    const monthData = calendarData[currentYear]?.[currentMonth] || {};
    const days = Object.keys(monthData).map(Number).sort((a, b) => a - b);
    
    if (days.length === 0) {
      return (
        <div className="h-80 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum dado disponível para {currentMonth} {currentYear}</p>
          </div>
        </div>
      );
    }
    
    let accumulatedPnL = 0;
    const maxPnL = Math.max(...days.map(day => monthData[day].pnl));
    const minPnL = Math.min(...days.map(day => monthData[day].pnl));
    const range = Math.max(Math.abs(maxPnL), Math.abs(minPnL));
    
    return (
      <div className="h-80 bg-gray-900 rounded-lg p-4">
        <div className="h-full relative">
          {/* Linha zero */}
          <div className="absolute w-full border-t border-gray-600 opacity-50" style={{ top: '50%' }}></div>
          
          {/* Barras do gráfico */}
          <div className="flex items-end justify-center h-full space-x-1">
            {days.map((day, index) => {
              const dayData = monthData[day];
              const pnl = dayData.pnl;
              accumulatedPnL += pnl;
              
              const barHeight = range > 0 ? Math.abs(pnl / range) * 40 : 0;
              const isPositive = pnl >= 0;
              
              return (
                <div key={day} className="flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    <div>Dia {day}</div>
                    <div>P&L: R$ {pnl.toFixed(2)}</div>
                    <div>Trades: {dayData.trades}</div>
                    <div>Acumulado: R$ {accumulatedPnL.toFixed(2)}</div>
                  </div>
                  
                  {/* Barra */}
                  <div className="flex flex-col items-center h-full justify-center">
                    {isPositive ? (
                      <div 
                        className="bg-green-500 w-4 rounded-t"
                        style={{ height: `${barHeight}%`, minHeight: pnl > 0 ? '2px' : '0' }}
                      ></div>
                    ) : (
                      <div 
                        className="bg-red-500 w-4 rounded-b"
                        style={{ height: `${barHeight}%`, minHeight: pnl < 0 ? '2px' : '0' }}
                      ></div>
                    )}
                  </div>
                  
                  {/* Label do dia */}
                  <span className="text-xs text-gray-400 mt-1">{day}</span>
                </div>
              );
            })}
          </div>
          
          {/* Linha do P&L acumulado */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={days.map((day, index) => {
                const x = (index / (days.length - 1)) * 100;
                const daysPnL = days.slice(0, index + 1).reduce((sum, d) => sum + monthData[d].pnl, 0);
                const y = 50 - (daysPnL / (range * 2)) * 40;
                return `${x}%,${y}%`;
              }).join(' ')}
            />
          </svg>
        </div>
      </div>
    );
  };
  
  // Função para renderizar gráfico mensal
  const renderMonthlyChart = () => {
    const yearData = calendarData[currentYear] || {};
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const monthsWithData = months.filter(month => {
      const monthData = yearData[month];
      return monthData && Object.keys(monthData).length > 0;
    });
    
    if (monthsWithData.length === 0) {
      return (
        <div className="h-80 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum dado disponível para {currentYear}</p>
          </div>
        </div>
      );
    }
    
    const monthlyPnLs = monthsWithData.map(month => {
      const monthData = yearData[month] || {};
      return Object.values(monthData).reduce((sum: number, day: any) => sum + day.pnl, 0);
    });
    
    const maxPnL = Math.max(...monthlyPnLs);
    const minPnL = Math.min(...monthlyPnLs);
    const range = Math.max(Math.abs(maxPnL), Math.abs(minPnL));
    
    let accumulatedPnL = 0;
    
    return (
      <div className="h-80 bg-gray-900 rounded-lg p-4">
        <div className="h-full relative">
          {/* Linha zero */}
          <div className="absolute w-full border-t border-gray-600 opacity-50" style={{ top: '50%' }}></div>
          
          {/* Barras do gráfico */}
          <div className="flex items-end justify-center h-full space-x-2">
            {monthsWithData.map((month, index) => {
              const monthData = yearData[month] || {};
              const monthPnL = Object.values(monthData).reduce((sum: number, day: any) => sum + day.pnl, 0);
              const monthTrades = Object.values(monthData).reduce((sum: number, day: any) => sum + day.trades, 0);
              const monthDays = Object.values(monthData).filter((day: any) => day.trades > 0).length;
              
              accumulatedPnL += monthPnL;
              
              const barHeight = range > 0 ? Math.abs(monthPnL / range) * 40 : 0;
              const isPositive = monthPnL >= 0;
              
              return (
                <div key={month} className="flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    <div className="capitalize">{month} {currentYear}</div>
                    <div>P&L: R$ {monthPnL.toFixed(2)}</div>
                    <div>Trades: {monthTrades}</div>
                    <div>Dias: {monthDays}</div>
                    <div>Acumulado: R$ {accumulatedPnL.toFixed(2)}</div>
                  </div>
                  
                  {/* Barra */}
                  <div className="flex flex-col items-center h-full justify-center">
                    {isPositive ? (
                      <div 
                        className="bg-green-500 w-6 rounded-t"
                        style={{ height: `${barHeight}%`, minHeight: monthPnL > 0 ? '2px' : '0' }}
                      ></div>
                    ) : (
                      <div 
                        className="bg-red-500 w-6 rounded-b"
                        style={{ height: `${barHeight}%`, minHeight: monthPnL < 0 ? '2px' : '0' }}
                      ></div>
                    )}
                  </div>
                  
                  {/* Label do mês */}
                  <span className="text-xs text-gray-400 mt-1 capitalize">
                    {month.substring(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Linha do P&L acumulado */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={monthsWithData.map((month, index) => {
                const x = (index / (monthsWithData.length - 1)) * 100;
                const monthsPnL = monthsWithData.slice(0, index + 1).reduce((sum, m) => {
                  const mData = yearData[m] || {};
                  return sum + Object.values(mData).reduce((s: number, day: any) => s + day.pnl, 0);
                }, 0);
                const y = 50 - (monthsPnL / (range * 2)) * 40;
                return `${x}%,${Math.max(5, Math.min(95, y))}%`;
              }).join(' ')}
            />
          </svg>
        </div>
      </div>
    );
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
              title="Voltar ao Dashboard"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Diário Quant</h1>
              <p className="text-gray-400">Seu diário de trading e insights</p>
            </div>
          </div>
          
          {/* Patrimônio Input */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                Capital Inicial:
              </span>
              {isEditingPatrimony ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={patrimonyInput}
                    onChange={(e) => setPatrimonyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const newValue = parseFloat(patrimonyInput);
                        if (!isNaN(newValue) && newValue > 0) {
                          setUserPatrimony(newValue);
                          setIsEditingPatrimony(false);
                        }
                      } else if (e.key === 'Escape') {
                        setPatrimonyInput(userPatrimony.toString());
                        setIsEditingPatrimony(false);
                      }
                    }}
                    className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      const newValue = parseFloat(patrimonyInput);
                      if (!isNaN(newValue) && newValue > 0) {
                        setUserPatrimony(newValue);
                        setIsEditingPatrimony(false);
                      }
                    }}
                    className="p-1 text-green-400 hover:text-green-300"
                    title="Salvar"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setPatrimonyInput(userPatrimony.toString());
                      setIsEditingPatrimony(false);
                    }}
                    className="p-1 text-gray-400 hover:text-white"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPatrimonyInput(userPatrimony.toString());
                    setIsEditingPatrimony(true);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                >
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="font-medium">
                    R$ {userPatrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <Edit2 className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* View Mode Switches */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendário</span>
            </button>
            <button
              onClick={() => setViewMode('statistics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'statistics'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Estatísticas</span>
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'chart'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Gráfico</span>
            </button>
          </div>
        </div>

        {/* Content based on view mode */}
        <div className="space-y-6">
          {viewMode === 'calendar' && renderCalendar()}
          {viewMode === 'statistics' && renderStatistics()}
          {viewMode === 'chart' && renderChart()}
        </div>
      </div>

      {/* Modal de seleção de ação */}
      {showActionModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-sm w-full p-6 relative">
            <button 
              onClick={() => setShowActionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <Calendar className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-100">
                Dia {selectedDay} de {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
              </h2>
              <p className="mt-2 text-gray-400">
                O que você gostaria de fazer?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleActionSelect('analysis')}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center justify-center space-x-3"
              >
                <FileText className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-medium">Adicionar Análise Salva</div>
                  <div className="text-sm opacity-75">Vincular uma análise de backtest ao dia</div>
                </div>
              </button>
              
              <button
                onClick={() => handleActionSelect('comment')}
                className="w-full p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center justify-center space-x-3"
              >
                <MessageSquare className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-medium">Adicionar Comentários</div>
                  <div className="text-sm opacity-75">Registrar observações sobre o dia</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar dia */}
      {showDayModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowDayModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                {actionType === 'analysis' ? (
                  <FileText className="w-12 h-12 text-blue-500" />
                ) : (
                  <MessageSquare className="w-12 h-12 text-green-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-100">
                {actionType === 'analysis' ? 'Adicionar Análise' : 'Adicionar Comentários'}
              </h2>
              <p className="mt-2 text-gray-400">
                {selectedDay} de {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
              </p>
            </div>

            <div className="space-y-4">
              {actionType === 'analysis' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      P&L do Dia (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingDay.pnl}
                      onChange={(e) => setEditingDay(prev => ({ ...prev, pnl: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Número de Trades
                    </label>
                    <input
                      type="number"
                      value={editingDay.trades}
                      onChange={(e) => setEditingDay(prev => ({ ...prev, trades: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Análise Vinculada
                    </label>
                    <select
                      value={editingDay.analysisId || ''}
                      onChange={(e) => setEditingDay(prev => ({ ...prev, analysisId: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecionar análise...</option>
                      <option value="analysis-1">Estratégia Scalping WINFUT</option>
                      <option value="analysis-2">Grid Trading PETR4</option>
                      <option value="analysis-3">Trend Following VALE3</option>
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Comentários e Observações
                  </label>
                  <textarea
                    value={editingDay.comment || ''}
                    onChange={(e) => setEditingDay(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Descreva como foi o dia, estratégias utilizadas, condições de mercado, lições aprendidas, emoções durante o trading..."
                  />
                </div>
              )}

              <div className="flex justify-between space-x-3 pt-4">
                <button
                  onClick={handleDeleteDay}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white flex items-center"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Excluir
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDayModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveDay}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}