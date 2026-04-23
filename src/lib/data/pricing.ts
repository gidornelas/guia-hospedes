export interface PricingPlan {
  name: string
  price: string
  period: string
  desc: string
  features: string[]
  cta: string
  popular: boolean
}

export const plans: PricingPlan[] = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: '/mes',
    desc: 'Ideal para testar e para anfitriões individuais',
    features: ['1 imóvel', 'Guia digital completo', 'Compartilhamento via link', 'Suporte por e-mail'],
    cta: 'Começar grátis',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'R$ 49',
    period: '/mes',
    desc: 'Para gestores com múltiplos imóveis',
    features: [
      'Até 10 imóveis',
      'Todos os canais de compartilhamento',
      'QR Code personalizado',
      'Templates de mensagem',
      'Estatísticas de acesso',
    ],
    cta: 'Comecar Pro',
    popular: true,
  },
  {
    name: 'Empresa',
    price: 'R$ 149',
    period: '/mes',
    desc: 'Para operações e times de hospedagem',
    features: [
      'Imóveis ilimitados',
      'Múltiplos usuários',
      'Integração Airbnb',
      'API de acesso',
      'Suporte prioritário',
    ],
    cta: 'Falar com vendas',
    popular: false,
  },
]
