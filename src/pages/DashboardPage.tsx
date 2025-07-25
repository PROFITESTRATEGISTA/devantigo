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
  MessageCircle, Heart, ThumbsUp, Bookmark
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

interface Expert {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  rating: number;
  reviews: number;
  hourly_rate: number;
  available: boolean;
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
        available: true
      },
      {
        id: '2',
        name: 'Maria Dev',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        specialty: 'Desenvolvedor Trader',
        rating: 4.8,
        reviews: 89,
        hourly_rate: 200,
        available: true
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
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Community Hub
            </h1>
            <p className="text-gray-400 mt-1">Conecte-se, compartilhe e evolua com a comunidade</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/backtest-analysis')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl flex items-center space-x-2 transition-all duration-200"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Nova Análise</span>
            </button>
            <button
              onClick={() => navigate('/robots')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl flex items-center space-x-2 transition-all duration-200"
            >
              <Code2 className="w-4 h-4" />
              <span>Novo Robô</span>
            </button>
          </div>
        </div>

        {/* Navigation Cards - Mobile Style */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setActiveSection('strategies')}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'strategies' 
                ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/50 shadow-lg shadow-green-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl mb-3 ${
                activeSection === 'strategies' ? 'bg-green-500/20' : 'bg-gray-700/50'
              }`}>
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-sm">Estratégias</h3>
              <p className="text-xs text-gray-400 mt-1">Verificadas</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('feed')}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'feed' 
                ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl mb-3 ${
                activeSection === 'feed' ? 'bg-blue-500/20' : 'bg-gray-700/50'
              }`}>
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">Feed</h3>
              <p className="text-xs text-gray-400 mt-1">Postagens</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('tutorials')}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'tutorials' 
                ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl mb-3 ${
                activeSection === 'tutorials' ? 'bg-purple-500/20' : 'bg-gray-700/50'
              }`}>
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">Tutoriais</h3>
              <p className="text-xs text-gray-400 mt-1">Aprenda</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('marketplace')}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'marketplace' 
                ? 'bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/50 shadow-lg shadow-orange-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl mb-3 ${
                activeSection === 'marketplace' ? 'bg-orange-500/20' : 'bg-gray-700/50'
              }`}>
                <ShoppingCart className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-sm">Marketplace</h3>
              <p className="text-xs text-gray-400 mt-1">Comprar</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('experts')}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              activeSection === 'experts' 
                ? 'bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl mb-3 ${
                activeSection === 'experts' ? 'bg-yellow-500/20' : 'bg-gray-700/50'
              }`}>
                <UserCheck className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-sm">Especialistas</h3>
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
                'Buscar...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Content based on active section */}
        {activeSection === 'strategies' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Estratégias Verificadas</h2>
              <p className="text-gray-400">Estratégias testadas e aprovadas pela comunidade</p>
            </div>
          </div>
        )}

        {activeSection === 'tutorials' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Tutoriais</h2>
              <p className="text-gray-400">Aprenda com os melhores da comunidade</p>
            </div>
          </div>
        )}

        {activeSection === 'marketplace' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-orange-500 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Marketplace</h2>
              <p className="text-gray-400">Compre e venda robôs e estratégias</p>
            </div>
          </div>
        )}

        {activeSection === 'experts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                    </div>
                    {expert.available && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{expert.name}</h3>
                    <p className="text-sm text-gray-400">{expert.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{expert.rating}</span>
                      <span className="text-xs text-gray-400 ml-1">({expert.reviews} avaliações)</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Taxa por hora</span>
                    <span className="font-bold text-lg text-green-400">R$ {expert.hourly_rate}</span>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-200">
                  Contratar Especialista
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'feed' && (
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

              {/* Filter Pills */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterType === 'all' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterType('analysis')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterType === 'analysis' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Análises
                </button>
                <button
                  onClick={() => setFilterType('robot')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterType === 'robot' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Robôs
                </button>
              </div>

              {/* Posts */}
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                  <div className="flex items-start space-x-4">
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
                              <Heart className="w-4 h-4" />
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ganhe Tokens */}
              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  Ganhe Tokens
                </h3>
                <div className="space-y-3">
                  {challenges.slice(0, 3).map((challenge) => (
                    <div key={challenge.id} className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{challenge.title}</h4>
                        <div className="flex items-center text-yellow-400 font-bold text-sm">
                          <Coins className="w-4 h-4 mr-1" />
                          {challenge.reward}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{challenge.description}</p>
                      {challenge.completed ? (
                        <div className="text-xs text-emerald-400 font-medium">✓ CONCLUÍDO</div>
                      ) : (
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg text-white font-medium transition-all duration-200">
                  Ver Todos os Desafios
                </button>
              </div>

              {/* Encontrar Usuários */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  Traders Ativos
                </h3>
                <div className="space-y-3">
                  {filteredUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="bg-gray-800/30 rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden relative">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-gray-900"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{user.name}</h4>
                          <p className="text-xs text-gray-400">{user.specialty}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div>
                          <div className="text-sm font-bold text-purple-400">{user.robots}</div>
                          <div className="text-xs text-gray-400">Robôs</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-blue-400">{user.analyses}</div>
                          <div className="text-xs text-gray-400">Análises</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-emerald-400">{user.performance_score}</div>
                          <div className="text-xs text-gray-400">Score</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <button
                          onClick={() => handleShareAnalysisWithUser(user.id)}
                          className="py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200"
                        >
                          <BarChart2 className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400 text-xs font-medium">Compartilhar Análise</span>
                        </button>
                        <button
                          onClick={() => handleShareRobotWithUser(user.id)}
                          className="py-1.5 px-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200"
                        >
                          <Bot className="w-3 h-3 text-purple-400" />
                          <span className="text-purple-400 text-xs font-medium">Compartilhar Robô</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleFollowUser(user.id)}
                        className={`w-full py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
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
              </div>

              {/* Performance Stats */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 text-yellow-500 mr-2" />
                  Suas Estatísticas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">0</div>
                    <div className="text-xs text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">0</div>
                    <div className="text-xs text-gray-400">Curtidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">0</div>
                    <div className="text-xs text-gray-400">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">--</div>
                    <div className="text-xs text-gray-400">Score</div>
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