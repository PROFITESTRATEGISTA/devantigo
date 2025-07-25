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
  Building, Verified, Crown, ChevronDown, MoreHorizontal,
  Package, Check
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
  const [activeSection, setActiveSection] = useState<'feed' | 'strategies' | 'tutorials' | 'marketplace' | 'specialists' | 'users'>('feed');
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
              Dashboard da Comunidade
            </h1>
            <p className="text-gray-400 mt-1">Conecte-se, compartilhe e evolua com a comunidade</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveSection('strategies')}
            className={`p-4 sm:p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
              activeSection === 'strategies'
                ? 'bg-gradient-to-br from-emerald-600/30 to-emerald-800/30 border border-emerald-500/50'
                : 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-600/50'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Estratégias</h3>
              <p className="text-xs text-gray-400">Verificadas</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('feed')}
            className={`p-4 sm:p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
              activeSection === 'feed'
                ? 'bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/50'
                : 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-600/50'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Feed</h3>
              <p className="text-xs text-gray-400">Postagens</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('tutorials')}
            className={`p-4 sm:p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
              activeSection === 'tutorials'
                ? 'bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/50'
                : 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-600/50'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Tutoriais</h3>
              <p className="text-xs text-gray-400">Aprenda</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('marketplace')}
            className={`p-4 sm:p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
              activeSection === 'marketplace'
                ? 'bg-gradient-to-br from-emerald-600/30 to-emerald-800/30 border border-emerald-500/50'
                : 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-600/50'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Marketplace</h3>
              <p className="text-xs text-gray-400">Comprar</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('specialists')}
            className={`p-4 sm:p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
              activeSection === 'specialists'
                ? 'bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/50'
                : 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-600/50'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Especialistas</h3>
              <p className="text-xs text-gray-400">Encontrar</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('users')}
            className={`p-4 sm:p-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
              activeSection === 'users'
                ? 'bg-gradient-to-br from-emerald-600/30 to-emerald-800/30 border border-emerald-500/50'
                : 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-600/50'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Usuários</h3>
              <p className="text-xs text-gray-400">Conectar</p>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-8">
          <button
            onClick={() => navigate('/backtest-analysis')}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="font-medium">Nova Análise</span>
          </button>
          <button
            onClick={() => navigate('/robots')}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
          >
            <Code2 className="w-5 h-5" />
            <span className="font-medium">Novo Robô</span>
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
                activeSection === 'specialists' ? 'Buscar especialistas...' :
                activeSection === 'tutorials' ? 'Buscar tutoriais...' :
                'Buscar...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === 'users' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Users className="w-5 h-5 text-emerald-400 mr-2" />
                Encontrar Usuários
              </h2>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuários por nome ou especialidade..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Carlos Quant', specialty: 'Quantitative Analysis', score: 94, level: 'Expert', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
                  { name: 'Ana Dev', specialty: 'HFT Development', score: 87, level: 'Pro', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
                  { name: 'Pedro Algo', specialty: 'Machine Learning', score: 91, level: 'Expert', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
                  { name: 'Marina Sys', specialty: 'Risk Management', score: 89, level: 'Pro', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
                  { name: 'Lucas Tech', specialty: 'Algorithmic Trading', score: 96, level: 'Expert', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
                  { name: 'Sofia Quant', specialty: 'Portfolio Optimization', score: 85, level: 'Pro', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
                ].map((user, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">{user.name}</h3>
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">Q</span>
                            </div>
                            <span className="text-xs font-medium text-emerald-400">{user.score}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">{user.specialty}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.level === 'Expert' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.level}
                          </span>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-xs text-gray-400">Online</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                        <BarChart2 className="w-4 h-4" />
                        <span>Análise</span>
                      </button>
                      <button className="flex-1 px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                        <Bot className="w-4 h-4" />
                        <span>Robô</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'feed' && (
          <div className="space-y-6">
            {/* Create Post */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop" 
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <input
                  type="text"
                  placeholder="Compartilhe uma descoberta, estratégia ou insight..."
                  className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                  <BarChart2 className="w-4 h-4" />
                  <span>Compartilhar Análise</span>
                </button>
                <button className="flex-1 px-4 py-2 bg-emerald-600/80 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>Compartilhar Robô</span>
                </button>
              </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
              {[
                {
                  user: 'Carlos Quant',
                  quantScore: 94,
                  level: 'Expert',
                  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
                  type: 'ANÁLISE',
                  time: '15/01/2024',
                  content: 'Estratégia de arbitragem estatística com correlação PETR4/VALE3. Sharpe 2.1, Max DD 8.5%',
                  metrics: { profitFactor: '2.3', winRate: '68.5%' },
                  likes: 42,
                  views: 287
                },
                {
                  user: 'Ana Dev',
                  quantScore: 87,
                  level: 'Pro',
                  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
                  type: 'ROBÔ',
                  time: '14/01/2024',
                  content: 'Robô HFT para mini índice com latência <2ms. Implementação em NTSL otimizada.',
                  likes: 35,
                  views: 156
                },
                {
                  user: 'Pedro Algo',
                  quantScore: 91,
                  level: 'Expert',
                  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
                  type: 'ANÁLISE',
                  time: '13/01/2024',
                  content: 'Machine Learning aplicado a mean reversion. Modelo XGBoost com 72% de precisão.',
                  metrics: { profitFactor: '1.8', winRate: '72.3%' },
                  likes: 28,
                  views: 198
                }
              ].map((post, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.avatar} 
                        alt={post.user}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">{post.user}</h3>
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">Q</span>
                            </div>
                            <span className="text-xs font-medium text-emerald-400">{post.quantScore}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            post.level === 'Expert' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {post.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{post.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      post.type === 'ANÁLISE' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {post.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{post.content}</p>
                  
                  {post.metrics && (
                    <div className="flex space-x-4 mb-4">
                      <div className="bg-gray-900/50 px-3 py-2 rounded-lg">
                        <p className="text-xs text-gray-400">Profit Factor</p>
                        <p className="font-bold text-emerald-400">{post.metrics.profitFactor}</p>
                      </div>
                      <div className="bg-gray-900/50 px-3 py-2 rounded-lg">
                        <p className="text-xs text-gray-400">Win Rate</p>
                        <p className="font-bold text-blue-400">{post.metrics.winRate}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{post.views}</span>
                      </div>
                    </div>
                    
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      post.type === 'ANÁLISE' 
                        ? 'bg-blue-600/80 hover:bg-blue-600 text-white' 
                        : 'bg-emerald-600/80 hover:bg-emerald-600 text-white'
                    }`}>
                      {post.type === 'ANÁLISE' ? 'Ver Análise' : 'Acessar Robô'}
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Ver Mais Button */}
              <div className="text-center mt-6">
                <button 
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 hover:from-blue-600/30 hover:to-emerald-600/30 border border-blue-500/30 rounded-lg text-white font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <span>{showAllPosts ? 'Ver Menos' : 'Ver Mais Posts'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAllPosts ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'strategies' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Estratégias Verificadas</h2>
                    <p className="text-gray-400">Estratégias testadas e aprovadas pela comunidade</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-lg p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-2 mb-3">
                      <Package className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-semibold text-white">Pack de Robôs</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Parceiro DevHub Trader</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-medium">R$ 299/mês</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-lg p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <h3 className="font-semibold text-white">Copy Trade IA</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Premium</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-medium">R$ 599/mês</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-600/10 to-blue-600/10 rounded-lg p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-2 mb-3">
                      <Settings className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-semibold text-white">Robô Personalizado</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Sob medida</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-medium">Consultar</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'tutorials' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Tutoriais</h2>
                    <p className="text-gray-400">Aprenda a usar todas as funcionalidades</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Como fazer upload de CSV',
                      description: 'Aprenda a preparar e enviar dados de backtest',
                      icon: Upload,
                      duration: '5 min',
                      difficulty: 'Fácil'
                    },
                    {
                      title: 'Gerar código de robô com IA',
                      description: 'Tutorial completo para criar robôs automaticamente',
                      icon: Bot,
                      duration: '8 min',
                      difficulty: 'Médio'
                    },
                    {
                      title: 'Como usar no Profit',
                      description: 'Configuração e implementação na plataforma',
                      icon: TrendingUp,
                      duration: '12 min',
                      difficulty: 'Médio'
                    },
                    {
                      title: 'Análise de métricas',
                      description: 'Entenda Sharpe, Drawdown e outras métricas',
                      icon: BarChart2,
                      duration: '10 min',
                      difficulty: 'Avançado'
                    },
                    {
                      title: 'Dicas de otimização',
                      description: 'Como melhorar performance dos seus robôs',
                      icon: Zap,
                      duration: '15 min',
                      difficulty: 'Avançado'
                    },
                    {
                      title: 'Gerenciamento de risco',
                      description: 'Estratégias para proteger seu capital',
                      icon: Shield,
                      duration: '20 min',
                      difficulty: 'Avançado'
                    }
                  ].map((tutorial, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <tutorial.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{tutorial.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-400">{tutorial.duration}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              tutorial.difficulty === 'Fácil' ? 'bg-emerald-500/20 text-emerald-400' :
                              tutorial.difficulty === 'Médio' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {tutorial.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{tutorial.description}</p>
                      <button className="w-full px-4 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors">
                        Assistir Tutorial
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'marketplace' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Marketplace</h2>
                    <p className="text-gray-400">Empresas e traders verificados</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'TradeTech Solutions',
                      type: 'Empresa',
                      verified: true,
                      rating: 4.9,
                      service: 'Desenvolvimento de robôs',
                      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'QuantAlpha Partners',
                      type: 'Gestora',
                      verified: true,
                      rating: 4.8,
                      service: 'Gestão quantitativa',
                      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'AlgoTrader Pro',
                      type: 'Trader',
                      verified: true,
                      rating: 4.7,
                      service: 'Copy trading IA',
                      logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'RiskMaster Analytics',
                      type: 'Consultoria',
                      verified: true,
                      rating: 4.9,
                      service: 'Análise de risco',
                      logo: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'HFT Systems',
                      type: 'Empresa',
                      verified: true,
                      rating: 4.6,
                      service: 'High Frequency Trading',
                      logo: 'https://images.pexels.com/photos/3184341/pexels-photo-3184341.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'DataDriven Capital',
                      type: 'Fundo',
                      verified: true,
                      rating: 4.8,
                      service: 'Investimento quantitativo',
                      logo: 'https://images.pexels.com/photos/3184342/pexels-photo-3184342.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    }
                  ].map((company, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center space-x-3 mb-4">
                        <img 
                          src={company.logo} 
                          alt={company.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">{company.name}</h3>
                            {company.verified && (
                              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{company.type}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3">{company.service}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-white">{company.rating}</span>
                        </div>
                        <button className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 rounded-lg text-sm font-medium transition-colors">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'specialists' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Encontrar Especialistas</h2>
                    <p className="text-gray-400">Profissionais especializados em trading</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'João Contador',
                      specialty: 'Contabilidade Trader',
                      experience: '8 anos',
                      rating: 4.9,
                      price: 'R$ 150/hora',
                      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'Maria Dev',
                      specialty: 'Desenvolvedora Trader',
                      experience: '6 anos',
                      rating: 4.8,
                      price: 'R$ 200/hora',
                      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'Carlos Gestor',
                      specialty: 'Trader Gestor Profissional',
                      experience: '12 anos',
                      rating: 4.9,
                      price: 'R$ 300/hora',
                      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'Ana Risk',
                      specialty: 'Gestão de Risco',
                      experience: '10 anos',
                      rating: 4.7,
                      price: 'R$ 250/hora',
                      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'Pedro Quant',
                      specialty: 'Análise Quantitativa',
                      experience: '9 anos',
                      rating: 4.8,
                      price: 'R$ 280/hora',
                      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    },
                    {
                      name: 'Sofia Legal',
                      specialty: 'Consultoria Jurídica',
                      experience: '7 anos',
                      rating: 4.6,
                      price: 'R$ 180/hora',
                      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
                    }
                  ].map((specialist, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <img 
                          src={specialist.avatar} 
                          alt={specialist.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{specialist.name}</h3>
                          <p className="text-sm text-gray-400">{specialist.specialty}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-400">{specialist.rating}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">{specialist.experience}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-medium">{specialist.price}</span>
                        <button className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors">
                          Contratar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ganhe Tokens Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ganhe Tokens</h2>
                <p className="text-gray-400">Complete desafios e ganhe tokens gratuitos</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(challenge.category)}
                      <h3 className="font-semibold">{challenge.title}</h3>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty === 'easy' ? 'Fácil' : 
                       challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-yellow-500">{challenge.reward}</span>
                    </div>
                    {challenge.completed && (
                      <div className="flex items-center space-x-1 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Concluído</span>
                      </div>
                    )}
                  </div>
                  
                  {!challenge.completed && (
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}