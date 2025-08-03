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
  language: 'pt', // Default language
  
  setLanguage: (language: Language) => {
    set({ language });
    // Save to localStorage for persistence
    localStorage.setItem('preferredLanguage', language);
  },
  
  t: (key: string) => {
    const { language } = get();
    return translations[language][key] || key;
  }
}));

// Initialize language from localStorage if available
if (typeof window !== 'undefined') {
  const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
    useLanguageStore.getState().setLanguage(savedLanguage);
  }
}