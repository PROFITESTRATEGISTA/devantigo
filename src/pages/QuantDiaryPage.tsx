import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Plus, TrendingUp, TrendingDown, 
  DollarSign, Hash, Percent, Clock, BarChart2, 
  AlertTriangle, Award, Zap, Activity, RefreshCw,
  ChevronLeft, ChevronRight, Edit2, Save, X, Check,
  Target, PieChart, LineChart, Calculator, Info
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguageStore } from '../stores/languageStore';

interface DayData {
  date: string;
  pnl: number;
  trades: number;
  winRate: number;
  notes?: string;
}

export function QuantDiaryPage() {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayData, setDayData] = useState<Record<string, DayData>>({});
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    pnl: '',
    trades: '',
    winRate: '',
    notes: ''
  });
  const [patrimonio, setPatrimonio] = useState<number>(10000);
  const [showPatrimonioInput, setShowPatrimonioInput] = useState(false);
  const [editingPatrimonio, setEditingPatrimonio] = useState('10000');

  // Calcular métricas baseadas nos dados do calendário
  const calculateMetrics = () => {
    const days = Object.values(dayData);
    if (days.length === 0) {
      return {
        pnlTotal: 0,
        totalTrades: 0,
        diasOperados: 0,
        melhorDia: 0,
        piorDia: 0,
        taxaAcertoMedia: 0,
        drawdownMaximo: 0,
        drawdownMaximoReais: 0,
        sharpeRatio: 0,
        fatorRecuperacao: 0,
        indiceCalmar: 0,
        sequenciaAtual: 0,
        maiorSequenciaPositiva: 0,
        maiorSequenciaNegativa: 0
      };
    }

    // Calcular métricas básicas
    const pnlTotal = days.reduce((sum, day) => sum + day.pnl, 0);
    const totalTrades = days.reduce((sum, day) => sum + day.trades, 0);
    const diasOperados = days.filter(day => day.trades > 0).length;
    const melhorDia = Math.max(...days.map(day => day.pnl));
    const piorDia = Math.min(...days.map(day => day.pnl));
    const taxaAcertoMedia = diasOperados > 0 
      ? days.reduce((sum, day) => sum + day.winRate, 0) / diasOperados 
      : 0;

    // Calcular drawdown baseado no patrimônio inicial
    const sortedDays = Object.entries(dayData)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
    
    let runningCapital = patrimonio;
    let peakCapital = patrimonio;
    let maxDrawdownReais = 0;
    
    for (const [date, data] of sortedDays) {
      runningCapital += data.pnl;
      if (runningCapital > peakCapital) {
        peakCapital = runningCapital;
      }
      const currentDrawdownReais = peakCapital - runningCapital;
      if (currentDrawdownReais > maxDrawdownReais) {
        maxDrawdownReais = currentDrawdownReais;
      }
    }
    
    const drawdownMaximo = patrimonio > 0 ? (maxDrawdownReais / patrimonio) * 100 : 0;
    const drawdownMaximoReais = maxDrawdownReais;

    // Calcular Sharpe Ratio: (lucro total - taxa de juros) / drawdown
    const mesesAnalisados = sortedDays.length > 0 
      ? Math.max(1, Math.ceil(sortedDays.length / 30)) 
      : 1;
    const taxaJuros = patrimonio * 0.01 * mesesAnalisados; // 1% ao mês
    const sharpeRatio = drawdownMaximo > 0 
      ? (pnlTotal - taxaJuros) / drawdownMaximo 
      : 0;

    // Calcular Fator de Recuperação
    const fatorRecuperacao = drawdownMaximoReais > 0 
      ? pnlTotal / drawdownMaximoReais 
      : 0;

    // Calcular Índice de Calmar
    const retornoTotal = patrimonio > 0 ? (pnlTotal / patrimonio) * 100 : 0;
    const indiceCalmar = drawdownMaximo > 0 
      ? retornoTotal / drawdownMaximo 
      : 0;

    // Calcular sequências
    let sequenciaAtual = 0;
    let maiorSequenciaPositiva = 0;
    let maiorSequenciaNegativa = 0;
    let sequenciaTemporaria = 0;
    let ultimoTipo = '';

    for (const [date, data] of sortedDays) {
      if (data.pnl > 0) {
        if (ultimoTipo === 'positivo') {
          sequenciaTemporaria++;
        } else {
          sequenciaTemporaria = 1;
          ultimoTipo = 'positivo';
        }
        maiorSequenciaPositiva = Math.max(maiorSequenciaPositiva, sequenciaTemporaria);
      } else if (data.pnl < 0) {
        if (ultimoTipo === 'negativo') {
          sequenciaTemporaria++;
        } else {
          sequenciaTemporaria = 1;
          ultimoTipo = 'negativo';
        }
        maiorSequenciaNegativa = Math.max(maiorSequenciaNegativa, sequenciaTemporaria);
      }
    }

    // Sequência atual (últimos dias)
    if (sortedDays.length > 0) {
      const ultimosDias = sortedDays.slice(-7); // Últimos 7 dias
      let sequencia = 0;
      for (let i = ultimosDias.length - 1; i >= 0; i--) {
        if (ultimosDias[i][1].pnl > 0) {
          sequencia++;
        } else {
          break;
        }
      }
      sequenciaAtual = sequencia;
    }

    return {
      pnlTotal,
      totalTrades,
      diasOperados,
      melhorDia,
      piorDia,
      taxaAcertoMedia,
      drawdownMaximo,
      drawdownMaximoReais,
      sharpeRatio,
      fatorRecuperacao,
      indiceCalmar,
      sequenciaAtual,
      maiorSequenciaPositiva,
      maiorSequenciaNegativa
    };
  };

  const metrics = calculateMetrics();

  // Gerar calendário do mês atual
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const currentCalendarDate = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentCalendarDate.toISOString().split('T')[0];
        const isCurrentMonth = currentCalendarDate.getMonth() === month;
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        const hasData = dayData[dateStr];
        
        weekDays.push({
          date: new Date(currentCalendarDate),
          dateStr,
          isCurrentMonth,
          isToday,
          hasData,
          pnl: hasData?.pnl || 0
        });
        
        currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
      }
      calendar.push(weekDays);
    }
    
    return calendar;
  };

  const calendar = generateCalendar();

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setShowAddEntry(true);
    
    // Preencher dados existentes se houver
    const existing = dayData[dateStr];
    if (existing) {
      setNewEntry({
        pnl: existing.pnl.toString(),
        trades: existing.trades.toString(),
        winRate: existing.winRate.toString(),
        notes: existing.notes || ''
      });
    } else {
      setNewEntry({
        pnl: '',
        trades: '',
        winRate: '',
        notes: ''
      });
    }
  };

  const handleSaveEntry = () => {
    if (!selectedDate) return;
    
    const pnl = parseFloat(newEntry.pnl) || 0;
    const trades = parseInt(newEntry.trades) || 0;
    const winRate = parseFloat(newEntry.winRate) || 0;
    
    setDayData(prev => ({
      ...prev,
      [selectedDate]: {
        date: selectedDate,
        pnl,
        trades,
        winRate,
        notes: newEntry.notes
      }
    }));
    
    setShowAddEntry(false);
    setSelectedDate(null);
    setNewEntry({
      pnl: '',
      trades: '',
      winRate: '',
      notes: ''
    });
  };

  const handleSavePatrimonio = () => {
    const valor = parseFloat(editingPatrimonio);
    if (!isNaN(valor) && valor > 0) {
      setPatrimonio(valor);
      setShowPatrimonioInput(false);
    }
  };

  const getPnlColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-400 bg-green-900 bg-opacity-30';
    if (pnl < 0) return 'text-red-400 bg-red-900 bg-opacity-30';
    return 'text-gray-400 bg-gray-700';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatMetric = (value: number, isPercentage = false, decimalPlaces = 2) => {
    if (isNaN(value)) return 'N/A';
    return isPercentage 
      ? `${value.toFixed(decimalPlaces)}%` 
      : value.toFixed(decimalPlaces);
  };

  const getMetricColor = (metric: string, value: number): string => {
    switch (metric) {
      case 'sharpeRatio':
        return value >= 1.0 ? 'text-green-400' : value >= 0.5 ? 'text-yellow-400' : 'text-red-400';
      case 'fatorRecuperacao':
        return value >= 3 ? 'text-green-400' : value >= 1 ? 'text-yellow-400' : 'text-red-400';
      case 'indiceCalmar':
        return value >= 1.0 ? 'text-green-400' : value >= 0.5 ? 'text-yellow-400' : 'text-red-400';
      case 'drawdown':
        return value <= 10 ? 'text-green-400' : value <= 20 ? 'text-yellow-400' : 'text-red-400';
      case 'pnl':
        return value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400';
      default:
        return 'text-gray-300';
    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
              <h1 className="text-2xl font-bold">
                {language === 'en' ? 'Quant Diary' : 'Diário Quant'}
              </h1>
              <p className="text-gray-400">
                {language === 'en' 
                  ? 'Track your daily trading performance'
                  : 'Acompanhe sua performance diária de trading'}
              </p>
            </div>
          </div>
          
          {/* Patrimônio Display/Edit */}
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">
                  {language === 'en' ? 'Initial Capital:' : 'Patrimônio Inicial:'}
                </span>
                {showPatrimonioInput ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editingPatrimonio}
                      onChange={(e) => setEditingPatrimonio(e.target.value)}
                      className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      autoFocus
                    />
                    <button
                      onClick={handleSavePatrimonio}
                      className="p-1 text-green-400 hover:text-green-300"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowPatrimonioInput(false)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-green-400">
                      {formatCurrency(patrimonio)}
                    </span>
                    <button
                      onClick={() => {
                        setEditingPatrimonio(patrimonio.toString());
                        setShowPatrimonioInput(true);
                      }}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Métricas de Performance */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {/* P&L Total */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">P&L Total</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className={`text-xl font-bold ${getMetricColor('pnl', metrics.pnlTotal)}`}>
              {formatCurrency(metrics.pnlTotal)}
            </p>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'All-time' : 'Todos os tempos'}
            </p>
          </div>

          {/* Drawdown Máximo */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Drawdown Máximo</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <p className={`text-xl font-bold ${getMetricColor('drawdown', metrics.drawdownMaximo)}`}>
              {formatMetric(metrics.drawdownMaximo, true)}
            </p>
            <p className="text-xs text-gray-500">
              {formatCurrency(metrics.drawdownMaximoReais)}
            </p>
          </div>

          {/* Sharpe Ratio */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Sharpe Ratio</span>
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <p className={`text-xl font-bold ${getMetricColor('sharpeRatio', metrics.sharpeRatio)}`}>
              {formatMetric(metrics.sharpeRatio)}
            </p>
            <p className="text-xs text-gray-500">
              {metrics.sharpeRatio >= 1.0 ? 'Excelente' : 
               metrics.sharpeRatio >= 0.5 ? 'Bom' : 'Regular'}
            </p>
          </div>

          {/* Fator de Recuperação */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Fator Recuperação</span>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <p className={`text-xl font-bold ${getMetricColor('fatorRecuperacao', metrics.fatorRecuperacao)}`}>
              {formatMetric(metrics.fatorRecuperacao)}
            </p>
            <p className="text-xs text-gray-500">
              {metrics.fatorRecuperacao >= 3 ? 'Excelente' : 
               metrics.fatorRecuperacao >= 1 ? 'Bom' : 'Baixo'}
            </p>
          </div>

          {/* Índice de Calmar */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Índice Calmar</span>
              <Calculator className="w-4 h-4 text-yellow-400" />
            </div>
            <p className={`text-xl font-bold ${getMetricColor('indiceCalmar', metrics.indiceCalmar)}`}>
              {formatMetric(metrics.indiceCalmar)}
            </p>
            <p className="text-xs text-gray-500">
              {metrics.indiceCalmar >= 1.0 ? 'Excelente' : 
               metrics.indiceCalmar >= 0.5 ? 'Bom' : 'Regular'}
            </p>
          </div>

          {/* Total de Trades */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Trades</span>
              <Hash className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl font-bold text-blue-400">{metrics.totalTrades}</p>
            <p className="text-xs text-gray-500">
              {metrics.diasOperados} {language === 'en' ? 'trading days' : 'dias operados'}
            </p>
          </div>
        </div>

        {/* Calendário */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="w-5 h-5 text-blue-400 mr-2" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-700 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                {language === 'en' ? 'Today' : 'Hoje'}
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-700 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendário */}
          <div className="space-y-2">
            {calendar.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((day, dayIndex) => (
                  <button
                    key={dayIndex}
                    onClick={() => handleDateClick(day.dateStr)}
                    className={`
                      aspect-square p-2 rounded-lg text-sm transition-all duration-200
                      ${day.isCurrentMonth ? 'hover:bg-gray-700' : 'text-gray-600'}
                      ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                      ${day.hasData ? getPnlColor(day.pnl) : 'bg-gray-700'}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="font-medium">{day.date.getDate()}</span>
                      {day.hasData && (
                        <span className="text-xs mt-1">
                          {day.pnl > 0 ? '+' : ''}{day.pnl.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Melhores e Piores Dias */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart2 className="w-5 h-5 text-blue-400 mr-2" />
              {language === 'en' ? 'Best & Worst Days' : 'Melhores e Piores Dias'}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{language === 'en' ? 'Best Day:' : 'Melhor Dia:'}</span>
                <span className="text-green-400 font-medium">
                  {formatCurrency(metrics.melhorDia)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{language === 'en' ? 'Worst Day:' : 'Pior Dia:'}</span>
                <span className="text-red-400 font-medium">
                  {formatCurrency(metrics.piorDia)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{language === 'en' ? 'Avg Win Rate:' : 'Taxa Acerto Média:'}</span>
                <span className="text-blue-400 font-medium">
                  {formatMetric(metrics.taxaAcertoMedia, true)}
                </span>
              </div>
            </div>
          </div>

          {/* Sequências */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 text-purple-400 mr-2" />
              {language === 'en' ? 'Streaks' : 'Sequências'}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{language === 'en' ? 'Current Streak:' : 'Sequência Atual:'}</span>
                <span className="text-purple-400 font-medium">
                  {metrics.sequenciaAtual} {language === 'en' ? 'days' : 'dias'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{language === 'en' ? 'Best Streak:' : 'Melhor Sequência:'}</span>
                <span className="text-green-400 font-medium">
                  {metrics.maiorSequenciaPositiva} {language === 'en' ? 'days' : 'dias'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{language === 'en' ? 'Worst Streak:' : 'Pior Sequência:'}</span>
                <span className="text-red-400 font-medium">
                  {metrics.maiorSequenciaNegativa} {language === 'en' ? 'days' : 'dias'}
                </span>
              </div>
            </div>
          </div>

          {/* Métricas Avançadas */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calculator className="w-5 h-5 text-yellow-400 mr-2" />
              {language === 'en' ? 'Advanced Metrics' : 'Métricas Avançadas'}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sharpe Ratio:</span>
                <span className={`font-medium ${getMetricColor('sharpeRatio', metrics.sharpeRatio)}`}>
                  {formatMetric(metrics.sharpeRatio)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fator Recuperação:</span>
                <span className={`font-medium ${getMetricColor('fatorRecuperacao', metrics.fatorRecuperacao)}`}>
                  {formatMetric(metrics.fatorRecuperacao)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Índice Calmar:</span>
                <span className={`font-medium ${getMetricColor('indiceCalmar', metrics.indiceCalmar)}`}>
                  {formatMetric(metrics.indiceCalmar)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informações sobre as Métricas */}
        <div className="bg-blue-900 bg-opacity-20 rounded-lg p-6 border border-blue-800">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-300 mb-2">
                {language === 'en' ? 'About the Metrics' : 'Sobre as Métricas'}
              </h4>
              <div className="text-sm text-blue-200 space-y-2">
                <p>
                  <strong>Sharpe Ratio:</strong> (Lucro Total - Taxa de Juros 1% a.m.) ÷ Drawdown (%)
                </p>
                <p>
                  <strong>Drawdown:</strong> (Pico Máximo - Saldo Atual) ÷ Patrimônio Inicial × 100
                </p>
                <p>
                  <strong>Fator de Recuperação:</strong> Lucro Total ÷ Drawdown Máximo (R$)
                </p>
                <p>
                  <strong>Índice de Calmar:</strong> Retorno Total (%) ÷ Drawdown Máximo (%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar entrada */}
      {showAddEntry && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {language === 'en' ? 'Add Entry' : 'Adicionar Entrada'}
              </h3>
              <button
                onClick={() => setShowAddEntry(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-400">
                {new Date(selectedDate).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
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
                  value={newEntry.pnl}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, pnl: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Number of Trades' : 'Número de Trades'}
                </label>
                <input
                  type="number"
                  value={newEntry.trades}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, trades: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Win Rate (%)' : 'Taxa de Acerto (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={newEntry.winRate}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, winRate: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {language === 'en' ? 'Notes' : 'Observações'}
                </label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder={language === 'en' ? 'Trading notes for the day...' : 'Observações sobre o dia de trading...'}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddEntry(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
              >
                {language === 'en' ? 'Cancel' : 'Cancelar'}
              </button>
              <button
                onClick={handleSaveEntry}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Save' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}