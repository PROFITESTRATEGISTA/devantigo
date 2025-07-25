import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Bot, 
  BarChart2, 
  Upload, 
  ChevronDown, 
  Play, 
  Clock, 
  Star,
  Lightbulb,
  ImageIcon,
  Zap,
  Shield
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Mock data para análises
  const mockAnalyses = [
    {
      id: 1,
      title: 'Análise WINFUT - Estratégia Scalping',
      date: '2024-01-15',
      profitFactor: 2.34,
      winRate: 68,
      trades: 156,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Backtest PETR4 - Swing Trade',
      date: '2024-01-14',
      profitFactor: 1.87,
      winRate: 45,
      trades: 89,
      status: 'completed'
    }
  ];

  // Mock data para feed de atividades
  const mockFeedPosts = [
    {
      id: 1,
      type: 'robot_created',
      title: 'Novo robô criado',
      description: 'Robô "Scalper WINFUT v2.1" foi criado com sucesso',
      timestamp: '2 horas atrás',
      icon: <Bot className="w-5 h-5 text-blue-400" />,
      color: 'blue'
    },
    {
      id: 2,
      type: 'analysis_completed',
      title: 'Análise de backtest concluída',
      description: 'Análise da estratégia "Swing PETR4" finalizada com Profit Factor 1.87',
      timestamp: '4 horas atrás',
      icon: <BarChart2 className="w-5 h-5 text-green-400" />,
      color: 'green'
    },
    {
      id: 3,
      type: 'collaboration',
      title: 'Nova colaboração',
      description: 'João Silva foi adicionado como colaborador no projeto "Trend Following"',
      timestamp: '1 dia atrás',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      color: 'purple'
    },
    {
      id: 4,
      type: 'optimization',
      title: 'Otimização sugerida',
      description: 'IA identificou oportunidade de melhoria no robô "Scalper M5"',
      timestamp: '2 dias atrás',
      icon: <TrendingUp className="w-5 h-5 text-orange-400" />,
      color: 'orange'
    },
    {
      id: 5,
      type: 'tutorial_completed',
      title: 'Tutorial concluído',
      description: 'Tutorial "Análise de métricas avançadas" foi finalizado',
      timestamp: '3 dias atrás',
      icon: <Star className="w-5 h-5 text-yellow-400" />,
      color: 'yellow'
    }
  ];

  // Mock data para tutoriais
  const mockTutorials = [
    {
      title: 'Como fazer upload de CSV',
      duration: '8 min',
      level: 'Fácil',
      description: 'Aprenda a preparar e enviar dados de backtest para análise completa',
      icon: <Upload className="w-6 h-6 text-green-400" />,
      actionText: 'Fazer Upload Agora',
      actionUrl: '/backtest-analysis',
      steps: [
        {
          title: 'Prepare seus dados de backtest',
          description: 'Exporte os resultados do seu backtest em formato CSV. O arquivo deve conter colunas como: Data, Hora, Ativo, Direção (Compra/Venda), Preço de Entrada, Preço de Saída, Resultado (Lucro/Prejuízo), Volume.',
          imageDescription: 'Screenshot mostrando exemplo de planilha CSV formatada',
          tips: 'Certifique-se de que as datas estão no formato DD/MM/AAAA e os valores monetários usam ponto como separador decimal.'
        },
        {
          title: 'Acesse a página de análise',
          description: 'Navegue até a seção "Análise de Backtest" no menu principal. Você verá uma área de upload onde pode arrastar e soltar seu arquivo CSV.',
          imageDescription: 'Interface da página de análise com área de upload destacada',
          tips: 'A área de upload aceita arquivos de até 10MB. Para arquivos maiores, considere filtrar apenas os dados mais relevantes.'
        },
        {
          title: 'Faça o upload do arquivo',
          description: 'Clique na área de upload ou arraste seu arquivo CSV diretamente. O sistema validará automaticamente o formato e mostrará uma prévia dos dados.',
          imageDescription: 'Processo de upload com barra de progresso e validação',
          tips: 'Se houver erros de formato, o sistema mostrará sugestões específicas para corrigir o arquivo.'
        },
        {
          title: 'Inicie a análise com IA',
          description: 'Após o upload bem-sucedido, clique em "Analisar Backtest". A IA processará seus dados e gerará métricas detalhadas como Profit Factor, Sharpe Ratio, Drawdown Máximo e muito mais.',
          imageDescription: 'Botão de análise e indicador de progresso da IA',
          tips: 'A análise consome 1000 tokens. Certifique-se de ter saldo suficiente antes de iniciar.'
        },
        {
          title: 'Interprete os resultados',
          description: 'Revise o relatório gerado com métricas de performance, pontos fortes e fracos da estratégia, e sugestões de otimização personalizadas.',
          imageDescription: 'Dashboard de resultados com gráficos e métricas',
          tips: 'Use o chat com IA para fazer perguntas específicas sobre os resultados e obter insights adicionais.'
        }
      ]
    },
    {
      title: 'Gerar código de robô com IA',
      duration: '12 min',
      level: 'Médio',
      description: 'Tutorial completo para criar robôs de trading automaticamente usando IA',
      icon: <Bot className="w-6 h-6 text-blue-400" />,
      actionText: 'Criar Robô com IA',
      actionUrl: '/robots',
      steps: [
        {
          title: 'Defina sua estratégia de trading',
          description: 'Antes de usar a IA, tenha uma ideia clara da sua estratégia. Pense nos indicadores que quer usar (médias móveis, RSI, MACD), condições de entrada e saída, e regras de gerenciamento de risco.',
          imageDescription: 'Diagrama mostrando elementos de uma estratégia de trading',
          tips: 'Quanto mais específico você for na descrição, melhor será o código gerado pela IA.'
        },
        {
          title: 'Acesse o editor de robôs',
          description: 'Vá para "Meus Robôs" e clique em "Criar Robô". Você será direcionado para o editor onde encontrará o chat da IA no painel lateral esquerdo.',
          imageDescription: 'Interface do editor com chat da IA destacado',
          tips: 'O editor suporta múltiplas linguagens: NTSL (Profit), MQL5 (MetaTrader) e outras plataformas.'
        },
        {
          title: 'Descreva sua estratégia para a IA',
          description: 'No chat da IA, descreva detalhadamente sua estratégia. Exemplo: "Crie um robô que compra quando a média móvel de 9 períodos cruza acima da de 21, com stop loss de 50 pontos e take profit de 100 pontos."',
          imageDescription: 'Chat da IA com exemplo de prompt detalhado',
          tips: 'Inclua informações sobre timeframe, ativo, horários de operação e regras específicas de entrada/saída.',
          code: `// Exemplo de prompt para IA:
"Crie um robô para WINFUT que:
- Use médias móveis 9 e 21
- Compre no cruzamento para cima
- Stop loss: 50 pontos
- Take profit: 100 pontos
- Opere apenas das 9h às 17h"`
        },
        {
          title: 'Revise e ajuste o código gerado',
          description: 'A IA gerará o código automaticamente. Revise a lógica, teste os parâmetros e faça ajustes se necessário. Você pode pedir à IA para modificar partes específicas.',
          imageDescription: 'Editor mostrando código gerado com destaque nas seções principais',
          tips: 'Use o chat para pedir modificações: "Adicione um filtro de volume mínimo" ou "Mude o stop loss para trailing stop".'
        },
        {
          title: 'Salve e teste seu robô',
          description: 'Salve o código como uma nova versão, dê um nome descritivo e adicione tags relevantes. Depois, teste em conta demo antes de usar em operações reais.',
          imageDescription: 'Modal de salvamento com campos de versão e tags',
          tips: 'Use tags como "scalping", "trend-following", "M5", "WINFUT" para organizar melhor seus robôs.'
        }
      ]
    },
    {
      title: 'Como usar no Profit',
      duration: '15 min',
      level: 'Médio',
      description: 'Configuração completa e implementação na plataforma Profit',
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      actionText: 'Ver Documentação Profit',
      actionUrl: '/tutorials',
      steps: [
        {
          title: 'Exporte o código do robô',
          description: 'No editor do DevHub Trader, clique em "Exportar" e escolha "Download as File". Isso salvará seu código em formato .txt compatível com o Profit.',
          imageDescription: 'Menu de exportação com opções de download',
          tips: 'Sempre exporte a versão mais recente e testada do seu robô.'
        },
        {
          title: 'Abra o Profit e acesse o Editor',
          description: 'Na plataforma Profit, vá em "Ferramentas" > "Editor de Estratégias" ou pressione F4. Isso abrirá o ambiente de desenvolvimento integrado.',
          imageDescription: 'Interface do Profit com menu Ferramentas destacado',
          tips: 'Certifique-se de estar conectado à sua conta e com a plataforma atualizada.'
        },
        {
          title: 'Importe e configure o código',
          description: 'No editor do Profit, crie um novo arquivo (.src) e cole o código exportado. Ajuste os parâmetros de entrada conforme necessário para seu estilo de trading.',
          imageDescription: 'Editor do Profit com código importado e parâmetros visíveis',
          tips: 'Revise todos os parâmetros como stop loss, take profit e tamanho de posição antes de compilar.',
          code: `// Parâmetros típicos no Profit:
input
  StopLoss: integer = 50;
  TakeProfit: integer = 100;
  Contratos: integer = 1;
  HorarioInicio: time = 0900;
  HorarioFim: time = 1700;`
        },
        {
          title: 'Compile e teste o robô',
          description: 'Pressione F7 para compilar o código. Se não houver erros, teste primeiro em modo simulação para verificar se a lógica está funcionando corretamente.',
          imageDescription: 'Console de compilação mostrando sucesso e modo de teste',
          tips: 'Sempre teste em simulação por pelo menos alguns dias antes de usar dinheiro real.'
        },
        {
          title: 'Configure e ative o robô',
          description: 'Após os testes, configure os parâmetros finais, defina o capital a ser usado e ative o robô em conta real. Monitore os primeiros trades de perto.',
          imageDescription: 'Painel de configuração final com robô ativo',
          tips: 'Comece com capital pequeno e aumente gradualmente conforme ganha confiança nos resultados.'
        }
      ]
    },
    {
      title: 'Análise de métricas',
      duration: '18 min',
      level: 'Avançado',
      description: 'Entenda Sharpe Ratio, Drawdown, Profit Factor e outras métricas essenciais',
      icon: <BarChart2 className="w-6 h-6 text-red-400" />,
      actionText: 'Analisar Métricas',
      actionUrl: '/backtest-analysis',
      steps: [
        {
          title: 'Profit Factor - A métrica fundamental',
          description: 'O Profit Factor é a razão entre lucro bruto e perda bruta. Valores acima de 1.5 são considerados bons, acima de 2.0 são excelentes. É a primeira métrica a analisar em qualquer estratégia.',
          imageDescription: 'Gráfico mostrando cálculo do Profit Factor com exemplos',
          tips: 'Um Profit Factor de 1.0 significa que você não ganha nem perde dinheiro. Abaixo de 1.0 indica estratégia perdedora.'
        },
        {
          title: 'Drawdown Máximo - Controle de risco',
          description: 'O Drawdown Máximo mostra a maior perda consecutiva da estratégia. Idealmente deve ficar abaixo de 20%. É crucial para determinar o capital necessário e o risco psicológico.',
          imageDescription: 'Curva de equity mostrando períodos de drawdown',
          tips: 'Multiplique o drawdown máximo por 3 para estimar o capital mínimo necessário para operar com segurança.'
        },
        {
          title: 'Sharpe Ratio - Retorno ajustado ao risco',
          description: 'O Sharpe Ratio mede o retorno em relação à volatilidade. Valores acima de 1.0 são bons, acima de 2.0 são excelentes. Ajuda a comparar diferentes estratégias.',
          imageDescription: 'Comparação de Sharpe Ratio entre diferentes estratégias',
          tips: 'Uma estratégia com menor retorno mas Sharpe maior pode ser melhor que uma com alto retorno e alta volatilidade.'
        },
        {
          title: 'Win Rate vs Payoff - O equilíbrio perfeito',
          description: 'Win Rate é a porcentagem de trades vencedores. Payoff é a razão entre ganho médio e perda média. Você pode ter sucesso com alta win rate e baixo payoff, ou vice-versa.',
          imageDescription: 'Matriz mostrando combinações de Win Rate e Payoff',
          tips: 'Estratégias de scalping tendem a ter alta win rate e baixo payoff. Estratégias de tendência têm baixa win rate e alto payoff.'
        },
        {
          title: 'Análise temporal - Quando operar',
          description: 'Analise a performance por dia da semana, mês e horário. Isso ajuda a identificar os melhores momentos para ativar sua estratégia e quando evitar o mercado.',
          imageDescription: 'Heatmap mostrando performance por período temporal',
          tips: 'Sextas-feiras e vésperas de feriado costumam ter comportamento diferente. Considere filtrar esses períodos.'
        },
        {
          title: 'Métricas avançadas - Recovery Factor e MAE/MFE',
          description: 'Recovery Factor (Lucro Líquido / Drawdown Máximo) mede a capacidade de recuperação. MAE (Maximum Adverse Excursion) e MFE (Maximum Favorable Excursion) ajudam a otimizar stops.',
          imageDescription: 'Dashboard com métricas avançadas e interpretação',
          tips: 'Recovery Factor acima de 3.0 indica boa capacidade de recuperação. Use MAE/MFE para ajustar seus stops de forma mais eficiente.'
        }
      ]
    },
    {
      title: 'Dicas de otimização',
      duration: '20 min',
      level: 'Avançado',
      description: 'Técnicas avançadas para melhorar a performance dos seus robôs de trading',
      icon: <Zap className="w-6 h-6 text-red-400" />,
      actionText: 'Otimizar Estratégia',
      actionUrl: '/strategy-analysis',
      steps: [
        {
          title: 'Análise de correlação entre parâmetros',
          description: 'Use ferramentas de otimização para identificar quais parâmetros têm maior impacto na performance. Evite over-optimization testando em dados out-of-sample.',
          imageDescription: 'Matriz de correlação entre parâmetros da estratégia',
          tips: 'Otimize no máximo 3-4 parâmetros por vez. Muitos parâmetros podem levar a curve fitting.'
        },
        {
          title: 'Filtros de mercado e volatilidade',
          description: 'Adicione filtros baseados em volatilidade (ATR), volume ou condições de mercado. Isso pode melhorar significativamente a qualidade dos sinais.',
          imageDescription: 'Código mostrando implementação de filtros de mercado',
          tips: 'Evite operar em mercados muito voláteis ou muito calmos. Use ATR para medir a volatilidade atual.',
          code: `// Exemplo de filtro de volatilidade:
var
  atr_atual, atr_medio: float;
begin
  atr_atual := atr(14);
  atr_medio := sma(atr_atual, 20);
  
  // Só opera se volatilidade estiver normal
  if (atr_atual > atr_medio * 0.7) and 
     (atr_atual < atr_medio * 1.5) then
    // Sua lógica de entrada aqui
end;`
        },
        {
          title: 'Gerenciamento dinâmico de posição',
          description: 'Implemente sizing baseado em volatilidade ou performance recente. Reduza o tamanho após perdas consecutivas e aumente após sequência de ganhos.',
          imageDescription: 'Gráfico mostrando ajuste dinâmico do tamanho de posição',
          tips: 'Use o Kelly Criterion como base, mas seja conservador. Nunca arrisque mais que 2% do capital por trade.'
        },
        {
          title: 'Trailing stops inteligentes',
          description: 'Implemente trailing stops baseados em ATR ou suporte/resistência dinâmicos. Isso pode melhorar significativamente o payoff da estratégia.',
          imageDescription: 'Comparação entre stop fixo e trailing stop baseado em ATR',
          tips: 'Ative o trailing stop apenas após o trade estar no lucro por uma margem mínima (ex: 1.5x o ATR).'
        },
        {
          title: 'Análise de regime de mercado',
          description: 'Identifique diferentes regimes de mercado (tendência, lateral, alta volatilidade) e ajuste os parâmetros automaticamente para cada regime.',
          imageDescription: 'Classificação automática de regimes de mercado',
          tips: 'Use indicadores como ADX para tendência e Bollinger Bands para volatilidade na classificação de regimes.'
        },
        {
          title: 'Backtesting robusto e walk-forward',
          description: 'Implemente walk-forward analysis para validar a robustez da estratégia. Teste em diferentes períodos e condições de mercado.',
          imageDescription: 'Processo de walk-forward analysis com múltiplos períodos',
          tips: 'Reserve pelo menos 30% dos dados para teste out-of-sample. Se a performance degradar muito, a estratégia pode estar overfitted.'
        }
      ]
    },
    {
      title: 'Gerenciamento de risco',
      duration: '25 min',
      level: 'Avançado',
      description: 'Estratégias essenciais para proteger seu capital e maximizar longevidade',
      icon: <Shield className="w-6 h-6 text-red-400" />,
      actionText: 'Implementar Gestão de Risco',
      actionUrl: '/robots',
      steps: [
        {
          title: 'Regra dos 2% - Fundamento do risk management',
          description: 'Nunca arrisque mais que 2% do seu capital total em um único trade. Esta regra simples pode ser a diferença entre sucesso e falência no trading.',
          imageDescription: 'Calculadora mostrando cálculo de risco por trade',
          tips: 'Com a regra dos 2%, você pode ter 50 trades perdedores consecutivos e ainda manter seu capital. Isso dá tempo para a estratégia se recuperar.'
        },
        {
          title: 'Diversificação de estratégias',
          description: 'Não coloque todos os ovos na mesma cesta. Use múltiplas estratégias não-correlacionadas para reduzir o risco geral do portfólio.',
          imageDescription: 'Portfolio com múltiplas estratégias e correlações',
          tips: 'Combine estratégias de tendência com mean reversion, diferentes timeframes e ativos para máxima diversificação.'
        },
        {
          title: 'Stop loss dinâmico baseado em ATR',
          description: 'Use o Average True Range (ATR) para definir stops que se adaptam à volatilidade do mercado. Stops muito apertados geram whipsaws, muito largos aumentam perdas.',
          imageDescription: 'Comparação entre stop fixo e stop baseado em ATR',
          tips: 'Uma boa regra é usar 2x ATR(14) como stop loss inicial. Ajuste conforme o comportamento da sua estratégia.',
          code: `// Stop loss baseado em ATR:
var
  atr_value, stop_distance: float;
begin
  atr_value := atr(14);
  stop_distance := atr_value * 2.0;
  
  if position > 0 then
    set_stop_loss(entryPrice - stop_distance)
  else if position < 0 then
    set_stop_loss(entryPrice + stop_distance);
end;`
        },
        {
          title: 'Controle de drawdown em tempo real',
          description: 'Monitore o drawdown da sua conta em tempo real. Se exceder 15-20%, considere reduzir o tamanho das posições ou pausar as operações.',
          imageDescription: 'Dashboard de monitoramento de drawdown em tempo real',
          tips: 'Implemente alertas automáticos quando o drawdown atingir 10%, 15% e 20% para tomar ações preventivas.'
        },
        {
          title: 'Gestão de capital por Kelly Criterion',
          description: 'Use a fórmula de Kelly para calcular o tamanho ótimo de posição baseado na win rate e payoff da sua estratégia. Sempre use uma fração do Kelly (25-50%).',
          imageDescription: 'Calculadora Kelly Criterion com exemplos práticos',
          tips: 'Kelly = (Win Rate × Payoff - (1 - Win Rate)) / Payoff. Nunca use 100% do Kelly, sempre uma fração conservadora.'
        },
        {
          title: 'Plano de contingência e circuit breakers',
          description: 'Defina regras claras para quando parar de operar: drawdown máximo, número de perdas consecutivas, mudanças de mercado. Tenha um plano antes de precisar dele.',
          imageDescription: 'Fluxograma de decisão para circuit breakers',
          tips: 'Escreva suas regras de contingência quando estiver calmo e racional. Na hora do stress, apenas siga o plano.'
        }
      ]
    }
  ];

  const displayedPosts = showAllPosts ? mockFeedPosts : mockFeedPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-700/50 rounded-lg p-1">
              <button
                onClick={() => setActiveSection('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSection === 'overview'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveSection('feed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSection === 'feed'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
                }`}
              >
                Feed de Atividades
              </button>
              <button
                onClick={() => setActiveSection('tutorials')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSection === 'tutorials'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
                }`}
              >
                Tutoriais
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Visão Geral */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Robôs Ativos</p>
                      <p className="text-3xl font-bold text-white mt-1">12</p>
                    </div>
                    <Bot className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">+2 este mês</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm font-medium">Análises Realizadas</p>
                      <p className="text-3xl font-bold text-white mt-1">47</p>
                    </div>
                    <BarChart2 className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">+8 esta semana</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm font-medium">Colaborações</p>
                      <p className="text-3xl font-bold text-white mt-1">8</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">+1 hoje</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-xl p-6 border border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-300 text-sm font-medium">Profit Factor Médio</p>
                      <p className="text-3xl font-bold text-white mt-1">2.1</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">Excelente</span>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-6">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate('/robots')}
                    className="flex items-center space-x-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg border border-blue-500/30 transition-all group"
                  >
                    <Bot className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Meus Robôs</span>
                  </button>

                  <button
                    onClick={() => navigate('/backtest-analysis')}
                    className="flex items-center space-x-3 p-4 bg-green-600/20 hover:bg-green-600/30 rounded-lg border border-green-500/30 transition-all group"
                  >
                    <Upload className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Analisar Backtest</span>
                  </button>

                  <button
                    onClick={() => navigate('/strategy-analysis')}
                    className="flex items-center space-x-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-all group"
                  >
                    <BarChart2 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Análise de Estratégia</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('tutorials')}
                    className="flex items-center space-x-3 p-4 bg-orange-600/20 hover:bg-orange-600/30 rounded-lg border border-orange-500/30 transition-all group"
                  >
                    <Play className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Ver Tutoriais</span>
                  </button>
                </div>
              </div>

              {/* Análises Recentes */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Análises Recentes</h2>
                  <button
                    onClick={() => navigate('/backtest-analysis')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Ver todas →
                  </button>
                </div>
                <div className="space-y-4">
                  {mockAnalyses.map((analysis) => (
                    <div key={analysis.id} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">{analysis.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{analysis.date}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <p className="text-gray-400">Profit Factor</p>
                            <p className={`font-semibold ${analysis.profitFactor >= 2 ? 'text-green-400' : analysis.profitFactor >= 1.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {analysis.profitFactor}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400">Win Rate</p>
                            <p className="font-semibold text-blue-400">{analysis.winRate}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400">Trades</p>
                            <p className="font-semibold text-white">{analysis.trades}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feed de Atividades */}
          {activeSection === 'feed' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Feed de Atividades</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Última atualização: agora</span>
                </div>
              </div>

              <div className="space-y-4">
                {displayedPosts.map((post) => (
                  <div key={post.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${post.color}-500/20`}>
                        {post.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{post.title}</h3>
                          <span className="text-sm text-gray-400">{post.timestamp}</span>
                        </div>
                        <p className="text-gray-300 mt-1">{post.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!showAllPosts && mockFeedPosts.length > 3 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllPosts(true)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                  >
                    Ver mais atividades
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tutoriais */}
          {activeSection === 'tutorials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Tutoriais Práticos</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Star className="w-4 h-4" />
                  <span>{mockTutorials.length} tutoriais disponíveis</span>
                </div>
              </div>

              <div className="space-y-6">
                {mockTutorials.map((tutorial, index) => (
                  <TutorialCard key={index} tutorial={tutorial} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente TutorialCard
const TutorialCard = ({ tutorial }: { tutorial: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-700/30 rounded-xl overflow-hidden">
      {/* Header do Tutorial */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              tutorial.level === 'Fácil' ? 'bg-green-500/20' :
              tutorial.level === 'Médio' ? 'bg-blue-500/20' : 'bg-red-500/20'
            }`}>
              {tutorial.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{tutorial.title}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm text-gray-400">{tutorial.duration}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tutorial.level === 'Fácil' ? 'bg-green-500/20 text-green-400' :
                  tutorial.level === 'Médio' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {tutorial.level}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">{tutorial.steps?.length || 0} passos</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-2">{tutorial.description}</p>
      </div>
      
      {/* Conteúdo Expandido */}
      {isExpanded && (
        <div className="border-t border-gray-600/50">
          <div className="p-6 space-y-6">
            {tutorial.steps?.map((step: any, stepIndex: number) => (
              <div key={stepIndex} className="flex space-x-4">
                {/* Número do Passo */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {stepIndex + 1}
                  </div>
                  {stepIndex < tutorial.steps.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-600 mx-auto mt-2"></div>
                  )}
                </div>
                
                {/* Conteúdo do Passo */}
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{step.description}</p>
                  
                  {/* Espaço para Imagem */}
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-3 border-2 border-dashed border-gray-600">
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Imagem: {step.imageDescription}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dicas Adicionais */}
                  {step.tips && (
                    <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-blue-400 mb-1">Dica:</p>
                          <p className="text-xs text-blue-300">{step.tips}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Código de Exemplo */}
                  {step.code && (
                    <div className="bg-gray-900 rounded-lg p-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-400">Código de exemplo:</span>
                        <button className="text-xs text-blue-400 hover:text-blue-300">
                          Copiar
                        </button>
                      </div>
                      <pre className="text-xs text-green-400 overflow-x-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Botão de Ação Final */}
            <div className="pt-4 border-t border-gray-600/50">
              <button
                onClick={() => {
                  if (tutorial.actionUrl) {
                    navigate(tutorial.actionUrl);
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium transition-all duration-300"
              >
                {tutorial.actionText || 'Começar Agora'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;