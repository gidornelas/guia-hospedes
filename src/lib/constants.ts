export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'GuiaHóspedes'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const PROPERTY_TYPES = {
  APARTMENT: 'Apartamento',
  HOUSE: 'Casa',
  CHALET: 'Chalé',
  STUDIO: 'Studio',
  LOFT: 'Loft',
  FARM: 'Sítio',
  PENTHOUSE: 'Cobertura',
} as const

export const PROPERTY_STATUS = {
  DRAFT: { label: 'Rascunho', color: 'warning' },
  ACTIVE: { label: 'Ativo', color: 'success' },
  ARCHIVED: { label: 'Arquivado', color: 'secondary' },
} as const

export const GUIDE_STATUS = {
  DRAFT: { label: 'Rascunho', color: 'warning' },
  REVIEW: { label: 'Em Revisão', color: 'info' },
  PUBLISHED: { label: 'Publicado', color: 'success' },
  UNPUBLISHED: { label: 'Despublicado', color: 'destructive' },
} as const

export const SHARE_CHANNELS = {
  WHATSAPP: 'WhatsApp',
  EMAIL: 'E-mail',
  LINK: 'Link',
  QR: 'QR Code',
} as const

export const TEMPLATE_TYPES = {
  WELCOME: 'Boas-vindas',
  PRE_CHECKIN: 'Pré-check-in',
  DURING_STAY: 'Durante Estadia',
  POST_CHECKOUT: 'Pós-check-out',
  CUSTOM: 'Personalizado',
} as const

export const INTEGRATION_PROVIDERS = {
  AIRBNB: 'Airbnb',
  WHATSAPP: 'WhatsApp',
  EMAIL: 'E-mail',
  STORAGE: 'Armazenamento',
} as const

export const INTEGRATION_STATUS = {
  CONNECTED: { label: 'Conectado', color: 'success' },
  DISCONNECTED: { label: 'Desconectado', color: 'secondary' },
  ERROR: { label: 'Erro', color: 'destructive' },
} as const

export const DEVICE_TYPES = {
  AC: 'Ar-condicionado',
  TV: 'TV',
  STOVE: 'Fogão',
  SHOWER: 'Chuveiro',
  INTERNET: 'Internet',
  LOCK: 'Fechadura',
  OTHER: 'Outro',
} as const

export const CONTACT_ROLES = {
  HOST: 'Anfitrião',
  SUPPORT: 'Suporte',
  MAINTENANCE: 'Manutenção',
  CONCIERGE: 'Portaria',
  EMERGENCY: 'Emergência',
} as const

export const RECOMMENDATION_CATEGORIES = {
  RESTAURANT: 'Restaurante',
  CAFE: 'Café',
  MARKET: 'Mercado',
  PHARMACY: 'Farmácia',
  ATTRACTION: 'Atração',
  TRANSPORT: 'Transporte',
} as const

export const LINK_TYPES = {
  GOOGLE_MAPS: 'Google Maps',
  WHATSAPP: 'WhatsApp',
  INSTAGRAM: 'Instagram',
  LISTING: 'Anúncio',
  MANUAL: 'Manual',
  VIDEO: 'Vídeo',
  OTHER: 'Outro',
} as const

export const DASHBOARD_NAV = [
  { label: 'Visão Geral', href: '/app', icon: 'LayoutDashboard' },
  { label: 'Imóveis', href: '/app/imoveis', icon: 'Building2' },
  { label: 'Novo Imóvel', href: '/app/imoveis/novo', icon: 'Plus' },
  { label: 'Guias', href: '/app/guias', icon: 'BookOpen' },
  { label: 'Compartilhamento', href: '/app/compartilhamento', icon: 'Share2' },
  { label: 'Modelos de Mensagem', href: '/app/modelos-mensagem', icon: 'MessageSquare' },
  { label: 'Integrações', href: '/app/integracoes', icon: 'Plug' },
  { label: 'Analytics', href: '/app/analytics', icon: 'BarChart3' },
  { label: 'Configurações', href: '/app/configuracoes', icon: 'Settings' },
] as const
