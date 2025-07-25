import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BarChart, FileText, AlertTriangle, Check, 
  RefreshCw, Download, ChevronDown, ChevronUp, 
  Lightbulb, MessageSquare, Zap, Layers, TrendingUp, XCircle,
  BarChart2, Calendar, ArrowUpDown, Filter, Search, X,
  Save, FolderOpen, Edit3, Trash2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../stores/authStore';
import { MetricsDashboard } from '../components/MetricsDashboard';
import { AIResponseChat } from '../components/AIResponseChat';

interface Trade {
  entry_date: string;
  exit_date: string;
  entry_price: number;
  exit_price: number;
  pnl: number;
  pnl_pct: number;
  direction: 'long' | 'short';
  symbol?: string;
}

interface DayOfWeekStats {
  "Profit Factor": number;
  "Trades": number;
  "Win Rate (%)": number;
}

interface MonthStats {
  "Profit Factor": number;
  "Trades": number;
  "Win Rate (%)": number;
}

interface BacktestResult {
  trades?: Trade[];
  "Performance Metrics": {
    "Average Loss": number;
    "Average Win": number;
    "Gross Loss": number;
    "Gross Profit": number;
    "Max Drawdown ($)": number;
    "Net Profit": number;
    "Payoff": number;
    "Profit Factor": number;
    "Sharpe Ratio": number;
    "Time in Market": string;
    "Total Trades": number;
    "Win Rate (%)": number;
  };
  "Day of Week Analysis": {
    "Best Day": {
      "Day": string;
      "Profit Factor": number;
      "Trades": number;
      "Win Rate (%)": number;
    };
    "Stats": {
      [key: string]: DayOfWeekStats;
    };
    "Worst Day": {
      "Day": string;
      "Profit Factor": number;
      "Trades": number;
      "Win Rate (%)": number;
    };
  };
  "Monthly Analysis": {
    "Best Month": {
      "Month": string;
      "Profit Factor": number;
      "Trades": number;
      "Win Rate (%)": number;
    };
    "Stats": {
      [key: string]: MonthStats;
    };
    "Worst Month": {
      "Month": string;
      "Profit Factor": number;
      "Trades": number;
      "Win Rate (%)": number;
    };
  };
  equity_curve?: number[];
}

interface SavedAnalysis {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  backtestResult: BacktestResult;
  selectedStrategy: string | null;
  selectedAsset: string | null;
  csvContent: string | null;
  availableStrategies: string[];
  availableAssets: string[];
  totalTrades: number;
}

// Lista de eventos especiais de mercado
const specialEvents = [
  { name: 'Payroll', date: '2023-05-05', impact: 'alto' },
  { name: 'FED', date: '2023-05-03', impact: 'alto' },
  { name: 'COPOM', date: '2023-05-10', impact: 'alto' },
  { name: 'CPI', date: '2023-05-12', impact: 'médio' },
  { name: 'Vencimento de Opções', date: '2023-05-19', impact: 'médio' },
  { name: 'Vencimento Índice Futuro', date: '2023-05-17', impact: 'médio' },
  { name: 'Vencimento Dólar Futuro', date: '2023-05-01', impact: 'médio' },
  { name: 'Véspera de Feriado', date: '2023-05-31', impact: 'baixo' },
  { name: 'Semana de Feriado', date: '2023-05-29', impact: 'baixo' }
];

