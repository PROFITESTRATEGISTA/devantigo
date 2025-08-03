import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trophy, Zap, Calendar, Clock, Check, 
  Star, Target, Users, BarChart2, Code2, Share2,
  Gift, Crown, Coins, ChevronRight, RefreshCw,
  Award, Flame, TrendingUp, Lightbulb
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'weekly' | 'monthly' | 'achievement';
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  maxProgress: number;
  completed: boolean;
  icon: React.ReactNode;
  category: string;
  expiresAt?: string;
}

export function ChallengesPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { t, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'achievements'>('daily');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    loadChallenges();
  }, [activeTab]);

  const loadChallenges = () => {
    const allChallenges: Challenge[] = [
      // Daily Challenges
      {
        id: 'daily-login',
        title: 'Login Diário',
        description: 'Faça login na plataforma hoje',
        reward: 10,
        type: 'daily',
        difficulty: 'easy',
        progress: 1,
        maxProgress: 1,
        completed: true,
        icon: <Calendar className="w-5 h-5" />,
        category: 'Atividade',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'daily-edit-robot',
        title: 'Editar Robô',
        description: 'Edite qualquer robô por pelo menos 5 minutos',
        reward: 25,
        type: 'daily',
        difficulty: 'easy',
        progress: 0,
        maxProgress: 1,
        completed: false,
        icon: <Code2 className="w-5 h-5" />,
        category: 'Desenvolvimento',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'daily-analysis',
        title: 'Análise de Backtest',
        description: 'Faça uma análise de backtest com IA',
        reward: 50,
        type: 'daily',
        difficulty: 'medium',
        progress: 0,
        maxProgress: 1,
        completed: false,
        icon: <BarChart2 className="w-5 h-5" />,
        category: 'Análise',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      // Weekly Challenges
      {
        id: 'weekly-create-robot',
        title: 'Criar Novo Robô',
        description: 'Crie um novo robô de trading esta semana',
        reward: 500,
        type: 'weekly',
        difficulty: 'medium',
        progress: 2,
        maxProgress: 1,
        completed: true,
        icon: <Code2 className="w-5 h-5" />,
        category: 'Criação',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'weekly-share-strategy',
        title: 'Compartilhar Estratégia',
        description: 'Compartilhe um robô com outro usuário',
        reward: 200,
        type: 'weekly',
        difficulty: 'easy',
        progress: 0,
        maxProgress: 1,
        completed: false,
        icon: <Share2 className="w-5 h-5" />,
        category: 'Social',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'weekly-optimize-strategy',
        title: 'Otimizar Estratégia',
        description: 'Use IA para otimizar uma estratégia existente',
        reward: 300,
        type: 'weekly',
        difficulty: 'medium',
        progress: 1,
        maxProgress: 3,
        completed: false,
        icon: <TrendingUp className="w-5 h-5" />,
        category: 'Otimização',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Monthly Challenges
      {
        id: 'monthly-competition',
        title: 'Competição de Performance',
        description: 'Participe da competição mensal de estratégias',
        reward: 2000,
        type: 'monthly',
        difficulty: 'hard',
        progress: 0,
        maxProgress: 1,
        completed: false,
        icon: <Trophy className="w-5 h-5" />,
        category: 'Competição',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'monthly-tutorial',
        title: 'Criar Tutorial',
        description: 'Contribua com um tutorial para a comunidade',
        reward: 1000,
        type: 'monthly',
        difficulty: 'hard',
        progress: 0,
        maxProgress: 1,
        completed: false,
        icon: <Users className="w-5 h-5" />,
        category: 'Comunidade',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Achievements
      {
        id: 'achievement-first-robot',
        title: 'Primeiro Robô',
        description: 'Crie seu primeiro robô de trading',
        reward: 500,
        type: 'achievement',
        difficulty: 'easy',
        progress: 1,
        maxProgress: 1,
        completed: true,
        icon: <Star className="w-5 h-5" />,
        category: 'Marco'
      },
      {
        id: 'achievement-robot-master',
        title: 'Mestre dos Robôs',
        description: 'Crie 10 robôs diferentes',
        reward: 1500,
        type: 'achievement',
        difficulty: 'hard',
        progress: 3,
        maxProgress: 10,
        completed: false,
        icon: <Crown className="w-5 h-5" />,
        category: 'Marco'
      },
      {
        id: 'achievement-streak-master',
        title: 'Sequência Perfeita',
        description: 'Mantenha uma sequência de 30 dias de login',
        reward: 1000,
        type: 'achievement',
        difficulty: 'medium',
        progress: 7,
        maxProgress: 30,
        completed: false,
        icon: <Flame className="w-5 h-5" />,
        category: 'Dedicação'
      }
    ];

    const filteredChallenges = allChallenges.filter(challenge => {
      if (activeTab === 'achievements') {
        return challenge.type === 'achievement';
      }
      return challenge.type === activeTab;
    });

    setChallenges(filteredChallenges);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'medium':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'hard':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500 bg-opacity-20 text-blue-400';
      case 'weekly':
        return 'bg-purple-500 bg-opacity-20 text-purple-400';
      case 'monthly':
        return 'bg-orange-500 bg-opacity-20 text-orange-400';
      case 'achievement':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const formatTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return '';
    
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expirado';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d restantes`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m restantes`;
    }
  };

  const claimReward = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true, progress: challenge.maxProgress }
          : challenge
      )
    );
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setTotalEarned(prev => prev + challenge.reward);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md z-50 flex items-center';
      successMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        +${challenge.reward} tokens ganhos!
      `;
      document.body.appendChild(successMessage);

      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
    }
  };

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const completionRate = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              title="Voltar"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                Ganhe Tokens
              </h1>
              <p className="text-gray-400">
                Complete desafios e ganhe tokens para usar recursos de IA
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Sequência atual</p>
            <div className="flex items-center">
              <Flame className="w-5 h-5 text-orange-500 mr-1" />
              <span className="text-2xl font-bold text-orange-400">{streak}</span>
              <span className="text-gray-400 ml-1">dias</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Tokens Ganhos</h3>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-400">{totalEarned.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Este mês</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Desafios Concluídos</h3>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-400">{completedChallenges}</p>
            <p className="text-sm text-gray-400">de {totalChallenges} disponíveis</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Taxa de Conclusão</h3>
              <Award className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{completionRate.toFixed(0)}%</p>
            <p className="text-sm text-gray-400">Neste período</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Próximo Bônus</h3>
              <Gift className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-400">1000</p>
            <p className="text-sm text-gray-400">Em 3 dias (sequência 10)</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg p-1 mb-8 flex">
          {[
            { id: 'daily', label: 'Diários', icon: <Calendar className="w-4 h-4" /> },
            { id: 'weekly', label: 'Semanais', icon: <Clock className="w-4 h-4" /> },
            { id: 'monthly', label: 'Mensais', icon: <Trophy className="w-4 h-4" /> },
            { id: 'achievements', label: 'Conquistas', icon: <Crown className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Challenge List */}
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id}
              className={`bg-gray-800 rounded-lg p-6 border-l-4 ${
                challenge.completed 
                  ? 'border-green-500 bg-green-500 bg-opacity-5' 
                  : 'border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    challenge.completed ? 'bg-green-600' : 'bg-gray-700'
                  }`}>
                    {challenge.completed ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      challenge.icon
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty === 'easy' ? 'Fácil' : 
                         challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(challenge.type)}`}>
                        {challenge.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 mb-3">{challenge.description}</p>
                    
                    {/* Progress Bar */}
                    {challenge.maxProgress > 1 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-gray-400">{challenge.progress}/{challenge.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Time Remaining */}
                    {challenge.expiresAt && !challenge.completed && (
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTimeRemaining(challenge.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 text-yellow-500 mr-1" />
                      <span className="text-xl font-bold text-yellow-400">
                        +{challenge.reward.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">tokens</p>
                  </div>
                  
                  {challenge.completed ? (
                    <div className="flex items-center text-green-400">
                      <Check className="w-5 h-5 mr-1" />
                      <span className="font-medium">Concluído</span>
                    </div>
                  ) : challenge.progress >= challenge.maxProgress ? (
                    <button
                      onClick={() => claimReward(challenge.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium flex items-center"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Resgatar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Navigate to relevant page based on challenge type
                        if (challenge.id.includes('robot')) {
                          navigate('/robots');
                        } else if (challenge.id.includes('analysis')) {
                          navigate('/backtest-analysis');
                        } else {
                          navigate('/dashboard');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium flex items-center"
                    >
                      Começar
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {challenges.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Nenhum desafio disponível
            </h3>
            <p className="text-gray-500">
              Novos desafios serão adicionados em breve!
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
            Dicas para Ganhar Mais Tokens
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Estratégias Diárias</h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Faça login todos os dias para manter sua sequência</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Edite seus robôs regularmente para melhorar estratégias</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use análises de IA para otimizar performance</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Bônus Especiais</h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-start">
                  <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Sequência de 10 dias: +1000 tokens bônus</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Primeiro lugar na competição: +5000 tokens</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Compartilhar estratégia popular: +500 tokens</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}