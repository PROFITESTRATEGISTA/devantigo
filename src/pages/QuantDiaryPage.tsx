import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, BarChart2, TrendingUp, 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export default function DiarioQuant() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('calendar');
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);

  const renderCalendar = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Calendar className="w-5 h-5 text-blue-400 mr-2" />
        Calendário de Trading
      </h3>
      <div className="text-center text-gray-400">
        <p>Calendário será implementado em breve</p>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="space-y-6">
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