import React from 'react';
import { Calendar, TrendingUp, BarChart2, ArrowRight, DollarSign, Hash, Percent, Clock } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

export function QuantDiarySection() {
  const { language } = useLanguageStore();

  // Estatísticas resumidas para o dashboard
  const summaryStats = {
    pnlMes: 0,
    totalTrades: 0,
    diasOperados: 0,
    melhorDia: 0,
    pnlTotal: 0,
    taxaAcerto: 0,
    sequenciaAtual: 0,
    ultimaAtualizacao: 'Hoje'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {language === 'en' ? 'Quant Diary' : 'Diário Quant'}
        </h2>
        <button
          onClick={() => window.location.href = '/quant-diary'}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
        >
          {language === 'en' ? 'Open Diary' : 'Abrir Diário'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Resumo de Performance */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
            {language === 'en' ? 'Performance Summary' : 'Resumo de Performance'}
          </h3>
          <span className="text-sm text-gray-400">
            {language === 'en' ? 'Last update: Today' : 'Última atualização: Hoje'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* P&L do Mês */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {language === 'en' ? 'Monthly P&L' : 'P&L do Mês'}
              </span>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xl font-bold text-green-400">
              +R$ {summaryStats.pnlMes.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'August 2025' : 'Agosto 2025'}
            </p>
          </div>

          {/* Total de Trades */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {language === 'en' ? 'Monthly Trades' : 'Trades do Mês'}
              </span>
              <Hash className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl font-bold text-blue-400">{summaryStats.totalTrades}</p>
            <p className="text-xs text-gray-500">
              {summaryStats.diasOperados} {language === 'en' ? 'trading days' : 'dias operados'}
            </p>
          </div>

          {/* P&L Total (All-Time) */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {language === 'en' ? 'Total P&L' : 'P&L Total'}
              </span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl font-bold text-purple-400">
              +R$ {summaryStats.pnlTotal.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'All-time' : 'Todos os tempos'}
            </p>
          </div>

          {/* Taxa de Acerto */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {language === 'en' ? 'Win Rate' : 'Taxa de Acerto'}
              </span>
              <Percent className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-xl font-bold text-yellow-400">
              {summaryStats.taxaAcerto.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'All-time average' : 'Média geral'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center">
              <Calendar className="w-4 h-4 text-green-400 mr-2" />
              {language === 'en' ? 'Best Day' : 'Melhor Dia'}
            </h4>
          </div>
          <p className="text-2xl font-bold text-green-400">
            R$ {summaryStats.melhorDia.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'en' ? 'No data yet' : 'Ainda sem dados'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center">
              <Clock className="w-4 h-4 text-blue-400 mr-2" />
              {language === 'en' ? 'Current Streak' : 'Sequência Atual'}
            </h4>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {summaryStats.sequenciaAtual} {language === 'en' ? 'days' : 'dias'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'en' ? 'Trading streak' : 'Sequência de trading'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center">
              <BarChart2 className="w-4 h-4 text-purple-400 mr-2" />
              {language === 'en' ? 'This Month' : 'Este Mês'}
            </h4>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {summaryStats.diasOperados} {language === 'en' ? 'days' : 'dias'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'en' ? 'Trading days' : 'Dias operados'}
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold mb-2">
          {language === 'en' ? 'Start Your Trading Journal' : 'Comece Seu Diário de Trading'}
        </h3>
        <p className="text-blue-100 mb-4">
          {language === 'en' 
            ? 'Track your daily performance, analyze patterns, and improve your trading strategies.'
            : 'Acompanhe sua performance diária, analise padrões e melhore suas estratégias de trading.'}
        </p>
        <button
          onClick={() => window.location.href = '/quant-diary'}
          className="px-6 py-3 bg-white text-blue-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          {language === 'en' ? 'Open Full Diary' : 'Abrir Diário Completo'}
        </button>
      </div>
    </div>
  );
}