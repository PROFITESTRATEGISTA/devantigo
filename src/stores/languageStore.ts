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
    'nav.robots': 'Robots',
    'nav.community': 'Community',
    'nav.profile': 'Profile',
    'nav.subscription': 'Subscription',
    'nav.experts': 'Experts',
    'nav.signOut': 'Sign Out',
    'nav.dashboard': 'Dashboard',
    'nav.faq': 'FAQ',
    'nav.earnTokens': 'Tokens',
    
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
    'faq.category.platforms': 'Trading Platforms',
    'faq.category.tokens': 'Tokens and Challenges',
    'faq.category.plans': 'Plans and Pricing',
    'faq.category.collaboration': 'Collaboration and Sharing',
    'faq.category.security': 'Security and Privacy',
    'faq.category.technical': 'Technical Support',
    'faq.category.marketplace': 'Strategy Marketplace',
    
    // FAQ Questions and Answers
    'faq.robots.q1': 'How to create my first robot?',
    'faq.robots.a1': 'Click "Create Robot" on the robots page, enter a name and start editing. You can use the AI assistant to generate code automatically or program manually in the editor.',
    'faq.robots.q2': 'How many robots can I create?',
    'faq.robots.a2': 'It depends on your plan: Free (5 robots), Pro 1 (25 robots), Pro 2 (100 robots), Pro 3 (500 robots). You can see your current limit in the robots panel.',
    'faq.robots.q3': 'How to share a robot with other users?',
    'faq.robots.a3': 'In the robot editor, click "Share" and choose between generating a public link or inviting specific users by email. You can set view or edit permissions.',
    
    // Platforms
    'faq.platforms.q1': 'Which trading platforms are supported?',
    'faq.platforms.a1': 'We support Profit (NTSL), MetaTrader 4/5 (MQL4/MQL5), TradingView (Pine Script), Python for backtesting, and other popular platforms. Code can be exported in compatible formats.',
    'faq.platforms.q2': 'Can I use the robots on any broker?',
    'faq.platforms.a2': 'Yes! Our robots are compatible with most brokers that support the respective platforms. The generated code is standard and works with any compatible broker.',
    'faq.platforms.q3': 'How do I export my robot to MetaTrader?',
    'faq.platforms.a3': 'In the robot editor, click "Export" and select "MetaTrader 4/5". The code will be converted to MQL format and downloaded as an .mq4 or .mq5 file.',
    'faq.platforms.q4': 'Do you support cryptocurrency exchanges?',
    'faq.platforms.a4': 'Currently we focus on traditional markets (stocks, forex, futures). Cryptocurrency support is planned for future releases.',
    
    'faq.ai.q1': 'How to use AI to create robots?',
    'faq.ai.a1': 'In the assistant chat, describe your strategy in natural language. For example: "Create a robot that buys when RSI < 30 and sells when RSI > 70". The AI will generate the code automatically.',
    'faq.ai.q2': 'How much does it cost to use AI?',
    'faq.ai.a2': 'Each AI interaction consumes tokens: robot creation (500 tokens), backtest analysis (1000 tokens), strategy optimization (300 tokens). Check your balance in the header.',
    
    // Tokens
    'faq.tokens.q1': 'How do I earn free tokens?',
    'faq.tokens.a1': 'Complete daily and weekly challenges: create first robot (+500 tokens), first analysis (+200 tokens), share strategy (+100 tokens), participate in competitions (up to 1000 tokens), contribute tutorials (+300 tokens).',
    'faq.tokens.q2': 'What challenges are available?',
    'faq.tokens.a2': 'Daily: Daily login (+10 tokens), backtest analysis (+50 tokens). Weekly: Create robot (+500 tokens), optimize strategy (+300 tokens). Monthly: Performance competition (+2000 tokens), community tutorial (+1000 tokens).',
    'faq.tokens.q3': 'Do tokens expire?',
    'faq.tokens.a3': 'Monthly plan tokens are renewed each cycle. Tokens earned from challenges and purchased separately never expire. Unused monthly tokens are not carried over.',
    'faq.tokens.q4': 'How much do extra tokens cost?',
    'faq.tokens.a4': 'Available packages: 2,500 tokens ($70), 7,500 tokens ($150), 25,000 tokens ($300). Extra tokens never expire and can be used anytime.',
    'faq.tokens.q5': 'Can I transfer tokens to other users?',
    'faq.tokens.a5': 'No, tokens are non-transferable and tied to your account. However, you can share robots and analyses with other users for free.',
    
    'faq.analysis.q1': 'How to upload backtest data?',
    'faq.analysis.a1': 'Go to "Backtest Analysis", drag your CSV file or click to select. The file should contain columns: Date, Entry Price, Exit Price, Result, Direction.',
    'faq.analysis.q2': 'What metrics are calculated?',
    'faq.analysis.a2': 'We calculate Profit Factor, Win Rate, Payoff, Max Drawdown, Sharpe Ratio, Recovery Factor, and analysis by day of week and month.',
    
    // Collaboration
    'faq.collaboration.q1': 'How does real-time collaboration work?',
    'faq.collaboration.a1': 'Multiple users can edit the same robot simultaneously. Changes are synchronized in real-time, and you can see who is editing what section of the code.',
    'faq.collaboration.q2': 'Can I control who has access to my robots?',
    'faq.collaboration.a2': 'Yes! You can set permissions (view-only or edit) for each collaborator and revoke access at any time. You maintain full control over your robots.',
    'faq.collaboration.q3': 'How do I resolve conflicts when multiple people edit?',
    'faq.collaboration.a3': 'Our system uses operational transformation to merge changes automatically. If conflicts occur, the system will highlight them and allow manual resolution.',
    'faq.collaboration.q4': 'Is there a limit to collaborators per robot?',
    'faq.collaboration.a4': 'Free plan: 2 collaborators per robot. Pro plans: unlimited collaborators. All collaborators need their own DevHub Trader accounts.',
    
    // Plans
    'faq.plans.q1': 'What\'s the difference between Pro 1, Pro 2, and Pro 3?',
    'faq.plans.a1': 'Pro 1 ($259.80): Up to 25 robots, AI robot generation, 20,000 tokens. Pro 2 ($499.80): Up to 100 robots, 50,000 tokens, dedicated support. Pro 3 ($999.80): Up to 500 robots, 100,000 tokens, all premium features.',
    'faq.plans.q2': 'Can I upgrade or downgrade anytime?',
    'faq.plans.a2': 'Yes! Upgrades are applied immediately. Downgrades take effect at the next billing cycle. You keep access to current plan features until then.',
    'faq.plans.q3': 'What happens if I cancel my subscription?',
    'faq.plans.a3': 'Your account reverts to the Free plan. You keep your existing robots (up to the free limit) and can export all your data. Premium features become unavailable.',
    'faq.plans.q4': 'Do you offer refunds?',
    'faq.plans.a4': 'We offer a 7-day money-back guarantee for new subscriptions. Contact support within 7 days if you\'re not satisfied.',
    'faq.plans.q5': 'Can I pause my subscription?',
    'faq.plans.a5': 'Currently we don\'t offer subscription pausing. You can cancel and resubscribe later, but you\'ll lose any unused monthly tokens.',
    
    // Security
    'faq.security.q1': 'How secure is my data?',
    'faq.security.a1': 'We use AES-256 encryption, secure servers, automatic backups, and GDPR compliance. Your code and strategies are private by default.',
    'faq.security.q2': 'Can DevHub Trader access my robots?',
    'faq.security.a2': 'No! Your robots are private by default. We only have access if you share them publicly or request specific support. We never share data without permission.',
    'faq.security.q3': 'Can I export my data?',
    'faq.security.a3': 'Yes! You can export all your robots, analyses, and data anytime in JSON, CSV, or source code format. No platform lock-in.',
    'faq.security.q4': 'What happens to my data if I delete my account?',
    'faq.security.a4': 'Your data is permanently deleted within 30 days of account deletion, in compliance with GDPR. You can export everything before deletion.',
    
    // Technical
    'faq.technical.q1': 'My robot isn\'t working as expected. What should I do?',
    'faq.technical.a1': 'First, check the robot\'s logic and parameters. Use our debugging tools and AI assistant for help. If issues persist, contact support with your robot details.',
    'faq.technical.q2': 'How do I optimize my robot\'s performance?',
    'faq.technical.a2': 'Use our AI analysis tools to identify weaknesses, run backtests with different parameters, and follow the optimization suggestions provided by our system.',
    'faq.technical.q3': 'Can I import robots from other platforms?',
    'faq.technical.a3': 'Yes! You can paste code from MetaTrader, TradingView, or other platforms. Our AI can help convert and adapt the code to work optimally.',
    'faq.technical.q4': 'What programming languages do you support?',
    'faq.technical.a4': 'We support NTSL (Profit), MQL4/MQL5 (MetaTrader), Pine Script (TradingView), Python, and can generate code for most trading platforms.',
    'faq.technical.q5': 'How do I report bugs or request features?',
    'faq.technical.a5': 'Use the feedback system in the platform, email support@devhubtrader.com.br, or report via our community. Confirmed bugs earn token rewards.',
    
    // Marketplace
    'faq.marketplace.q1': 'How does the strategy marketplace work?',
    'faq.marketplace.a1': 'Users can sell/buy verified strategies. Sellers earn 70% of the value, platform keeps 30%. All strategies undergo performance verification.',
    'faq.marketplace.q2': 'How do I sell my strategy?',
    'faq.marketplace.a2': 'Submit your strategy for verification with at least 6 months of backtest data. Once approved, set your price and start earning from sales.',
    'faq.marketplace.q3': 'Are marketplace strategies guaranteed to work?',
    'faq.marketplace.a3': 'All strategies are verified for historical performance, but past results don\'t guarantee future performance. Always test strategies before live trading.',
    
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
    
    // Challenges
    'challenges.title': 'Earn Tokens',
    'challenges.subtitle': 'Complete challenges and earn tokens to use AI features',
    'challenges.currentStreak': 'Current streak',
    'challenges.days': 'days',
    'challenges.tokensEarned': 'Tokens Earned',
    'challenges.thisMonth': 'This month',
    'challenges.completed': 'Challenges Completed',
    'challenges.ofTotal': '{{completed}} of {{total}} available',
    'challenges.completionRate': 'Completion Rate',
    'challenges.thisPeriod': 'This period',
    'challenges.nextBonus': 'Next Bonus',
    'challenges.nextBonusDescription': 'In 3 days (10-day streak)',
    'challenges.tabs.achievements': 'Achievements',
    'challenges.tabs.monthly': 'Monthly',
    'challenges.difficulty.easy': 'Easy',
    'challenges.difficulty.medium': 'Medium',
    'challenges.difficulty.hard': 'Hard',
    'challenges.progress': 'Progress',
    'challenges.expired': 'Expired',
    'challenges.daysRemaining': '{{days}}d remaining',
    'challenges.hoursMinutesRemaining': '{{hours}}h {{minutes}}m',
    'challenges.minutesRemaining': '{{minutes}}m remaining',
    'challenges.claim': 'Claim',
    'challenges.achievement.firstRobot.title': 'Primeiro Robô',
    'challenges.achievement.firstRobot.description': 'Crie seu primeiro robô de trading',
    'challenges.achievement.robotMaster.title': 'Mestre dos Robôs',
    'challenges.achievement.robotMaster.description': 'Crie 10 robôs diferentes',
    'challenges.achievement.streakMaster.title': 'Sequência Perfeita',
    'challenges.achievement.streakMaster.description': 'Mantenha uma sequência de 30 dias de login',
    'challenges.achievement.aiExpert.title': 'Especialista em IA',
    'challenges.achievement.aiExpert.description': 'Use IA para criar 5 robôs diferentes',
    'challenges.achievement.analyst.title': 'Analista Profissional',
    'challenges.achievement.analyst.description': 'Complete 20 análises de backtest',
    'challenges.monthly.competition.title': 'Competição de Performance',
    'challenges.monthly.competition.description': 'Participe da competição mensal de estratégias',
    'challenges.monthly.tutorial.title': 'Criar Tutorial',
    'challenges.monthly.tutorial.description': 'Contribua com um tutorial para a comunidade',
    'challenges.monthly.portfolio.title': 'Mestre do Portfólio',
    'challenges.monthly.portfolio.description': 'Monte 3 portfólios diversificados usando IA',
    'challenges.category.milestone': 'Marco',
    'challenges.category.dedication': 'Dedicação',
    'challenges.category.ai': 'IA',
    'challenges.category.analysis': 'Análise',
    'challenges.category.competition': 'Competição',
    'challenges.category.community': 'Comunidade',
    'challenges.category.portfolio': 'Portfólio',
    'challenges.category.ai': 'AI',
    'challenges.category.analysis': 'Analysis',
    'challenges.category.competition': 'Competition',
    'challenges.category.community': 'Community',
    'challenges.category.portfolio': 'Portfolio',
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
    
    // Additional challenge tips
    'challenges.tips.title': 'Tips to Earn More Tokens',
    'challenges.tips.dailyStrategies': 'Daily Strategies',
    'challenges.tips.dailyLogin': 'Login daily to maintain your streak',
    'challenges.tips.editRobots': 'Create robots regularly to earn milestones',
    'challenges.tips.useAI': 'Use AI analysis to optimize performance',
    'challenges.tips.specialBonuses': 'Special Bonuses',
    'challenges.tips.streakBonus': '30-day streak: +1000 bonus tokens',
    'challenges.tips.competitionBonus': 'First place in competition: +5000 tokens',
    'challenges.tips.shareBonus': 'Share popular strategy: +500 tokens',
    
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
    'nav.robots': 'Robôs',
    'nav.community': 'Comunidade',
    'nav.profile': 'Perfil',
    'nav.subscription': 'Assinatura',
    'nav.experts': 'Especialistas',
    'nav.signOut': 'Sair',
    'nav.dashboard': 'Dashboard',
    'nav.faq': 'FAQ',
    'nav.earnTokens': 'Tokens',
    
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
    'faq.category.platforms': 'Plataformas de Trading',
    'faq.category.tokens': 'Tokens e Desafios',
    'faq.category.plans': 'Planos e Preços',
    'faq.category.collaboration': 'Colaboração e Compartilhamento',
    'faq.category.security': 'Segurança e Privacidade',
    'faq.category.technical': 'Suporte Técnico',
    'faq.category.marketplace': 'Marketplace de Estratégias',
    
    // FAQ Questions and Answers
    'faq.robots.q1': 'Como criar meu primeiro robô?',
    'faq.robots.a1': 'Clique em "Criar Robô" na página de robôs, digite um nome e comece a editar. Você pode usar o assistente de IA para gerar código automaticamente ou programar manualmente no editor.',
    'faq.robots.q2': 'Quantos robôs posso criar?',
    'faq.robots.a2': 'Depende do seu plano: Free (5 robôs), Pro 1 (25 robôs), Pro 2 (100 robôs), Pro 3 (500 robôs). Você pode ver seu limite atual no painel de robôs.',
    'faq.robots.q3': 'Como compartilhar um robô com outros usuários?',
    'faq.robots.a3': 'No editor do robô, clique em "Compartilhar" e escolha entre gerar um link público ou convidar usuários específicos por email. Você pode definir permissões de visualização ou edição.',
    
    // Plataformas
    'faq.platforms.q1': 'Quais plataformas de trading são suportadas?',
    'faq.platforms.a1': 'Suportamos Profit (NTSL), MetaTrader 4/5 (MQL4/MQL5), TradingView (Pine Script), Python para backtesting e outras plataformas populares. O código pode ser exportado em formatos compatíveis.',
    'faq.platforms.q2': 'Posso usar os robôs em qualquer corretora?',
    'faq.platforms.a2': 'Sim! Nossos robôs são compatíveis com a maioria das corretoras que suportam as respectivas plataformas. O código gerado é padrão e funciona com qualquer corretora compatível.',
    'faq.platforms.q3': 'Como exportar meu robô para o MetaTrader?',
    'faq.platforms.a3': 'No editor do robô, clique em "Exportar" e selecione "MetaTrader 4/5". O código será convertido para formato MQL e baixado como arquivo .mq4 ou .mq5.',
    'faq.platforms.q4': 'Vocês suportam exchanges de criptomoedas?',
    'faq.platforms.a4': 'Atualmente focamos em mercados tradicionais (ações, forex, futuros). Suporte para criptomoedas está planejado para versões futuras.',
    
    'faq.ai.q1': 'Como usar a IA para criar robôs?',
    'faq.ai.a1': 'No chat do assistente, descreva sua estratégia em linguagem natural. Por exemplo: "Crie um robô que compra quando RSI < 30 e vende quando RSI > 70". A IA gerará o código automaticamente.',
    'faq.ai.q2': 'Quanto custa usar a IA?',
    'faq.ai.a2': 'Cada interação com a IA consome tokens: criação de robô (500 tokens), análise de backtest (1000 tokens), otimização de estratégia (300 tokens). Consulte seu saldo no header.',
    
    // Tokens
    'faq.tokens.q1': 'Como ganhar tokens gratuitos?',
    'faq.tokens.a1': 'Complete desafios diários e semanais: criar primeiro robô (+500 tokens), primeira análise (+200 tokens), compartilhar estratégia (+100 tokens), participar de competições (até 1000 tokens), contribuir com tutoriais (+300 tokens).',
    'faq.tokens.q2': 'Quais são os desafios disponíveis?',
    'faq.tokens.a2': 'Diários: Login diário (+10 tokens), análise de backtest (+50 tokens). Semanais: Criar robô (+500 tokens), otimizar estratégia (+300 tokens). Mensais: Competição de performance (+2000 tokens), tutorial da comunidade (+1000 tokens).',
    'faq.tokens.q3': 'Os tokens expiram?',
    'faq.tokens.a3': 'Tokens mensais do plano são renovados a cada ciclo. Tokens ganhos em desafios e comprados separadamente nunca expiram. Tokens não utilizados do plano mensal não são acumulados.',
    'faq.tokens.q4': 'Quanto custam os tokens extras?',
    'faq.tokens.a4': 'Pacotes disponíveis: 2.500 tokens (R$ 70), 7.500 tokens (R$ 150), 25.000 tokens (R$ 300). Tokens extras nunca expiram.',
    'faq.tokens.q5': 'Posso transferir tokens para outros usuários?',
    'faq.tokens.a5': 'Não, tokens são intransferíveis e vinculados à sua conta. Porém, você pode compartilhar robôs e análises com outros usuários gratuitamente.',
    
    'faq.analysis.q1': 'Como fazer upload de dados de backtest?',
    'faq.analysis.a1': 'Vá para "Backtest Analysis", arraste seu arquivo CSV ou clique para selecionar. O arquivo deve conter colunas: Data, Preço Entrada, Preço Saída, Resultado, Direção.',
    'faq.analysis.q2': 'Que métricas são calculadas?',
    'faq.analysis.a2': 'Calculamos Profit Factor, Win Rate, Payoff, Max Drawdown, Sharpe Ratio, Recovery Factor, e análises por dia da semana e mês.',
    
    // Colaboração
    'faq.collaboration.q1': 'Como funciona a colaboração em tempo real?',
    'faq.collaboration.a1': 'Múltiplos usuários podem editar o mesmo robô simultaneamente. As mudanças são sincronizadas em tempo real, e você pode ver quem está editando qual seção do código.',
    'faq.collaboration.q2': 'Posso controlar quem tem acesso aos meus robôs?',
    'faq.collaboration.a2': 'Sim! Você pode definir permissões (apenas visualização ou edição) para cada colaborador e revogar acesso a qualquer momento. Você mantém controle total sobre seus robôs.',
    'faq.collaboration.q3': 'Como resolver conflitos quando várias pessoas editam?',
    'faq.collaboration.a3': 'Nosso sistema usa transformação operacional para mesclar mudanças automaticamente. Se conflitos ocorrerem, o sistema os destacará e permitirá resolução manual.',
    'faq.collaboration.q4': 'Há limite de colaboradores por robô?',
    'faq.collaboration.a4': 'Plano Free: 2 colaboradores por robô. Planos Pro: colaboradores ilimitados. Todos os colaboradores precisam ter suas próprias contas DevHub Trader.',
    
    // Planos
    'faq.plans.q1': 'Qual a diferença entre Pro 1, Pro 2 e Pro 3?',
    'faq.plans.a1': 'Pro 1 (R$ 259,80): Até 25 robôs, IA para gerar robôs, 20.000 tokens. Pro 2 (R$ 499,80): Até 100 robôs, 50.000 tokens, suporte dedicado. Pro 3 (R$ 999,80): Até 500 robôs, 100.000 tokens, todos os recursos premium.',
    'faq.plans.q2': 'Posso fazer upgrade ou downgrade a qualquer momento?',
    'faq.plans.a2': 'Sim! Upgrades são aplicados imediatamente. Downgrades entram em vigor no próximo ciclo de faturamento. Você mantém acesso aos recursos do plano atual até então.',
    'faq.plans.q3': 'O que acontece se eu cancelar minha assinatura?',
    'faq.plans.a3': 'Sua conta volta para o plano Free. Você mantém seus robôs existentes (até o limite gratuito) e pode exportar todos os seus dados. Recursos premium ficam indisponíveis.',
    'faq.plans.q4': 'Vocês oferecem reembolso?',
    'faq.plans.a4': 'Oferecemos garantia de 7 dias para novas assinaturas. Entre em contato com o suporte em até 7 dias se não estiver satisfeito.',
    'faq.plans.q5': 'Posso pausar minha assinatura?',
    'faq.plans.a5': 'Atualmente não oferecemos pausa de assinatura. Você pode cancelar e reativar depois, mas perderá tokens mensais não utilizados.',
    
    // Segurança
    'faq.security.q1': 'Quão seguros são meus dados?',
    'faq.security.a1': 'Usamos criptografia AES-256, servidores seguros, backup automático e conformidade com LGPD. Seus códigos e estratégias são privados por padrão.',
    'faq.security.q2': 'A DevHub Trader pode acessar meus robôs?',
    'faq.security.a2': 'Não! Seus robôs são privados por padrão. Só temos acesso se você compartilhar publicamente ou solicitar suporte específico. Nunca compartilhamos dados sem permissão.',
    'faq.security.q3': 'Posso exportar meus dados?',
    'faq.security.a3': 'Sim! Você pode exportar todos os seus robôs, análises e dados a qualquer momento em formato JSON, CSV ou código fonte. Não há lock-in na plataforma.',
    'faq.security.q4': 'O que acontece com meus dados se eu deletar minha conta?',
    'faq.security.a4': 'Seus dados são permanentemente deletados em até 30 dias após exclusão da conta, em conformidade com a LGPD. Você pode exportar tudo antes da exclusão.',
    
    // Técnico
    'faq.technical.q1': 'Meu robô não está funcionando como esperado. O que fazer?',
    'faq.technical.a1': 'Primeiro, verifique a lógica e parâmetros do robô. Use nossas ferramentas de debug e assistente de IA para ajuda. Se problemas persistirem, contate o suporte com detalhes do robô.',
    'faq.technical.q2': 'Como otimizar a performance do meu robô?',
    'faq.technical.a2': 'Use nossas ferramentas de análise de IA para identificar fraquezas, execute backtests com diferentes parâmetros e siga as sugestões de otimização fornecidas pelo sistema.',
    'faq.technical.q3': 'Posso importar robôs de outras plataformas?',
    'faq.technical.a3': 'Sim! Você pode colar código do MetaTrader, TradingView ou outras plataformas. Nossa IA pode ajudar a converter e adaptar o código para funcionar otimamente.',
    'faq.technical.q4': 'Quais linguagens de programação vocês suportam?',
    'faq.technical.a4': 'Suportamos NTSL (Profit), MQL4/MQL5 (MetaTrader), Pine Script (TradingView), Python, e podemos gerar código para a maioria das plataformas de trading.',
    'faq.technical.q5': 'Como reportar bugs ou solicitar recursos?',
    'faq.technical.a5': 'Use o sistema de feedback na plataforma, envie email para suporte@devhubtrader.com.br ou reporte via nossa comunidade. Bugs confirmados geram recompensas em tokens.',
    
    // Marketplace
    'faq.marketplace.q1': 'Como funciona o marketplace de estratégias?',
    'faq.marketplace.a1': 'Usuários podem vender/comprar estratégias verificadas. Vendedores ganham 70% do valor, plataforma fica com 30%. Todas as estratégias passam por verificação de performance.',
    'faq.marketplace.q2': 'Como vender minha estratégia?',
    'faq.marketplace.a2': 'Submeta sua estratégia para verificação com pelo menos 6 meses de dados de backtest. Uma vez aprovada, defina seu preço e comece a ganhar com as vendas.',
    'faq.marketplace.q3': 'Estratégias do marketplace são garantidas?',
    'faq.marketplace.a3': 'Todas as estratégias são verificadas quanto à performance histórica, mas resultados passados não garantem performance futura. Sempre teste estratégias antes de operar ao vivo.',
    
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
    
    // Challenges
    'challenges.title': 'Ganhe Tokens',
    'challenges.subtitle': 'Complete desafios e ganhe tokens para usar recursos de IA',
    'challenges.currentStreak': 'Sequência atual',
    'challenges.days': 'dias',
    'challenges.tokensEarned': 'Tokens Ganhos',
    'challenges.thisMonth': 'Este mês',
    'challenges.completed': 'Desafios Concluídos',
    'challenges.ofTotal': '{{completed}} de {{total}} disponíveis',
    'challenges.completionRate': 'Taxa de Conclusão',
    'challenges.thisPeriod': 'Neste período',
    'challenges.nextBonus': 'Próximo Bônus',
    'challenges.nextBonusDescription': 'Em 3 dias (sequência 10)',
    'challenges.tabs.achievements': 'Conquistas',
    'challenges.tabs.monthly': 'Mensais',
    'challenges.difficulty.easy': 'Fácil',
    'challenges.difficulty.medium': 'Médio',
    'challenges.difficulty.hard': 'Difícil',
    'challenges.progress': 'Progresso',
    'challenges.expired': 'Expirado',
    'challenges.daysRemaining': '{{days}}d restantes',
    'challenges.hoursMinutesRemaining': '{{hours}}h {{minutes}}m',
    'challenges.minutesRemaining': '{{minutes}}m restantes',
    'challenges.claim': 'Resgatar',
    'challenges.start': 'Começar',
    'challenges.noChallenges': 'Nenhum desafio disponível',
    'challenges.newChallengesSoon': 'Novos desafios serão adicionados em breve!',
    'challenges.tips.title': 'Dicas para Ganhar Mais Tokens',
    'challenges.tips.dailyStrategies': 'Estratégias Diárias',
    'challenges.tips.dailyLogin': 'Faça login todos os dias para manter sua sequência',
    'challenges.tips.editRobots': 'Crie robôs regularmente para ganhar marcos',
    'challenges.tips.useAI': 'Use análises de IA para otimizar performance',
    'challenges.tips.specialBonuses': 'Bônus Especiais',
    'challenges.tips.streakBonus': 'Sequência de 30 dias: +1000 tokens bônus',
    'challenges.tips.competitionBonus': 'Primeiro lugar na competição: +5000 tokens',
    'challenges.tips.shareBonus': 'Compartilhar estratégia popular: +500 tokens',
    
    // Additional challenge tips
    'challenges.tips.dailyStrategies': 'Estratégias Diárias',
    'challenges.tips.dailyLogin': 'Faça login todos os dias para manter sua sequência',
    'challenges.tips.editRobots': 'Crie robôs regularmente para ganhar marcos',
    'challenges.tips.useAI': 'Use análises de IA para otimizar performance',
    'challenges.tips.specialBonuses': 'Bônus Especiais',
    'challenges.tips.streakBonus': 'Sequência de 30 dias: +1000 tokens bônus',
    'challenges.tips.competitionBonus': 'Primeiro lugar na competição: +5000 tokens',
    'challenges.tips.shareBonus': 'Compartilhar estratégia popular: +500 tokens',
    
    // Analyses Section
    'analyses.title': 'Análises Recentes',
    'analyses.subtitle': 'Suas últimas análises de backtest e estratégias',
    'analyses.newAnalysis': 'Nova Análise',
    'analyses.backtestAnalysis': 'Análise de Backtest',
    'analyses.strategyAnalysis': 'Análise de Estratégia',
    'analyses.viewAnalysis': 'Ver Análise',
    'analyses.noAnalyses': 'Nenhuma análise encontrada',
    'analyses.createFirst': 'Crie sua primeira análise para começar',
    'analyses.shareAnalysis': 'Compartilhar Análise',
    'analyses.addToRanking': 'Adicionar ao Ranking',
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