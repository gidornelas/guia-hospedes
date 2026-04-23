export interface FaqItem {
  value: string
  question: string
  answer: string
}

export interface TrustPoint {
  iconName: 'Sparkles' | 'ShieldCheck'
  title: string
  description: string
}

export const faqs: FaqItem[] = [
  {
    value: 'tempo',
    question: 'Vou demorar para montar o primeiro guia?',
    answer:
      'Não. O fluxo foi pensado para tirar o guia do papel rápido: você cadastra o imóvel, preenche os pontos principais e já consegue revisar o preview antes de publicar.',
  },
  {
    value: 'hospede',
    question: 'O hóspede precisa instalar aplicativo ou criar conta?',
    answer:
      'Não. O guia abre direto no navegador pelo link, WhatsApp, e-mail ou QR Code. Isso reduz atrito e facilita o acesso durante a estadia.',
  },
  {
    value: 'operacao',
    question: 'Isso funciona para vários imóveis e para equipe?',
    answer:
      'Sim. O produto foi desenhado para anfitriões individuais e também para operações com vários imóveis, mantendo padrão visual, organização e compartilhamento centralizado.',
  },
  {
    value: 'publicacao',
    question: 'Consigo revisar antes de enviar ao hóspede?',
    answer:
      'Sim. O dashboard mostra preview do guia e o status de publicação, para você identificar o que ainda falta e compartilhar só quando estiver pronto.',
  },
]

export const trustPoints = [
  {
    iconName: 'Sparkles' as const,
    title: 'Menos improviso',
    description:
      'Centralize informações importantes sem depender de mensagens espalhadas ou textos copiados a cada reserva.',
  },
  {
    iconName: 'ShieldCheck' as const,
    title: 'Mais controle',
    description:
      'Veja o que já foi publicado, compartilhe no canal certo e reduza ruído operacional no dia a dia.',
  },
]
