// Mock data for dashboard sections

export const mockAnalyses = [
  {
    id: '1',
    name: 'Estratégia Scalping WINFUT',
    type: 'Backtest',
    profitFactor: 1.85,
    winRate: 62.5,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Grid Trading PETR4',
    type: 'Análise',
    profitFactor: 1.42,
    winRate: 58.3,
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    name: 'Trend Following VALE3',
    type: 'Backtest',
    profitFactor: 2.15,
    winRate: 45.8,
    createdAt: '2024-01-13T09:15:00Z'
  }
];

export const mockRankingAnalyses = [
  {
    id: '1',
    name: 'Estratégia Alpha Supreme',
    profitFactor: 3.25,
    winRate: 72.4,
    rank: 1,
    author: 'TradingMaster'
  },
  {
    id: '2',
    name: 'Momentum Breakout Pro',
    profitFactor: 2.89,
    winRate: 68.1,
    rank: 2,
    author: 'QuantTrader'
  },
  {
    id: '3',
    name: 'Mean Reversion Elite',
    profitFactor: 2.67,
    winRate: 65.3,
    rank: 3,
    author: 'AlgoExpert'
  },
  {
    id: '4',
    name: 'Volatility Hunter',
    profitFactor: 2.45,
    winRate: 61.7,
    rank: 4,
    author: 'RiskManager'
  }
];

export const mockTutorials = [
  {
    id: '1',
    title: 'Introdução ao Trading Algorítmico',
    description: 'Aprenda os conceitos básicos do trading automatizado',
    duration: '15 min',
    author: 'DevHub Team',
    difficulty: 'Iniciante',
    thumbnail: ''
  },
  {
    id: '2',
    title: 'Criando sua Primeira Estratégia',
    description: 'Passo a passo para desenvolver uma estratégia de trading',
    duration: '25 min',
    author: 'Expert Trader',
    difficulty: 'Intermediário',
    thumbnail: ''
  },
  {
    id: '3',
    title: 'Análise de Backtest Avançada',
    description: 'Como interpretar métricas e otimizar estratégias',
    duration: '35 min',
    author: 'Quant Analyst',
    difficulty: 'Avançado',
    thumbnail: ''
  }
];

export const mockMarketplace = [
  {
    id: '1',
    name: 'Profit Estratégias',
    description: 'Especialistas em estratégias para plataforma Profit',
    rating: 4.8,
    strategies: 25,
    price: 'R$ 299',
    logo: ''
  },
  {
    id: '2',
    name: 'MetaTrader Solutions',
    description: 'Robôs otimizados para MetaTrader 4 e 5',
    rating: 4.6,
    strategies: 18,
    price: 'R$ 199',
    logo: ''
  },
  {
    id: '3',
    name: 'Quant Strategies',
    description: 'Estratégias quantitativas de alta performance',
    rating: 4.9,
    strategies: 12,
    price: 'R$ 499',
    logo: ''
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'Carlos Silva',
    location: 'São Paulo, SP',
    rating: 4.7,
    strategies: 8,
    avatar: '',
    specialty: 'Scalping Expert'
  },
  {
    id: '2',
    name: 'Ana Costa',
    location: 'Rio de Janeiro, RJ',
    rating: 4.9,
    strategies: 12,
    avatar: '',
    specialty: 'Swing Trading'
  },
  {
    id: '3',
    name: 'Pedro Santos',
    location: 'Belo Horizonte, MG',
    rating: 4.5,
    strategies: 6,
    avatar: '',
    specialty: 'Grid Trading'
  },
  {
    id: '4',
    name: 'Maria Oliveira',
    location: 'Porto Alegre, RS',
    rating: 4.8,
    strategies: 15,
    avatar: '',
    specialty: 'Arbitragem'
  }
];