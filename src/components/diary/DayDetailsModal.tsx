import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, DollarSign, Hash, Percent, Edit2, Save, 
  Plus, Trash2, BarChart2, Target, MessageSquare, Zap,
  TrendingUp, TrendingDown, Clock, Award
} from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  entryTime: string;
  exitTime: string;
  strategy: string;
  notes?: string;
}

interface DayData {
  date: string;
  pnl: number;
  trades: Trade[];
  comments: string;
  checklist: {
    planejamento: boolean;
    analise: boolean;
    risco: boolean;
    emocional: boolean;
    revisao: boolean;
  };
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  marketConditions: string;
  lessons: string;
}

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  dayData: DayData;
  onSave: (data: DayData) => void;
}

export function DayDetailsModal({ isOpen, onClose, selectedDate, dayData, onSave }: DayDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<DayData>(dayData);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    symbol: 'WINFUT',
    side: 'buy',
    quantity: 1,
    entryPrice: 0,
    exitPrice: 0,
    strategy: 'Scalping'
  });

  useEffect(() => {
    setEditedData(dayData);
  }, [dayData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'neutral': return 'text-gray-400';
      case 'bad': return 'text-orange-500';
      case 'terrible': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excellent': return '🤩';
      case 'good': return '😊';
      case 'neutral': return '😐';
      case 'bad': return '😔';
      case 'terrible': return '😡';
      default: return '😐';
    }
  };

  const handleSave = () => {
    // Calculate total PnL from trades
    const totalPnL = editedData.trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const updatedData = { ...editedData, pnl: totalPnL };
    
    onSave(updatedData);
    setIsEditing(false);
  };

  const addTrade = () => {
    if (!newTrade.entryPrice || !newTrade.exitPrice) return;
    
    const pnl = newTrade.side === 'buy' 
      ? (newTrade.exitPrice - newTrade.entryPrice) * (newTrade.quantity || 1)
      : (newTrade.entryPrice - newTrade.exitPrice) * (newTrade.quantity || 1);
    
    const trade: Trade = {
      id: Date.now().toString(),
      symbol: newTrade.symbol || 'WINFUT',
      side: newTrade.side || 'buy',
      quantity: newTrade.quantity || 1,
      entryPrice: newTrade.entryPrice,
      exitPrice: newTrade.exitPrice,
      pnl: pnl,
      entryTime: new Date().toLocaleTimeString(),
      exitTime: new Date().toLocaleTimeString(),
      strategy: newTrade.strategy || 'Manual',
      notes: newTrade.notes || ''
    };
    
    setEditedData({
      ...editedData,
      trades: [...editedData.trades, trade]
    });
    
    setNewTrade({
      symbol: 'WINFUT',
      side: 'buy',
      quantity: 1,
      entryPrice: 0,
      exitPrice: 0,
      strategy: 'Scalping'
    });
    
    setShowAddTradeModal(false);
  };

  const deleteTrade = (tradeId: string) => {
    setEditedData({
      ...editedData,
      trades: editedData.trades.filter(trade => trade.id !== tradeId)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              {formatDate(selectedDate)}
            </h2>
            <p className="text-gray-400 text-sm">Detalhes do dia de trading</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setEditedData(dayData);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-sm flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">P&L do Dia</span>
                <DollarSign className={`w-4 h-4 ${editedData.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <p className={`text-2xl font-bold ${editedData.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {editedData.pnl >= 0 ? '+' : ''}R$ {editedData.pnl.toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Total de Trades</span>
                <Hash className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-500">{editedData.trades.length}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Taxa de Acerto</span>
                <Percent className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-yellow-500">
                {editedData.trades.length > 0 
                  ? ((editedData.trades.filter(t => t.pnl > 0).length / editedData.trades.length) * 100).toFixed(1)
                  : '0.0'}%
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Humor</span>
                <span className="text-xl">{getMoodEmoji(editedData.mood)}</span>
              </div>
              <p className={`text-lg font-bold ${getMoodColor(editedData.mood)}`}>
                {editedData.mood === 'excellent' ? 'Excelente' :
                 editedData.mood === 'good' ? 'Bom' :
                 editedData.mood === 'neutral' ? 'Neutro' :
                 editedData.mood === 'bad' ? 'Ruim' : 'Péssimo'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Trades */}
            <div className="lg:col-span-2">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <BarChart2 className="w-5 h-5 text-blue-500 mr-2" />
                    Operações do Dia
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowAddTradeModal(true)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </button>
                  )}
                </div>

                {editedData.trades.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhuma operação registrada</p>
                    {isEditing && (
                      <button
                        onClick={() => setShowAddTradeModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
                      >
                        Adicionar Primeira Operação
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {editedData.trades.map((trade) => (
                      <div key={trade.id} className="bg-gray-600 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{trade.symbol}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              trade.side === 'buy' ? 'bg-green-600' : 'bg-red-600'
                            }`}>
                              {trade.side === 'buy' ? 'C' : 'V'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.pnl >= 0 ? '+' : ''}R$ {trade.pnl.toFixed(2)}
                            </span>
                            {isEditing && (
                              <button
                                onClick={() => deleteTrade(trade.id)}
                                className="p-1 hover:bg-gray-500 rounded text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-xs text-gray-300">
                          <div>Qtd: {trade.quantity}</div>
                          <div>Entrada: {trade.entryPrice}</div>
                          <div>Saída: {trade.exitPrice}</div>
                          <div>{trade.strategy}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Controls */}
            <div className="space-y-4">
              {/* Checklist */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Target className="w-4 h-4 text-green-500 mr-2" />
                  Checklist
                </h4>
                
                <div className="space-y-2">
                  {Object.entries(editedData.checklist).map(([key, checked]) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (isEditing) {
                            setEditedData({
                              ...editedData,
                              checklist: {
                                ...editedData.checklist,
                                [key]: e.target.checked
                              }
                            });
                          }
                        }}
                        disabled={!isEditing}
                        className="w-3 h-3 text-blue-600 bg-gray-600 border-gray-500 rounded"
                      />
                      <span className={`text-sm ${checked ? 'text-green-400' : 'text-gray-400'}`}>
                        {key === 'planejamento' ? 'Planejamento' :
                         key === 'analise' ? 'Análise' :
                         key === 'risco' ? 'Gestão de Risco' :
                         key === 'emocional' ? 'Controle Emocional' :
                         'Revisão'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Award className="w-4 h-4 text-yellow-500 mr-2" />
                  Humor
                </h4>
                
                {isEditing ? (
                  <div className="space-y-2">
                    {['excellent', 'good', 'neutral', 'bad', 'terrible'].map((mood) => (
                      <label key={mood} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mood"
                          value={mood}
                          checked={editedData.mood === mood}
                          onChange={(e) => setEditedData({
                            ...editedData,
                            mood: e.target.value as any
                          })}
                          className="w-3 h-3 text-blue-600"
                        />
                        <span className={`text-sm flex items-center space-x-1 ${getMoodColor(mood)}`}>
                          <span>{getMoodEmoji(mood)}</span>
                          <span>
                            {mood === 'excellent' ? 'Excelente' :
                             mood === 'good' ? 'Bom' :
                             mood === 'neutral' ? 'Neutro' :
                             mood === 'bad' ? 'Ruim' : 'Péssimo'}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMoodEmoji(editedData.mood)}</span>
                    <span className={`font-medium ${getMoodColor(editedData.mood)}`}>
                      {editedData.mood === 'excellent' ? 'Excelente' :
                       editedData.mood === 'good' ? 'Bom' :
                       editedData.mood === 'neutral' ? 'Neutro' :
                       editedData.mood === 'bad' ? 'Ruim' : 'Péssimo'}
                    </span>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 text-blue-500 mr-2" />
                  Comentários
                </h4>
                
                {isEditing ? (
                  <textarea
                    value={editedData.comments}
                    onChange={(e) => setEditedData({...editedData, comments: e.target.value})}
                    placeholder="Observações do dia..."
                    className="w-full h-20 bg-gray-600 border border-gray-500 rounded-md p-2 text-white text-sm placeholder-gray-400"
                  />
                ) : (
                  <div className="bg-gray-600 rounded-md p-2 min-h-[60px]">
                    {editedData.comments ? (
                      <p className="text-sm text-gray-300">{editedData.comments}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Sem comentários</p>
                    )}
                  </div>
                )}
              </div>

              {/* Lessons */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                  Lições
                </h4>
                
                {isEditing ? (
                  <textarea
                    value={editedData.lessons}
                    onChange={(e) => setEditedData({...editedData, lessons: e.target.value})}
                    placeholder="O que aprendeu hoje..."
                    className="w-full h-20 bg-gray-600 border border-gray-500 rounded-md p-2 text-white text-sm placeholder-gray-400"
                  />
                ) : (
                  <div className="bg-gray-600 rounded-md p-2 min-h-[60px]">
                    {editedData.lessons ? (
                      <p className="text-sm text-gray-300">{editedData.lessons}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Sem lições</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Trade Modal */}
      {showAddTradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Adicionar Trade</h3>
              <button 
                onClick={() => setShowAddTradeModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Ativo</label>
                  <select
                    value={newTrade.symbol}
                    onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                  >
                    <option value="WINFUT">WINFUT</option>
                    <option value="WDOFUT">WDOFUT</option>
                    <option value="PETR4">PETR4</option>
                    <option value="VALE3">VALE3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Direção</label>
                  <select
                    value={newTrade.side}
                    onChange={(e) => setNewTrade({...newTrade, side: e.target.value as 'buy' | 'sell'})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                  >
                    <option value="buy">Compra</option>
                    <option value="sell">Venda</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Qtd</label>
                  <input
                    type="number"
                    value={newTrade.quantity}
                    onChange={(e) => setNewTrade({...newTrade, quantity: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Entrada</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.entryPrice}
                    onChange={(e) => setNewTrade({...newTrade, entryPrice: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Saída</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.exitPrice}
                    onChange={(e) => setNewTrade({...newTrade, exitPrice: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Estratégia</label>
                <select
                  value={newTrade.strategy}
                  onChange={(e) => setNewTrade({...newTrade, strategy: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                >
                  <option value="Scalping">Scalping</option>
                  <option value="Swing">Swing</option>
                  <option value="Day Trade">Day Trade</option>
                  <option value="Position">Position</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddTradeModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={addTrade}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}