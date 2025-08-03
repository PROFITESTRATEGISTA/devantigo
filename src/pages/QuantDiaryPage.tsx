import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, BarChart2, TrendingUp, DollarSign, Hash, Percent, Clock, Target,
  Plus, Edit, Save, X, MessageSquare, AlertTriangle
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

interface DayData {
  pnl: number;
  trades: number;
  comment?: string;
  strategies?: string[];
}

interface CalendarData {
  [month: string]: {
    [day: number]: DayData;
  };
}

export function QuantDiaryPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('calendar');
  const [showAllTime, setShowAllTime] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('agosto');
  const [currentYear, setCurrentYear] = useState(2025);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingDay, setEditingDay] = useState<DayData>({ pnl: 0, trades: 0, comment: '' });
  const [calendarData, setCalendarData] = useState<CalendarData>({
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
    }
  });

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

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const dayData = calendarData[currentMonth]?.[day] || { pnl: 0, trades: 0, comment: '' };
    setEditingDay({ ...dayData });
    setShowDayModal(true);
  };

  const handleSaveDay = () => {
    if (selectedDay === null) return;

    setCalendarData(prev => ({
      ...prev,
      [currentMonth]: {
        ...prev[currentMonth],
        [selectedDay]: { ...editingDay }
      }
    }));

    setShowDayModal(false);
    setSelectedDay(null);
  };

  const handleDeleteDay = () => {
    if (selectedDay === null) return;

    setCalendarData(prev => {
      const newData = { ...prev };
      if (newData[currentMonth]) {
        delete newData[currentMonth][selectedDay];
      }
      return newData;
    });

    setShowDayModal(false);
    setSelectedDay(null);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfWeek = getFirstDayOfMonth(currentMonth, currentYear);
    
    // Criar array com células vazias para os dias antes do primeiro dia do mês
    const calendarCells = [];
    
    // Adicionar células vazias para os dias da semana anterior
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarCells.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }
    
    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = calendarData[currentMonth]?.[day] || { pnl: 0, trades: 0 };
      const hasData = dayData.trades > 0;
      const isPositive = dayData.pnl > 0;
      
      calendarCells.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`aspect-square p-2 rounded-lg border text-center transition-all hover:scale-105 ${
            hasData
              ? isPositive
                ? 'bg-green-900 border-green-700 text-green-300 hover:bg-green-800'
                : 'bg-red-900 border-red-700 text-red-300 hover:bg-red-800'
              : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
          }`}
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
    }

    return (
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
          {calendarCells}
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
          <div className="flex items-center">
            <MessageSquare className="w-3 h-3 text-blue-400 mr-2" />
            <span className="text-sm text-gray-400">Com Comentários</span>
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
          {showAllTime ? 'Performance Todos os Tempos' : 'Performance Mensal'}
        </h3>
        
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
                <Calendar className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">
                {selectedDay} de {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
              </h2>
              <p className="mt-2 text-gray-400">
                Adicione ou edite os dados do dia
              </p>
            </div>

            <div className="space-y-4">
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
                  Comentários e Observações
                </label>
                <textarea
                  value={editingDay.comment || ''}
                  onChange={(e) => setEditingDay(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Descreva como foi o dia, estratégias utilizadas, condições de mercado, lições aprendidas..."
                />
              </div>

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