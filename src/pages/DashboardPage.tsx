import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, Code2, Activity, BookOpen, ShoppingCart, Users, 
  Share2, Heart, MessageCircle, Eye, ChevronDown, ChevronUp,
  Star, Check, ExternalLink, Play, Clock, Award, TrendingUp
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../stores/authStore';

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [activeSection, setActiveSection] = useState('analyses');
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Mock data para análises
  const mockAnalyses = [
    { name: 'Análise WINFUT', date: '15/01/2024', profitFactor: '2.3', winRate: '68', drawdown: '8.5' },
    { name: 'Backtest PETR4', date: '14/01/2024', profitFactor: '1.8', winRate: '72', drawdown: '12.3' },
    { name: 'Grid Strategy', date: '13/01/2024', profitFactor: '2.1', winRate: '65', drawdown: '15.2' },
    { name: 'Scalping M5', date: '12/01/2024', profitFactor: '1.9', winRate: '70', drawdown: '9.8' },
    { name: 'Trend Following', date: '11/01/2024', profitFactor: '2.5', winRate: '63', drawdown: '18.7' },
    { name: 'Mean Reversion', date: '10/01/2024', profitFactor: '2.0', winRate: '69', drawdown: '11.4' }
  ];

  // Mock data para robôs
  const mockRobots = [
    { id: '1', name: 'Scalper Pro', version: 'v2.1.0', profitFactor: '2.3', winRate: '68' },
    { id: '2', name: 'Trend Master', version: 'v1.5.2', profitFactor: '1.8', winRate: '72' },
    { id: '3', name: 'Grid Bot', version: 'v3.0.1', profitFactor: '2.1', winRate: '65' },
    { id: '4', name: 'Mean Reversion', version: 'v1.2.0', profitFactor: '1.9', winRate: '70' },
    { id: '5', name: 'Breakout Hunter', version: 'v2.0.3', profitFactor: '2.5', winRate: '63' },
    { id: '6', name: 'Volatility Rider', version: 'v1.8.1', profitFactor: '2.0', winRate: '69' }
  ];

  // Mock data para posts do feed
  const mockPosts = [
    {
      author: { 
        name: 'Carlos Silva', 
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
        quantScore: 94
      },
      title: 'Nova estratégia de scalping M5',
      content: 'Desenvolvi uma estratégia que está performando muito bem no WINFUT. Compartilho os resultados do backtest.',
      timestamp: '2h atrás',
      likes: 24,
      comments: 8,
      views: 156,
      metrics: { profitFactor: '2.3', winRate: '68', drawdown: '8.5' }
    },
    {
      author: { 
        name: 'Ana Costa', 
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face',
        quantScore: 87
      },
      title: 'Análise de correlação PETR4 x VALE3',
      content: 'Análise detalhada da correlação entre PETR4 e VALE3 nos últimos 6 meses. Resultados surpreendentes!',
      timestamp: '4h atrás',
      likes: 31,
      comments: 12,
      views: 203,
      metrics: { profitFactor: '1.8', winRate: '72', drawdown: '12.3' }
    },
    {
      author: { 
        name: 'Roberto Lima', 
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop&crop=face',
        quantScore: 91
      },
      title: 'Grid trading otimizado',
      content: 'Otimizei meu robô de grid trading e consegui melhorar o profit factor em 40%. Vou compartilhar a estratégia.',
      timestamp: '6h atrás',
      likes: 18,
      comments: 5,
      views: 89,
      metrics: { profitFactor: '2.1', winRate: '65', drawdown: '15.2' }
    },
    {
      author: { 
        name: 'Marina Santos', 
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100&h=100&fit=crop&crop=face',
        quantScore: 88
      },
      title: 'Backtest com trailing stop',
      content: 'Testei diferentes configurações de trailing stop e encontrei a combinação ideal para day trade.',
      timestamp: '8h atrás',
      likes: 27,
      comments: 9,
      views: 134
    }
  ];

  // Mock data para tutoriais
  const mockTutorials = [
    {
      title: 'Como fazer upload de CSV',
      description: 'Aprenda a preparar e fazer upload dos dados de backtest',
      difficulty: 'Iniciante',
      duration: '5 min'
    },
    {
      title: 'Gerar código de robô com IA',
      description: 'Tutorial completo para criar robôs usando assistente de IA',
      difficulty: 'Iniciante',
      duration: '10 min'
    },
    {
      title: 'Como usar no Profit',
      description: 'Configuração e implementação no Profit Chart',
      difficulty: 'Intermediário',
      duration: '15 min'
    },
    {
      title: 'Análise de métricas',
      description: 'Entenda Sharpe Ratio, Drawdown e outras métricas importantes',
      difficulty: 'Avançado',
      duration: '20 min'
    }
  ];

  // Mock data para marketplace
  const mockMarketplace = [
    {
      company: 'QuantBroker',
      description: 'Portfólios de IA copy trade com performance auditada',
      specialty: 'Copy Trade IA Premium',
      rating: 5,
      verified: true,
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=50&h=50&fit=crop',
      link: 'https://quantbroker.com.br'
    },
    {
      company: 'NotBroker',
      description: 'Contabilidade especializada e resultados auditados',
      specialty: 'Auditoria de Resultados',
      rating: 5,
      verified: true,
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?w=50&h=50&fit=crop',
      link: 'https://notbroker.com.br'
    },
    {
      company: 'Estrategista Solutions',
      description: 'Projetos personalizados desenvolvidos por humanos especialistas',
      specialty: 'Robôs Personalizados',
      rating: 5,
      verified: true,
      logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?w=50&h=50&fit=crop',
      link: 'https://profitestrategista.com.br'
    },
    {
      company: 'Pack de Robôs',
      description: 'Coleção completa de robôs testados e otimizados',
      specialty: 'Estrategista Solutions',
      rating: 5,
      verified: true,
      logo: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?w=50&h=50&fit=crop',
      link: 'https://profitestrategista.com.br/robots'
    }
  ];

  // Mock data para usuários
  const mockUsers = [
    {
      name: 'Pedro Oliveira',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
      specialty: 'Especialista em HFT',
      quantScore: 96
    },
    {
      name: 'Julia Ferreira',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face',
      specialty: 'Análise Quantitativa',
      quantScore: 89
    },
    {
      name: 'Lucas Martins',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop&crop=face',
      specialty: 'Grid Trading',
      quantScore: 92
    },
    {
      name: 'Camila Rocha',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100&h=100&fit=crop&crop=face',
      specialty: 'Swing Trading',
      quantScore: 85
    },
    {
      name: 'Rafael Santos',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face',
      specialty: 'Scalping',
      quantScore: 88
    },
    {
      name: 'Fernanda Lima',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
      specialty: 'Arbitragem',
      quantScore: 93
    }
  ];

  useEffect(() => {
    // Set default active section
    setActiveSection('analyses');
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard da Comunidade</h1>
        </div>

        {/* Painel de Navegação */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 max-w-6xl mx-auto">
          {/* Minhas Análises */}
          <button
            onClick={() => setActiveSection('analyses')}
            className={`group relative overflow-hidden rounded-2xl p-8 lg:p-10 transition-all duration-300 ${
              activeSection === 'analyses'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-600/20 hover:to-blue-700/20'
            }`}
          >
            <div className="relative z-10">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center mb-4 ${
                activeSection === 'analyses' ? 'bg-white/20' : 'bg-blue-500/20'
              }`}>
                <BarChart2 className={`w-8 h-8 lg:w-10 lg:h-10 ${
                  activeSection === 'analyses' ? 'text-white' : 'text-blue-400'
                }`} />
              </div>
              <h3 className="font-semibold text-white mb-1 text-lg lg:text-xl">Minhas Análises</h3>
              <p className="text-sm lg:text-base text-gray-300">Backtest</p>
            </div>
          </button>

          {/* Meus Robôs */}
          <button
            onClick={() => setActiveSection('myrobots')}
            className={`group relative overflow-hidden rounded-2xl p-8 lg:p-10 transition-all duration-300 ${
              activeSection === 'myrobots'
                ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-500/25'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-emerald-600/20 hover:to-emerald-700/20'
            }`}
          >
            <div className="relative z-10">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center mb-4 ${
                activeSection === 'myrobots' ? 'bg-white/20' : 'bg-emerald-500/20'
              }`}>
                <Code2 className={`w-8 h-8 lg:w-10 lg:h-10 ${
                  activeSection === 'myrobots' ? 'text-white' : 'text-emerald-400'
                }`} />
              </div>
              <h3 className="font-semibold text-white mb-1 text-lg lg:text-xl">Meus Robôs</h3>
              <p className="text-sm lg:text-base text-gray-300">Gerenciar</p>
            </div>
          </button>

          {/* Feed de Postagens */}
          <button
            onClick={() => setActiveSection('feed')}
            className={`group relative overflow-hidden rounded-2xl p-8 lg:p-10 transition-all duration-300 ${
              activeSection === 'feed'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-600/20 hover:to-blue-700/20'
            }`}
          >
            <div className="relative z-10">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center mb-4 ${
                activeSection === 'feed' ? 'bg-white/20' : 'bg-blue-500/20'
              }`}>
                <Activity className={`w-8 h-8 lg:w-10 lg:h-10 ${
                  activeSection === 'feed' ? 'text-white' : 'text-blue-400'
                }`} />
              </div>
              <h3 className="font-semibold text-white mb-1 text-lg lg:text-xl">Feed</h3>
              <p className="text-sm lg:text-base text-gray-300">Postagens</p>
            </div>
          </button>

          {/* Tutoriais */}
          <button
            onClick={() => setActiveSection('tutorials')}
            className={`group relative overflow-hidden rounded-2xl p-8 lg:p-10 transition-all duration-300 ${
              activeSection === 'tutorials'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-600/20 hover:to-blue-700/20'
            }`}
          >
            <div className="relative z-10">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center mb-4 ${
                activeSection === 'tutorials' ? 'bg-white/20' : 'bg-blue-500/20'
              }`}>
                <BookOpen className={`w-8 h-8 lg:w-10 lg:h-10 ${
                  activeSection === 'tutorials' ? 'text-white' : 'text-blue-400'
                }`} />
              </div>
              <h3 className="font-semibold text-white mb-1 text-lg lg:text-xl">Tutoriais</h3>
              <p className="text-sm lg:text-base text-gray-300">Aprenda</p>
            </div>
          </button>

          {/* Marketplace */}
          <button
            onClick={() => setActiveSection('marketplace')}
            className={`group relative overflow-hidden rounded-2xl p-8 lg:p-10 transition-all duration-300 ${
              activeSection === 'marketplace'
                ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-500/25'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-emerald-600/20 hover:to-emerald-700/20'
            }`}
          >
            <div className="relative z-10">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center mb-4 ${
                activeSection === 'marketplace' ? 'bg-white/20' : 'bg-emerald-500/20'
              }`}>
                <ShoppingCart className={`w-8 h-8 lg:w-10 lg:h-10 ${
                  activeSection === 'marketplace' ? 'text-white' : 'text-emerald-400'
                }`} />
              </div>
              <h3 className="font-semibold text-white mb-1 text-lg lg:text-xl">Marketplace</h3>
              <p className="text-sm lg:text-base text-gray-300">Comprar</p>
            </div>
          </button>

          {/* Usuários */}
          <button
            onClick={() => setActiveSection('users')}
            className={`group relative overflow-hidden rounded-2xl p-8 lg:p-10 transition-all duration-300 ${
              activeSection === 'users'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-600/20 hover:to-blue-700/20'
            }`}
          >
            <div className="relative z-10">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center mb-4 ${
                activeSection === 'users' ? 'bg-white/20' : 'bg-blue-500/20'
              }`}>
                <Users className={`w-8 h-8 lg:w-10 lg:h-10 ${
                  activeSection === 'users' ? 'text-white' : 'text-blue-400'
                }`} />
              </div>
              <h3 className="font-semibold text-white mb-1 text-lg lg:text-xl">Usuários</h3>
              <p className="text-sm lg:text-base text-gray-300">Encontrar</p>
            </div>
          </button>
        </div>

        {/* Conteúdo das Seções */}
        <div className="space-y-6">
          {/* Minhas Análises */}
          {activeSection === 'analyses' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Minhas Análises</h2>
                    <p className="text-gray-400 text-sm">Histórico de análises de backtest</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/backtest-analysis')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Nova Análise
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAnalyses.map((analysis, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{analysis.name}</h3>
                      <span className="text-xs text-gray-400">{analysis.date}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <p className="text-sm font-bold text-green-400">{analysis.profitFactor}</p>
                        <p className="text-xs text-gray-400">P.F.</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-blue-400">{analysis.winRate}%</p>
                        <p className="text-xs text-gray-400">Win</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-red-400">{analysis.drawdown}%</p>
                        <p className="text-xs text-gray-400">DD</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate('/backtest-analysis')}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => {}}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Compartilhar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meus Robôs */}
          {activeSection === 'myrobots' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Meus Robôs</h2>
                    <p className="text-gray-400 text-sm">Gerencie seus robôs de trading</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/robots')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Novo Robô
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockRobots.slice(0, 6).map((robot, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Code2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="font-medium">{robot.name}</h3>
                      </div>
                      <span className="text-xs text-gray-400">{robot.version}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-400">{robot.profitFactor}</p>
                        <p className="text-xs text-gray-400">Profit Factor</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-400">{robot.winRate}%</p>
                        <p className="text-xs text-gray-400">Win Rate</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/editor/${robot.id}`)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {}}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Compartilhar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feed de Postagens */}
          {activeSection === 'feed' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Feed da Comunidade</h2>
                    <p className="text-gray-400 text-sm">Últimas postagens e análises</p>
                  </div>
                </div>
              </div>
              
              {/* Filtros do Feed */}
              <div className="flex space-x-2 mb-6">
                <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium">
                  Todos
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium">
                  Análises
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium">
                  Robôs
                </button>
              </div>
              
              <div className="space-y-4">
                {(showAllPosts ? mockPosts : mockPosts.slice(0, 2)).map((post, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{post.author.name}</h3>
                          <div className="flex items-center space-x-1">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              post.author.quantScore >= 90 ? 'bg-blue-500 text-white' :
                              post.author.quantScore >= 70 ? 'bg-emerald-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>
                              Q
                            </div>
                            <span className={`text-sm font-medium ${
                              post.author.quantScore >= 90 ? 'text-blue-400' :
                              post.author.quantScore >= 70 ? 'text-emerald-400' :
                              'text-gray-400'
                            }`}>
                              {post.author.quantScore}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            post.author.quantScore >= 90 ? 'bg-blue-500/20 text-blue-400' :
                            post.author.quantScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {post.author.quantScore >= 90 ? 'Expert' : post.author.quantScore >= 70 ? 'Pro' : 'Advanced'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{post.timestamp}</p>
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-2">{post.title}</h4>
                    <p className="text-gray-300 mb-3">{post.content}</p>
                    
                    {post.metrics && (
                      <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm font-bold text-green-400">{post.metrics.profitFactor}</p>
                          <p className="text-xs text-gray-400">Profit Factor</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-blue-400">{post.metrics.winRate}%</p>
                          <p className="text-xs text-gray-400">Win Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-red-400">{post.metrics.drawdown}%</p>
                          <p className="text-xs text-gray-400">Drawdown</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <span className="flex items-center space-x-1 text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{post.views}</span>
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium">
                          Análise
                        </button>
                        <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-medium">
                          Robô
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                >
                  {showAllPosts ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Ver Menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Ver Mais Postagens
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Tutoriais */}
          {activeSection === 'tutorials' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Tutoriais</h2>
                  <p className="text-gray-400 text-sm">Aprenda a usar a plataforma</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockTutorials.slice(0, 4).map((tutorial, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tutorial.difficulty === 'Iniciante' ? 'bg-green-500/20' :
                        tutorial.difficulty === 'Intermediário' ? 'bg-yellow-500/20' :
                        'bg-red-500/20'
                      }`}>
                        <BookOpen className={`w-5 h-5 ${
                          tutorial.difficulty === 'Iniciante' ? 'text-green-400' :
                          tutorial.difficulty === 'Intermediário' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{tutorial.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            tutorial.difficulty === 'Iniciante' ? 'bg-green-500/20 text-green-400' :
                            tutorial.difficulty === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {tutorial.difficulty}
                          </span>
                          <span className="text-xs text-gray-400">{tutorial.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4">{tutorial.description}</p>
                    
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors">
                      Assistir Tutorial
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketplace */}
          {activeSection === 'marketplace' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Marketplace</h2>
                  <p className="text-gray-400 text-sm">Serviços e produtos especializados</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockMarketplace.slice(0, 4).map((item, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <img src={item.logo} alt={item.company} className="w-8 h-8 rounded" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{item.company}</h3>
                          {item.verified && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${
                              i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                            }`} />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">({item.rating})</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                    <p className="text-xs text-emerald-400 mb-4">{item.specialty}</p>
                    
                    <button 
                      onClick={() => window.open(item.link, '_blank')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      Acessar Serviço
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Usuários */}
          {activeSection === 'users' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Encontrar Usuários</h2>
                  <p className="text-gray-400 text-sm">Conecte-se com outros traders</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockUsers.slice(0, 6).map((user, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3 mb-2">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{user.name}</h3>
                          <div className="flex items-center space-x-1">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              user.quantScore >= 90 ? 'bg-blue-500 text-white' :
                              user.quantScore >= 70 ? 'bg-emerald-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>
                              Q
                            </div>
                            <span className={`text-sm font-medium ${
                              user.quantScore >= 90 ? 'text-blue-400' :
                              user.quantScore >= 70 ? 'text-emerald-400' :
                              'text-gray-400'
                            }`}>
                              {user.quantScore}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            user.quantScore >= 90 ? 'bg-blue-500/20 text-blue-400' :
                            user.quantScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {user.quantScore >= 90 ? 'Expert' : user.quantScore >= 70 ? 'Pro' : 'Advanced'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{user.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors">
                        Análise
                      </button>
                      <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors">
                        Robô
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}