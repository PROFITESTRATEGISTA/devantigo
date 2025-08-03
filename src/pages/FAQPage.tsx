import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Zap, Code2, BarChart2, Users, Crown, Shield, Gift } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguageStore } from '../stores/languageStore';

export function FAQPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force component re-render by updating state
      navigate('/faq', { replace: true });
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, [navigate]);

  const faqCategories = [
    {
      title: language === 'en' ? 'Plans and Pricing' : 'Planos e Preços',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      questions: [
        {
          question: language === 'en' ? 'What\'s the difference between Pro 1, Pro 2, Pro 3 and Pro 4 plans?' : 'Qual a diferença entre os planos Pro 1, Pro 2, Pro 3 e Pro 4?',
          answer: language === 'en' ? 'Pro 1 ($259.80): Up to 25 robots, AI to generate robots, 20,000 tokens. Pro 2 ($499.80): Up to 100 robots, 50,000 tokens, dedicated support. Pro 3 ($999.80): Up to 500 robots, 100,000 tokens, all premium features.' : 'Pro 1 (R$ 259,80): Até 25 robôs, IA para gerar robôs, 20.000 tokens. Pro 2 (R$ 499,80): Até 100 robôs, 50.000 tokens, suporte dedicado. Pro 3 (R$ 999,80): Até 500 robôs, 100.000 tokens, todos os recursos premium.'
        },
        {
          question: language === 'en' ? 'Does the Free plan have limitations?' : 'O plano Free tem limitações?',
          answer: language === 'en' ? 'Yes, the Free plan includes up to 3 trading robots, 3 free pre-configured robots, 1,000 monthly tokens, simple backtest analysis (without advanced AI), and support via community and WhatsApp group. Does not include AI to generate robots.' : 'Sim, o plano Free inclui até 3 robôs de trading, 3 robôs gratuitos pré-configurados, 1.000 tokens mensais, análise simples de backtest (sem IA avançada), e suporte via comunidade e grupo WhatsApp. Não inclui IA para gerar robôs.'
        },
        {
          question: language === 'en' ? 'Can I upgrade or downgrade at any time?' : 'Posso fazer upgrade ou downgrade a qualquer momento?',
          answer: language === 'en' ? 'Yes, you can change your plan at any time. Upgrades are applied immediately, downgrades take effect on the next billing cycle.' : 'Sim, você pode alterar seu plano a qualquer momento. Upgrades são aplicados imediatamente, downgrades entram em vigor no próximo ciclo de faturamento.'
        },
        {
          question: language === 'en' ? 'How does the trial period work?' : 'Como funciona o período de teste?',
          answer: language === 'en' ? 'We offer 7 free days to test any Pro plan. During this period, you have full access to all features of the chosen plan.' : 'Oferecemos 7 dias gratuitos para testar qualquer plano Pro. Durante este período, você tem acesso completo a todos os recursos do plano escolhido.'
        }
      ]
    },
    {
      title: language === 'en' ? 'Tokens and Challenges' : 'Tokens e Desafios',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      questions: [
        {
          question: language === 'en' ? 'How to earn free tokens?' : 'Como ganhar tokens gratuitos?',
          answer: language === 'en' ? 'Complete daily and weekly challenges: create first robot (+500 tokens), make first analysis (+200 tokens), share strategy (+100 tokens), participate in competitions (up to 1000 tokens), contribute tutorials (+300 tokens).' : 'Complete desafios diários e semanais: criar primeiro robô (+500 tokens), fazer primeira análise (+200 tokens), compartilhar estratégia (+100 tokens), participar de competições (até 1000 tokens), contribuir com tutoriais (+300 tokens).'
        },
        {
          question: language === 'en' ? 'What challenges are available?' : 'Quais são os desafios disponíveis?',
          answer: language === 'en' ? 'Daily Challenges: Daily login (+10 tokens), backtest analysis (+50 tokens). Weekly Challenges: Create robot (+500 tokens), optimize strategy (+300 tokens). Monthly Challenges: Performance competition (+2000 tokens), community tutorial (+1000 tokens).' : 'Desafios Diários: Login diário (+10 tokens), análise de backtest (+50 tokens). Desafios Semanais: Criar robô (+500 tokens), otimizar estratégia (+300 tokens). Desafios Mensais: Competição de performance (+2000 tokens), tutorial da comunidade (+1000 tokens).'
        },
        {
          question: language === 'en' ? 'Do tokens expire?' : 'Os tokens expiram?',
          answer: language === 'en' ? 'Monthly plan tokens are renewed each cycle. Tokens earned from challenges and purchased separately never expire. Unused monthly plan tokens are not carried over.' : 'Tokens mensais do plano são renovados a cada ciclo. Tokens ganhos em desafios e comprados separadamente nunca expiram. Tokens não utilizados do plano mensal não são acumulados.'
        },
        {
          question: language === 'en' ? 'How much do extra tokens cost?' : 'Quanto custam os tokens extras?',
          answer: language === 'en' ? 'Available packages: 2,500 tokens ($70.00), 7,500 tokens ($150.00), 25,000 tokens ($300.00). Extra tokens never expire and can be used anytime.' : 'Pacotes disponíveis: 2.500 tokens (R$ 70,00), 7.500 tokens (R$ 150,00), 25.000 tokens (R$ 300,00). Tokens extras nunca expiram e podem ser usados a qualquer momento.'
        }
      ]
    },
    {
      title: language === 'en' ? 'AI and Robot Generation' : 'IA e Geração de Robôs',
      icon: <Code2 className="w-6 h-6 text-blue-500" />,
      questions: [
        {
          question: language === 'en' ? 'How does AI work to generate robots?' : 'Como funciona a IA para gerar robôs?',
          answer: language === 'en' ? 'Available from Pro 1. You describe your strategy in natural language ("Create a robot that buys when RSI < 30") and AI automatically generates code in NTSL, MQL5 or other languages. The process takes 30-60 seconds.' : 'Disponível a partir do Pro 1. Você descreve sua estratégia em linguagem natural ("Crie um robô que compra quando RSI < 30") e a IA gera automaticamente o código em NTSL, MQL5 ou outras linguagens. O processo leva 30-60 segundos.'
        },
        {
          question: language === 'en' ? 'Can I modify the code generated by AI?' : 'Posso modificar o código gerado pela IA?',
          answer: language === 'en' ? 'Yes! The generated code is fully editable. You can modify parameters, add filters, adjust entry/exit logic. AI can also make modifications based on your requests.' : 'Sim! O código gerado é totalmente editável. Você pode modificar parâmetros, adicionar filtros, ajustar lógica de entrada/saída. A IA também pode fazer modificações baseadas em suas solicitações.'
        },
        {
          question: language === 'en' ? 'Which platforms are supported?' : 'Quais plataformas são suportadas?',
          answer: language === 'en' ? 'We generate code for: Profit (NTSL), MetaTrader 4/5 (MQL4/MQL5), TradingView (Pine Script), Python (for backtesting), and other popular platforms. Code is exportable in compatible format.' : 'Geramos código para: Profit (NTSL), MetaTrader 4/5 (MQL4/MQL5), TradingView (Pine Script), Python (para backtesting), e outras plataformas populares. O código é exportável em formato compatível.'
        },
        {
          question: language === 'en' ? 'Can AI create complex strategies?' : 'A IA pode criar estratégias complexas?',
          answer: language === 'en' ? 'Yes! AI can create from simple strategies (moving average crossover) to complex ones (arbitrage, grid trading, machine learning). The more detailed your description, the better the result.' : 'Sim! A IA pode criar desde estratégias simples (cruzamento de médias) até complexas (arbitragem, grid trading, machine learning). Quanto mais detalhada sua descrição, melhor o resultado.'
        }
      ]
    },
    {
      title: language === 'en' ? 'Backtest Analysis' : 'Análise de Backtest',
      icon: <BarChart2 className="w-6 h-6 text-green-500" />,
      questions: [
        {
          question: language === 'en' ? 'What\'s the difference between simple and complete analysis?' : 'Qual a diferença entre análise simples e completa?',
          answer: language === 'en' ? 'Simple Analysis (Free): Basic metrics like Profit Factor, Win Rate, Drawdown. Complete Analysis (Pro): AI insights, optimization suggestions, correlation analysis, pattern identification, personalized recommendations.' : 'Análise Simples (Free): Métricas básicas como Profit Factor, Win Rate, Drawdown. Análise Completa (Pro): Insights de IA, sugestões de otimização, análise de correlação, identificação de padrões, recomendações personalizadas.'
        },
        {
          question: language === 'en' ? 'What file format can I use?' : 'Que formato de arquivo posso usar?',
          answer: language === 'en' ? 'We accept CSV files with columns: Date, Time, Asset, Direction (Buy/Sell), Entry Price, Exit Price, Result, Volume (optional). Maximum 10MB per file.' : 'Aceitamos arquivos CSV com colunas: Data, Hora, Ativo, Direção (Compra/Venda), Preço Entrada, Preço Saída, Resultado, Volume (opcional). Máximo 10MB por arquivo.'
        },
        {
          question: language === 'en' ? 'How long does the analysis take?' : 'Quanto tempo demora a análise?',
          answer: language === 'en' ? 'Simple analysis: 10-30 seconds. Complete analysis with AI: 1-3 minutes. More complex analyses (>1000 trades) can take up to 5 minutes.' : 'Análise simples: 10-30 segundos. Análise completa com IA: 1-3 minutos. Análises mais complexas (>1000 trades) podem levar até 5 minutos.'
        },
        {
          question: language === 'en' ? 'Can I analyze multiple strategies?' : 'Posso analisar múltiplas estratégias?',
          answer: language === 'en' ? 'Yes! You can upload multiple CSVs and compare strategies side by side. AI can suggest optimal combinations for portfolio diversification.' : 'Sim! Você pode fazer upload de múltiplos CSVs e comparar estratégias lado a lado. A IA pode sugerir combinações ótimas para diversificação de portfólio.'
        }
      ]
    },
    {
      title: language === 'en' ? 'Portfolio Assembly' : 'Montagem de Portfólios',
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      questions: [
        {
          question: language === 'en' ? 'How does automatic portfolio assembly work?' : 'Como funciona a montagem automática de portfólios?',
          answer: language === 'en' ? 'AI analyzes your strategies and creates diversified portfolios based on correlation, risk, return and drawdown. Suggests capital allocation and automatic rebalancing.' : 'A IA analisa suas estratégias e cria portfólios diversificados baseados em correlação, risco, retorno e drawdown. Sugere alocação de capital e rebalanceamento automático.'
        },
        {
          question: language === 'en' ? 'Can I customize the suggested portfolios?' : 'Posso personalizar os portfólios sugeridos?',
          answer: language === 'en' ? 'Yes! You can adjust weights, add/remove strategies, define risk limits and configure rebalancing rules. AI learns your preferences over time.' : 'Sim! Você pode ajustar pesos, adicionar/remover estratégias, definir limites de risco e configurar regras de rebalanceamento. A IA aprende suas preferências ao longo do tempo.'
        },
        {
          question: language === 'en' ? 'How many strategies can I use to build a portfolio?' : 'Com quantas estratégias posso montar um portfólio?',
          answer: language === 'en' ? 'We recommend 3-8 strategies for optimal diversification. AI can work with 2-20 strategies, but more than 10 may generate unnecessary complexity.' : 'Recomendamos 3-8 estratégias para diversificação ótima. A IA pode trabalhar com 2-20 estratégias, mas mais de 10 pode gerar complexidade desnecessária.'
        },
        {
          question: language === 'en' ? 'Is the portfolio rebalanced automatically?' : 'O portfólio é rebalanceado automaticamente?',
          answer: language === 'en' ? 'Yes, you can configure automatic rebalancing: daily, weekly, monthly or performance-based. AI monitors correlations and adjusts allocations as needed.' : 'Sim, você pode configurar rebalanceamento automático: diário, semanal, mensal ou baseado em performance. A IA monitora correlações e ajusta alocações conforme necessário.'
        }
      ]
    },
    {
      title: language === 'en' ? 'Support and Community' : 'Suporte e Comunidade',
      icon: <Users className="w-6 h-6 text-blue-500" />,
      questions: [
        {
          question: language === 'en' ? 'How does support work in each plan?' : 'Como funciona o suporte em cada plano?',
          answer: language === 'en' ? 'Free and Pro 1: Support via community and WhatsApp group. Pro 2 and Pro 3: Dedicated support with priority response. All plans have access to the community WhatsApp group.' : 'Free e Pro 1: Suporte via comunidade e grupo WhatsApp. Pro 2 e Pro 3: Suporte dedicado com resposta prioritária. Todos os planos têm acesso ao grupo WhatsApp da comunidade.'
        },
        {
          question: language === 'en' ? 'Can I share my robots?' : 'Posso compartilhar meus robôs?',
          answer: language === 'en' ? 'Yes! You can share robots with other users, set permissions (view/edit), create public links and participate in the community. Sharing generates extra tokens.' : 'Sim! Você pode compartilhar robôs com outros usuários, definir permissões (visualizar/editar), criar links públicos e participar da comunidade. Compartilhamentos geram tokens extras.'
        },
        {
          question: language === 'en' ? 'Is there a strategy marketplace?' : 'Existe marketplace de estratégias?',
          answer: language === 'en' ? 'Yes! Users can sell/buy verified strategies. Sellers earn 70% of the value, platform keeps 30%. All strategies undergo performance verification.' : 'Sim! Usuários podem vender/comprar estratégias verificadas. Vendedores ganham 70% do valor, plataforma fica com 30%. Todas as estratégias passam por verificação de performance.'
        },
        {
          question: language === 'en' ? 'How to report bugs or suggest improvements?' : 'Como reportar bugs ou sugerir melhorias?',
          answer: language === 'en' ? 'Use the integrated feedback system in the platform, email support@devhubtrader.com.br or report via community. Confirmed bugs generate reward tokens.' : 'Use o sistema de feedback integrado na plataforma, envie email para suporte@devhubtrader.com.br ou reporte via comunidade. Bugs confirmados geram tokens de recompensa.'
        }
      ]
    },
    {
      title: language === 'en' ? 'Security and Data' : 'Segurança e Dados',
      icon: <Shield className="w-6 h-6 text-red-500" />,
      questions: [
        {
          question: language === 'en' ? 'Are my data secure?' : 'Meus dados estão seguros?',
          answer: language === 'en' ? 'Yes! We use AES-256 encryption, secure servers, automatic backup and GDPR compliance. Your codes and strategies are private by default.' : 'Sim! Usamos criptografia AES-256, servidores seguros, backup automático e conformidade com LGPD. Seus códigos e estratégias são privados por padrão.'
        },
        {
          question: language === 'en' ? 'Do you have access to my robots?' : 'Vocês têm acesso aos meus robôs?',
          answer: language === 'en' ? 'No! Your robots are private by default. We only have access if you share publicly or request specific support. We never share data without permission.' : 'Não! Seus robôs são privados por padrão. Só temos acesso se você compartilhar publicamente ou solicitar suporte específico. Nunca compartilhamos dados sem permissão.'
        },
        {
          question: language === 'en' ? 'Can I export my data?' : 'Posso exportar meus dados?',
          answer: language === 'en' ? 'Yes! You can export all your robots, analyses and data anytime in JSON, CSV or source code format. No platform lock-in.' : 'Sim! Você pode exportar todos os seus robôs, análises e dados a qualquer momento em formato JSON, CSV ou código fonte. Não há lock-in na plataforma.'
        },
        {
          question: language === 'en' ? 'What happens if I cancel?' : 'O que acontece se eu cancelar?',
          answer: language === 'en' ? 'Your data remains available for 90 days after cancellation. You can export everything during this period. After 90 days, data is permanently removed (according to GDPR).' : 'Seus dados permanecem disponíveis por 90 dias após cancelamento. Você pode exportar tudo neste período. Após 90 dias, dados são removidos permanentemente (conforme LGPD).'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Code2 className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">DevHub Trader</span>
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
            
            {/* Mobile menu */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => navigate('/?login=true')}
                  className="text-gray-300 hover:text-white px-2 py-1 rounded-md text-sm font-medium"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => navigate('/?signup=true')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                >
                  Cadastrar
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/plans')}
              className="mr-4 p-2 hover:bg-blue-800 rounded-full transition-colors"
              title="Voltar para planos"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Perguntas Frequentes
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Encontre respostas para as dúvidas mais comuns sobre a plataforma DevHub Trader
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-900 px-6 py-4 flex items-center">
                  {category.icon}
                  <h2 className="ml-3 text-2xl font-bold">{category.title}</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-b border-gray-700 last:border-b-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-semibold mb-3 flex items-start">
                        <HelpCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-300 leading-relaxed ml-7">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{language === 'en' ? 'Didn\'t find your answer?' : 'Não encontrou sua resposta?'}</h2>
            <p className="text-blue-100 mb-6">
              {language === 'en' ? 'Our team is ready to help you with any questions' : 'Nossa equipe está pronta para ajudar você com qualquer dúvida'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  const message = language === 'en' ? "Hello! I have a question about the DevHub Trader platform that I didn't find in the FAQ." : "Olá! Tenho uma dúvida sobre a plataforma DevHub Trader que não encontrei no FAQ.";
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/5511975333355?text=${encodedMessage}`, '_blank');
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
              >
                {language === 'en' ? 'Chat on WhatsApp' : 'Falar no WhatsApp'}
              </button>
              <button
                onClick={() => window.open('mailto:suporte@devhubtrader.com.br', '_blank')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                {language === 'en' ? 'Send Email' : 'Enviar Email'}
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium"
              >
                {language === 'en' ? 'Back to Home' : 'Voltar ao Início'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}