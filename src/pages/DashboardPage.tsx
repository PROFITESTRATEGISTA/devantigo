import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Share2, Search, Plus, Trophy, 
  BarChart2, Code2, Eye, Download, UserPlus,
  Filter, TrendingUp, Clock, Award, Zap, Target,
  CheckCircle, Calendar, FileText, Bot, Coins,
  ArrowRight, Play, ExternalLink, Send, Gift,
  Activity, Layers, Grid, Sparkles, ChevronRight,
  Star, Shield, BookOpen, ShoppingCart, UserCheck,
  Briefcase, Calculator, Wrench, GraduationCap,
  MessageCircle, Heart, ThumbsUp, Bookmark,
  Upload, FileSpreadsheet, TrendingDown, Copy,
  Settings, Lightbulb, Video, FileDown, HelpCircle,
  Building, Verified, Crown, ChevronDown, MoreHorizontal
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

interface CommunityPost {
  id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  type: 'analysis' | 'robot';
  likes: number;
  views: number;
  created_at: string;
  robot_name?: string;
  analysis_id?: string;
  profit_factor?: number;
  win_rate?: number;
  quantscore?: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  completed: boolean;
  deadline?: string;
  category: 'creation' | 'analysis' | 'community' | 'performance';
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  robots: number;
  analyses: number;
  followers: number;
  isFollowing: boolean;
  quantscore: number;
  last_active: string;
  reputation_level: string;
}

interface Expert {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  rating: number;
  reviews: number;
  hourly_rate: number;
  available: boolean;
  quantscore: number;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'upload' | 'coding' | 'analysis' | 'platform';
  thumbnail?: string;
}

interface MarketplaceItem {
  id: string;
  company_name: string;
  logo?: string;
  description: string;
  verified: boolean;
  rating: number;
  services: string[];
  contact_info: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [activeSection, setActiveSection] = useState<'feed' | 'strategies' | 'tutorials' | 'marketplace' | 'experts'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'analysis' | 'robot'>('all');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [postsToShow, setPostsToShow] = useState(3);

