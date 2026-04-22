'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building,
  Building2,
  CheckCircle,
  Clock,
  Hotel,
  House,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Plug,
  Shield,
  Share2,
  Smartphone,
  Star,
  Wifi,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const audienceCards = [
  {
    title: 'Anfitriões do Airbnb',
    desc: 'Automatize as mensagens de boas-vindas e pare de repetir as mesmas instruções para cada reserva.',
    icon: House,
  },
  {
    title: 'Gestores de Imóveis',
    desc: 'Padronize a experiência em dezenas de imóveis com guias profissionais e centralizados.',
    icon: Building,
  },
  {
    title: 'Operações de Hospedagem',
    desc: 'Reduza o volume de perguntas repetidas e ofereça uma experiência premium sem aumentar custos.',
    icon: Hotel,
  },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="flex min-h-screen flex-col pb-24 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-heading text-xl font-semibold">GuiaHóspedes</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#recursos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Recursos
            </a>
            <a
              href="#como-funciona"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Como Funciona
            </a>
            <a
              href="#precos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Preços
            </a>
            <a
              href="#contato"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contato
            </a>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            type="button"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-4 border-t border-border px-4 py-4 md:hidden">
            <a
              href="#recursos"
              className="block text-sm font-medium"
              onClick={closeMobileMenu}
            >
              Recursos
            </a>
            <a
              href="#como-funciona"
              className="block text-sm font-medium"
              onClick={closeMobileMenu}
            >
              Como Funciona
            </a>
            <a
              href="#precos"
              className="block text-sm font-medium"
              onClick={closeMobileMenu}
            >
              Preços
            </a>
            <a
              href="#contato"
              className="block text-sm font-medium"
              onClick={closeMobileMenu}
            >
              Contato
            </a>
            <Link href="/login" className="block" onClick={closeMobileMenu}>
              <Button className="w-full">Começar grátis</Button>
            </Link>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="h-4 w-4" />
                <span>Plataforma completa para anfitriões</span>
              </div>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Guie seu hóspede.
                <br />
                <span className="text-primary">Sem repetir.</span>
                <br />
                Sem esquecer.
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground">
                Crie guias digitais automáticos para cada imóvel. Compartilhe por
                WhatsApp e e-mail em um clique. Padronize a experiência do seu
                hóspede.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/login">
                  <Button size="lg" className="gap-2">
                    Criar meu primeiro guia
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/g/flat-elegance-paulista" target="_blank">
                  <Button size="lg" variant="outline">
                    Ver demo
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Grátis para começar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Sem cartão de crédito</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl border border-border bg-card p-2 shadow-elevated">
                <div className="space-y-4 rounded-xl bg-muted p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Flat Elegance Paulista</p>
                      <p className="text-sm text-muted-foreground">
                        São Paulo, SP
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: MapPin, label: 'Check-in' },
                      { icon: MapPin, label: 'Check-out' },
                      { icon: Wifi, label: 'Wi-Fi' },
                      { icon: Lock, label: 'Regras' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-background p-3"
                      >
                        <item.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Você ainda manda instruções manualmente?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Muitos gestores perdem tempo repetindo as mesmas informações para
              cada hóspede.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Clock,
                title: 'Toda reserva, mesma mensagem',
                desc: 'Você digita as instruções manualmente a cada check-in.',
              },
              {
                icon: MessageCircle,
                title: 'Esqueceu de mandar a senha do Wi-Fi?',
                desc: 'Informações importantes são esquecidas no meio da correria.',
              },
              {
                icon: Shield,
                title: 'Cada imóvel com um formato diferente',
                desc: 'Sem padronização entre seus imóveis e equipes.',
              },
              {
                icon: Smartphone,
                title: 'Hóspedes perguntam as mesmas coisas',
                desc: 'Você responde as mesmas dúvidas repetidamente.',
              },
              {
                icon: BarChart3,
                title: 'Sem controle do que foi enviado',
                desc: 'Não sabe se o hóspede recebeu ou leu as informações.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-background p-6 shadow-card"
              >
                <item.icon className="mb-4 h-8 w-8 text-destructive" />
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-brand-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Feito para quem recebe hóspedes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Do anfitrião individual à operação de múltiplos imóveis.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {audienceCards.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-background p-8 text-center shadow-card"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Um guia para cada imóvel.
                <br />
                <span className="text-primary">Criado uma vez, enviado sempre.</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Nossa plataforma transforma o processo manual em algo automático,
                profissional e rastreável. Preencha as informações do imóvel uma
                única vez e gere guias digitais sempre que precisar.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Formulário estruturado por imóvel',
                  'Template padronizado e profissional',
                  'Geração automática do guia digital',
                  'Compartilhamento por WhatsApp e e-mail',
                  'Rastreamento de envios e leituras',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl border border-border bg-card p-8 shadow-elevated">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Passo 1 de 3
                  </span>
                  <div className="flex gap-1">
                    <div className="h-2 w-8 rounded-full bg-primary" />
                    <div className="h-2 w-8 rounded-full bg-muted" />
                    <div className="h-2 w-8 rounded-full bg-muted" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Informações do imóvel
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Preencha os dados estruturados do imóvel
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="h-10 rounded-lg border border-border bg-muted" />
                  <div className="h-10 rounded-lg border border-border bg-muted" />
                  <div className="h-20 rounded-lg border border-border bg-muted" />
                </div>
                <Button className="w-full">Próximo passo</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Como Funciona
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Três passos simples para revolucionar a experiência do seu
              hóspede.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Cadastre seu imóvel',
                desc: 'Preencha as informações estruturadas: check-in, Wi-Fi, regras, equipamentos, contatos e dicas locais.',
              },
              {
                step: '02',
                title: 'Gere o guia automaticamente',
                desc: 'O guia é criado instantaneamente com design profissional e padronizado. Visualize antes de publicar.',
              },
              {
                step: '03',
                title: 'Compartilhe com o hóspede',
                desc: 'Envie por WhatsApp, e-mail ou link direto. O hóspede acessa tudo no celular, sem instalar nada.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-border bg-background p-8 text-center shadow-card"
              >
                <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recursos" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Tudo que você precisa
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Uma plataforma completa para gestão profissional de guias de
              boas-vindas.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: 'Formulário estruturado',
                desc: 'Preencha todas as informações do imóvel de forma organizada.',
              },
              {
                icon: Zap,
                title: 'Guia automático',
                desc: 'Gere guias digitais profissionais em segundos, não em horas.',
              },
              {
                icon: MessageCircle,
                title: 'Compartilhamento por WhatsApp',
                desc: 'Envie o guia diretamente pelo WhatsApp do hóspede.',
              },
              {
                icon: Mail,
                title: 'Envio por e-mail',
                desc: 'Templates profissionais de e-mail com o link do guia.',
              },
              {
                icon: Smartphone,
                title: 'Preview em tempo real',
                desc: 'Veja exatamente como o hóspede verá o guia antes de publicar.',
              },
              {
                icon: Building2,
                title: 'Múltiplos imóveis',
                desc: 'Gerencie dezenas de imóveis com consistência visual.',
              },
              {
                icon: Share2,
                title: 'Links dinâmicos',
                desc: 'Cada guia tem um link único e personalizado.',
              },
              {
                icon: Plug,
                title: 'Integração Airbnb',
                desc: 'Sincronize dados com seu anúncio do Airbnb via iCal.',
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                desc: 'Acompanhe acessos, compartilhamentos e engajamento.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-border bg-background p-6 shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    value: '90%',
                    label: 'Menos tempo em instruções',
                    desc: 'Automatize o que você faz manualmente hoje.',
                  },
                  {
                    value: '100%',
                    label: 'Padronização',
                    desc: 'Mesma qualidade em todos os seus imóveis.',
                  },
                  {
                    value: '5x',
                    label: 'Mais profissionalismo',
                    desc: 'Impressão premium para seus hóspedes.',
                  },
                  {
                    value: '24/7',
                    label: 'Controle centralizado',
                    desc: 'Saiba o que foi publicado e compartilhado.',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border bg-background p-6 shadow-card"
                  >
                    <p className="text-3xl font-bold text-primary">{item.value}</p>
                    <p className="mt-2 font-semibold">{item.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Benefícios que fazem a diferença
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Não é apenas sobre economizar tempo. É sobre oferecer uma
                experiência consistente, profissional e memorável para cada
                hóspede, em cada imóvel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Um link. Um clique.
                <br />
                <span className="text-primary">O hóspede recebe tudo.</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Compartilhe o guia pelo canal que seu hóspede prefere. WhatsApp,
                e-mail ou link direto. O hóspede acessa no celular, sem precisar
                instalar nada.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-card">
                  <MessageCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      Mensagem pronta para envio
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-card">
                  <Mail className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-semibold">E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Template profissional
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-elevated">
                <div className="space-y-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">Agora</p>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg bg-background p-3 text-sm">
                    <p>Olá Maria!</p>
                    <p>
                      Seja bem-vinda ao Flat Elegance Paulista! Seu guia digital
                      está pronto:
                    </p>
                    <p className="text-primary underline">
                      guiahospedes.com/g/flat-elegance...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Wi-Fi, check-in, regras e dicas locais em um só lugar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF5A5F] text-sm font-bold text-white">
                      air
                    </div>
                    <div>
                      <p className="font-semibold">Airbnb</p>
                      <p className="text-xs text-muted-foreground">
                        Integração ativa
                      </p>
                    </div>
                  </div>
                  <div className="flex h-6 items-center rounded-full bg-emerald-100 px-3 text-xs font-medium text-emerald-700">
                    Conectado
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    'Sincronização iCal',
                    'Mapeamento de imóveis',
                    'Logs de sincronização',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-lg bg-muted p-3"
                    >
                      <span className="text-sm">{item}</span>
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Conecte sua operação
                <br />
                <span className="text-primary">ao Airbnb</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Sincronize dados com seu anúncio do Airbnb via iCal. Vincule
                listings internos e externos. Mantenha tudo atualizado
                automaticamente.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Sincronização de calendário via iCal',
                  'Mapeamento entre imóveis internos e listings',
                  'Logs detalhados de cada sincronização',
                  'Arquitetura preparada para API oficial',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="precos" className="scroll-mt-24 bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Comece grátis, escale quando precisar
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Teste a plataforma sem compromisso. Sem cartão de crédito.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                name: 'Grátis',
                price: 'R$ 0',
                period: '/mês',
                desc: 'Ideal para testar e anfitriões individuais',
                features: [
                  '1 imóvel',
                  'Guia digital completo',
                  'Compartilhamento via link',
                  'Suporte por e-mail',
                ],
                cta: 'Começar grátis',
                popular: false,
              },
              {
                name: 'Pro',
                price: 'R$ 49',
                period: '/mês',
                desc: 'Para gestores com múltiplos imóveis',
                features: [
                  'Até 10 imóveis',
                  'Todos os canais de compartilhamento',
                  'QR Code personalizado',
                  'Templates de mensagem',
                  'Estatísticas de acesso',
                ],
                cta: 'Começar Pro',
                popular: true,
              },
              {
                name: 'Empresa',
                price: 'R$ 149',
                period: '/mês',
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
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border bg-background p-8 shadow-card ${
                  plan.popular ? 'border-primary' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Mais popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.desc}
                  </p>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/login">
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              O que dizem os gestores
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Ana Paula R.',
                role: 'Gestora de 12 imóveis',
                text: 'Economizo horas toda semana. Antes eu enviava tudo manualmente; agora é um clique. Meus hóspedes elogiam a organização do guia.',
              },
              {
                name: 'Ricardo M.',
                role: 'Anfitrião Airbnb',
                text: 'A integração com Airbnb é um diferencial. Consigo manter tudo sincronizado e os hóspedes recebem o guia automaticamente.',
              },
              {
                name: 'Juliana F.',
                role: 'Operadora de hospedagem',
                text: 'Padronizamos a experiência em todos os nossos 30 imóveis. A equipe adora a facilidade e os hóspedes notam a diferença.',
              },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-border bg-background p-6 shadow-card"
              >
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">"{item.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contato"
        className="scroll-mt-24 border-y border-border bg-gradient-brand-soft py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Contato e demonstração
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Quer validar o produto com a sua operação?
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Fale com a equipe, teste a demo pública e entenda como organizar
              onboarding, compartilhamento e experiência do hóspede sem depender
              de mensagens repetidas.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/g/flat-elegance-paulista" target="_blank">
                <Button size="lg" variant="outline">
                  Abrir demonstração
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  E-mail de contato
                </p>
                <a
                  href="mailto:oi@guiahospedes.com"
                  className="mt-1 block text-lg font-semibold text-foreground transition-colors hover:text-primary"
                >
                  oi@guiahospedes.com
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ideal para
                </p>
                <p className="mt-1 text-sm text-foreground">
                  anfitriões individuais, gestores com múltiplos imóveis e times
                  de operação.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Próximo passo sugerido
                </p>
                <p className="mt-1 text-sm text-foreground">
                  Criar o primeiro imóvel, publicar o guia e testar o envio por
                  WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-slate-50">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Crie seu primeiro guia agora
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Grátis para começar. Sem cartão de crédito. Configure seu primeiro
            imóvel em minutos.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                Começar grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/g/flat-elegance-paulista" target="_blank">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Ver demonstração
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-heading text-lg font-semibold">
                  GuiaHóspedes
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Guias digitais profissionais para imóveis de hospedagem. Criado
                uma vez, enviado sempre.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#recursos"
                    className="transition-colors hover:text-foreground"
                  >
                    Recursos
                  </a>
                </li>
                <li>
                  <a
                    href="#como-funciona"
                    className="transition-colors hover:text-foreground"
                  >
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#precos"
                    className="transition-colors hover:text-foreground"
                  >
                    Preços
                  </a>
                </li>
                <li>
                  <Link
                    href="/g/flat-elegance-paulista"
                    target="_blank"
                    className="transition-colors hover:text-foreground"
                  >
                    Ver demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Conta</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-foreground"
                  >
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-foreground"
                  >
                    Criar conta
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:oi@guiahospedes.com"
                    className="transition-colors hover:text-foreground"
                  >
                    Suporte
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span>Política de privacidade em preparação</span>
                </li>
                <li>
                  <span>Termos de uso em preparação</span>
                </li>
                <li>
                  <span>Política de cookies em preparação</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} GuiaHóspedes. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 py-3 shadow-lg backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Link href="/login" className="flex-1">
            <Button className="w-full">Começar grátis</Button>
          </Link>
          <Link href="/g/flat-elegance-paulista" target="_blank" className="flex-1">
            <Button variant="outline" className="w-full">
              Ver demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
