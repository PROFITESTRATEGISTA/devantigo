import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, BarChart2, TrendingUp, DollarSign, Hash, Percent, Clock, Target,
  Plus, Edit, Save, X, MessageSquare, AlertTriangle, FileText, PlusCircle, Eye, Edit3, TrendingDown
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
    const allYears = Object.keys(calendarData).map(Number);
    let totalPnl = 0;
    let totalDiasOperados = 0;
    let diasOperados = 0;
    let melhorMesPnl = -Infinity;
    let piorMesPnl = Infinity;
    let melhorMes = '';
    let piorMes = '';
    let totalLucroBruto = 0;
    let totalPrejuizoBruto = 0;
    
    allYears.forEach(year => {
      const yearData = calendarData[year];
      Object.entries(yearData).forEach(([month, monthData]) => {
        const days = Object.values(monthData);
        const monthPnl = days.reduce((sum, day) => sum + day.pnl, 0);
        const monthDias = days.filter(day => day.trades > 0).length;
        const monthLucroBruto = days.filter(day => day.pnl > 0).reduce((sum, day) => sum + day.pnl, 0);
        const monthPrejuizoBruto = Math.abs(days.filter(day => day.pnl < 0).reduce((sum, day) => sum + day.pnl, 0));
        
        totalPnl += monthPnl;
        totalLucroBruto += monthLucroBruto;
        totalPrejuizoBruto += monthPrejuizoBruto;
        diasOperados += monthDias;
        
        if (monthPnl > melhorMesPnl) {
          melhorMesPnl = monthPnl;
          melhorMes = `${month} ${year}`;
        }
        
        if (monthPnl < piorMesPnl && monthDias > 0) {
          piorMesPnl = monthPnl;
          piorMes = `${month} ${year}`;
        }
      });
    });
    
    // Calcular fator de lucro
    const fatorLucro = totalPrejuizoBruto > 0 ? totalLucroBruto / totalPrejuizoBruto : 0;
    
    return {
      totalPnl,
      totalLucroBruto,
      totalPrejuizoBruto,
      fatorLucro,
      diasOperados,
      melhorMes,
      melhorMesPnl,
      piorMes,
      piorMesPnl,
      mediaPnlDia: diasOperados > 0 ? totalPnl / diasOperados : 0
    };
  };
  
  const allTimeStats = calculateAllTimeStats();

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
          days: [...currentWeekDays],
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
    
    if (weeklyPnLs.length === 0) {
      return {
        ganhoMedioSemanal: 0,
        perdaMediaSemanal: 0,
        ganhoMaximoSemanal: 0,
        perdaMaximaSemanal: 0
      };
    }
    
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
    let totalTrades = 0;
    let diasPositivos = 0;
    let diasNegativos = 0;
    let melhorDia = 0;
    let piorDia = 0;
    let sequenciaAtual = 0;
    let maiorSequenciaPositiva = 0;
    let maiorSequenciaNegativa = 0;
    let sequenciaTemporaria = 0;
    let ultimoTipoSequencia = '';
    
    Object.values(yearData).forEach(monthData => {
      const days = Object.values(monthData);
      totalPnl += days.reduce((sum, day) => sum + day.pnl, 0);
      totalTrades += days.reduce((sum, day) => sum + day.trades, 0);
      diasOperados += days.filter(day => day.trades > 0).length;
      totalLucroBruto += days.filter(day => day.pnl > 0).reduce((sum, day) => sum + day.pnl, 0);
      totalPrejuizoBruto += Math.abs(days.filter(day => day.pnl < 0).reduce((sum, day) => sum + day.pnl, 0));
      
      // Calcular dias positivos e negativos
      diasPositivos += days.filter(day => day.pnl > 0 && day.trades > 0).length;
      diasNegativos += days.filter(day => day.pnl < 0 && day.trades > 0).length;
      
      // Encontrar melhor e pior dia
      days.forEach(day => {
        if (day.trades > 0) {
          if (day.pnl > melhorDia) melhorDia = day.pnl;
          if (day.pnl < piorDia) piorDia = day.pnl;
        }
      });
      
      // Calcular sequências (simplificado - seria melhor com datas ordenadas)
      days.forEach(day => {
        if (day.trades > 0) {
          const tipoAtual = day.pnl > 0 ? 'positivo' : 'negativo';
          
          if (tipoAtual === ultimoTipoSequencia) {
            sequenciaTemporaria++;
          } else {
            if (ultimoTipoSequencia === 'positivo') {
              maiorSequenciaPositiva = Math.max(maiorSequenciaPositiva, sequenciaTemporaria);
            } else if (ultimoTipoSequencia === 'negativo') {
              maiorSequenciaNegativa = Math.max(maiorSequenciaNegativa, sequenciaTemporaria);
            }
            sequenciaTemporaria = 1;
            ultimoTipoSequencia = tipoAtual;
          }
        }
      });
    });
    
    // Finalizar última sequência
    if (ultimoTipoSequencia === 'positivo') {
      maiorSequenciaPositiva = Math.max(maiorSequenciaPositiva, sequenciaTemporaria);
    } else if (ultimoTipoSequencia === 'negativo') {
      maiorSequenciaNegativa = Math.max(maiorSequenciaNegativa, sequenciaTemporaria);
    }
    
    const fatorLucro = totalPrejuizoBruto > 0 ? totalLucroBruto / totalPrejuizoBruto : 0;
    const mediaPnlDia = diasOperados > 0 ? totalPnl / diasOperados : 0;
    const taxaAcerto = diasOperados > 0 ? (diasPositivos / diasOperados) * 100 : 0;
    const ganhoMedioDiario = diasPositivos > 0 ? totalLucroBruto / diasPositivos : 0;
    const perdaMediaDiaria = diasNegativos > 0 ? totalPrejuizoBruto / diasNegativos : 0;
    const payoffDiario = perdaMediaDiaria > 0 ? ganhoMedioDiario / perdaMediaDiaria : 0;
    
    return {
      totalPnl,
      diasOperados,
      totalTrades,
      totalLucroBruto,
      totalPrejuizoBruto,
      fatorLucro,
      mediaPnlDia,
      diasPositivos,
      diasNegativos,
      taxaAcerto,
      melhorDia,
      piorDia,
      ganhoMedioDiario,
      perdaMediaDiaria,
      payoffDiario,
      maiorSequenciaPositiva,
      maiorSequenciaNegativa
    };
  };

  const weeklyStats = calculateWeeklyStats();
  const currentYearStats = calculateYearlyStats(currentYear);

  const handleDayClick = (day: number) => {
    // No modo mensal, não permite interação
    if (calendarViewMode === 'monthly') return;
    
    setSelectedDay(day);
    setShowActionModal(true);
  };

  const handleActionSelect = (action: 'analysis' | 'comment') => {
    setActionType(action);
    setShowActionModal(false);
    
    const dayData = calendarData[currentYear]?.[currentMonth]?.[selectedDay!] || { pnl: 0, trades: 0, comment: '' };
    setEditingDay({ ...dayData });
    setShowDayModal(true);
  };

  const handleSaveDay = () => {
    if (selectedDay === null) return;

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
    if (selectedDay === null) return;

    setCalendarData(prev => {
      const newData = { ...prev };
      if (newData[currentYear]?.[currentMonth]) {
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
                currentYearStats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {currentYearStats.totalPnl >= 0 ? '+' : ''}R$ {currentYearStats.totalPnl.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Dias Operados</p>
              <p className="text-xl font-bold text-blue-400">{currentYearStats.diasOperados}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Fator de Lucro</p>
              <p className="text-xl font-bold text-purple-400">{currentYearStats.fatorLucro.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Média P&L/Dia</p>
              <p className="text-xl font-bold text-yellow-400">R$ {currentYearStats.mediaPnlDia.toFixed(2)}</p>
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

  const renderStatistics = () => (
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
                allTimeStats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {allTimeStats.totalPnl >= 0 ? '+' : ''}R$ {allTimeStats.totalPnl.toFixed(2)}
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
                +R$ {allTimeStats.totalLucroBruto.toFixed(2)}
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
                -R$ {allTimeStats.totalPrejuizoBruto.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Todas as perdas</p>
            </div>
            
            {/* Melhor Mês */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Melhor Mês</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-400">+R$ {allTimeStats.melhorMesPnl.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{allTimeStats.melhorMes}</p>
            </div>
        </div>
      </div>
      
      {/* Análise Operacional */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">
          ⚙️ Análise Operacional
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Fator de Lucro */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Fator de Lucro</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{allTimeStats.fatorLucro.toFixed(2)}</p>
            <p className="text-xs text-gray-500">
              {allTimeStats.fatorLucro >= 2.0 ? 'Excelente' : 
               allTimeStats.fatorLucro >= 1.5 ? 'Muito bom' : 
               allTimeStats.fatorLucro >= 1.0 ? 'Bom' : 'Insuficiente'}
            </p>
          </div>
          
          {/* Taxa de Acerto */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Taxa de Acerto</span>
              <Percent className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">{allTimeStats.taxaAcerto.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">
              {allTimeStats.diasPositivos} ganhos / {allTimeStats.diasNegativos} perdas
            </p>
          </div>
          
          {/* Drawdown Estimado */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Maior Perda</span>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-orange-400">R$ {Math.abs(allTimeStats.piorDia).toFixed(2)}</p>
            <p className="text-xs text-gray-500">Pior dia</p>
          </div>
          
          {/* Payoff */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Payoff</span>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">{allTimeStats.payoffDiario.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Ganho/Perda</p>
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
            <p className="text-2xl font-bold text-purple-400">{allTimeStats.diasOperados}</p>
            <p className="text-xs text-gray-500">Todos os tempos</p>
          </div>
          
          {/* Ganho Médio Diário */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Ganho Médio Diário</span>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">R$ {allTimeStats.ganhoMedioDiario.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Por dia lucrativo</p>
          </div>
          
          {/* Perda Média Diária */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Perda Média Diária</span>
              <DollarSign className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">R$ -{allTimeStats.perdaMediaDiaria.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Por dia negativo</p>
          </div>
          
          {/* Maior Ganho Diário */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Maior Ganho Diário</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">R$ {allTimeStats.melhorDia.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Melhor dia</p>
          </div>
          
          {/* Maior Perda Diária */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Maior Perda Diária</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">R$ {allTimeStats.piorDia.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Pior dia</p>
          </div>
          
          {/* Payoff Diário */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Payoff Diário</span>
              <Percent className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">{allTimeStats.payoffDiario.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Ganho/Perda</p>
          </div>
          
          {/* Perdas Consecutivas */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Perdas Consecutivas</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">{allTimeStats.maiorSequenciaNegativa} dias</p>
            <p className="text-xs text-gray-500">Máximo</p>
          </div>
          
          {/* Ganhos Consecutivos */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Ganhos Consecutivos</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{allTimeStats.maiorSequenciaPositiva} dias</p>
            <p className="text-xs text-gray-500">Máximo</p>
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

  const renderChart = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
        Evolução do P&L Acumulado
      </h3>
      
      <div className="h-80 bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <BarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Gráfico será exibido quando houver dados</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-400">P&L Positivo</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-400">P&L Negativo</span>
        </div>
      </div>
    </div>
  );

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