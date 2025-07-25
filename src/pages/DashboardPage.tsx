import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Share2, Search, Plus, MessageSquare, Trophy, 
  BarChart2, Code2, Heart, Eye, Download, UserPlus,
  Filter, TrendingUp, Clock, Star, Award, Zap, Target,
  Gift, CheckCircle, Calendar, FileText, Bot, Coins
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

interface CommunityPost {
  id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  type: 'analysis' | 'robot' | 'discussion';
  likes: number;
  views: number;
  created_at: string;
  tags: string[];
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
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'users'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'analysis' | 'robot' | 'discussion'>('all');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState<'analysis' | 'robot' | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    // Mock community posts
    setPosts([
      {
        id: '1',
        user_name: 'Carlos Trader',
        user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        content: 'Compartilhando minha análise de backtest da estratégia de médias móveis. Profit Factor de 2.3 com 65% de acerto!',
        type: 'analysis',
        likes: 24,
        views: 156,
        created_at: '2024-01-15T10:30:00Z',
        tags: ['medias-moveis', 'backtest', 'profit-factor']
      },
      {
        id: '2',
        user_name: 'Ana Quant',
        user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        content: 'Novo robô de scalping para mini índice. Testado em 3 meses de dados históricos com resultados consistentes.',
        type: 'robot',
        likes: 18,
        views: 89,
        created_at: '2024-01-14T15:45:00Z',
        tags: ['scalping', 'mini-indice', 'hft']
      },
      {
        id: '3',
        user_name: 'Pedro Dev',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        content: 'Discussão: Qual a melhor forma de implementar trailing stop em estratégias de tendência?',
        type: 'discussion',
        likes: 12,
        views: 67,
        created_at: '2024-01-13T09:20:00Z',
        tags: ['trailing-stop', 'tendencia', 'discussao']
      }
    ]);

    // Mock challenges
    setChallenges([
      {
        id: '1',
        title: 'Primeiro Robô',
        description: 'Crie seu primeiro robô de trading',
        reward: 500,
        difficulty: 'easy',
        progress: 100,
        completed: true
      },
      {
        id: '2',
        title: 'Análise de Backtest',
        description: 'Faça upload e analise um backtest',
        reward: 1000,
        difficulty: 'medium',
        progress: 0,
        completed: false
      },
      {
        id: '3',
        title: 'Compartilhar na Comunidade',
        description: 'Compartilhe uma análise ou robô na comunidade',
        reward: 750,
        difficulty: 'medium',
        progress: 0,
        completed: false
      },
      {
        id: '4',
        title: 'Estratégia Lucrativa',
        description: 'Crie uma estratégia com Profit Factor > 1.5',
        reward: 2000,
        difficulty: 'hard',
        progress: 60,
        completed: false,
        deadline: '2024-02-01'
      },
      {
        id: '5',
        title: 'Mentor da Comunidade',
        description: 'Ajude 5 usuários com comentários úteis',
        reward: 1500,
        difficulty: 'medium',
        progress: 40,
        completed: false
      }
    ]);

