import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, BarChart2, TrendingUp, DollarSign, Hash, Percent, Clock, Target
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export function QuantDiaryPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('calendar');
  const [showAllTime, setShowAllTime] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('agosto');
  const [currentYear, setCurrentYear] = useState(2025);

  // Mock data para demonstração
  const monthlyBreakdown = [
    { month: 'janeiro', trades: 45, dias: 22, pnl: 2450.75 },
    { month: 'fevereiro', trades: 38, dias: 20, pnl: 1890.50 },
    { month: 'março', trades: 52, dias: 23, pnl: 3120.25 },
    { month: 'abril', trades: 41, dias: 21, pnl: 2780.00 },
    { month: 'maio', trades: 47, dias: 22, pnl: 2950.75 },
    { month: 'junho', trades: 39, dias: 21, pnl: 2340.50 },
    { month: 'julho', trades: 44, dias: 22, pnl: 2680.25 },
    { month: 'agosto', trades: 0, dias: 0, pnl: 0.00 }
  ];

  // Dados do calendário (dias do mês com P&L)
  const calendarData = {
    agosto: {
      1: { pnl: 0, trades: 0 },
      2: { pnl: 0, trades: 0 },
      3: { pnl: 0, trades: 0 },
      // ... outros dias zerados para agosto
    }
  };

  // Estatísticas gerais
  const allTimeStats = {
    totalPnl: 18212.00,
    totalTrades: 306,
    diasOperados: 151,
    melhorMes: 'março',
    melhorMesPnl: 3120.25,
    piorMes: 'fevereiro',
    piorMesPnl: 1890.50,
    mediaTradesDia: 2.03,
    mediaPnlDia: 120.61
  };

  const renderCalendar = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Calendar className="w-5 h-5 text-blue-400 mr-2" />
          Calendário de Trading - {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} {currentYear}
        </h3>
        <div className="flex items-center space-x-4">
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

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          const dayData = calendarData[currentMonth]?.[day] || { pnl: 0, trades: 0 };
          const hasData = dayData.trades > 0;
          const isPositive = dayData.pnl > 0;
          
          return (
            <div
              key={day}
              className={`aspect-square p-2 rounded-lg border text-center ${
                hasData
                  ? isPositive
                    ? 'bg-green-900 border-green-700 text-green-300'
                    : 'bg-red-900 border-red-700 text-red-300'
                  : 'bg-gray-700 border-gray-600 text-gray-400'
              }`}
            >
              <div className="text-sm font-medium">{day}</div>
              {hasData && (
                <div className="text-xs mt-1">
                  R$ {dayData.pnl.toFixed(0)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6">
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
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <BarChart2 className="w-5 h-5 text-blue-400 mr-2" />
            {showAllTime ? 'Performance Todos os Tempos' : 'Performance Mensal'}
          </h3>
          
          {/* Switch para alternar entre mensal e todos os tempos */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-400">Mensal</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={showAllTime} 
                onChange={() => setShowAllTime(!showAllTime)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm text-gray-400">Todos os Tempos</span>
          </div>
        </div>

        {showAllTime ? (
          /* Estatísticas Todos os Tempos */
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">P&L Total</span>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-green-400">
                  +R$ {allTimeStats.totalPnl.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Desde o início</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Total Trades</span>
                  <Hash className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-blue-400">{allTimeStats.totalTrades}</p>
                <p className="text-xs text-gray-500">{allTimeStats.diasOperados} dias operados</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Média P&L/Dia</span>
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  R$ {allTimeStats.mediaPnlDia.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Por dia operado</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Média Trades/Dia</span>
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {allTimeStats.mediaTradesDia.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">Trades por dia</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium mb-3 text-green-400">Melhor Mês</h4>
                <p className="text-xl font-bold capitalize">{allTimeStats.melhorMes} 2025</p>
                <p className="text-lg text-green-400">+R$ {allTimeStats.melhorMesPnl.toFixed(2)}</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium mb-3 text-red-400">Pior Mês</h4>
                <p className="text-xl font-bold capitalize">{allTimeStats.piorMes} 2025</p>
                <p className="text-lg text-red-400">+R$ {allTimeStats.piorMesPnl.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Breakdown Mensal */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monthlyBreakdown.slice(0, 6).map((month) => (
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
                      <span className={`text-sm font-medium ${month.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {month.pnl >= 0 ? '+' : ''}R$ {month.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monthlyBreakdown.slice(6).map((month) => (
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
                      <span className={`text-sm font-medium ${month.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {month.pnl >= 0 ? '+' : ''}R$ {month.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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