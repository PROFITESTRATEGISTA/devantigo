import { create } from 'zustand';

type Language = 'en' | 'pt';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.robots': 'My Robots',
    'nav.community': 'Community',
    'nav.profile': 'Profile',
    'nav.subscription': 'Subscription',
    'nav.experts': 'Experts',
    'nav.signOut': 'Sign Out',
    'nav.dashboard': 'Dashboard',
    'nav.faq': 'FAQ',
    
    // Buttons
    'button.createRobot': 'Create Robot',
    'button.newVersion': 'New Version',
    'button.save': 'Save',
    'button.share': 'Share',
    'button.export': 'Export',
    'button.cancel': 'Cancel',
    'button.back': 'Back',
    'button.analyze': 'Analyze',
    'button.upload': 'Upload',
    'button.download': 'Download',
    
    // Robot actions
    'robot.edit': 'Edit',
    'robot.delete': 'Delete',
    'robot.view': 'View',
    'robot.rename': 'Rename',
    'robot.create': 'Create Robot',
    'robot.noRobots': 'No robots found',
    'robot.createFirst': 'Create your first robot to get started',
    
    // Sharing
    'share.title': 'Share Robot',
    'share.permission': 'Permission Level',
    'share.viewOnly': 'View Only',
    'share.canEdit': 'Can Edit',
    'share.generateLink': 'Generate Link',
    'share.inviteByEmail': 'Invite by Email',
    'share.shareLink': 'Share Link',
    
    // AI Assistant
    'ai.title': 'AI Assistant',
    'ai.placeholder': 'Ask me anything...',
    'ai.createRobot': 'Create Robot with AI',
    'ai.configAssistant': 'Configuration Assistant',
    'ai.clearChat': 'Clear Chat',
    'ai.buyTokens': 'Buy Tokens',
    'ai.notEnoughTokens': 'Not enough tokens. Please buy more.',
    'ai.tokenCost': 'Each AI analysis costs 100 tokens',
    
    // Tokens
    'tokens.balance': 'tokens',
    'tokens.buy': 'Buy Tokens',
    'tokens.insufficient': 'Insufficient tokens',
    'tokens.required': 'tokens required',
    
    // Profile
    'profile.title': 'Profile Settings',
    'profile.photo': 'Profile Photo',
    'profile.email': 'Email Address',
    'profile.name': 'Display Name',
    'profile.save': 'Save Changes',
    'profile.phone': 'Phone Number',
    'profile.currentPlan': 'Current Plan',
    
    // Subscription
    'subscription.title': 'Subscription & Tokens',
    'subscription.current': 'Current Plan',
    'subscription.status': 'Status',
    'subscription.renewal': 'Next Renewal',
    'subscription.manage': 'Manage Subscription',
    'subscription.upgrade': 'Upgrade Plan',
    'subscription.tokenBalance': 'Token Balance',
    
    // Analysis
    'analysis.backtest': 'Backtest Analysis',
    'analysis.strategy': 'Strategy Analysis',
    'analysis.upload': 'Upload Data',
    'analysis.results': 'Analysis Results',
    'analysis.metrics': 'Performance Metrics',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions about the platform',
    'faq.notFound': 'Didn\'t find your answer?',
    'faq.contact': 'Our team is ready to help you with any questions',
    'faq.whatsapp': 'Chat on WhatsApp',
    'faq.email': 'Send Email',
    'faq.backToDashboard': 'Back to Dashboard',
    
    // FAQ Categories
    'faq.category.robots': 'Robot Creation and Management',
    'faq.category.ai': 'AI Assistant',
    'faq.category.analysis': 'Backtest Analysis',
    'faq.category.tokens': 'Tokens and Plans',
    'faq.category.collaboration': 'Collaboration and Sharing',
    'faq.category.technical': 'Technical Support',
    
    // FAQ Questions and Answers
    'faq.robots.q1': 'How to create my first robot?',
    'faq.robots.a1': 'Click "Create Robot" on the robots page, enter a name and start editing. You can use the AI assistant to generate code automatically or program manually in the editor.',
    'faq.robots.q2': 'How many robots can I create?',
    'faq.robots.a2': 'It depends on your plan: Free (5 robots), Pro 1 (25 robots), Pro 2 (100 robots), Pro 3 (500 robots). You can see your current limit in the robots panel.',
    'faq.robots.q3': 'How to share a robot with other users?',
    'faq.robots.a3': 'In the robot editor, click "Share" and choose between generating a public link or inviting specific users by email. You can set view or edit permissions.',
    
    'faq.ai.q1': 'How to use AI to create robots?',
    'faq.ai.a1': 'In the assistant chat, describe your strategy in natural language. For example: "Create a robot that buys when RSI < 30 and sells when RSI > 70". The AI will generate the code automatically.',
    'faq.ai.q2': 'How much does it cost to use AI?',
    'faq.ai.a2': 'Each AI interaction consumes tokens: robot creation (500 tokens), backtest analysis (1000 tokens), strategy optimization (300 tokens). Check your balance in the header.',
    
    'faq.analysis.q1': 'How to upload backtest data?',
    'faq.analysis.a1': 'Go to "Backtest Analysis", drag your CSV file or click to select. The file should contain columns: Date, Entry Price, Exit Price, Result, Direction.',
    'faq.analysis.q2': 'What metrics are calculated?',
    'faq.analysis.a2': 'We calculate Profit Factor, Win Rate, Payoff, Max Drawdown, Sharpe Ratio, Recovery Factor, and analysis by day of week and month.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Overview of your trading activity',
    'dashboard.myRobots': 'My Robots',
    'dashboard.myRobotsDesc': 'Your trading robots',
    'dashboard.analyses': 'Analyses',
    'dashboard.analysesDesc': 'Backtest and strategy analyses',
    'dashboard.ranking': 'Ranking',
    'dashboard.rankingDesc': 'Performance ranking',
    'dashboard.tutorials': 'Tutorials',
    'dashboard.tutorialsDesc': 'Tutorials and guides',
    'dashboard.marketplace': 'Marketplace',
    'dashboard.marketplaceDesc': 'Strategy marketplace',
    'dashboard.users': 'Users',
    'dashboard.usersDesc': 'User community',
    'dashboard.searchRobots': 'Search robots...',
    'dashboard.createRobot': 'Create Robot',
    'dashboard.noRobotsFound': 'No robots found',
    'dashboard.noRobotsCreated': 'No robots created',
    'dashboard.noRobotsSearch': 'No robots match the search',
    'dashboard.createFirstRobot': 'Create your first robot to get started',
    'dashboard.createFirstRobotBtn': 'Create First Robot',
    'dashboard.updatedToday': 'Updated today',
    'dashboard.updatedYesterday': 'Updated yesterday',
    'dashboard.updatedDaysAgo': 'Updated {days} days ago',
    'dashboard.you': 'You',
    'dashboard.viewAllRobots': 'View All Robots',
    
    // Analyses Section
    'analyses.title': 'Recent Analyses',
    'analyses.subtitle': 'Your latest backtest and strategy analyses',
    'analyses.newAnalysis': 'New Analysis',
    'analyses.backtestAnalysis': 'Backtest Analysis',
    'analyses.strategyAnalysis': 'Strategy Analysis',
    'analyses.viewAnalysis': 'View Analysis',
    'analyses.noAnalyses': 'No analyses found',
    'analyses.createFirst': 'Create your first analysis to get started',
    'analyses.profitFactor': 'Profit Factor',
    'analyses.winRate': 'Win Rate',
    'analyses.addToRanking': 'Add to Ranking',
    'analyses.sharpeRatio': 'Sharpe Ratio',
    'analyses.recoveryFactor': 'Recovery Factor',
    'analyses.maxDrawdown': 'Max Drawdown',
    'analyses.totalTrades': 'Total Trades',
    
    // Ranking Section
    'ranking.title': 'Performance Ranking',
    'ranking.subtitle': 'Top performing strategies from the community',
    'ranking.participate': 'Participate',
    'ranking.joinRanking': 'Join Ranking',
    'ranking.viewStrategy': 'View Strategy',
    'ranking.noStrategies': 'No strategies found',
    'ranking.filters': 'Filters',
    'ranking.sortBy': 'Sort by',
    'ranking.order': 'Order',
    'ranking.period': 'Period',
    'ranking.category': 'Category',
    'ranking.highestToLowest': 'Highest to Lowest',
    'ranking.lowestToHighest': 'Lowest to Highest',
    'ranking.allTime': 'All Time',
    'ranking.thisWeek': 'This Week',
    'ranking.thisMonth': 'This Month',
    'ranking.thisYear': 'This Year',
    'ranking.allCategories': 'All Categories',
    'ranking.scalping': 'Scalping',
    'ranking.swingTrading': 'Swing Trading',
    'ranking.trendFollowing': 'Trend Following',
    
    // Tutorials Section
    'tutorials.title': 'Tutorials and Guides',
    'tutorials.subtitle': 'Learn trading strategies and platform features',
    'tutorials.watch': 'Watch',
    'tutorials.duration': 'Duration',
    'tutorials.author': 'Author',
    'tutorials.difficulty': 'Difficulty',
    'tutorials.beginner': 'Beginner',
    'tutorials.intermediate': 'Intermediate',
    'tutorials.advanced': 'Advanced',
    'tutorials.noTutorials': 'No tutorials available',
    
    // Marketplace Section
    'marketplace.title': 'Strategy Marketplace',
    'marketplace.subtitle': 'Discover strategies from expert traders',
    'marketplace.rating': 'Rating',
    'marketplace.strategies': 'strategies',
    'marketplace.viewPartner': 'View Partner',
    'marketplace.explorePartner': 'Explore Partner',
    'marketplace.noPartners': 'No partners available',
    
    // Users Section
    'users.title': 'User Community',
    'users.subtitle': 'Connect with other traders',
    'users.searchUsers': 'Search users...',
    'users.connect': 'Connect',
    'users.shareAnalysis': 'Share Analysis',
    'users.shareRobot': 'Share Robot',
    'users.location': 'Location',
    'users.specialty': 'Specialty',
    'users.noUsers': 'No users found',
    'users.noUsersSearch': 'No users match your search',
    
    // Misc
    'loading': 'Loading...',
    'error': 'An error occurred',
    'success': 'Success!',
    'search': 'Search...',
    'filter': 'Filter',
    'sort': 'Sort',
    'actions': 'Actions',
  },
  pt: {
    // Navigation
    'nav.robots': 'Meus Robôs',
    'nav.community': 'Comunidade',
    'nav.profile': 'Perfil',
    'nav.subscription': 'Assinatura',
    'nav.experts': 'Especialistas',
    'nav.signOut': 'Sair',
    'nav.dashboard': 'Dashboard',
    'nav.faq': 'FAQ',
    
    // Buttons
    'button.createRobot': 'Criar Robô',
    'button.newVersion': 'Nova Versão',
    'button.save': 'Salvar',
    'button.share': 'Compartilhar',
    'button.export': 'Exportar',
    'button.cancel': 'Cancelar',
    'button.back': 'Voltar',
    'button.analyze': 'Analisar',
    'button.upload': 'Enviar',
    'button.download': 'Baixar',
    
    // Robot actions
    'robot.edit': 'Editar',
    'robot.delete': 'Excluir',
    'robot.view': 'Visualizar',
    'robot.rename': 'Renomear',
    'robot.create': 'Criar Robô',
    'robot.noRobots': 'Nenhum robô encontrado',
    'robot.createFirst': 'Crie seu primeiro robô para começar',
    
    // Sharing
    'share.title': 'Compartilhar Robô',
    'share.permission': 'Nível de Permissão',
    'share.viewOnly': 'Apenas Visualização',
    'share.canEdit': 'Pode Editar',
    'share.generateLink': 'Gerar Link',
    'share.inviteByEmail': 'Convidar por Email',
    'share.shareLink': 'Link de Compartilhamento',
    
    // AI Assistant
    'ai.title': 'Assistente de IA',
    'ai.placeholder': 'Pergunte-me qualquer coisa...',
    'ai.createRobot': 'Criar Robô com IA',
    'ai.configAssistant': 'Assistente de Configuração',
    'ai.clearChat': 'Limpar Chat',
    'ai.buyTokens': 'Comprar Tokens',
    'ai.notEnoughTokens': 'Tokens insuficientes. Por favor, compre mais.',
    'ai.tokenCost': 'Cada análise de IA custa 100 tokens',
    
    // Tokens
    'tokens.balance': 'tokens',
    'tokens.buy': 'Comprar Tokens',
    'tokens.insufficient': 'Tokens insuficientes',
    'tokens.required': 'tokens necessários',
    
    // Profile
    'profile.title': 'Configurações de Perfil',
    'profile.photo': 'Foto de Perfil',
    'profile.email': 'Endereço de Email',
    'profile.name': 'Nome de Exibição',
    'profile.save': 'Salvar Alterações',
    'profile.phone': 'Telefone',
    'profile.currentPlan': 'Plano Atual',
    
    // Subscription
    'subscription.title': 'Assinatura e Tokens',
    'subscription.current': 'Plano Atual',
    'subscription.status': 'Status',
    'subscription.renewal': 'Próxima Renovação',
    'subscription.manage': 'Gerenciar Assinatura',
    'subscription.upgrade': 'Atualizar Plano',
    'subscription.tokenBalance': 'Saldo de Tokens',
    
    // Analysis
    'analysis.backtest': 'Análise de Backtest',
    'analysis.strategy': 'Análise de Estratégia',
    'analysis.upload': 'Enviar Dados',
    'analysis.results': 'Resultados da Análise',
    'analysis.metrics': 'Métricas de Performance',
    
    // FAQ
    'faq.title': 'Perguntas Frequentes',
    'faq.subtitle': 'Encontre respostas para as dúvidas mais comuns sobre a plataforma',
    'faq.notFound': 'Não encontrou sua resposta?',
    'faq.contact': 'Nossa equipe está pronta para ajudar você com qualquer dúvida',
    'faq.whatsapp': 'Falar no WhatsApp',
    'faq.email': 'Enviar Email',
    'faq.backToDashboard': 'Voltar ao Dashboard',
    
    // FAQ Categories
    'faq.category.robots': 'Criação e Gerenciamento de Robôs',
    'faq.category.ai': 'Assistente de IA',
    'faq.category.analysis': 'Análise de Backtest',
    'faq.category.tokens': 'Tokens e Planos',
    'faq.category.collaboration': 'Colaboração e Compartilhamento',
    'faq.category.technical': 'Suporte Técnico',
    
    // FAQ Questions and Answers
    'faq.robots.q1': 'Como criar meu primeiro robô?',
    'faq.robots.a1': 'Clique em "Criar Robô" na página de robôs, digite um nome e comece a editar. Você pode usar o assistente de IA para gerar código automaticamente ou programar manualmente no editor.',
    'faq.robots.q2': 'Quantos robôs posso criar?',
    'faq.robots.a2': 'Depende do seu plano: Free (5 robôs), Pro 1 (25 robôs), Pro 2 (100 robôs), Pro 3 (500 robôs). Você pode ver seu limite atual no painel de robôs.',
    'faq.robots.q3': 'Como compartilhar um robô com outros usuários?',
    'faq.robots.a3': 'No editor do robô, clique em "Compartilhar" e escolha entre gerar um link público ou convidar usuários específicos por email. Você pode definir permissões de visualização ou edição.',
    
    'faq.ai.q1': 'Como usar a IA para criar robôs?',
    'faq.ai.a1': 'No chat do assistente, descreva sua estratégia em linguagem natural. Por exemplo: "Crie um robô que compra quando RSI < 30 e vende quando RSI > 70". A IA gerará o código automaticamente.',
    'faq.ai.q2': 'Quanto custa usar a IA?',
    'faq.ai.a2': 'Cada interação com a IA consome tokens: criação de robô (500 tokens), análise de backtest (1000 tokens), otimização de estratégia (300 tokens). Consulte seu saldo no header.',
    
    'faq.analysis.q1': 'Como fazer upload de dados de backtest?',
    'faq.analysis.a1': 'Vá para "Backtest Analysis", arraste seu arquivo CSV ou clique para selecionar. O arquivo deve conter colunas: Data, Preço Entrada, Preço Saída, Resultado, Direção.',
    'faq.analysis.q2': 'Que métricas são calculadas?',
    'faq.analysis.a2': 'Calculamos Profit Factor, Win Rate, Payoff, Max Drawdown, Sharpe Ratio, Recovery Factor, e análises por dia da semana e mês.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Visão geral da sua atividade de trading',
    'dashboard.myRobots': 'Meus Robôs',
    'dashboard.myRobotsDesc': 'Seus robôs de trading',
    'dashboard.analyses': 'Análises',
    'dashboard.analysesDesc': 'Análises de backtest e estratégias',
    'dashboard.ranking': 'Ranking',
    'dashboard.rankingDesc': 'Ranking de performance',
    'dashboard.tutorials': 'Tutoriais',
    'dashboard.tutorialsDesc': 'Tutoriais e guias',
    'dashboard.marketplace': 'Marketplace',
    'dashboard.marketplaceDesc': 'Marketplace de estratégias',
    'dashboard.users': 'Usuários',
    'dashboard.usersDesc': 'Comunidade de usuários',
    'dashboard.searchRobots': 'Buscar robôs...',
    'dashboard.createRobot': 'Criar Robô',
    'dashboard.noRobotsFound': 'Nenhum robô encontrado',
    'dashboard.noRobotsCreated': 'Nenhum robô criado',
    'dashboard.noRobotsSearch': 'Nenhum robô corresponde à busca',
    'dashboard.createFirstRobot': 'Crie seu primeiro robô para começar',
    'dashboard.createFirstRobotBtn': 'Criar Primeiro Robô',
    'dashboard.updatedToday': 'Atualizado hoje',
    'dashboard.updatedYesterday': 'Atualizado ontem',
    'dashboard.updatedDaysAgo': 'Atualizado há {days} dias',
    'dashboard.you': 'Você',
    'dashboard.viewAllRobots': 'Ver Todos os Robôs',
    
    // Analyses Section
    'analyses.title': 'Análises Recentes',
    'analyses.subtitle': 'Suas últimas análises de backtest e estratégias',
    'analyses.newAnalysis': 'Nova Análise',
    'analyses.backtestAnalysis': 'Análise de Backtest',
    'analyses.strategyAnalysis': 'Análise de Estratégia',
    'analyses.viewAnalysis': 'Ver Análise',
    'analyses.noAnalyses': 'Nenhuma análise encontrada',
    'analyses.createFirst': 'Crie sua primeira análise para começar',
    'analyses.profitFactor': 'Fator de Lucro',
    'analyses.winRate': 'Taxa de Acerto',
    'analyses.addToRanking': 'Adicionar ao Ranking',
    'analyses.sharpeRatio': 'Sharpe Ratio',
    'analyses.recoveryFactor': 'Fator de Recuperação',
    'analyses.maxDrawdown': 'Drawdown Máximo',
    'analyses.totalTrades': 'Total de Trades',
    
    // Ranking Section
    'ranking.title': 'Ranking de Performance',
    'ranking.subtitle': 'Estratégias com melhor desempenho da comunidade',
    'ranking.participate': 'Participar',
    'ranking.joinRanking': 'Entrar no Ranking',
    'ranking.viewStrategy': 'Ver Estratégia',
    'ranking.noStrategies': 'Nenhuma estratégia encontrada',
    'ranking.filters': 'Filtros',
    'ranking.sortBy': 'Ordenar por',
    'ranking.order': 'Ordem',
    'ranking.period': 'Período',
    'ranking.category': 'Categoria',
    'ranking.highestToLowest': 'Maior para Menor',
    'ranking.lowestToHighest': 'Menor para Maior',
    'ranking.allTime': 'Todos os Tempos',
    'ranking.thisWeek': 'Esta Semana',
    'ranking.thisMonth': 'Este Mês',
    'ranking.thisYear': 'Este Ano',
    'ranking.allCategories': 'Todas as Categorias',
    'ranking.scalping': 'Scalping',
    'ranking.swingTrading': 'Swing Trading',
    'ranking.trendFollowing': 'Trend Following',
    
    // Tutorials Section
    'tutorials.title': 'Tutoriais e Guias',
    'tutorials.subtitle': 'Aprenda estratégias de trading e recursos da plataforma',
    'tutorials.watch': 'Assistir',
    'tutorials.duration': 'Duração',
    'tutorials.author': 'Autor',
    'tutorials.difficulty': 'Dificuldade',
    'tutorials.beginner': 'Iniciante',
    'tutorials.intermediate': 'Intermediário',
    'tutorials.advanced': 'Avançado',
    'tutorials.noTutorials': 'Nenhum tutorial disponível',
    
    // Marketplace Section
    'marketplace.title': 'Marketplace de Estratégias',
    'marketplace.subtitle': 'Descubra estratégias de traders especialistas',
    'marketplace.rating': 'Avaliação',
    'marketplace.strategies': 'estratégias',
    'marketplace.viewPartner': 'Ver Parceiro',
    'marketplace.explorePartner': 'Conhecer Parceiro',
    'marketplace.noPartners': 'Nenhum parceiro disponível',
    
    // Users Section
    'users.title': 'Comunidade de Usuários',
    'users.subtitle': 'Conecte-se com outros traders',
    'users.searchUsers': 'Buscar usuários...',
    'users.connect': 'Conectar',
    'users.shareAnalysis': 'Compartilhar Análise',
    'users.shareRobot': 'Compartilhar Robô',
    'users.location': 'Localização',
    'users.specialty': 'Especialidade',
    'users.noUsers': 'Nenhum usuário encontrado',
    'users.noUsersSearch': 'Nenhum usuário corresponde à busca',
    
    // Misc
    'loading': 'Carregando...',
    'error': 'Ocorreu um erro',
    'success': 'Sucesso!',
    'search': 'Buscar...',
    'filter': 'Filtrar',
    'sort': 'Ordenar',
    'actions': 'Ações',
  }
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en', // Default language
  
  setLanguage: (language: Language) => {
    set({ language });
    // Save to localStorage for persistence
    localStorage.setItem('preferredLanguage', language);
    
    // Trigger a custom event to notify all components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  },
  
  t: (key: string) => {
    const { language } = get();
    return translations[language][key] || translations['en'][key] || key;
  }
}));

// Initialize language from localStorage if available
if (typeof window !== 'undefined') {
  const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
    useLanguageStore.getState().setLanguage(savedLanguage);
  }
}