    // Mock users
    setUsers([
      {
        id: '1',
        name: 'Carlos Trader',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        specialty: 'Análise Técnica',
        robots: 12,
        followers: 45,
        isFollowing: false
      },
      {
        id: '2',
        name: 'Ana Quant',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        specialty: 'Desenvolvimento de Robôs',
        robots: 8,
        followers: 32,
        isFollowing: true
      },
      {
        id: '3',
        name: 'Pedro Dev',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        specialty: 'Estratégias Quantitativas',
        robots: 15,
        followers: 67,
        isFollowing: false
      }
    ]);
  }, []);

  const handleShareAnalysis = () => {
    setShareType('analysis');
    setShowShareModal(true);
  };

  const handleShareRobot = () => {
    setShareType('robot');
    setShowShareModal(true);
  };

  const handleFollowUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing, followers: user.isFollowing ? user.followers - 1 : user.followers + 1 }
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
    
    if (diffHours < 1) return 'Agora há pouco';
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900';
      case 'hard': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analysis': return <BarChart2 className="w-4 h-4" />;
      case 'robot': return <Bot className="w-4 h-4" />;
      case 'discussion': return <MessageSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || post.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard da Comunidade</h1>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShareAnalysis}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Análise
            </button>
            <button
              onClick={handleShareRobot}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center"
            >
              <Code2 className="w-4 h-4 mr-2" />
              Compartilhar Robô
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === 'feed' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feed da Comunidade
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === 'challenges' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 mr-2" />
            Ganhe Tokens
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
              activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Encontrar Usuários
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'feed' ? 'Buscar posts, usuários ou tags...' :
                activeTab === 'users' ? 'Buscar usuários por nome ou especialidade...' :
                'Buscar desafios...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {activeTab === 'feed' && (
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Posts</option>
                <option value="analysis">Análises</option>
                <option value="robot">Robôs</option>
                <option value="discussion">Discussões</option>
              </select>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Compartilhe uma análise, robô ou inicie uma discussão..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setShowShareModal(true)}
                    readOnly
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleShareAnalysis}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center"
                  >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Análise
                  </button>
                  <button
                    onClick={handleShareRobot}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center justify-center"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Robô
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-md flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Discussão
                  </button>
                </div>
              </div>

              {/* Posts */}
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                      {post.user_avatar ? (
                        <img src={post.user_avatar} alt={post.user_name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{post.user_name}</h3>
                        <div className={`px-2 py-0.5 rounded-full text-xs flex items-center ${
                          post.type === 'analysis' ? 'bg-blue-900 text-blue-300' :
                          post.type === 'robot' ? 'bg-green-900 text-green-300' :
                          'bg-purple-900 text-purple-300'
                        }`}>
                          {getTypeIcon(post.type)}
                          <span className="ml-1">
                            {post.type === 'analysis' ? 'Análise' :
                             post.type === 'robot' ? 'Robô' : 'Discussão'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                      </div>
                      <p className="text-gray-300 mb-3">{post.content}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-red-400"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400">
                          <MessageSquare className="w-4 h-4" />
                          <span>Comentar</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400">
                          <Download className="w-4 h-4" />
                          <span>Baixar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Top Contributors */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {users.slice(0, 3).map((user, index) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600 text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.robots} robôs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Tags */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                  Tags em Alta
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['medias-moveis', 'scalping', 'backtest', 'profit-factor', 'trailing-stop', 'hft'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Suas Estatísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posts Compartilhados</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Curtidas Recebidas</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seguidores</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seguindo</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenges List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                  Desafios Disponíveis
                </h2>
                
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className={`bg-gray-700 rounded-lg p-4 ${challenge.completed ? 'opacity-75' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{challenge.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty === 'easy' ? 'Fácil' :
                               challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                            </span>
                            {challenge.completed && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{challenge.description}</p>
                          {challenge.deadline && !challenge.completed && (
                            <div className="flex items-center text-xs text-yellow-400">
                              <Calendar className="w-3 h-3 mr-1" />
                              Prazo: {new Date(challenge.deadline).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-yellow-500 font-medium">
                            <Coins className="w-4 h-4 mr-1" />
                            {challenge.reward}
                          </div>
                          {challenge.completed && (
                            <span className="text-xs text-green-400">Concluído!</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {!challenge.completed && challenge.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progresso</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${challenge.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {!challenge.completed && (
                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm">
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
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  Seus Tokens
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {profile?.token_balance?.toLocaleString() || '0'}
                  </div>
                  <p className="text-gray-400 text-sm mb-4">Tokens disponíveis</p>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-sm"
                  >
                    Comprar Mais Tokens
                  </button>
                </div>
              </div>

              {/* Challenge Stats */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Estatísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Desafios Concluídos</span>
                    <span className="font-medium text-green-400">
                      {challenges.filter(c => c.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tokens Ganhos</span>
                    <span className="font-medium text-yellow-400">
                      {challenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Em Progresso</span>
                    <span className="font-medium">
                      {challenges.filter(c => !c.completed && c.progress > 0).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Challenges */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Target className="w-5 h-5 text-blue-500 mr-2" />
                  Próximos Desafios
                </h3>
                <div className="space-y-3">
                  {challenges.filter(c => !c.completed).slice(0, 3).map((challenge) => (
                    <div key={challenge.id} className="bg-gray-700 p-3 rounded-lg">
                      <p className="font-medium text-sm mb-1">{challenge.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{challenge.difficulty}</span>
                        <div className="flex items-center text-yellow-500 text-xs">
                          <Coins className="w-3 h-3 mr-1" />
                          {challenge.reward}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.specialty}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{user.robots}</div>
                    <div className="text-xs text-gray-400">Robôs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{user.followers}</div>
                    <div className="text-xs text-gray-400">Seguidores</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFollowUser(user.id)}
                    className={`flex-1 py-2 rounded-md text-sm flex items-center justify-center ${
                      user.isFollowing 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    {user.isFollowing ? 'Seguindo' : 'Seguir'}
                  </button>
                  <button className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                Compartilhar na Comunidade
              </h2>
              <p className="mt-2 text-gray-400">
                {shareType === 'analysis' ? 'Compartilhe uma análise de backtest' :
                 shareType === 'robot' ? 'Compartilhe um robô da sua carteira' :
                 'Inicie uma discussão na comunidade'}
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                placeholder={
                  shareType === 'analysis' ? 'Descreva sua análise e principais insights...' :
                  shareType === 'robot' ? 'Descreva seu robô e estratégia...' :
                  'Sobre o que você gostaria de discutir?'
                }
                className="w-full h-32 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="ex: scalping, mini-indice, hft"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setShareType(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                >
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}