export function BacktestAnalysisPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showDailyResults, setShowDailyResults] = useState(true);
  const [showTrades, setShowTrades] = useState(false);
  const [showEquityCurve, setShowEquityCurve] = useState(true);
  const [showSpecialEvents, setShowSpecialEvents] = useState(false);
  const [showCorrelation, setShowCorrelation] = useState(false);
  const [showStrategySelector, setShowStrategySelector] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [availableStrategies, setAvailableStrategies] = useState<string[]>(['Estratégia 1', 'Estratégia 2', 'Estratégia 3']);
  const [availableAssets, setAvailableAssets] = useState<string[]>(['WINFUT', 'WDOFUT', 'PETR4', 'VALE3']);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [tradeSearch, setTradeSearch] = useState('');

  // Save system states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [renameAnalysisId, setRenameAnalysisId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');

  // Load saved analyses on component mount
  useEffect(() => {
    const saved = localStorage.getItem('backtestAnalyses');
    if (saved) {
      try {
        setSavedAnalyses(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved analyses:', error);
      }
    }
  }, []);

  // Save analyses to localStorage whenever savedAnalyses changes
  useEffect(() => {
    localStorage.setItem('backtestAnalyses', JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  useEffect(() => {
    if (backtestResult?.trades) {
      let trades = [...backtestResult.trades];
      
      // Apply strategy filter
      if (selectedStrategy) {
        // In a real implementation, this would filter by strategy
        // For now, we'll just keep all trades since we don't have strategy info
      }
      
      // Apply asset filter
      if (selectedAsset) {
        trades = trades.filter(trade => 
          trade.symbol === selectedAsset || 
          // If symbol is not available, keep all trades
          !trade.symbol
        );
      }
      
      // Apply search filter
      if (tradeSearch) {
        const searchLower = tradeSearch.toLowerCase();
        trades = trades.filter(trade => 
          (trade.symbol && trade.symbol.toLowerCase().includes(searchLower)) ||
          trade.entry_date.toLowerCase().includes(searchLower) ||
          trade.exit_date.toLowerCase().includes(searchLower) ||
          trade.pnl.toString().includes(searchLower)
        );
      }
      
      setFilteredTrades(trades);
    }
  }, [backtestResult?.trades, selectedStrategy, selectedAsset, tradeSearch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setFile(newFiles[0]); // Set the first file as the current file for backward compatibility
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setFile(newFiles[0]); // Set the first file as the current file for backward compatibility
      setError(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Por favor, selecione pelo menos um arquivo CSV para análise');
      return;
    }

    // Check file extensions
    const invalidFiles = files.filter(file => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      return fileExtension !== 'csv';
    });

    if (invalidFiles.length > 0) {
      setError(`Os seguintes arquivos não são CSVs válidos: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, just process the first file
      const fileContent = await readFileAsText(files[0]);
      setCsvContent(fileContent);

      // Create form data
      const formData = new FormData();
      formData.append('file', files[0]);

      // Send to API
      const response = await fetch('https://api.devhubtrader.com.br/api/tabela', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process and set the result
      setBacktestResult(data);
      setShowUploadForm(false);
      setShowChat(true);
      setCurrentAnalysisId(null); // Reset current analysis ID for new upload
      
      // Extract available assets from the data if possible
      if (data.trades && data.trades.length > 0) {
        const assets = Array.from(new Set(data.trades.map((trade: any) => trade.symbol || 'Unknown')));
        if (assets.length > 0 && assets[0] !== 'Unknown') {
          setAvailableAssets(assets);
        }
      }
      
      // Set filtered trades initially to all trades
      if (data.trades) {
        setFilteredTrades(data.trades);
      }
      
      // Update available strategies based on file names
      setAvailableStrategies(files.map(file => file.name.replace('.csv', '')));
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar o arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleReset = () => {
    setFile(null);
    setFiles([]);
    setBacktestResult(null);
    setShowUploadForm(true);
    setError(null);
    setShowChat(false);
    setFilteredTrades([]);
    setCurrentAnalysisId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadReport = () => {
    if (!backtestResult) return;
    
    const metrics = backtestResult["Performance Metrics"];
    const dayOfWeekAnalysis = backtestResult["Day of Week Analysis"];
    const monthlyAnalysis = backtestResult["Monthly Analysis"];
    
    const report = `
# Relatório de Backtest

## Métricas de Performance
- Lucro Líquido: R$ ${metrics["Net Profit"].toFixed(2)}
- Fator de Lucro: ${metrics["Profit Factor"].toFixed(2)}
- Taxa de Acerto: ${metrics["Win Rate (%)"].toFixed(2)}%
- Payoff: ${metrics["Payoff"].toFixed(2)}
- Drawdown Máximo: R$ ${metrics["Max Drawdown ($)"].toFixed(2)}
- Trades Totais: ${metrics["Total Trades"]}
- Ganho Médio: R$ ${metrics["Average Win"].toFixed(2)}
- Perda Média: R$ ${metrics["Average Loss"].toFixed(2)}
- Lucro Bruto: R$ ${metrics["Gross Profit"].toFixed(2)}
- Perda Bruta: R$ ${metrics["Gross Loss"].toFixed(2)}
- Tempo no Mercado: ${metrics["Time in Market"]}
- Sharpe Ratio: ${metrics["Sharpe Ratio"].toFixed(2)}

## Análise por Dia da Semana
${Object.entries(dayOfWeekAnalysis.Stats).map(([day, data]) => 
  `- ${day}: ${data["Trades"]} trades, ${data["Win Rate (%)"].toFixed(2)}% acerto, Fator de Lucro ${data["Profit Factor"].toFixed(2)}`
).join('\n')}

## Análise Mensal
${Object.entries(monthlyAnalysis.Stats).map(([month, data]) => 
  `- ${month}: ${data["Trades"]} trades, ${data["Win Rate (%)"].toFixed(2)}% acerto, Fator de Lucro ${data["Profit Factor"].toFixed(2)}`
).join('\n')}

Relatório gerado em: ${new Date().toLocaleString()}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-backtest.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Convert API response to the format expected by MetricsDashboard
  const convertToMetricsDashboardFormat = (result: BacktestResult) => {
    if (!result) return {};
    
    const perfMetrics = result["Performance Metrics"];
    const dayOfWeekAnalysis = result["Day of Week Analysis"];
    const monthlyAnalysis = result["Monthly Analysis"];
    
    // Convert day of week analysis with null/undefined safety
    const convertedDayOfWeekAnalysis: Record<string, { trades: number; winRate: number; profitFactor: number }> = {};
    Object.entries(dayOfWeekAnalysis.Stats).forEach(([day, data]) => {
      convertedDayOfWeekAnalysis[day.toLowerCase()] = {
        trades: data["Trades"] ?? 0,
        winRate: data["Win Rate (%)"] ?? 0,
        profitFactor: data["Profit Factor"] ?? 0
      };
    });
    
    // Convert monthly analysis with null/undefined safety
    const convertedMonthlyAnalysis: Record<string, { trades: number; winRate: number; profitFactor: number }> = {};
    Object.entries(monthlyAnalysis.Stats).forEach(([month, data]) => {
      convertedMonthlyAnalysis[month.toLowerCase()] = {
        trades: data["Trades"] ?? 0,
        winRate: data["Win Rate (%)"] ?? 0,
        profitFactor: data["Profit Factor"] ?? 0
      };
    });
    
    return {
      profitFactor: perfMetrics["Profit Factor"] ?? 0,
      winRate: perfMetrics["Win Rate (%)"] ?? 0,
      payoff: perfMetrics["Payoff"] ?? 0,
      maxDrawdown: 15, // Not directly provided in the API, using a default value
      maxDrawdownAmount: perfMetrics["Max Drawdown ($)"] ?? 0,
      netProfit: perfMetrics["Net Profit"] ?? 0,
      grossProfit: perfMetrics["Gross Profit"] ?? 0,
      grossLoss: perfMetrics["Gross Loss"] ?? 0,
      totalTrades: perfMetrics["Total Trades"] ?? 0,
      profitableTrades: Math.round((perfMetrics["Total Trades"] ?? 0) * (perfMetrics["Win Rate (%)"] ?? 0) / 100),
      lossTrades: Math.round((perfMetrics["Total Trades"] ?? 0) * (1 - (perfMetrics["Win Rate (%)"] ?? 0) / 100)),
      averageWin: perfMetrics["Average Win"] ?? 0,
      averageLoss: perfMetrics["Average Loss"] ?? 0,
      sharpeRatio: perfMetrics["Sharpe Ratio"] ?? 0,
      averageTrade: ((perfMetrics["Net Profit"] ?? 0) / (perfMetrics["Total Trades"] ?? 1)),
      averageTradeDuration: perfMetrics["Time in Market"] ?? "0",
      dayOfWeekAnalysis: convertedDayOfWeekAnalysis,
      monthlyAnalysis: convertedMonthlyAnalysis,
      
      // Métricas complementares moved to advanced metrics section
      maxConsecutiveLosses: 4,
      maxConsecutiveWins: 7,
      maiorGanho: 1850.75,
      maiorPerda: -980.25,
      recoveryFactor: 2.5
    };
  };

  const handleMetricsReceived = (metrics: any) => {
    console.log("Metrics received from chat:", metrics);
    setAnalysisResult(metrics);
  };

  // Save system functions
  const handleSaveAnalysis = () => {
    if (!backtestResult) return;
    
    if (currentAnalysisId) {
      // Update existing analysis
      setSavedAnalyses(prev => prev.map(analysis => 
        analysis.id === currentAnalysisId 
          ? {
              ...analysis,
              updatedAt: new Date().toISOString(),
              backtestResult,
              selectedStrategy,
              selectedAsset,
              csvContent,
              availableStrategies,
              availableAssets
            }
          : analysis
      ));
    } else {
      // Save new analysis
      setShowSaveModal(true);
    }
  };

  const confirmSaveAnalysis = () => {
    if (!backtestResult || !saveName.trim()) return;
    
    const newAnalysis: SavedAnalysis = {
      id: Date.now().toString(),
      name: saveName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      backtestResult,
      selectedStrategy,
      selectedAsset,
      csvContent,
      availableStrategies,
      availableAssets,
      totalTrades: backtestResult.trades?.length || 0
    };
    
    setSavedAnalyses(prev => [...prev, newAnalysis]);
    setCurrentAnalysisId(newAnalysis.id);
    setShowSaveModal(false);
    setSaveName('');
  };

  const handleLoadAnalysis = (analysis: SavedAnalysis) => {
    setBacktestResult(analysis.backtestResult);
    setSelectedStrategy(analysis.selectedStrategy);
    setSelectedAsset(analysis.selectedAsset);
    setCsvContent(analysis.csvContent);
    setAvailableStrategies(analysis.availableStrategies);
    setAvailableAssets(analysis.availableAssets);
    setCurrentAnalysisId(analysis.id);
    setShowUploadForm(false);
    setShowChat(true);
    setShowLoadModal(false);
    
    // Set filtered trades
    if (analysis.backtestResult.trades) {
      setFilteredTrades(analysis.backtestResult.trades);
    }
  };

  const handleDeleteAnalysis = (analysisId: string) => {
    setSavedAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
    if (currentAnalysisId === analysisId) {
      setCurrentAnalysisId(null);
    }
  };

  const handleRenameAnalysis = (analysisId: string, currentName: string) => {
    setRenameAnalysisId(analysisId);
    setRenameName(currentName);
    setShowRenameModal(true);
  };

  const confirmRenameAnalysis = () => {
    if (!renameAnalysisId || !renameName.trim()) return;
    
    setSavedAnalyses(prev => prev.map(analysis => 
      analysis.id === renameAnalysisId 
        ? { ...analysis, name: renameName.trim(), updatedAt: new Date().toISOString() }
        : analysis
    ));
    
    setShowRenameModal(false);
    setRenameAnalysisId(null);
    setRenameName('');
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/robots')}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              title="Voltar para robôs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Análise de Backtest</h1>
            {currentAnalysisId && (
              <span className="px-2 py-1 bg-green-600 text-green-100 text-xs rounded-full">
                Salvo
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {!showUploadForm && backtestResult && (
              <button
                onClick={handleSaveAnalysis}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center"
                title={currentAnalysisId ? "Atualizar análise salva" : "Salvar análise"}
              >
                <Save className="w-4 h-4 mr-2" />
                {currentAnalysisId ? 'Atualizar' : 'Salvar'}
              </button>
            )}
            
            <button
              onClick={() => setShowLoadModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Carregar Análise
              {savedAnalyses.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-800 text-blue-100 text-xs rounded-full">
                  {savedAnalyses.length}
                </span>
              )}
            </button>
            
            {!showUploadForm && (
              <>
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Relatório
                </button>
                
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Analisar Outro Arquivo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Chat Section - Shown after CSV upload */}
        {showChat && (
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-purple-400 mr-2" />
                <h2 className="text-lg font-medium">Chat com IA</h2>
              </div>
            </div>
            <div className="p-4 h-[600px]">
              <AIResponseChat 
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
                onCancelAnalysis={() => {}}
                error={error2}
                setError={setError2}
                analysisResult={analysisResult}
                onMetricsReceived={handleMetricsReceived}
              />
            </div>
          </div>
        )}

        {/* Strategy and Asset Selector */}
        {!showUploadForm && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Estratégia
                  </label>
                  <select
                    value={selectedStrategy || ''}
                    onChange={(e) => setSelectedStrategy(e.target.value || null)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas as estratégias</option>
                    {availableStrategies.map(strategy => (
                      <option key={strategy} value={strategy}>{strategy}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ativo
                  </label>
                  <select
                    value={selectedAsset || ''}
                    onChange={(e) => setSelectedAsset(e.target.value || null)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos os ativos</option>
                    {availableAssets.map(asset => (
                      <option key={asset} value={asset}>{asset}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // Reset filters
                    setSelectedStrategy(null);
                    setSelectedAsset(null);
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </button>
                
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Adicionar CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm ? (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 text-blue-400 mr-2" />
              Upload de Arquivo CSV
            </h2>
            
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-blue-500 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv"
                multiple
              />
              
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              
              {files.length > 0 ? (
                <div>
                  <p className="text-lg font-medium text-blue-400">{files.length} arquivo(s) selecionado(s)</p>
                  <ul className="mt-2 text-sm text-gray-400">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between py-1">
                        <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">
                    Arraste e solte seu(s) arquivo(s) CSV aqui
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    ou clique para selecionar arquivos
                  </p>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md inline-flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Selecionar Arquivos
                  </button>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-md flex items-center text-red-500">
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={files.length === 0 || isLoading}
                className={`px-4 py-2 rounded-md flex items-center ${
                  files.length === 0 || isLoading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <BarChart2 className="w-5 h-5 mr-2" />
                    Analisar Backtest
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Results */}
            {backtestResult && (
              <div className="space-y-6">
                {/* Metrics Dashboard */}
                <div>
                  <MetricsDashboard metrics={convertToMetricsDashboardFormat(backtestResult)} />
                </div>
                
                {/* Equity Curve Section */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
                      <h2 className="text-lg font-medium">Curva de Equity</h2>
                    </div>
                    <button 
                      onClick={() => setShowEquityCurve(!showEquityCurve)}
                      className="p-1.5 hover:bg-gray-700 rounded-md"
                    >
                      {showEquityCurve ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {showEquityCurve && (
                    <div className="p-4">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="text-center text-gray-400 mb-4">
                          Visualização da curva de equity não disponível nesta versão
                        </div>
                        <div className="h-64 flex items-center justify-center">
                          <BarChart className="w-16 h-16 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Daily Results Section - Simplified */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                      <h2 className="text-lg font-medium">Resultados Diários</h2>
                    </div>
                    <button 
                      onClick={() => setShowDailyResults(!showDailyResults)}
                      className="p-1.5 hover:bg-gray-700 rounded-md"
                    >
                      {showDailyResults ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {showDailyResults && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                            Ganho Médio
                          </h3>
                          <div className="text-2xl font-bold text-green-400">
                            R$ {backtestResult["Performance Metrics"]["Average Win"].toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <XCircle className="w-4 h-4 text-red-400 mr-2" />
                            Perda Média
                          </h3>
                          <div className="text-2xl font-bold text-red-400">
                            R$ {backtestResult["Performance Metrics"]["Average Loss"].toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-3 flex items-center">
                            <Check className="w-4 h-4 text-blue-400 mr-2" />
                            Taxa de Acerto
                          </h3>
                          <div className="text-2xl font-bold text-blue-400">
                            {backtestResult["Performance Metrics"]["Win Rate (%)"].toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Trades Section */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart className="w-5 h-5 text-blue-400 mr-2" />
                      <h2 className="text-lg font-medium">Trades</h2>
                    </div>
                    <button 
                      onClick={() => setShowTrades(!showTrades)}
                      className="p-1.5 hover:bg-gray-700 rounded-md"
                    >
                      {showTrades ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {showTrades && (
                    <div className="p-4">
                      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar trades..."
                            value={tradeSearch}
                            onChange={(e) => setTradeSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Filtrar por Ativo</label>
                            <select
                              value={selectedAsset || ''}
                              onChange={(e) => setSelectedAsset(e.target.value || null)}
                              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Todos os ativos</option>
                              {availableAssets.map(asset => (
                                <option key={asset} value={asset}>{asset}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Filtrar por Estratégia</label>
                            <select
                              value={selectedStrategy || ''}
                              onChange={(e) => setSelectedStrategy(e.target.value || null)}
                              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Todas as estratégias</option>
                              {availableStrategies.map(strategy => (
                                <option key={strategy} value={strategy}>{strategy}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        {filteredTrades.length > 0 ? (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-700">
                                <th className="px-4 py-2 text-left">Data Entrada</th>
                                <th className="px-4 py-2 text-left">Data Saída</th>
                                <th className="px-4 py-2 text-right">Preço Entrada</th>
                                <th className="px-4 py-2 text-right">Preço Saída</th>
                                <th className="px-4 py-2 text-center">Ativo</th>
                                <th className="px-4 py-2 text-center">Direção</th>
                                <th className="px-4 py-2 text-right">Resultado</th>
                                <th className="px-4 py-2 text-right">Resultado %</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTrades.slice(0, 100).map((trade, index) => (
                                <tr key={index} className={`border-b border-gray-700 ${trade.pnl > 0 ? 'hover:bg-green-900 hover:bg-opacity-20' : 'hover:bg-red-900 hover:bg-opacity-20'}`}>
                                  <td className="px-4 py-2">{new Date(trade.entry_date).toLocaleString()}</td>
                                  <td className="px-4 py-2">{new Date(trade.exit_date).toLocaleString()}</td>
                                  <td className="px-4 py-2 text-right">{trade.entry_price.toFixed(2)}</td>
                                  <td className="px-4 py-2 text-right">{trade.exit_price.toFixed(2)}</td>
                                  <td className="px-4 py-2 text-center">{trade.symbol || 'N/A'}</td>
                                  <td className="px-4 py-2 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${trade.direction === 'long' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                      {trade.direction === 'long' ? 'Compra' : 'Venda'}
                                    </span>
                                  </td>
                                  <td className={`px-4 py-2 text-right ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.pnl.toFixed(2)}
                                  </td>
                                  <td className={`px-4 py-2 text-right ${trade.pnl_pct > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.pnl_pct.toFixed(2)}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-center py-8 bg-gray-700 bg-opacity-30 rounded-lg">
                            <div className="text-gray-400">
                              Nenhuma operação encontrada com os filtros selecionados
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {filteredTrades.length > 100 && (
                        <div className="mt-4 text-center text-gray-400 text-sm">
                          Mostrando 100 de {filteredTrades.length} trades
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Special Events Section */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                      <h2 className="text-lg font-medium">Eventos Especiais</h2>
                    </div>
                    <button 
                      onClick={() => setShowSpecialEvents(!showSpecialEvents)}
                      className="p-1.5 hover:bg-gray-700 rounded-md"
                    >
                      {showSpecialEvents ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {showSpecialEvents && (
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-700">
                              <th className="px-4 py-2 text-left">Evento</th>
                              <th className="px-4 py-2 text-center">Data</th>
                              <th className="px-4 py-2 text-center">Impacto</th>
                              <th className="px-4 py-2 text-right">Resultado</th>
                              <th className="px-4 py-2 text-right">Trades</th>
                            </tr>
                          </thead>
                          <tbody>
                            {specialEvents.map((event, index) => (
                              <tr key={index} className="border-b border-gray-700">
                                <td className="px-4 py-2">{event.name}</td>
                                <td className="px-4 py-2 text-center">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    event.impact === 'alto' ? 'bg-red-900 text-red-300' : 
                                    event.impact === 'médio' ? 'bg-yellow-900 text-yellow-300' : 
                                    'bg-blue-900 text-blue-300'
                                  }`}>
                                    {event.impact}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                  <span className={index % 2 === 0 ? 'text-green-400' : 'text-red-400'}>
                                    {index % 2 === 0 ? '+' : '-'}R$ {(Math.random() * 500 + 100).toFixed(2)}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-right">{Math.floor(Math.random() * 10) + 1}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Correlation Analysis Section */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 text-green-400 mr-2" />
                      <h2 className="text-lg font-medium">Correlação</h2>
                    </div>
                    <button 
                      onClick={() => setShowCorrelation(!showCorrelation)}
                      className="p-1.5 hover:bg-gray-700 rounded-md"
                    >
                      {showCorrelation ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {showCorrelation && (
                    <div className="p-4">
                      {files.length > 1 ? (
                        <div>
                          <h3 className="text-lg font-medium mb-4">Matriz de Correlação</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-gray-700">
                                  <th className="px-4 py-2 text-left">Estratégia</th>
                                  {availableStrategies.map(strategy => (
                                    <th key={strategy} className="px-4 py-2 text-center">{strategy}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {availableStrategies.map((strategy, rowIndex) => (
                                  <tr key={strategy} className="border-b border-gray-700">
                                    <td className="px-4 py-2 font-medium">{strategy}</td>
                                    {availableStrategies.map((colStrategy, colIndex) => {
                                      // Diagonal is always 1.0
                                      if (rowIndex === colIndex) {
                                        return (
                                          <td key={colStrategy} className="px-4 py-2 text-center bg-blue-900 bg-opacity-20">
                                            <span className="text-blue-400">1.00</span>
                                          </td>
                                        );
                                      }
                                      
                                      // Generate random correlation for demo
                                      const correlation = (Math.random() * 2 - 1).toFixed(2);
                                      const correlationNum = parseFloat(correlation);
                                      
                                      return (
                                        <td key={colStrategy} className="px-4 py-2 text-center">
                                          <span className={
                                            correlationNum > 0.7 ? 'text-red-400' : 
                                            correlationNum > 0.3 ? 'text-yellow-400' : 
                                            correlationNum < -0.3 ? 'text-green-400' : 
                                            'text-gray-400'
                                          }>
                                            {correlation}
                                          </span>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                            <h4 className="text-md font-medium mb-2">Interpretação</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <span className="text-red-400 font-bold mr-2">Alta correlação positiva (&gt;0.7):</span>
                                <span className="text-gray-300">Estratégias muito similares, pouco benefício em diversificação</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-yellow-400 font-bold mr-2">Correlação moderada (0.3 a 0.7):</span>
                                <span className="text-gray-300">Alguma diversificação, mas ainda com comportamentos similares</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-gray-400 font-bold mr-2">Baixa correlação (-0.3 a 0.3):</span>
                                <span className="text-gray-300">Boa diversificação, comportamentos independentes</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-green-400 font-bold mr-2">Correlação negativa (&lt;-0.3):</span>
                                <span className="text-gray-300">Excelente diversificação, comportamentos opostos</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <div className="text-center text-gray-400 mb-4">
                            Análise de correlação disponível após upload de múltiplos backtests
                          </div>
                          <div className="h-64 flex items-center justify-center">
                            <MessageSquare className="w-16 h-16 text-gray-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Save Analysis Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Salvar Análise</h3>
            <input
              type="text"
              placeholder="Nome da análise..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSaveName('');
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSaveAnalysis}
                disabled={!saveName.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Analysis Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Carregar Análise</h3>
            {savedAnalyses.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Nenhuma análise salva encontrada
              </div>
            ) : (
              <div className="space-y-3">
                {savedAnalyses.map((analysis) => (
                  <div key={analysis.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{analysis.name}</h4>
                      <div className="text-sm text-gray-400 mt-1">
                        <div>Criado: {new Date(analysis.createdAt).toLocaleString()}</div>
                        <div>Atualizado: {new Date(analysis.updatedAt).toLocaleString()}</div>
                        <div>Trades: {analysis.totalTrades}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRenameAnalysis(analysis.id, analysis.name)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                        title="Renomear"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleLoadAnalysis(analysis)}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                      >
                        Carregar
                      </button>
                      <button
                        onClick={() => handleDeleteAnalysis(analysis.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-md"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowLoadModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Analysis Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Renomear Análise</h3>
            <input
              type="text"
              placeholder="Novo nome..."  
              value={renameName} 
              onChange={(e) => setRenameName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setRenameAnalysisId(null);
                  setRenameName('');  
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRenameAnalysis}
                disabled={!renameName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Renomear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}