  // Mock data for demonstration
  useEffect(() => {
    // Mock community posts
    setPosts([
      {
        id: '1',
        user_name: 'Carlos Quant',
        user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        content: 'Estratégia de arbitragem estatística com correlação PETR4/VALE3. Sharpe 2.1, Max DD 8.5%',
        type: 'analysis',
        likes: 42,
        views: 287,
        created_at: '2024-01-15T10:30:00Z',
        analysis_id: 'analysis_001',
        profit_factor: 2.3,
        win_rate: 68.5,
        quantscore: 94
      },
      {
        id: '2',
        user_name: 'Ana Dev',
        user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        content: 'Robô HFT para mini índice com latência <2ms. Implementação em NTSL otimizada.',
        type: 'robot',
        likes: 35,
        views: 156,
        created_at: '2024-01-14T15:45:00Z',
        robot_name: 'HFT_MiniIndice_v2',
        quantscore: 87
      },
      {
        id: '3',
        user_name: 'Pedro Algo',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        content: 'Machine Learning aplicado a mean reversion. Modelo XGBoost com 72% de precisão.',
        type: 'analysis',
        likes: 28,
        views: 198,
        created_at: '2024-01-13T09:15:00Z',
        analysis_id: 'analysis_002',
        profit_factor: 1.8,
        win_rate: 72.3,
        quantscore: 91
      },
      {
        id: '4',
        user_name: 'Marina Sys',
        user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        content: 'Grid trading adaptativo com gestão dinâmica de risco. Backtested em 2 anos de dados.',
        type: 'robot',
        likes: 19,
        views: 89,
        created_at: '2024-01-12T16:20:00Z',
        robot_name: 'GridTrading_Dynamic',
        quantscore: 83
      },
      {
        id: '5',
        user_name: 'Lucas Tech',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        content: 'Análise de correlação multi-timeframe para WINFUT. Identificação de padrões sazonais.',
        type: 'analysis',
        likes: 31,
        views: 145,
        created_at: '2024-01-11T11:45:00Z',
        analysis_id: 'analysis_003',
        profit_factor: 2.1,
        win_rate: 65.8,
        quantscore: 96
      }
    ]);

    // Mock challenges
    setChallenges([
      {
        id: '1',
        title: 'Primeiro Deploy',
        description: 'Crie e publique seu primeiro robô na plataforma',
        reward: 500,
        difficulty: 'easy',
        progress: 100,
        completed: true,
        category: 'creation'
      },
      {
        id: '2',
        title: 'Análise Quantitativa',
        description: 'Complete uma análise de backtest com Sharpe > 1.5',
        reward: 1500,
        difficulty: 'medium',
        progress: 0,
        completed: false,
        category: 'analysis'
      },
      {
        id: '3',
        title: 'Mentor da Comunidade',
        description: 'Receba 50 curtidas em seus posts',
        reward: 2000,
        difficulty: 'hard',
        progress: 60,
        completed: false,
        category: 'community'
      }
    ]);

    // Mock users
    setUsers([
      {
        id: '1',
        name: 'Carlos Quant',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        specialty: 'Quantitative Analysis',
        robots: 24,
        analyses: 18,
        followers: 156,
        isFollowing: false,
        quantscore: 94,
        last_active: '2h ago',
        reputation_level: 'Expert'
      },
      {
        id: '2',
        name: 'Ana Dev',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        specialty: 'HFT Development',
        robots: 31,
        analyses: 12,
        followers: 203,
        isFollowing: true,
        quantscore: 87,
        last_active: '1h ago',
        reputation_level: 'Pro'
      }
    ]);

    // Mock experts
    setExperts([
      {
        id: '1',
        name: 'João Contador',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        specialty: 'Contabilidade Trader',
        rating: 4.9,
        reviews: 127,
        hourly_rate: 150,
        available: true,
        quantscore: 96
      },
      {
        id: '2',
        name: 'Maria Dev',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        specialty: 'Desenvolvedor Trader',
        rating: 4.8,
        reviews: 89,
        hourly_rate: 200,
        available: true,
        quantscore: 92
      }
    ]);

    // Mock tutorials
    setTutorials([
      {
        id: '1',
        title: 'Como fazer upload de CSV para análise',
        description: 'Aprenda a preparar e fazer upload dos seus dados de backtest',
        duration: '8 min',
        difficulty: 'beginner',
        category: 'upload'
      },
      {
        id: '2',
        title: 'Gerando código de robô com IA',
        description: 'Tutorial completo para criar robôs usando assistente de IA',
        duration: '15 min',
        difficulty: 'beginner',
        category: 'coding'
      },
      {
        id: '3',
        title: 'Configurando robô no Profit',
        description: 'Passo a passo para implementar seu robô na plataforma Profit',
        duration: '12 min',
        difficulty: 'intermediate',
        category: 'platform'
      },
      {
        id: '4',
        title: 'Análise avançada de métricas',
        description: 'Como interpretar Sharpe, Drawdown, Profit Factor e outras métricas',
        duration: '20 min',
        difficulty: 'advanced',
        category: 'analysis'
      },
      {
        id: '5',
        title: 'Dicas de otimização de estratégias',
        description: 'Técnicas para melhorar performance e reduzir riscos',
        duration: '18 min',
        difficulty: 'intermediate',
        category: 'analysis'
      }
    ]);

    // Mock marketplace items
    setMarketplaceItems([
      {
        id: '1',
        company_name: 'TradeTech Solutions',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        description: 'Especialistas em desenvolvimento de robôs HFT e algoritmos quantitativos',
        verified: true,
        rating: 4.9,
        services: ['Desenvolvimento de Robôs', 'Consultoria Quantitativa', 'Backtesting'],
        contact_info: 'contato@tradetech.com'
      },
      {
        id: '2',
        company_name: 'QuantAlpha Partners',
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
        description: 'Gestora especializada em estratégias algorítmicas e copy trading',
        verified: true,
        rating: 4.8,
        services: ['Copy Trading', 'Gestão de Portfólio', 'Análise de Risco'],
        contact_info: 'info@quantalpha.com'
      },
      {
        id: '3',
        company_name: 'AlgoTrader Pro',
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
        description: 'Plataforma de trading algorítmico com IA avançada',
        verified: true,
        rating: 4.7,
        services: ['IA Trading', 'Machine Learning', 'Automação'],
        contact_info: 'support@algotrader.pro'
      }
    ]);
  }, []);

  const handleViewAnalysis = (analysisId: string) => {
    navigate(`/backtest-analysis?analysis=${analysisId}`);
  };

  const handleViewRobot = (robotName: string) => {
    navigate(`/robots`);
  };

  const handleShareRobotWithUser = (userId: string) => {
    console.log(`Sharing robot with user ${userId}`);
  };

