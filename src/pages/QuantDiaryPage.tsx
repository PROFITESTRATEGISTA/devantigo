import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, BarChart2, TrendingUp, 
  ChevronLeft, ChevronRight, Plus, Edit, 
  DollarSign, Hash, Percent, Activity,
  Award, AlertTriangle, Clock, Target
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguageStore } from '../stores/languageStore';

export function QuantDiaryPage() {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const [viewMode, setViewMode] = useState<'calendar' | 'statistics' | 'chart'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Mock data for demonstration
  const monthlyStats = {
    pnlMes: 0,
    totalTrades: 0,
    taxaAcerto: 0,
    fatorLucro: 0,
    sharpeRatio: 0,
    drawdownMaximo: 0,
    melhorDia: 0,
    piorDia: 0,
    pnlMedioDia: 0,
    diasLucrativos: 0,
    diasPerda: 0,
    lucroBruto: 0
  };

  const accumulatedStats = {
    pnlTotal: 0,
    totalTrades: 0,
    taxaAcerto: 0,
    diasOperados: 0,
    profitFactor: 0,
    sharpeRatio: 0,
    drawdownMax: 0,
    melhorDia: 0
  };

  const monthlyBreakdown = [
    { month: 'janeiro', trades: 0, dias: 0, pnl: 0 },
    { month: 'fevereiro', trades: 0, dias: 0, pnl: 0 },
    { month: 'março', trades: 0, dias: 0, pnl: 0 },
    { month: 'abril', trades: 0, dias: 0, pnl: 0 },
    { month: 'maio', trades: 0, dias: 0, pnl: 0 },
    { month: 'junho', trades: 0, dias: 0, pnl: 0 },
    { month: 'julho', trades: 0, dias: 0, pnl: 0 },
    { month: 'agosto', trades: 0, dias: 0, pnl: 0 },
    { month: 'setembro', trades: 0, dias: 0, pnl: 0 },
    { month: 'outubro', trades: 0, dias: 0, pnl: 0 },
    { month: 'novembro', trades: 0, dias: 0, pnl: 0 },
    { month: 'dezembro', trades: 0, dias: 0, pnl: 0 }
  ];

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Add day headers
    const dayHeaders = dayNames.map(day => (
      <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
        {day}
      </div>
    ));

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2"></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentMonth.getMonth() &&
                     new Date().getFullYear() === currentMonth.getFullYear();
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`p-2 h-16 rounded-lg border-2 transition-all ${
            selectedDay === day
              ? 'border-blue-500 bg-blue-500 bg-opacity-20'
              : isToday
              ? 'border-green-500 bg-green-500 bg-opacity-10'
              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
          }`}
        >
          <div className="text-sm font-medium">{day}</div>
          <div className="text-xs text-gray-400 mt-1">
            Clique para adicionar dados
          </div>
        </button>
      );
    }

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-semibold capitalize">
            {formatMonth(currentMonth)}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {dayHeaders}
          {days}
        </div>
      </div>
    );
  };

  const renderStatistics = () => (
    <div className="space-y-6">
      {/* Performance Mensal */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
            Performance Mensal
          </h3>
          <span className="text-sm text-gray-400">agosto 2025</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">P&L do Mês</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">+R$ {monthlyStats.pnlMes.toFixed(2)}</p>
            <p className="text-xs text-gray-500">0 por dia</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total de Trades</span>
              <Hash className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">{monthlyStats.totalTrades}</p>
            <p className="text-xs text-gray-500">0 por dia</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Taxa de Acerto</span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
            <p className="text-2xl font-bold text-red-400">{monthlyStats.taxaAcerto.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">0 dias operados</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Fator de Lucro</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-400">{monthlyStats.fatorLucro.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Prejuízo</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Sharpe Ratio</span>
            <p className="text-xl font-bold text-red-400">{monthlyStats.sharpeRatio.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Drawdown Máximo</span>
            <p className="text-xl font-bold text-green-400">R$ {monthlyStats.drawdownMaximo.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Melhor Dia</span>
            <p className="text-xl font-bold text-green-400">R$ {monthlyStats.melhorDia.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Pior Dia</span>
            <p className="text-xl font-bold text-red-400">R$ {monthlyStats.piorDia.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">P&L Médio/Dia</span>
            <p className="text-xl font-bold text-red-400">R$ {monthlyStats.pnlMedioDia.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Dias Lucrativos</span>
            <p className="text-xl font-bold text-blue-400">{monthlyStats.diasLucrativos}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Dias de Perda</span>
            <p className="text-xl font-bold text-red-400">{monthlyStats.diasPerda}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Lucro Bruto</span>
            <p className="text-xl font-bold text-green-400">R$ {monthlyStats.lucroBruto.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Performance Acumulada */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <BarChart2 className="w-5 h-5 text-purple-400 mr-2" />
          Performance Acumulada (Todos os Tempos)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">P&L Total</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">+R$ {accumulatedStats.pnlTotal.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total de Trades</span>
              <Hash className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">{accumulatedStats.totalTrades}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Taxa de Acerto</span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
            <p className="text-2xl font-bold text-red-400">{accumulatedStats.taxaAcerto.toFixed(1)}%</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Dias Operados</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">{accumulatedStats.diasOperados}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Profit Factor</span>
            <p className="text-xl font-bold text-red-400">{accumulatedStats.profitFactor.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Sharpe Ratio</span>
            <p className="text-xl font-bold text-red-400">{accumulatedStats.sharpeRatio.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Drawdown Máx.</span>
            <p className="text-xl font-bold text-green-400">R$ {accumulatedStats.drawdownMax.toFixed(2)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <span className="text-sm text-gray-400">Melhor Dia</span>
            <p className="text-xl font-bold text-green-400">R$ {accumulatedStats.melhorDia.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Breakdown Mensal */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Calendar className="w-5 h-5 text-blue-400 mr-2" />
          Breakdown Mensal (2025)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {monthlyBreakdown.map((month) => (
            <div key={month.month} className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium mb-2 capitalize">{month.month}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Trades</span>
                  <span className="text-sm">{month.trades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Dias</span>
                  <span className="text-sm">{month.dias}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">P&L</span>
                  <span className="text-sm">R$ {month.pnl.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}