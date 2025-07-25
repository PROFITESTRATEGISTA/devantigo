import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Share2, Search, Plus, Trophy, 
  BarChart2, Code2, Eye, Download, UserPlus,
  Filter, TrendingUp, Clock, Award, Zap, Target,
  CheckCircle, Calendar, FileText, Bot, Coins,
  ArrowRight, Play, ExternalLink, Send, Gift,
  Activity, Layers, Grid, Sparkles, ChevronRight
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
  performance_score: number;
  last_active: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'users'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'analysis' | 'robot'>('all');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    // Mock community posts with more tech-focused content
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
        win_rate: 68.5
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
        robot_name: 'HFT_MiniIndice_v2'
      },
      {
        id: '3',
        user_name: 'Pedro Algo',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        content: 'Machine Learning aplicado a mean reversion. Modelo XGBoost com 72% de precisão.',
        type: 'analysis',
        likes: 28,
        views: 198,
        created_at: '2024-01-13T09:20:00Z',
        analysis_id: 'analysis_002',
        profit_factor: 1.8,
        win_rate: 72.3
      },
      {
        id: '4',
        user_name: 'Marina Sys',
        user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        content: 'Grid trading adaptativo com gestão dinâmica de risco. Backtested em 2 anos de dados.',
        type: 'robot',
        likes: 19,
        views: 89,
        created_at: '2024-01-12T14:30:00Z',
        robot_name: 'GridTrading_Adaptive'
      }
    ]);

    // Enhanced challenges with categories
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
        title: 'Viral na Comunidade',
        description: 'Receba 50+ curtidas em um post da comunidade',
        reward: 1000,
        difficulty: 'medium',
        progress: 0,
        completed: false,
        category: 'community'
      },
      {
        id: '4',
        title: 'Alpha Generator',
        description: 'Desenvolva uma estratégia com Profit Factor > 2.0',
        reward: 3000,
        difficulty: 'hard',
        progress: 60,
        completed: false,
        deadline: '2024-02-01',
        category: 'performance'
      },
      {
        id: '5',
        title: 'Code Master',
        description: 'Contribua com 10 robôs únicos para a comunidade',
        reward: 2500,
        difficulty: 'hard',
        progress: 30,
        completed: false,
        category: 'creation'
      },
      {
        id: '6',
        title: 'Network Builder',
        description: 'Conecte-se com 25 traders na plataforma',
        reward: 800,
        difficulty: 'easy',
        progress: 40,
        completed: false,
        category: 'community'
      }
    ]);

    // Enhanced users with performance metrics
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
        performance_score: 94,
        last_active: '2h ago'
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
        performance_score: 87,
        last_active: '1h ago'
      },
      {
        id: '3',
        name: 'Pedro Algo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        specialty: 'Machine Learning',
        robots: 19,
        analyses: 25,
        followers: 178,
        isFollowing: false,
        performance_score: 91,
        last_active: '30min ago'
      },
      {
        id: '4',
        name: 'Marina Sys',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        specialty: 'Risk Management',
        robots: 15,
        analyses: 22,
        followers: 134,
        isFollowing: false,
        performance_score: 89,
        last_active: '4h ago'
      },
      {
        id: '5',
        name: 'Lucas Tech',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        specialty: 'Algorithmic Trading',
        robots: 28,
        analyses: 16,
        followers: 245,
        isFollowing: false,
        performance_score: 96,
        last_active: '1d ago'
      }
    ]);
  }, []);

  const handleViewAnalysis = (analysisId: string) => {
    navigate(`/backtest-analysis?analysis=${analysisId}`);
  };

  const handleViewRobot = (robotName: string) => {
    // In a real app, you'd get the robot ID and navigate to editor
    navigate(`/robots`); // For now, navigate to robots page
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

  const handleInviteUser = (userId: string, type: 'analysis' | 'robot') => {
    // Mock invite functionality
    console.log(`Inviting user ${userId} to view ${type}`);
    // In real app, this would open a modal to select which analysis/robot to share
  };

  const handleShareWithUser = (userId: string, type: 'analysis' | 'robot') => {
    // Mock share functionality
    console.log(`Sharing ${type} with user ${userId}`);
    // In real app, this would open a modal to select what to share
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
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
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

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-gray-400';
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

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Community Hub
            </h1>
            <p className="text-gray-400 mt-1">Conecte-se, compartilhe e evolua com a comunidade</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/backtest-analysis')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Nova Análise</span>
            </button>
            <button
              onClick={() => navigate('/robots')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <Code2 className="w-4 h-4" />
              <span>Novo Robô</span>
            </button>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/50 p-1 rounded-xl backdrop-blur-sm border border-gray-800">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
              activeTab === 'feed' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="font-medium">Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
              activeTab === 'challenges' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Ganhe Tokens</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Traders</span>
          </button>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'feed' ? 'Buscar análises, robôs ou usuários...' :
                activeTab === 'users' ? 'Buscar traders por nome ou especialidade...' :
                'Buscar desafios...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>
          
          {activeTab === 'feed' && (
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filterType === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterType('analysis')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filterType === 'analysis' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Análises
                </button>
                <button
                  onClick={() => setFilterType('robot')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filterType === 'robot' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Robôs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Create Post */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Compartilhe uma descoberta, estratégia ou insight..."
                    className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/backtest-analysis')}
                    className="py-3 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-500/30 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    <BarChart2 className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Compartilhar Análise</span>
                  </button>
                  <button
                    onClick={() => navigate('/robots')}
                    className="py-3 bg-gradient-to-r from-purple-600/20 to-purple-700/20 hover:from-purple-600/30 hover:to-purple-700/30 border border-purple-500/30 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    <Bot className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-medium">Compartilhar Robô</span>
                  </button>
                </div>
              </div>

              {/* Posts */}
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {post.user_avatar ? (
                        <img src={post.user_avatar} alt={post.user_name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{post.user_name}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          post.type === 'analysis' 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                            : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        }`}>
                          {post.type === 'analysis' ? 'ANÁLISE' : 'ROBÔ'}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                      
                      {/* Performance Metrics for Analysis */}
                      {post.type === 'analysis' && (post.profit_factor || post.win_rate) && (
                        <div className="flex space-x-4 mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          {post.profit_factor && (
                            <div className="text-center">
                              <div className="text-lg font-bold text-emerald-400">{post.profit_factor}</div>
                              <div className="text-xs text-gray-400">Profit Factor</div>
                            </div>
                          )}
                          {post.win_rate && (
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-400">{post.win_rate}%</div>
                              <div className="text-xs text-gray-400">Win Rate</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center">
                              <span className="text-sm">❤️</span>
                            </div>
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {post.type === 'analysis' ? (
                            <button
                              onClick={() => handleViewAnalysis(post.analysis_id || '')}
                              className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg flex items-center space-x-2 transition-all duration-200"
                            >
                              <Play className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 font-medium">Ver Análise</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleViewRobot(post.robot_name || '')}
                              className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg flex items-center space-x-2 transition-all duration-200"
                            >
                              <ExternalLink className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-400 font-medium">Acessar Robô</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Performance Stats */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 text-yellow-500 mr-2" />
                  Suas Estatísticas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Posts Compartilhados</span>
                    <span className="font-bold text-xl">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Curtidas Recebidas</span>
                    <span className="font-bold text-xl text-red-400">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Seguidores</span>
                    <span className="font-bold text-xl text-blue-400">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Performance Score</span>
                    <span className="font-bold text-xl text-emerald-400">--</span>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
                  Top Performers
                </h3>
                <div className="space-y-3">
                  {users.slice(0, 3).map((user, index) => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.performance_score} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Challenges List */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Trophy className="w-7 h-7 text-yellow-500 mr-3" />
                  Desafios Disponíveis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className={`bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-xl p-5 border transition-all duration-200 hover:scale-[1.02] ${
                      challenge.completed 
                        ? 'border-emerald-500/30 bg-emerald-500/5' 
                        : 'border-gray-600/50 hover:border-gray-500/50'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            challenge.completed ? 'bg-emerald-500/20' : 'bg-gray-700/50'
                          }`}>
                            {challenge.completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : (
                              getCategoryIcon(challenge.category)
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{challenge.title}</h3>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty === 'easy' ? 'FÁCIL' :
                               challenge.difficulty === 'medium' ? 'MÉDIO' : 'DIFÍCIL'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-yellow-400 font-bold text-lg">
                            <Coins className="w-5 h-5 mr-1" />
                            {challenge.reward}
                          </div>
                          {challenge.completed && (
                            <span className="text-xs text-emerald-400 font-medium">CONCLUÍDO</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">{challenge.description}</p>
                      
                      {challenge.deadline && !challenge.completed && (
                        <div className="flex items-center text-xs text-amber-400 mb-3">
                          <Calendar className="w-3 h-3 mr-1" />
                          Prazo: {new Date(challenge.deadline).toLocaleDateString()}
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      {!challenge.completed && challenge.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progresso</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${challenge.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {!challenge.completed && (
                        <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-200">
                          {challenge.progress > 0 ? 'Continuar' : 'Começar Desafio'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Challenges Sidebar */}
            <div className="space-y-6">
              {/* Token Balance */}
              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  Seus Tokens
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {profile?.token_balance?.toLocaleString() || '0'}
                  </div>
                  <p className="text-gray-400 text-sm mb-4">Tokens disponíveis</p>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="w-full py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg text-white font-medium transition-all duration-200"
                  >
                    Comprar Mais
                  </button>
                </div>
              </div>

              {/* Challenge Stats */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Concluídos</span>
                    <span className="font-bold text-emerald-400">
                      {challenges.filter(c => c.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tokens Ganhos</span>
                    <span className="font-bold text-yellow-400">
                      {challenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Em Progresso</span>
                    <span className="font-bold text-blue-400">
                      {challenges.filter(c => !c.completed && c.progress > 0).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden relative">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.specialty}</p>
                    <p className="text-xs text-gray-500">{user.last_active}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{user.robots}</div>
                    <div className="text-xs text-gray-400">Robôs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{user.analyses}</div>
                    <div className="text-xs text-gray-400">Análises</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getPerformanceColor(user.performance_score)}`}>
                      {user.performance_score}
                    </div>
                    <div className="text-xs text-gray-400">Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => handleInviteUser(user.id, 'analysis')}
                    className="py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200"
                  >
                    <BarChart2 className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Compartilhar Análise</span>
                  </button>
                  <button
                    onClick={() => handleShareWithUser(user.id, 'robot')}
                    className="py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200"
                  >
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">Compartilhar Robô</span>
                  </button>
                </div>
                
                <button
                  onClick={() => handleFollowUser(user.id)}
                  className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
                    user.isFollowing 
                      ? 'bg-gray-600/50 hover:bg-gray-600/70 text-gray-300' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {user.isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}