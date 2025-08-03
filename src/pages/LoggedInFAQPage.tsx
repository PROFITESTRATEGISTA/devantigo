import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Zap, Code2, BarChart2, Users, Crown, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export function LoggedInFAQPage() {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const faqCategories = [
    {
      id: 'robots',
      title: 'Criação e Gerenciamento de Robôs',
      icon: <Code2 className="w-6 h-6 text-blue-500" />,
      questions: [
        {
          question: 'Como criar meu primeiro robô?',
          answer: 'Clique em "Criar Robô" na página de robôs, digite um nome e comece a editar. Você pode usar o assistente de IA para gerar código automaticamente ou programar manualmente no editor.'
        },
        {
          question: 'Quantos robôs posso criar?',
          answer: 'Depende do seu plano: Free (5 robôs), Pro 1 (25 robôs), Pro 2 (100 robôs), Pro 3 (500 robôs). Você pode ver seu limite atual no painel de robôs.'
        },
        {
          question: 'Como compartilhar um robô com outros usuários?',
          answer: 'No editor do robô, clique em "Compartilhar" e escolha entre gerar um link público ou convidar usuários específicos por email. Você pode definir permissões de visualização ou edição.'
        },
        {
          question: 'Como criar versões do meu robô?',
          answer: 'No editor, clique em "Nova Versão" ou use Ctrl+Alt+S. Dê um nome descritivo, adicione uma descrição e tags para organizar suas versões.'
        },
        {
          question: 'Posso recuperar uma versão deletada?',
          answer: 'Não, versões deletadas não podem ser recuperadas. Recomendamos fazer backup do código importante antes de deletar versões.'
        }
      ]
    },
    {
      id: 'ai',
      title: 'Assistente de IA',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      questions: [
        {
          question: 'Como usar a IA para criar robôs?',
          answer: 'No chat do assistente, descreva sua estratégia em linguagem natural. Por exemplo: "Crie um robô que compra quando RSI < 30 e vende quando RSI > 70". A IA gerará o código automaticamente.'
        },
        {
          question: 'Quanto custa usar a IA?',
          answer: 'Cada interação com a IA consome tokens: criação de robô (500 tokens), análise de backtest (1000 tokens), otimização de estratégia (300 tokens). Consulte seu saldo no header.'
        },
        {
          question: 'A IA pode modificar robôs existentes?',
          answer: 'Sim! Selecione um robô no editor e peça para a IA fazer modificações específicas, como "adicionar stop loss" ou "otimizar parâmetros do RSI".'
        },
        {
          question: 'Que linguagens a IA suporta?',
          answer: 'A IA pode gerar código em NTSL (Profit), MQL4/MQL5 (MetaTrader), Pine Script (TradingView) e Python para backtesting.'
        }
      ]
    },
    {
      id: 'analysis',
      title: 'Análise de Backtest',
      icon: <BarChart2 className="w-6 h-6 text-green-500" />,
      questions: [
        {
          question: 'Como fazer upload de dados de backtest?',
          answer: 'Vá para "Backtest Analysis", arraste seu arquivo CSV ou clique para selecionar. O arquivo deve conter colunas: Data, Preço Entrada, Preço Saída, Resultado, Direção.'
        },
        {
          question: 'Que métricas são calculadas?',
          answer: 'Calculamos Profit Factor, Win Rate, Payoff, Max Drawdown, Sharpe Ratio, Recovery Factor, e análises por dia da semana e mês.'
        },
        {
          question: 'Como interpretar o Profit Factor?',
          answer: 'Profit Factor = Lucro Bruto / Perda Bruta. Valores > 1.5 são excelentes, > 1.0 são aceitáveis, < 1.0 indicam estratégia perdedora.'
        },
        {
          question: 'Posso adicionar minha análise ao ranking?',
          answer: 'Sim! Após a análise, clique em "Adicionar ao Ranking" para compartilhar seus resultados com a comunidade e competir com outras estratégias.'
        }
      ]
    },
    {
      id: 'tokens',
      title: 'Tokens e Planos',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      questions: [
        {
          question: 'Como ganhar tokens gratuitos?',
          answer: 'Complete desafios: criar primeiro robô (+500), primeira análise (+200), compartilhar estratégia (+100), login diário (+10), participar de competições (até 1000).'
        },
        {
          question: 'Como comprar mais tokens?',
          answer: 'Clique no contador de tokens no header ou vá para "Assinatura". Pacotes disponíveis: 2.500 tokens (R$ 70), 7.500 tokens (R$ 150), 25.000 tokens (R$ 300).'
        },
        {
          question: 'Os tokens expiram?',
          answer: 'Tokens mensais do plano são renovados a cada ciclo. Tokens comprados separadamente e ganhos em desafios nunca expiram.'
        },
        {
          question: 'Como fazer upgrade do plano?',
          answer: 'Vá para "Assinatura" e escolha um plano superior. O upgrade é aplicado imediatamente com acesso a mais robôs e tokens.'
        }
      ]
    },
    {
      id: 'collaboration',
      title: 'Colaboração e Compartilhamento',
      icon: <Users className="w-6 h-6 text-blue-500" />,
      questions: [
        {
          question: 'Como colaborar em tempo real?',
          answer: 'Compartilhe seu robô com permissão de "Editar". Outros usuários poderão editar simultaneamente, com sincronização automática das alterações.'
        },
        {
          question: 'Como aceitar convites de colaboração?',
          answer: 'Vá para "Perfil" e veja a seção "Convites Pendentes". Clique em "Aceitar" para ter acesso ao robô compartilhado.'
        },
        {
          question: 'Posso revogar acesso compartilhado?',
          answer: 'Sim! No modal de compartilhamento do robô, você verá todos os convites ativos e pode revogá-los a qualquer momento.'
        },
        {
          question: 'Como funciona o controle de versões?',
          answer: 'Cada robô mantém um histórico de versões. Você pode criar, renomear, deletar versões e alternar entre elas no editor.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Suporte Técnico',
      icon: <Shield className="w-6 h-6 text-red-500" />,
      questions: [
        {
          question: 'Meu robô não está salvando. O que fazer?',
          answer: 'Verifique sua conexão com a internet. Se o problema persistir, tente recarregar a página ou entre em contato pelo WhatsApp.'
        },
        {
          question: 'Como exportar meus robôs?',
          answer: 'No editor, clique no menu "Exportar" e escolha "Copiar para Área de Transferência" ou "Download como Arquivo".'
        },
        {
          question: 'Posso usar os robôs em qualquer plataforma?',
          answer: 'Sim! Os robôs são compatíveis com Profit (NTSL), MetaTrader 4/5, TradingView e outras plataformas. O código é exportável no formato adequado.'
        },
        {
          question: 'Como reportar bugs ou problemas?',
          answer: 'Entre em contato via WhatsApp ou email. Descreva o problema detalhadamente e, se possível, inclua capturas de tela.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Perguntas Frequentes
            </h1>
            <p className="text-gray-400">
              Encontre respostas para as dúvidas mais comuns sobre a plataforma
            </p>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {faqCategories.map((category) => (
            <div key={category.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  {category.icon}
                  <h2 className="ml-3 text-xl font-bold">{category.title}</h2>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedCategory === category.id && (
                <div className="px-6 pb-6 space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold mb-2 flex items-start">
                        <HelpCircle className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-300 leading-relaxed ml-7">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Não encontrou sua resposta?</h2>
          <p className="text-blue-100 mb-6">
            Nossa equipe está pronta para ajudar você com qualquer dúvida
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                const message = "Olá! Tenho uma dúvida sobre a plataforma DevHub Trader que não encontrei no FAQ.";
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/5511975333355?text=${encodedMessage}`, '_blank');
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              Falar no WhatsApp
            </button>
            <button
              onClick={() => window.open('mailto:suporte@devhubtrader.com.br', '_blank')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            >
              Enviar Email
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}