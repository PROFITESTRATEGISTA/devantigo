import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, Zap, Check, ArrowRight, Shield, Users, 
  Code2, BarChart2, Sparkles, MessageSquare, Star, Building
} from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguageStore } from '../stores/languageStore';

export function PublicPlansPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();
  const [selectedProLevel, setSelectedProLevel] = useState<'pro1' | 'pro2' | 'pro3'>('pro1');

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force component re-render
      setSelectedProLevel(prev => prev);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  // Pro plan levels with details
  const proLevels = {
    pro1: {
      name: 'Pro 1',
      price: 'R$ 259,80/mês',
      robots: 25,
      tokens: 20000,
      features: [
        'Até 25 robôs',
        '20.000 tokens',
        'IA para gerar robôs'
      ]
    },
    pro2: {
      name: 'Pro 2',
      price: 'R$ 499,80/mês',
      robots: 100,
      tokens: 50000,
      features: [
        'Até 100 robôs',
        '50.000 tokens',
        'Suporte dedicado'
      ]
    },
    pro3: {
      name: 'Pro 3',
      price: 'R$ 999,80/mês',
      robots: 500,
      tokens: 100000,
      features: [
        'Até 500 robôs',
        '100.000 tokens',
        'Todos os recursos premium'
      ]
    }
  };

  const tokenPackages = [
    {
      tokens: '2.500',
      price: 'R$ 70,00',
      popular: false
    },
    {
      tokens: '7.500',
      price: 'R$ 150,00',
      popular: true
    },
    {
      tokens: '25.000',
      price: 'R$ 300,00',
      popular: false
    }
  ];

  const handleSignUp = () => {
    navigate('/?signup=true');
  };

  const handleContactSupport = () => {
    const message = language === 'en' 
      ? "Hello, I came from DevHub Trader and want more information about the plans"
      : "Olá vim do DevHub Trader e quero mais informações sobre os planos";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511975333355?text=${encodedMessage}`, '_blank');
  };

  const handleUpgradeClick = (planId: string) => {
    // Determine which plan to upgrade to
    let message = language === 'en' 
      ? "Hello, I came from DevHub Trader and want more information and help to create robots"
      : "Olá vim do DevHub Trader e quero mais informações e ajuda para criar robôs";
    
    switch(planId) {
      case 'pro1':
        message = language === 'en'
          ? `Hello, I came from DevHub Trader and want more information and help to contract the Pro 1 plan (R$ 259.80/month).`
          : `Olá vim do DevHub Trader e quero mais informações e ajuda para contratar o plano Pro 1 (R$ 259,80/mês).`;
        break;
      case 'pro2':
        message = language === 'en'
          ? `Hello, I came from DevHub Trader and want more information and help to contract the Pro 2 plan (R$ 499.80/month).`
          : `Olá vim do DevHub Trader e quero mais informações e ajuda para contratar o plano Pro 2 (R$ 499,80/mês).`;
        break;
      case 'pro3':
        message = language === 'en'
          ? `Hello, I came from DevHub Trader and want more information and help to contract the Pro 3 plan (R$ 999.80/month).`
          : `Olá vim do DevHub Trader e quero mais informações e ajuda para contratar o plano Pro 3 (R$ 999,80/mês).`;
        break;
      case 'business':
        message = language === 'en'
          ? `Hello, I came from DevHub Trader and want more information about the Business plan with custom pricing, personalized robots and tokens for my company.`
          : `Olá vim do DevHub Trader e quero mais informações sobre o plano Business com preços personalizados, robôs e tokens customizados para minha empresa.`;
        break;
      default:
        message = language === 'en'
          ? "Hello, I came from DevHub Trader and want more information about the plans"
          : "Olá vim do DevHub Trader e quero mais informações sobre os planos";
    }
    
    // Encode the message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/5511975333355?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-white">DevHub Trader</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <button 
                onClick={() => navigate('/faq')}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                FAQ
              </button>
              <button 
                onClick={() => navigate('/plans')}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                {language === 'en' ? 'Plans' : 'Planos'}
              </button>
              <button 
                onClick={() => navigate('/?login=true')}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Entrar
              </button>
              <button 
                onClick={() => navigate('/?signup=true')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                Cadastrar <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            
            {/* Mobile menu */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => navigate('/?login=true')}
                  className="text-gray-300 hover:text-white text-sm font-medium"
                >
                  {language === 'en' ? 'Login' : 'Entrar'}
                </button>
                <button 
                  onClick={() => navigate('/?signup=true')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                >
                  {language === 'en' ? 'Sign Up' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile navigation links */}
          <div className="md:hidden border-t border-gray-700 py-2">
            <div className="flex justify-center space-x-6">
              <button 
                onClick={() => navigate('/faq')}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                FAQ
              </button>
              <button 
                onClick={() => navigate('/plans')}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                Planos
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Planos para Todos os Perfis de Trader
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Escolha o plano ideal para suas necessidades de trading automatizado e comece a criar robôs com assistência de IA hoje mesmo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleSignUp}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-lg"
            >
              Começar Gratuitamente
            </button>
            <button
              onClick={handleContactSupport}
              className="px-6 py-3 bg-white text-blue-900 hover:bg-gray-100 rounded-md font-medium text-lg"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{language === 'en' ? 'Our Plans' : 'Nossos Planos'}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {language === 'en' ? 'Choose the plan that best fits your trading needs' : 'Escolha o plano que melhor se adapta às suas necessidades de trading'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-800 rounded-lg p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Free Forever</h3>
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-3xl font-bold mb-4">R$ 0,00</p>
              <p className="text-gray-400 mb-6">
                {language === 'en' ? 'Perfect to get started' : 'Perfeito para começar'}
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Up to 3 trading robots' : 'Até 3 robôs de trading'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? '1,000 monthly tokens' : '1.000 tokens mensais'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Basic backtest analysis' : 'Análise básica de backtest'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Community access' : 'Acesso à comunidade'}</span>
                </li>
              </ul>

              <button 
                onClick={handleSignUp}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-md text-white"
              >
                {language === 'en' ? 'Start Free' : 'Começar Grátis'}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-800 rounded-lg p-6 relative ring-2 ring-blue-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                Mais Popular
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Pro</h3>
                <Star className="w-6 h-6 text-blue-500" />
              </div>
              
              {/* Dynamic Price Display */}
              <p className="text-3xl font-bold mb-4">{proLevels[selectedProLevel].price}</p>
              
              {/* Pro Level Selector */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">
                  Escolha seu nível:
                </p>
                <div className="space-y-2">
                  {Object.entries(proLevels).map(([key, level]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedProLevel(key as 'pro1' | 'pro2' | 'pro3')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedProLevel === key
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      <div className="text-left">
                        <span className="font-medium">{level.name}</span>
                        <p className="text-xs opacity-75">
                          {level.robots} robôs • {level.tokens.toLocaleString()} tokens
                        </p>
                      </div>
                      <span className="text-lg font-bold">{level.price}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">
                {language === 'en' ? 'AI robot creation and advanced features' : 'Criação de robôs com IA e recursos avançados'}
              </p>
              
              <ul className="space-y-3 mb-6">
                {proLevels[selectedProLevel].features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Advanced backtest analysis' : 'Análise avançada de backtest'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Portfolio automation' : 'Automação de portfólios'}</span>
                </li>
              </ul>

              <button 
                onClick={() => handleUpgradeClick(selectedProLevel)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
              >
                Escolher {proLevels[selectedProLevel].name}
              </button>
            </div>

            {/* Business Plan */}
            <div className="bg-gray-800 rounded-lg p-6 relative ring-2 ring-purple-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 rounded-full text-sm font-medium">
                Para Empresas
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Business</h3>
                <Building className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold mb-4 text-purple-400">
                Preço Personalizado
              </p>
              <p className="text-gray-400 mb-6">
                {language === 'en' ? 'Tailored solutions for your business needs' : 'Soluções sob medida para suas necessidades empresariais'}
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Custom robots for your business' : 'Robôs personalizados para seu negócio'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Custom token packages' : 'Pacotes de tokens personalizados'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Dedicated account manager' : 'Gerente de conta dedicado'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Priority 24/7 support' : 'Suporte prioritário 24/7'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'White-label solutions' : 'Soluções white-label'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Custom integrations' : 'Integrações personalizadas'}</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{language === 'en' ? 'Training and onboarding' : 'Treinamento e onboarding'}</span>
                </li>
              </ul>

              <button 
                onClick={() => handleUpgradeClick('business')}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
              >
                {language === 'en' ? 'Contact Our Team' : 'Entrar em Contato com Equipe'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Plan Details Modal Trigger */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Níveis do Plano Pro</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Compare os diferentes níveis do plano Pro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Pro 1 - R$ 259,80/mês</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Até 25 robôs</li>
                <li>• 20.000 tokens</li>
                <li>• IA para gerar robôs</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg ring-2 ring-green-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Pro 2 - R$ 499,80/mês</h4>
                <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Até 100 robôs</li>
                <li>• 50.000 tokens</li>
                <li>• Suporte dedicado</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Pro 3 - R$ 999,80/mês</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Até 500 robôs</li>
                <li>• 100.000 tokens</li>
                <li>• Todos os recursos premium</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Token Packages */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pacotes de Tokens</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Recarregue seus tokens para continuar utilizando os recursos de IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {tokenPackages.map((pkg, index) => (
              <div 
                key={index}
                className={`bg-gray-800 rounded-lg overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-yellow-500' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-yellow-600 text-center py-2">
                    <p className="text-sm font-medium">Melhor Custo-Benefício</p>
                  </div>
                )}
                <div className="p-6 text-center">
                  <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{pkg.tokens}</h3>
                  <p className="text-gray-400 mb-2">tokens</p>
                  <p className="text-xl font-bold mb-6">{pkg.price}</p>
                  
                  <button
                    onClick={handleContactSupport}
                    className={`w-full py-2 rounded-md ${
                      pkg.popular
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    Comprar Tokens
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">O Que Você Pode Fazer</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Conheça os recursos disponíveis em nossa plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 rounded-full p-3 mr-4">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">IA para Gerar Robôs</h3>
              </div>
              <p className="text-gray-300">
                Crie robôs de trading automaticamente com IA. Descreva sua estratégia e receba código pronto para usar. (Disponível a partir do Pro 1)
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-600 rounded-full p-3 mr-4">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Análise de Backtest</h3>
              </div>
              <p className="text-gray-300">
                Analise seus resultados de backtest com IA. Versão Free tem análise simples, planos Pro têm análise completa com insights avançados.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600 rounded-full p-3 mr-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Montagem de Portfólios</h3>
              </div>
              <p className="text-gray-300">
                IA automática para montar portfólios diversificados com suas estratégias, otimizando risco e retorno. (Planos Pro)
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-600 rounded-full p-3 mr-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Colaboração em Tempo Real</h3>
              </div>
              <p className="text-gray-300">
                Colabore com sua equipe em tempo real no desenvolvimento de robôs, com controle de versão integrado.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-600 rounded-full p-3 mr-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Suporte Especializado</h3>
              </div>
              <p className="text-gray-300">
                Receba suporte de especialistas em trading e desenvolvimento para tirar suas dúvidas e resolver problemas.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-600 rounded-full p-3 mr-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Ganhe Tokens</h3>
              </div>
              <p className="text-gray-300">
                Complete desafios da plataforma e ganhe tokens gratuitos. Participe de competições, compartilhe estratégias e contribua com a comunidade.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 rounded-full p-3 mr-4">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">Recursos Premium</h3>
              </div>
              <p className="text-gray-300">
                Acesse recursos exclusivos como indicadores personalizados, análise de mercado e estratégias avançadas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Token Challenges Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ganhe Tokens com Desafios</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Complete desafios diários e semanais para ganhar tokens gratuitos e acelerar seu aprendizado
          </p>
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg font-medium mb-2">🏆 Desafio da Semana</p>
            <p className="text-yellow-100">Crie seu primeiro robô e ganhe 500 tokens extras!</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-gray-400">
              Tire suas dúvidas sobre nossos planos e serviços
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">O que são tokens e como funcionam?</h3>
              <p className="text-gray-300">
                Tokens são a moeda utilizada para acessar recursos de IA na plataforma. Cada interação com a IA (criação de robô, análise de backtest, montagem de portfólios) consome tokens. Você pode ganhar tokens completando desafios ou comprando pacotes adicionais.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Posso mudar de plano a qualquer momento?</h3>
              <p className="text-gray-300">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Ao fazer upgrade, você terá acesso imediato aos novos recursos e tokens. Ao fazer downgrade, as mudanças serão aplicadas no próximo ciclo de faturamento.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Qual a diferença entre análise simples e completa?</h3>
              <p className="text-gray-300">
                A análise simples (Free) fornece métricas básicas como Profit Factor e Win Rate. A análise completa (Pro) inclui insights avançados de IA, sugestões de otimização, análise de correlação e recomendações personalizadas para melhorar sua estratégia.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Como funciona a IA para gerar robôs?</h3>
              <p className="text-gray-300">
                A IA para gerar robôs está disponível a partir do plano Pro 1. Você descreve sua estratégia em linguagem natural e a IA gera automaticamente o código do robô em NTSL, MQL5 ou outras linguagens. O código pode ser exportado diretamente para sua plataforma de trading.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Como ganhar tokens gratuitos?</h3>
              <p className="text-gray-300">
                Você pode ganhar tokens completando desafios da plataforma, como criar seu primeiro robô, fazer análises de backtest, compartilhar estratégias com a comunidade, participar de competições e contribuir com tutoriais. Novos desafios são adicionados semanalmente.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">O que são os robôs gratuitos do plano Free?</h3>
              <p className="text-gray-300">
                O plano Free inclui 3 robôs pré-configurados para você começar: um robô de scalping, um de trend following e um de grid trading. Estes robôs são otimizados e prontos para usar, perfeitos para aprender os conceitos básicos de trading automatizado.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Os tokens expiram?</h3>
              <p className="text-gray-300">
                Tokens incluídos em sua assinatura mensal são renovados a cada ciclo de faturamento. Tokens não utilizados não são acumulados para o próximo mês. Tokens ganhos em desafios e comprados separadamente não expiram.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Posso cancelar minha assinatura?</h3>
              <p className="text-gray-300">
                Sim, você pode cancelar sua assinatura a qualquer momento. Após o cancelamento, você manterá o acesso ao plano atual até o final do período de faturamento. Depois disso, sua conta será convertida para o plano gratuito, mantendo seus robôs existentes dentro do limite do plano gratuito.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Como funciona o suporte?</h3>
              <p className="text-gray-300">
                O nível de suporte varia de acordo com seu plano. O plano Free oferece suporte via comunidade, Pro 1 e Pro 2 incluem suporte por email, Pro 3 oferece suporte prioritário, e Pro 4 inclui suporte dedicado com tempos de resposta mais rápidos.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Posso usar os robôs em qualquer corretora?</h3>
              <p className="text-gray-300">
                Sim! Nossos robôs são compatíveis com as principais plataformas: Profit, MetaTrader 4/5, NTSL e outras. O código gerado pode ser exportado no formato adequado para sua plataforma de preferência.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Ready to Transform Your Trading?' : 'Pronto para Transformar seu Trading?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Join thousands of traders who are already using DevHub Trader to create, analyze and optimize their trading strategies.'
              : 'Junte-se a milhares de traders que já estão usando o DevHub Trader para criar, analisar e otimizar suas estratégias de trading.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleSignUp}
              className="px-8 py-4 bg-white text-blue-900 rounded-md font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              {language === 'en' ? 'Start Now' : 'Comece Agora'}
            </button>
            <button
              onClick={() => navigate('/faq')}
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-bold text-lg transition-colors"
            >
              {language === 'en' ? 'View Complete FAQ' : 'Ver FAQ Completo'}
            </button>
            <button
              onClick={handleContactSupport}
              className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-bold text-lg transition-colors"
            >
              {language === 'en' ? 'Talk to Specialist' : 'Falar com Especialista'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}