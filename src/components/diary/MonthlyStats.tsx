import React from 'react';
import { TrendingUp, DollarSign, Hash, Percent, Calendar, Award, Target } from 'lucide-react';

interface MonthlyStatsProps {
  currentDate: Date;
  monthlyData: {
    totalPnL: number;
    totalTrades: number;
    winRate: number;
    tradingDays: number;
    bestDay: number;
    worstDay: number;
    avgDailyPnL: number;
    consistency: number;
  };
}

export function MonthlyStats({ currentDate, monthlyData }: MonthlyStatsProps) {
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
          Resumo de {monthName}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* P&L Total */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">P&L Total</span>
            <DollarSign className={`w-4 h-4 ${monthlyData.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <p className={`text-2xl font-bold ${monthlyData.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {monthlyData.totalPnL >= 0 ? '+' : ''}R$ {monthlyData.totalPnL.toFixed(2)}
          </p>
        </div>

        {/* Total Trades */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Trades</span>
            <Hash className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-500">{monthlyData.totalTrades}</p>
        </div>

        {/* Win Rate */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Taxa de Acerto</span>
            <Percent className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-500">{monthlyData.winRate.toFixed(1)}%</p>
        </div>

        {/* Trading Days */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Dias Operados</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-500">{monthlyData.tradingDays}</p>
        </div>

        {/* Best Day */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Melhor Dia</span>
            <Award className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-lg font-bold text-green-500">
            +R$ {monthlyData.bestDay.toFixed(2)}
          </p>
        </div>

        {/* Worst Day */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Pior Dia</span>
            <Target className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-lg font-bold text-red-500">
            R$ {monthlyData.worstDay.toFixed(2)}
          </p>
        </div>

        {/* Average Daily P&L */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Média Diária</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className={`text-lg font-bold ${monthlyData.avgDailyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {monthlyData.avgDailyPnL >= 0 ? '+' : ''}R$ {monthlyData.avgDailyPnL.toFixed(2)}
          </p>
        </div>

        {/* Consistency */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Consistência</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-lg font-bold text-purple-500">{monthlyData.consistency.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}