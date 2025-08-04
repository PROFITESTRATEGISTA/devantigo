import React from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface CalendarDay {
  date: string;
  pnl: number;
  trades: number;
  hasData: boolean;
}

interface CalendarGridProps {
  currentDate: Date;
  calendarDays: CalendarDay[];
  selectedDate: string | null;
  onDayClick: (date: string) => void;
}

export function CalendarGrid({ currentDate, calendarDays, selectedDate, onDayClick }: CalendarGridProps) {
  const getDayColor = (day: CalendarDay) => {
    if (!day.hasData) return 'bg-gray-800 hover:bg-gray-700';
    if (day.pnl > 0) return 'bg-green-900 hover:bg-green-800 border-green-600';
    if (day.pnl < 0) return 'bg-red-900 hover:bg-red-800 border-red-600';
    return 'bg-gray-700 hover:bg-gray-600 border-gray-500';
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-400';
    if (pnl < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const isCurrentMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="w-6 h-6 text-blue-500 mr-2" />
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const dayNumber = new Date(day.date).getDate();
          const isSelected = selectedDate === day.date;
          const isTodayDate = isToday(day.date);
          const isCurrentMonthDate = isCurrentMonth(day.date);
          
          return (
            <button
              key={day.date}
              onClick={() => onDayClick(day.date)}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200 min-h-[80px]
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                ${isTodayDate ? 'ring-1 ring-yellow-500' : 'border-transparent'}
                ${getDayColor(day)}
                ${!isCurrentMonthDate ? 'opacity-50' : ''}
              `}
            >
              <div className="text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isTodayDate ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {dayNumber}
                  </span>
                  {day.hasData && (
                    <div className="flex items-center">
                      {day.pnl > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : day.pnl < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </div>
                
                {day.hasData && (
                  <div className="space-y-1">
                    <div className={`text-xs font-bold ${getPnLColor(day.pnl)}`}>
                      {day.pnl >= 0 ? '+' : ''}R$ {Math.abs(day.pnl).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {day.trades} trade{day.trades !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-900 border border-green-600 rounded"></div>
          <span className="text-gray-400">Lucro</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-900 border border-red-600 rounded"></div>
          <span className="text-gray-400">Prejuízo</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-800 border border-gray-600 rounded"></div>
          <span className="text-gray-400">Sem dados</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-yellow-500 rounded"></div>
          <span className="text-gray-400">Hoje</span>
        </div>
      </div>
    </div>
  );
}