  const handleShareAnalysisWithUser = (userId: string) => {
    console.log(`Sharing analysis with user ${userId}`);
  };

  const handleFollowUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            isFollowing: !user.isFollowing, 
            followers: user.isFollowing ? user.followers - 1 : user.followers + 1 
          }
        : user
    ));
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'agora';
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'hard': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'creation': return <Code2 className="w-4 h-4" />;
      case 'analysis': return <BarChart2 className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getQuantScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getReputationBadge = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Pro': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTutorialIcon = (category: string) => {
    switch (category) {
      case 'upload': return <Upload className="w-5 h-5" />;
      case 'coding': return <Code2 className="w-5 h-5" />;
      case 'analysis': return <BarChart2 className="w-5 h-5" />;
      case 'platform': return <Settings className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTutorialColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400';
      case 'intermediate': return 'bg-blue-500/20 text-blue-400';
      case 'advanced': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.user_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || post.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedPosts = showAllPosts ? filteredPosts : filteredPosts.slice(0, postsToShow);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Community Hub
            </h1>
            <p className="text-gray-400 mt-1">Conecte-se, compartilhe e evolua com a comunidade</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/backtest-analysis')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Nova Análise</span>
            </button>
            <button
              onClick={() => navigate('/robots')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <Code2 className="w-4 h-4" />
              <span>Novo Robô</span>
            </button>
          </div>
        </div>

        {/* Navigation Cards - Mobile Style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveSection('strategies')}
            className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'strategies' 
                ? 'bg-gradient-to-br from-emerald-600/20 to-emerald-600/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-2 sm:p-3 rounded-xl mb-2 sm:mb-3 ${
                activeSection === 'strategies' ? 'bg-emerald-500/20' : 'bg-gray-700/50'
              }`}>
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">Estratégias</h3>
              <p className="text-xs text-gray-400 mt-1">Verificadas</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('feed')}
            className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'feed' 
                ? 'bg-gradient-to-br from-blue-600/20 to-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-2 sm:p-3 rounded-xl mb-2 sm:mb-3 ${
                activeSection === 'feed' ? 'bg-blue-500/20' : 'bg-gray-700/50'
              }`}>
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">Feed</h3>
              <p className="text-xs text-gray-400 mt-1">Postagens</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('tutorials')}
            className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'tutorials' 
                ? 'bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-2 sm:p-3 rounded-xl mb-2 sm:mb-3 ${
                activeSection === 'tutorials' ? 'bg-blue-500/20' : 'bg-gray-700/50'
              }`}>
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">Tutoriais</h3>
              <p className="text-xs text-gray-400 mt-1">Aprenda</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('marketplace')}
            className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'marketplace' 
                ? 'bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-2 sm:p-3 rounded-xl mb-2 sm:mb-3 ${
                activeSection === 'marketplace' ? 'bg-emerald-500/20' : 'bg-gray-700/50'
              }`}>
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">Marketplace</h3>
              <p className="text-xs text-gray-400 mt-1">Comprar</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('experts')}
            className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 col-span-2 sm:col-span-1 ${
              activeSection === 'experts' 
                ? 'bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-2 sm:p-3 rounded-xl mb-2 sm:mb-3 ${
                activeSection === 'experts' ? 'bg-blue-500/20' : 'bg-gray-700/50'
              }`}>
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm">Especialistas</h3>
              <p className="text-xs text-gray-400 mt-1">Encontrar</p>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeSection === 'feed' ? 'Buscar análises, robôs ou usuários...' :
                activeSection === 'experts' ? 'Buscar especialistas...' :
                activeSection === 'tutorials' ? 'Buscar tutoriais...' :
                'Buscar...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Content based on active section */}
        {activeSection === 'strategies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pack de Robôs Parceiro */}
              <div className="bg-gradient-to-br from-emerald-900/80 to-emerald-800/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-500/20 rounded-xl p-3 mr-4">
                    <Bot className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-400">Pack de Robôs</h3>
                    <p className="text-emerald-300/80">Parceiro DevHub Trader</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Robôs verificados e testados pela nossa equipe de especialistas. Estratégias comprovadas no mercado.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-400 font-bold">15+ Robôs</span>
                  <div className="flex items-center">
                    <Verified className="w-4 h-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 text-sm">Verificado</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.open('https://profitestrategista.com.br/robots', '_blank')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Acessar Pack
                </button>
              </div>

              {/* Copy Trade IA Premium */}
              <div className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/20 rounded-xl p-3 mr-4">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400">Copy Trade IA</h3>
                    <p className="text-blue-300/80">Premium</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Sistema de copy trading com inteligência artificial. Replique estratégias dos melhores traders automaticamente.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-400 font-bold">IA Avançada</span>
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-blue-400 text-sm">Premium</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all duration-200">
                  Conhecer Serviço
                </button>
              </div>

              {/* Robô Personalizado */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-500/30 hover:border-gray-400/50 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-500/20 rounded-xl p-3 mr-4">
                    <Wrench className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-300">Robô Personalizado</h3>
                    <p className="text-gray-400">Sob Medida</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Desenvolvimento de robôs personalizados para suas necessidades específicas. Consultoria completa incluída.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 font-bold">Consultoria</span>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-400 text-sm">Personalizado</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-gray-600 hover:bg-gray-700 rounded-xl text-white font-medium transition-all duration-200">
                  Solicitar Orçamento
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'tutorials' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <div key={tutorial.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500/20 rounded-xl p-3 mr-4">
                      {getTutorialIcon(tutorial.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTutorialColor(tutorial.difficulty)}`}>
                          {tutorial.difficulty === 'beginner' ? 'Iniciante' : 
                           tutorial.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                        </span>
                        <span className="text-xs text-gray-400">{tutorial.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{tutorial.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tutorial.description}</p>
                  
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    Assistir Tutorial
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'marketplace' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceItems.map((item) => (
                <div key={item.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden mr-4">
                      <img src={item.logo} alt={item.company_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.company_name}</h3>
                        {item.verified && (
                          <Verified className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.services.slice(0, 2).map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-lg text-xs">
                        {service}
                      </span>
                    ))}
                    {item.services.length > 2 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-lg text-xs">
                        +{item.services.length - 2} mais
                      </span>
                    )}
                  </div>
                  
                  <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Entrar em Contato
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'experts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                    </div>
                    {expert.available && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{expert.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{expert.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{expert.rating}</span>
                      <span className="text-xs text-gray-400 ml-1">({expert.reviews})</span>
                    </div>
                  </div>
                </div>
                
                {/* QuantScore */}
                <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">QuantScore</span>
                    <span className={`font-bold text-lg ${getQuantScoreColor(expert.quantscore)}`}>
                      {expert.quantscore}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Taxa por hora</span>
                    <span className="font-bold text-base sm:text-lg text-emerald-400">R$ {expert.hourly_rate}</span>
                  </div>
                </div>
                
                <button className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-xl text-white font-medium transition-all duration-200 text-sm sm:text-base">
                  Contratar Especialista
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'feed' && (
          <div className="space-y-6">
            {/* Create Post - Mobile Optimized */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Compartilhe uma descoberta, estratégia ou insight..."
                  className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm text-sm sm:text-base"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/backtest-analysis')}
                  className="py-2 sm:py-3 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-500/30 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium text-xs sm:text-sm">Compartilhar Análise</span>
                </button>
                <button
                  onClick={() => navigate('/robots')}
                  className="py-2 sm:py-3 bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 hover:from-emerald-600/30 hover:to-emerald-700/30 border border-emerald-500/30 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium text-xs sm:text-sm">Compartilhar Robô</span>
                </button>
              </div>
            </div>

            {/* Filter Pills - Mobile Optimized */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  filterType === 'all' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('analysis')}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  filterType === 'analysis' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Análises
              </button>
              <button
                onClick={() => setFilterType('robot')}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  filterType === 'robot' 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Robôs
              </button>
            </div>

            {/* Posts Grid - Mobile First */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {displayedPosts.map((post) => (
                <div key={post.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {post.user_avatar ? (
                        <img src={post.user_avatar} alt={post.user_name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="font-semibold text-base sm:text-lg">{post.user_name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            post.type === 'analysis' 
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {post.type === 'analysis' ? 'ANÁLISE' : 'ROBÔ'}
                          </div>
                          {post.quantscore && (
                            <div className="flex items-center">
                              <Trophy className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className={`text-xs font-bold ${getQuantScoreColor(post.quantscore)}`}>
                                {post.quantscore}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{post.content}</p>
                      
                      {/* Performance Metrics for Analysis */}
                      {post.type === 'analysis' && (post.profit_factor || post.win_rate) && (
                        <div className="flex flex-wrap gap-3 sm:gap-4 mb-3 sm:mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          {post.profit_factor && (
                            <div className="text-center">
                              <div className="text-base sm:text-lg font-bold text-emerald-400">{post.profit_factor}</div>
                              <div className="text-xs text-gray-400">Profit Factor</div>
                            </div>
                          )}
                          {post.win_rate && (
                            <div className="text-center">
                              <div className="text-base sm:text-lg font-bold text-blue-400">{post.win_rate}%</div>
                              <div className="text-xs text-gray-400">Win Rate</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Actions - Mobile Optimized */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                          >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center">
                              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <span className="font-medium text-sm">{post.likes}</span>
                          </button>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-sm">{post.views}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 w-full sm:w-auto">
                          {post.type === 'analysis' ? (
                            <button
                              onClick={() => handleViewAnalysis(post.analysis_id || '')}
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                            >
                              <Play className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                              <span className="text-blue-400 font-medium text-xs sm:text-sm">Ver Análise</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleViewRobot(post.robot_name || '')}
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                            >
                              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                              <span className="text-emerald-400 font-medium text-xs sm:text-sm">Acessar Robô</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ver Mais Button */}
            {!showAllPosts && filteredPosts.length > postsToShow && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowAllPosts(true);
                    setPostsToShow(filteredPosts.length);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-xl text-white font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span>Ver Mais ({filteredPosts.length - postsToShow} posts)</span>
                </button>
              </div>
            )}

            {/* Sidebar Content - Mobile Stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Ganhe Tokens */}
              <div className="bg-gradient-to-br from-yellow-900/20 to-emerald-900/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-yellow-500/30">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2" />
                  Ganhe Tokens
                </h3>
                <div className="space-y-3">
                  {challenges.slice(0, 3).map((challenge) => (
                    <div key={challenge.id} className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{challenge.title}</h4>
                        <div className="flex items-center text-yellow-400 font-bold text-sm">
                          <Coins className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {challenge.reward}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{challenge.description}</p>
                      {challenge.completed ? (
                        <div className="text-xs text-emerald-400 font-medium">✓ CONCLUÍDO</div>
                      ) : (
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-gradient-to-r from-yellow-600 to-emerald-600 hover:from-yellow-700 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-200 text-sm">
                  Ver Todos os Desafios
                </button>
              </div>

              {/* Traders Ativos */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2" />
                  Traders Ativos
                </h3>
                <div className="space-y-3">
                  {filteredUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="bg-gray-800/30 rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden relative">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border border-gray-900"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm truncate">{user.name}</h4>
                            <div className={`px-1.5 py-0.5 rounded text-xs border ${getReputationBadge(user.reputation_level)}`}>
                              {user.reputation_level}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 truncate">{user.specialty}</p>
                          <div className="flex items-center mt-1">
                            <Trophy className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className={`text-xs font-bold ${getQuantScoreColor(user.quantscore)}`}>
                              QuantScore: {user.quantscore}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div>
                          <div className="text-sm font-bold text-emerald-400">{user.robots}</div>
                          <div className="text-xs text-gray-400">Robôs</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-blue-400">{user.analyses}</div>
                          <div className="text-xs text-gray-400">Análises</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-yellow-400">{user.followers}</div>
                          <div className="text-xs text-gray-400">Seguidores</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <button
                          onClick={() => handleShareAnalysisWithUser(user.id)}
                          className="py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200"
                        >
                          <BarChart2 className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400 text-xs font-medium">Análise</span>
                        </button>
                        <button
                          onClick={() => handleShareRobotWithUser(user.id)}
                          className="py-1.5 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200"
                        >
                          <Bot className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 text-xs font-medium">Robô</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleFollowUser(user.id)}
                        className={`w-full py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                          user.isFollowing 
                            ? 'bg-gray-600/50 hover:bg-gray-600/70 text-gray-300' 
                            : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white'
                        }`}
                      >
                        {user.isFollowing ? 'Seguindo' : 'Seguir'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Stats */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2" />
                  Suas Estatísticas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-400">0</div>
                    <div className="text-xs text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-red-400">0</div>
                    <div className="text-xs text-gray-400">Curtidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-400">0</div>
                    <div className="text-xs text-gray-400">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">--</div>
                    <div className="text-xs text-gray-400">QuantScore</div>
                  </div>
                </div>
                
                {/* QuantScore Progress */}
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Próximo Nível</span>
                    <span className="text-sm font-medium">50 pontos</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}