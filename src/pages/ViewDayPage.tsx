import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, DollarSign, TrendingUp, TrendingDown, 
  Clock, Hash, Percent, Edit2, Save, X, Plus, Trash2, 
  MessageSquare, BarChart2, Target, AlertTriangle, Check,
  FileText, Activity, Award, Zap
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLanguageStore } from '../stores/languageStore';

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

export function ViewDayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguageStore();
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<DayData | null>(null);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    symbol: 'WINFUT',
    side: 'buy',
    quantity: 1,
    entryPrice: 0,
    exitPrice: 0,
    strategy: 'Scalping'
  });

  // Get date from URL params
  const dateParam = searchParams.get('date');
  const selectedDate = dateParam || new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadDayData();
  }, [selectedDate]);

  const loadDayData = () => {
    // Load from localStorage or create empty data
    const savedData = localStorage.getItem('quantDiary');
    const diaryData = savedData ? JSON.parse(savedData) : {};
    
    const existingData = diaryData[selectedDate];
    
    if (existingData) {
      setDayData(existingData);
      setEditedData(existingData);
    } else {
      // Create empty day data
      const emptyData: DayData = {
        date: selectedDate,
        pnl: 0,
        trades: [],
        comments: '',
        checklist: {
          planejamento: false,
          analise: false,
          risco: false,
          emocional: false,
          revisao: false
        },
        mood: 'neutral',
        marketConditions: '',
        lessons: ''
      };
      setDayData(emptyData);
      setEditedData(emptyData);
    }
  };

  const saveDayData = () => {
    if (!editedData) return;
    
    const savedData = localStorage.getItem('quantDiary');
    const diaryData = savedData ? JSON.parse(savedData) : {};
    
    // Calculate total PnL from trades
    const totalPnL = editedData.trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const updatedData = { ...editedData, pnl: totalPnL };
    
    diaryData[selectedDate] = updatedData;
    localStorage.setItem('quantDiary', JSON.stringify(diaryData));
    
    setDayData(updatedData);
    setIsEditing(false);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50 flex items-center';
    successMessage.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Dados do dia salvos com sucesso!
    `;
    document.body.appendChild(successMessage);
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  };

  const addTrade = () => {
    if (!editedData || !newTrade.entryPrice || !newTrade.exitPrice) return;
    
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
    if (!editedData) return;
    
    setEditedData({
      ...editedData,
      trades: editedData.trades.filter(trade => trade.id !== tradeId)
    });
  };

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

  if (!dayData) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando dados do dia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/quant-diary')}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              title="Voltar ao diário"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Calendar className="w-8 h-8 text-blue-500 mr-3" />
                {formatDate(selectedDate)}
              </h1>
              <p className="text-gray-400">
                {language === 'en' ? 'Trading day details' : 'Detalhes do dia de trading'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setEditedData(dayData);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={saveDayData}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar Dia
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">P&L do Dia</span>
              <DollarSign className={`w-5 h-5 ${dayData.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className={`text-3xl font-bold ${dayData.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {dayData.pnl >= 0 ? '+' : ''}R$ {dayData.pnl.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total de Trades</span>
              <Hash className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-500">{dayData.trades.length}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Taxa de Acerto</span>
              <Percent className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-500">
              {dayData.trades.length > 0 
                ? ((dayData.trades.filter(t => t.pnl > 0).length / dayData.trades.length) * 100).toFixed(1)
                : '0.0'}%
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Humor do Dia</span>
              <span className="text-2xl">{getMoodEmoji(dayData.mood)}</span>
            </div>
            <p className={`text-lg font-bold ${getMoodColor(dayData.mood)}`}>
              {dayData.mood === 'excellent' ? 'Excelente' :
               dayData.mood === 'good' ? 'Bom' :
               dayData.mood === 'neutral' ? 'Neutro' :
               dayData.mood === 'bad' ? 'Ruim' : 'Péssimo'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trades */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trades Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <BarChart2 className="w-6 h-6 text-blue-500 mr-2" />
                  Operações do Dia
                </h2>
                {isEditing && (
                  <button
                    onClick={() => setShowAddTradeModal(true)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Trade
                  </button>
                )}
              </div>

              {dayData.trades.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhuma operação registrada neste dia</p>
                  {isEditing && (
                    <button
                      onClick={() => setShowAddTradeModal(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Adicionar Primeira Operação
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {(isEditing ? editedData?.trades : dayData.trades)?.map((trade, index) => (
                    <div key={trade.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold">{trade.symbol}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.side === 'buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {trade.side === 'buy' ? 'COMPRA' : 'VENDA'}
                          </span>
                          <span className="text-sm text-gray-400">{trade.strategy}</span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.pnl >= 0 ? '+' : ''}R$ {trade.pnl.toFixed(2)}
                          </span>
                          {isEditing && (
                            <button
                              onClick={() => deleteTrade(trade.id)}
                              className="p-1 hover:bg-gray-600 rounded text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Quantidade:</span>
                          <p className="font-medium">{trade.quantity}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Entrada:</span>
                          <p className="font-medium">R$ {trade.entryPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Saída:</span>
                          <p className="font-medium">R$ {trade.exitPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Horário:</span>
                          <p className="font-medium">{trade.entryTime} - {trade.exitTime}</p>
                        </div>
                      </div>
                      
                      {trade.notes && (
                        <div className="mt-3 p-3 bg-gray-600 rounded-lg">
                          <p className="text-sm">{trade.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Market Analysis */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="w-6 h-6 text-purple-500 mr-2" />
                Análise do Mercado
              </h2>
              
              {isEditing ? (
                <textarea
                  value={editedData?.marketConditions || ''}
                  onChange={(e) => setEditedData(prev => prev ? {...prev, marketConditions: e.target.value} : null)}
                  placeholder="Como estava o mercado hoje? Volatilidade, tendência, eventos importantes..."
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="bg-gray-700 rounded-lg p-4">
                  {dayData.marketConditions ? (
                    <p className="text-gray-300">{dayData.marketConditions}</p>
                  ) : (
                    <p className="text-gray-500 italic">Nenhuma análise de mercado registrada</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Checklist */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 text-green-500 mr-2" />
                Checklist do Trader
              </h3>
              
              <div className="space-y-3">
                {Object.entries(editedData?.checklist || {}).map(([key, checked]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (isEditing && editedData) {
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
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className={checked ? 'text-green-400' : 'text-gray-400'}>
                      {key === 'planejamento' ? 'Planejamento feito' :
                       key === 'analise' ? 'Análise pré-mercado' :
                       key === 'risco' ? 'Gestão de risco' :
                       key === 'emocional' ? 'Controle emocional' :
                       'Revisão pós-mercado'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mood Selector */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 text-yellow-500 mr-2" />
                Humor do Dia
              </h3>
              
              {isEditing ? (
                <div className="space-y-2">
                  {['excellent', 'good', 'neutral', 'bad', 'terrible'].map((mood) => (
                    <label key={mood} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="mood"
                        value={mood}
                        checked={editedData?.mood === mood}
                        onChange={(e) => {
                          if (editedData) {
                            setEditedData({
                              ...editedData,
                              mood: e.target.value as any
                            });
                          }
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className={`flex items-center space-x-2 ${getMoodColor(mood)}`}>
                        <span className="text-lg">{getMoodEmoji(mood)}</span>
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
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getMoodEmoji(dayData.mood)}</span>
                  <span className={`text-lg font-medium ${getMoodColor(dayData.mood)}`}>
                    {dayData.mood === 'excellent' ? 'Excelente' :
                     dayData.mood === 'good' ? 'Bom' :
                     dayData.mood === 'neutral' ? 'Neutro' :
                     dayData.mood === 'bad' ? 'Ruim' : 'Péssimo'}
                  </span>
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
                Comentários
              </h3>
              
              {isEditing ? (
                <textarea
                  value={editedData?.comments || ''}
                  onChange={(e) => setEditedData(prev => prev ? {...prev, comments: e.target.value} : null)}
                  placeholder="Registre suas observações sobre o dia..."
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="bg-gray-700 rounded-lg p-4">
                  {dayData.comments ? (
                    <p className="text-gray-300 whitespace-pre-line">{dayData.comments}</p>
                  ) : (
                    <p className="text-gray-500 italic">Nenhum comentário registrado</p>
                  )}
                </div>
              )}
            </div>

            {/* Lessons Learned */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                Lições Aprendidas
              </h3>
              
              {isEditing ? (
                <textarea
                  value={editedData?.lessons || ''}
                  onChange={(e) => setEditedData(prev => prev ? {...prev, lessons: e.target.value} : null)}
                  placeholder="O que você aprendeu hoje? Erros a evitar, estratégias que funcionaram..."
                  className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="bg-gray-700 rounded-lg p-4">
                  {dayData.lessons ? (
                    <p className="text-gray-300 whitespace-pre-line">{dayData.lessons}</p>
                  ) : (
                    <p className="text-gray-500 italic">Nenhuma lição registrada</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Trade Modal */}
      {showAddTradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowAddTradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-6">Adicionar Operação</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Ativo</label>
                  <select
                    value={newTrade.symbol}
                    onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="WINFUT">WINFUT</option>
                    <option value="WDOFUT">WDOFUT</option>
                    <option value="PETR4">PETR4</option>
                    <option value="VALE3">VALE3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Direção</label>
                  <select
                    value={newTrade.side}
                    onChange={(e) => setNewTrade({...newTrade, side: e.target.value as 'buy' | 'sell'})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="buy">Compra</option>
                    <option value="sell">Venda</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={newTrade.quantity}
                    onChange={(e) => setNewTrade({...newTrade, quantity: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Preço Entrada</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.entryPrice}
                    onChange={(e) => setNewTrade({...newTrade, entryPrice: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Preço Saída</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.exitPrice}
                    onChange={(e) => setNewTrade({...newTrade, exitPrice: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estratégia</label>
                <select
                  value={newTrade.strategy}
                  onChange={(e) => setNewTrade({...newTrade, strategy: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="Scalping">Scalping</option>
                  <option value="Swing">Swing</option>
                  <option value="Day Trade">Day Trade</option>
                  <option value="Position">Position</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Observações</label>
                <textarea
                  value={newTrade.notes || ''}
                  onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})}
                  placeholder="Observações sobre esta operação..."
                  className="w-full h-20 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddTradeModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={addTrade}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
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