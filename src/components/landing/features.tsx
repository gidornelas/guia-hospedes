import {
  BarChart3,
  BookOpen,
  Building2,
  Mail,
  MessageCircle,
  Plug,
  Share2,
  Smartphone,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Formulário estruturado',
    desc: 'Preencha check-in, Wi-Fi, regras, contatos e dicas locais de forma organizada.',
  },
  {
    icon: Zap,
    title: 'Guia automático',
    desc: 'Transforme informações operacionais em um guia profissional em poucos passos.',
  },
  {
    icon: MessageCircle,
    title: 'Compartilhamento por WhatsApp',
    desc: 'Envie o guia rapidamente no canal mais usado pelo hóspede.',
  },
  {
    icon: Mail,
    title: 'Envio por e-mail',
    desc: 'Mantenha um fluxo mais formal para reservas corporativas ou operações com equipe.',
  },
  {
    icon: Smartphone,
    title: 'Preview em tempo real',
    desc: 'Revise a experiência mobile do hóspede antes de colocar o guia no ar.',
  },
  {
    icon: Building2,
    title: 'Múltiplos imóveis',
    desc: 'Padronize a operação de vários imóveis sem perder clareza nem identidade.',
  },
  {
    icon: Share2,
    title: 'Links e QR dinâmicos',
    desc: 'Compartilhe por link direto, QR Code e outros canais conforme o contexto.',
  },
  {
    icon: Plug,
    title: 'Integração com Airbnb',
    desc: 'Conecte rotinas da operação e reduza trabalho manual em cadastros repetidos.',
  },
  {
    icon: BarChart3,
    title: 'Analytics operacional',
    desc: 'Acompanhe publicação, compartilhamento e sinais de uso com mais contexto.',
  },
]

export function LandingFeatures() {
  return (
    <section id="recursos" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Recursos principais
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tudo que você precisa para sair do improviso
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            A plataforma combina cadastro guiado, preview, publicação e distribuição para transformar o guia em parte real da operação.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border/70 bg-background p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
