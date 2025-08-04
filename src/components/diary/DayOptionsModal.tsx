import React from 'react';
import { X, FileSpreadsheet, MessageSquare, Calendar } from 'lucide-react';

interface DayOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onAddAnalysis: () => void;
  onAddComments: () => void;
  onViewDay: () => void;
}

export function DayOptionsModal({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onAddAnalysis, 
  onAddComments, 
  onViewDay 
}: DayOptionsModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-sm w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Dia {formatDate(selectedDate)}
          </h2>
          <p className="mt-2 text-gray-400">
            O que você gostaria de fazer?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onAddAnalysis}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-left flex items-center space-x-3 transition-colors"
          >
            <FileSpreadsheet className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-medium text-white">Adicionar Análise Salva</h3>
              <p className="text-sm text-blue-100">Vincular uma análise de backtest ao dia</p>
            </div>
          </button>

          <button
            onClick={onAddComments}
            className="w-full p-4 bg-green-600 hover:bg-green-700 rounded-lg text-left flex items-center space-x-3 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-medium text-white">Adicionar Comentários</h3>
              <p className="text-sm text-green-100">Registrar observações sobre o dia</p>
            </div>
          </button>

          <button
            onClick={onViewDay}
            className="w-full p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-left flex items-center space-x-3 transition-colors"
          >
            <Calendar className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-medium text-white">Ver Dia</h3>
              <p className="text-sm text-purple-100">Visualizar painel completo do dia</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}