import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Shield, TrendingUp, Users, MessageSquare, 
  Star, Download, Eye, Copy, ExternalLink, Phone,
  BarChart2, Target, Clock, DollarSign, CheckCircle,
  Filter, Search, ChevronDown, Play, Pause, Settings,
  User, Crown, Zap, Bot, Activity, Calendar, ArrowRight
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../stores/authStore';

interface VerifiedRobot {
  id: string;
  name: string;
  description: string;
  category: 'scalping' | 'swing' | 'day-trade' | 'arbitragem';
  market: string;
  timeframe: string;
  profitFactor: number;
  winRate: number;
  maxDrawdown: number;
  monthlyReturn: number;
  price: number;
  downloads: number;
  rating: number;
  verified: boolean;
  author: string;
  lastUpdate: string;
  tags: string[];
  image?: string;
}

interface CopyTrader {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  totalReturn: number;
  winRate: number;
  followers: number;
  monthlyFee: number;
  verified: boolean;
  performance: {
    month: string;
    return: number;
  }[];
  description: string;
}

interface CustomStrategy {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  deliveryTime: string;
  examples: string[];
}

export function VerifiedStrategiesPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'robots' | 'copy-trade' | 'custom'>('robots');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'scalping' | 'swing' | 'day-trade' | 'arbitragem'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'return' | 'price'>('popular');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  // Mock data for verified robots
  const [verifiedRobots] = useState<VerifiedRobot[]>([
    {
      id: '1',
      name: 'Scalper Pro WINFUT',
      description: 'Robô de scalping otimizado para mini índice com alta frequência de operações e baixo drawdown.',
      category: 'scalping',
      market: 'WINFUT',
      timeframe: 'M1',
      profitFactor: 2.45,
      winRate: 68.5,
      maxDrawdown: 8.2,
      monthlyReturn: 12.8,
      price: 497,
      downloads: 1247,
      rating: 4.8,
      verified: true,
      author: 'Profit Estrategista',
      lastUpdate: '2024-01-15',
      tags: ['scalping', 'hft', 'mini-indice', 'intraday'],
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Trend Master PETR4',
      description: 'Estratégia de swing trade para ações com foco em tendências de médio prazo.',
      category: 'swing',
      market: 'PETR4',
      timeframe: 'H4',
      profitFactor: 1.85,
      winRate: 72.3,
      maxDrawdown: 15.1,
      monthlyReturn: 8.4,
      price: 297,
      downloads: 892,
      rating: 4.6,
      verified: true,
      author: 'Quant Analytics',
      lastUpdate: '2024-01-12',
      tags: ['swing', 'acoes', 'tendencia', 'petroleo'],
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Arbitrage USDBRL',
      description: 'Robô de arbitragem para câmbio com execução automática de oportunidades.',
      category: 'arbitragem',
      market: 'USDBRL',
      timeframe: 'M5',
      profitFactor: 3.12,
      winRate: 89.2,
      maxDrawdown: 4.5,
      monthlyReturn: 15.6,
      price: 897,
      downloads: 456,
      rating: 4.9,
      verified: true,
      author: 'FX Master',
      lastUpdate: '2024-01-10',
      tags: ['arbitragem', 'forex', 'dolar', 'automatico'],
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop'
    }
  ]);

  // Mock data for copy traders
  const [copyTraders] = useState<CopyTrader[]>([
    {
      id: '1',
      name: 'Carlos Mendes',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      specialty: 'Day Trade Mini Índice',
      totalReturn: 245.8,
      winRate: 74.2,
      followers: 1247,
      monthlyFee: 197,
      verified: true,
      description: 'Especialista em day trade com 8 anos de experiência. Foco em mini índice e operações de curto prazo.',
      performance: [
        { month: 'Jan', return: 12.5 },
        { month: 'Fev', return: 8.3 },
        { month: 'Mar', return: 15.7 },
        { month: 'Abr', return: 9.2 },
        { month: 'Mai', return: 18.4 },
        { month: 'Jun', return: 11.8 }
      ]
    },
    {
      id: '2',
      name: 'Ana Silva',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      specialty: 'Swing Trade Ações',
      totalReturn: 189.3,
      winRate: 68.9,
      followers: 892,
      monthlyFee: 147,
      verified: true,
      description: 'Gestora de fundos com foco em swing trade de ações. Estratégias baseadas em análise fundamentalista.',
      performance: [
        { month: 'Jan', return: 7.2 },
        { month: 'Fev', return: 11.8 },
        { month: 'Mar', return: 9.5 },
        { month: 'Abr', return: 13.1 },
        { month: 'Mai', return: 6.7 },
        { month: 'Jun', return: 14.3 }
      ]
    },
    {
      id: '3',
      name: 'Pedro Santos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      specialty: 'Forex & Commodities',
      totalReturn: 312.4,
      winRate: 71.6,
      followers: 2156,
      monthlyFee: 297,
      verified: true,
      description: 'Trader profissional especializado em forex e commodities. Estratégias quantitativas avançadas.',
      performance: [
        { month: 'Jan', return: 16.8 },
        { month: 'Fev', return: 12.4 },
        { month: 'Mar', return: 19.2 },
        { month: 'Abr', return: 8.9 },
        { month: 'Mai', return: 21.7 },
        { month: 'Jun', return: 15.3 }
      ]
    }
  ]);

  // Mock data for custom strategies
  const [customStrategies] = useState<CustomStrategy[]>([
    {
      id: '1',
      title: 'Robôs Prontos',
      description: 'Adquira robôs de trading já configurados e prontos para operar em diversos mercados.',
      features: ['Resultados comprovados', 'Suporte técnico', 'Atualizações gratuitas', 'Documentação completa'],
      price: 'A partir de R$ 297',
      deliveryTime: 'Imediato',
      examples: ['Scalper WINFUT', 'Swing PETR4', 'Grid USDBRL', 'Breakout VALE3']
    },
    {
      id: '2',
      title: 'Copy Trade',
      description: 'Copie automaticamente as operações dos melhores traders da plataforma e lucre junto.',
      features: ['Sem conhecimento técnico', 'Execução automática', 'Traders verificados', 'Relatórios detalhados'],
      price: 'A partir de R$ 147/mês',
      deliveryTime: 'Ativação em 24h',
      examples: ['Day Trade', 'Swing Trade', 'Forex', 'Commodities']
    },
    {
      id: '3',
      title: 'Estratégias Personalizadas',
      description: 'Solicite o desenvolvimento de estratégias sob medida para suas necessidades específicas.',
      features: ['Suporte dedicado', 'Desenvolvimento exclusivo', 'Backtests inclusos', 'Otimização contínua'],
      price: 'A partir de R$ 1.997',
      deliveryTime: '7-15 dias úteis',
      examples: ['HFT Personalizado', 'Multi-Asset', 'Risk Parity', 'Market Making']
    }
  ]);

  const handleContactSpecialist = (service: string) => {
    setSelectedService(service);
    setShowContactModal(true);
  };

  const handleWhatsAppContact = (service: string) => {
    const messages = {
      'robots': 'Olá vim do DevHub Trader e quero mais informações sobre robôs prontos verificados',
      'copy-trade': 'Olá vim do DevHub Trader e quero mais informações sobre copy trade premium',
      'custom': 'Olá vim do DevHub Trader e quero mais informações sobre estratégias personalizadas',
      'general': 'Olá vim do DevHub Trader e quero mais informações sobre estratégias verificadas'
    };
    
    const message = messages[service as keyof typeof messages] || messages.general;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511975333355?text=${encodedMessage}`, '_blank');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scalping': return 'bg-red-900 text-red-300';
      case 'swing': return 'bg-blue-900 text-blue-300';
      case 'day-trade': return 'bg-green-900 text-green-300';
      case 'arbitragem': return 'bg-purple-900 text-purple-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredRobots = verifiedRobots.filter(robot => {
    const matchesSearch = robot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         robot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         robot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || robot.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'return': return b.monthlyReturn - a.monthlyReturn;
      case 'price': return a.price - b.price;
      default: return b.downloads - a.downloads;
    }
  });

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <Award className="w-10 h-10 text-yellow-500 mr-3" />
            Estratégias Verificadas
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Robôs prontos para todos os perfis. Acesse nossa plataforma completa com dezenas de robôs prontos para uso, estratégias testadas e sistema de copy trade.
          </p>
          <button
            onClick={() => handleWhatsAppContact('general')}
            className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-lg flex items-center mx-auto"
          >
            Comece a operar em minutos
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('robots')}
            className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center ${
              activeTab === 'robots' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bot className="w-5 h-5 mr-2" />
            Robôs Verificados
          </button>
          <button
            onClick={() => setActiveTab('copy-trade')}
            className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center ${
              activeTab === 'copy-trade' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy Trade Premium
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center ${
              activeTab === 'custom' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 mr-2" />
            Estratégias Personalizadas
          </button>
        </div>

        {/* Verified Robots Tab */}
        {activeTab === 'robots' && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar robôs por nome, mercado ou tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="scalping">Scalping</option>
                  <option value="swing">Swing Trade</option>
                  <option value="day-trade">Day Trade</option>
                  <option value="arbitragem">Arbitragem</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Mais Populares</option>
                  <option value="rating">Melhor Avaliação</option>
                  <option value="return">Maior Retorno</option>
                  <option value="price">Menor Preço</option>
                </select>
              </div>
            </div>

            {/* Verification Banner */}
            <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-12 h-12 text-green-400 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Robôs Verificados</h2>
                    <p className="text-green-100">
                      Todos os robôs são testados e verificados pela nossa equipe para garantir qualidade e segurança.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleWhatsAppContact('robots')}
                  className="px-6 py-3 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100"
                >
                  Fale com um especialista
                </button>
              </div>
            </div>

            {/* Robots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRobots.map((robot) => (
                <div key={robot.id} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                  {/* Robot Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
                    {robot.image && (
                      <img 
                        src={robot.image} 
                        alt={robot.name}
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      {robot.verified && (
                        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verificado
                        </div>
                      )}
                      <div className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(robot.category)}`}>
                        {robot.category}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center bg-black bg-opacity-50 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-white text-xs">{robot.rating}</span>
                    </div>
                  </div>

                  {/* Robot Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{robot.name}</h3>
                        <p className="text-sm text-gray-400">{robot.market} • {robot.timeframe}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{formatCurrency(robot.price)}</div>
                        <div className="text-xs text-gray-400">{robot.downloads} downloads</div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{robot.description}</p>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Profit Factor</div>
                        <div className="text-lg font-bold text-green-400">{robot.profitFactor}</div>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                        <div className="text-lg font-bold text-blue-400">{robot.winRate}%</div>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Max Drawdown</div>
                        <div className="text-lg font-bold text-red-400">{robot.maxDrawdown}%</div>
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Retorno Mensal</div>
                        <div className="text-lg font-bold text-yellow-400">{robot.monthlyReturn}%</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {robot.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleWhatsAppContact('robots')}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
                      >
                        Contato
                      </button>
                      <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Copy Trade Tab */}
        {activeTab === 'copy-trade' && (
          <>
            {/* Copy Trade Banner */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 mb-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Copy Trade Premium</h2>
                <p className="text-xl text-purple-100 mb-6">
                  Copie as operações dos melhores traders da plataforma e obtenha resultados consistentes sem precisar operar.
                </p>
                <button
                  onClick={() => handleWhatsAppContact('copy-trade')}
                  className="px-8 py-3 bg-white text-purple-900 rounded-md font-bold text-lg hover:bg-gray-100"
                >
                  Conhecer Copy Trade
                </button>
              </div>
            </div>

            {/* Traders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {copyTraders.map((trader) => (
                <div key={trader.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  {/* Trader Header */}
                  <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img src={trader.avatar} alt={trader.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-bold">{trader.name}</h3>
                          {trader.verified && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                        <p className="text-purple-200">{trader.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">+{trader.totalReturn}%</div>
                        <div className="text-xs text-purple-200">Retorno Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{trader.winRate}%</div>
                        <div className="text-xs text-purple-200">Win Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">{trader.followers}</div>
                        <div className="text-xs text-purple-200">Seguidores</div>
                      </div>
                    </div>
                  </div>

                  {/* Trader Details */}
                  <div className="p-6">
                    <p className="text-gray-300 text-sm mb-4">{trader.description}</p>
                    
                    {/* Performance Chart */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Performance (6 meses)</h4>
                      <div className="flex items-end space-x-1 h-16">
                        {trader.performance.map((perf, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-blue-600 rounded-t"
                              style={{ height: `${(perf.return / 25) * 100}%` }}
                            />
                            <div className="text-xs text-gray-400 mt-1">{perf.month}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-700 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold">{formatCurrency(trader.monthlyFee)}</div>
                          <div className="text-xs text-gray-400">por mês</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-400">Taxa de sucesso</div>
                          <div className="text-xs text-gray-400">Sem taxa de performance</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleWhatsAppContact('copy-trade')}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium"
                      >
                        Copiar Trader
                      </button>
                      <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Custom Strategies Tab */}
        {activeTab === 'custom' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {customStrategies.map((strategy) => (
                <div key={strategy.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        {strategy.id === '1' && <Bot className="w-8 h-8" />}
                        {strategy.id === '2' && <Copy className="w-8 h-8" />}
                        {strategy.id === '3' && <Settings className="w-8 h-8" />}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{strategy.title}</h3>
                      <p className="text-gray-400 text-sm">{strategy.description}</p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Características:</h4>
                      <ul className="space-y-2">
                        {strategy.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Examples */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Exemplos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {strategy.examples.map((example, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-700 p-4 rounded-lg mb-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400 mb-1">{strategy.price}</div>
                        <div className="text-xs text-gray-400">Entrega: {strategy.deliveryTime}</div>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => handleWhatsAppContact('custom')}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium"
                    >
                      {strategy.id === '3' ? 'Solicitar' : 'Contato'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Precisa de algo específico?</h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Nossa equipe de desenvolvedores pode criar estratégias personalizadas para suas necessidades específicas. 
                Entre em contato e conte-nos sobre seus objetivos de trading.
              </p>
              <button
                onClick={() => handleWhatsAppContact('custom')}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-md font-bold text-lg"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-100">
                Falar com Especialista
              </h2>
              <p className="mt-2 text-gray-400">
                Entre em contato via WhatsApp para mais informações sobre {selectedService}
              </p>
            </div>

            <button
              onClick={() => {
                handleWhatsAppContact(selectedService);
                setShowContactModal(false);
              }}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md font-medium flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Abrir WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}