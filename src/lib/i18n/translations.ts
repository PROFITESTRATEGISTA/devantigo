/**
 * Translation dictionaries for all supported languages
 */
export const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.robots': 'My Robots',
    'nav.backtest': 'Backtest Analysis',
    'nav.faq': 'FAQ',
    'nav.profile': 'Profile',
    'nav.subscription': 'Subscription',
    'nav.signOut': 'Sign Out',
    
    // Common actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.create': 'Create',
    'action.upload': 'Upload',
    'action.download': 'Download',
    'action.share': 'Share',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.confirm': 'Confirm',
    'action.close': 'Close',
    
    // Robot management
    'robot.create': 'Create Robot',
    'robot.createFirst': 'Create your first robot',
    'robot.noRobots': 'No robots found',
    'robot.rename': 'Rename Robot',
    'robot.delete': 'Delete Robot',
    'robot.share': 'Share Robot',
    'robot.export': 'Export Robot',
    'robot.versions': 'Versions',
    'robot.newVersion': 'New Version',
    
    // Analysis
    'analysis.backtest': 'Backtest Analysis',
    'analysis.strategy': 'Strategy Analysis',
    'analysis.upload': 'Upload Data',
    'analysis.analyzing': 'Analyzing...',
    'analysis.complete': 'Analysis Complete',
    'analysis.failed': 'Analysis Failed',
    'analysis.noData': 'No analysis data available',
    
    // Tokens
    'tokens.balance': 'Token Balance',
    'tokens.buy': 'Buy Tokens',
    'tokens.insufficient': 'Insufficient tokens',
    'tokens.required': 'tokens required',
    'tokens.consumed': 'tokens consumed',
    
    // Time and dates
    'time.now': 'now',
    'time.today': 'today',
    'time.yesterday': 'yesterday',
    'time.daysAgo': '{{count}} days ago',
    'time.hoursAgo': '{{count}} hours ago',
    'time.minutesAgo': '{{count}} minutes ago',
    'time.justNow': 'just now',
    
    // Status
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.failed': 'Failed',
    'status.loading': 'Loading...',
    
    // Errors and messages
    'error.generic': 'An error occurred',
    'error.network': 'Network error',
    'error.unauthorized': 'Unauthorized access',
    'error.notFound': 'Not found',
    'success.saved': 'Saved successfully',
    'success.created': 'Created successfully',
    'success.deleted': 'Deleted successfully',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions',
    'faq.contact': 'Contact Support',
    'faq.notFound': 'Didn\'t find your answer?',
    
    // Plans and subscription
    'plan.free': 'Free Forever',
    'plan.pro1': 'Pro 1',
    'plan.pro2': 'Pro 2',
    'plan.pro3': 'Pro 3',
    'plan.current': 'Current Plan',
    'plan.upgrade': 'Upgrade Plan',
    'plan.features': 'Features',
    
    // Numbers and metrics
    'metrics.profitFactor': 'Profit Factor',
    'metrics.winRate': 'Win Rate',
    'metrics.drawdown': 'Max Drawdown',
    'metrics.trades': 'Total Trades',
    'metrics.sharpe': 'Sharpe Ratio',
    
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
    'challenges.tabs.daily': 'Daily',
    'challenges.tabs.weekly': 'Weekly',
    'challenges.tabs.monthly': 'Monthly',
    'challenges.tabs.achievements': 'Achievements',
    'challenges.difficulty.easy': 'Easy',
    'challenges.difficulty.medium': 'Medium',
    'challenges.difficulty.hard': 'Hard',
    'challenges.progress': 'Progress',
    'challenges.expired': 'Expired',
    'challenges.daysRemaining': '{{days}}d remaining',
    'challenges.hoursMinutesRemaining': '{{hours}}h {{minutes}}m',
    'challenges.minutesRemaining': '{{minutes}}m remaining',
    'challenges.claim': 'Claim',
    'challenges.start': 'Start',
    'challenges.noChallenges': 'No challenges available',
    'challenges.newChallengesSoon': 'New challenges will be added soon!',
    'challenges.tips.title': 'Tips to Earn More Tokens',
    'challenges.tips.dailyStrategies': 'Daily Strategies',
    'challenges.tips.dailyLogin': 'Log in every day to maintain your streak',
    'challenges.tips.editRobots': 'Edit your robots regularly to improve strategies',
    'challenges.tips.useAI': 'Use AI analysis to optimize performance',
    'challenges.tips.specialBonuses': 'Special Bonuses',
    'challenges.tips.streakBonus': '10-day streak: +1000 bonus tokens',
    'challenges.tips.competitionBonus': 'First place in competition: +5000 tokens',
    'challenges.tips.shareBonus': 'Share popular strategy: +500 tokens',
    
    // Challenge specific content
    'challenges.daily.login.title': 'Daily Login',
    'challenges.daily.login.description': 'Log in to the platform today',
    'challenges.daily.editRobot.title': 'Edit Robot',
    'challenges.daily.editRobot.description': 'Edit any robot for at least 5 minutes',
    'challenges.daily.analysis.title': 'Backtest Analysis',
    'challenges.daily.analysis.description': 'Perform a backtest analysis with AI',
    'challenges.weekly.createRobot.title': 'Create New Robot',
    'challenges.weekly.createRobot.description': 'Create a new trading robot this week',
    'challenges.weekly.shareStrategy.title': 'Share Strategy',
    'challenges.weekly.shareStrategy.description': 'Share a robot with another user',
    'challenges.weekly.optimizeStrategy.title': 'Optimize Strategy',
    'challenges.weekly.optimizeStrategy.description': 'Use AI to optimize an existing strategy',
    'challenges.monthly.competition.title': 'Performance Competition',
    'challenges.monthly.competition.description': 'Participate in the monthly strategy competition',
    'challenges.monthly.tutorial.title': 'Create Tutorial',
    'challenges.monthly.tutorial.description': 'Contribute a tutorial to the community',
    'challenges.achievement.firstRobot.title': 'First Robot',
    'challenges.achievement.firstRobot.description': 'Create your first trading robot',
    'challenges.achievement.robotMaster.title': 'Robot Master',
    'challenges.achievement.robotMaster.description': 'Create 10 different robots',
    'challenges.achievement.streakMaster.title': 'Perfect Streak',
    'challenges.achievement.streakMaster.description': 'Maintain a 30-day login streak',
    'challenges.category.activity': 'Activity',
    'challenges.category.development': 'Development',
    'challenges.category.analysis': 'Analysis',
    'challenges.category.creation': 'Creation',
    'challenges.category.social': 'Social',
    'challenges.category.optimization': 'Optimization',
    'challenges.category.competition': 'Competition',
    'challenges.category.community': 'Community',
    'challenges.category.milestone': 'Milestone',
    'challenges.category.dedication': 'Dedication',
  },
  
  pt: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.robots': 'Meus Robôs',
    'nav.backtest': 'Análise de Backtest',
    'nav.faq': 'FAQ',
    'nav.profile': 'Perfil',
    'nav.subscription': 'Assinatura',
    'nav.signOut': 'Sair',
    
    // Common actions
    'action.save': 'Salvar',
    'action.cancel': 'Cancelar',
    'action.delete': 'Excluir',
    'action.edit': 'Editar',
    'action.create': 'Criar',
    'action.upload': 'Enviar',
    'action.download': 'Baixar',
    'action.share': 'Compartilhar',
    'action.back': 'Voltar',
    'action.next': 'Próximo',
    'action.previous': 'Anterior',
    'action.confirm': 'Confirmar',
    'action.close': 'Fechar',
    
    // Robot management
    'robot.create': 'Criar Robô',
    'robot.createFirst': 'Crie seu primeiro robô',
    'robot.noRobots': 'Nenhum robô encontrado',
    'robot.rename': 'Renomear Robô',
    'robot.delete': 'Excluir Robô',
    'robot.share': 'Compartilhar Robô',
    'robot.export': 'Exportar Robô',
    'robot.versions': 'Versões',
    'robot.newVersion': 'Nova Versão',
    
    // Analysis
    'analysis.backtest': 'Análise de Backtest',
    'analysis.strategy': 'Análise de Estratégia',
    'analysis.upload': 'Enviar Dados',
    'analysis.analyzing': 'Analisando...',
    'analysis.complete': 'Análise Concluída',
    'analysis.failed': 'Análise Falhou',
    'analysis.noData': 'Nenhum dado de análise disponível',
    
    // Tokens
    'tokens.balance': 'Saldo de Tokens',
    'tokens.buy': 'Comprar Tokens',
    'tokens.insufficient': 'Tokens insuficientes',
    'tokens.required': 'tokens necessários',
    'tokens.consumed': 'tokens consumidos',
    
    // Time and dates
    'time.now': 'agora',
    'time.today': 'hoje',
    'time.yesterday': 'ontem',
    'time.daysAgo': 'há {{count}} dias',
    'time.hoursAgo': 'há {{count}} horas',
    'time.minutesAgo': 'há {{count}} minutos',
    'time.justNow': 'agora mesmo',
    
    // Status
    'status.active': 'Ativo',
    'status.inactive': 'Inativo',
    'status.pending': 'Pendente',
    'status.completed': 'Concluído',
    'status.failed': 'Falhou',
    'status.loading': 'Carregando...',
    
    // Errors and messages
    'error.generic': 'Ocorreu um erro',
    'error.network': 'Erro de rede',
    'error.unauthorized': 'Acesso não autorizado',
    'error.notFound': 'Não encontrado',
    'success.saved': 'Salvo com sucesso',
    'success.created': 'Criado com sucesso',
    'success.deleted': 'Excluído com sucesso',
    
    // FAQ
    'faq.title': 'Perguntas Frequentes',
    'faq.subtitle': 'Encontre respostas para dúvidas comuns',
    'faq.contact': 'Entrar em Contato',
    'faq.notFound': 'Não encontrou sua resposta?',
    
    // Plans and subscription
    'plan.free': 'Gratuito Para Sempre',
    'plan.pro1': 'Pro 1',
    'plan.pro2': 'Pro 2',
    'plan.pro3': 'Pro 3',
    'plan.current': 'Plano Atual',
    'plan.upgrade': 'Atualizar Plano',
    'plan.features': 'Recursos',
    
    // Numbers and metrics
    'metrics.profitFactor': 'Fator de Lucro',
    'metrics.winRate': 'Taxa de Acerto',
    'metrics.drawdown': 'Drawdown Máximo',
    'metrics.trades': 'Total de Trades',
    'metrics.sharpe': 'Índice Sharpe',
  },
  
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.robots': 'Mis Robots',
    'nav.backtest': 'Análisis de Backtest',
    'nav.faq': 'FAQ',
    'nav.profile': 'Perfil',
    'nav.subscription': 'Suscripción',
    'nav.signOut': 'Cerrar Sesión',
    
    // Common actions
    'action.save': 'Guardar',
    'action.cancel': 'Cancelar',
    'action.delete': 'Eliminar',
    'action.edit': 'Editar',
    'action.create': 'Crear',
    'action.upload': 'Subir',
    'action.download': 'Descargar',
    'action.share': 'Compartir',
    'action.back': 'Volver',
    'action.next': 'Siguiente',
    'action.previous': 'Anterior',
    'action.confirm': 'Confirmar',
    'action.close': 'Cerrar',
    
    // Robot management
    'robot.create': 'Crear Robot',
    'robot.createFirst': 'Crea tu primer robot',
    'robot.noRobots': 'No se encontraron robots',
    'robot.rename': 'Renombrar Robot',
    'robot.delete': 'Eliminar Robot',
    'robot.share': 'Compartir Robot',
    'robot.export': 'Exportar Robot',
    'robot.versions': 'Versiones',
    'robot.newVersion': 'Nueva Versión',
    
    // Analysis
    'analysis.backtest': 'Análisis de Backtest',
    'analysis.strategy': 'Análisis de Estrategia',
    'analysis.upload': 'Subir Datos',
    'analysis.analyzing': 'Analizando...',
    'analysis.complete': 'Análisis Completo',
    'analysis.failed': 'Análisis Falló',
    'analysis.noData': 'No hay datos de análisis disponibles',
    
    // Add more Spanish translations...
  },
  
  ar: {
    // Navigation (RTL example)
    'nav.dashboard': 'لوحة التحكم',
    'nav.robots': 'روبوتاتي',
    'nav.backtest': 'تحليل الاختبار التاريخي',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.profile': 'الملف الشخصي',
    'nav.subscription': 'الاشتراك',
    'nav.signOut': 'تسجيل الخروج',
    
    // Common actions
    'action.save': 'حفظ',
    'action.cancel': 'إلغاء',
    'action.delete': 'حذف',
    'action.edit': 'تحرير',
    'action.create': 'إنشاء',
    'action.upload': 'رفع',
    'action.download': 'تحميل',
    'action.share': 'مشاركة',
    'action.back': 'رجوع',
    'action.next': 'التالي',
    'action.previous': 'السابق',
    'action.confirm': 'تأكيد',
    'action.close': 'إغلاق',
    
    // Add more Arabic translations...
  }
};