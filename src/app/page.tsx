'use client'

import Link from 'next/link'
import {
  BookOpen,
  CheckCircle,
  Clock,
  MessageCircle,
  Mail,
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
  Menu,
  X,
  Star,
  MapPin,
  Wifi,
  Lock,
  Share2,
  BarChart3,
  Plug,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-heading text-xl font-semibold">GuiaHóspedes</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
            <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
            <a href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Preços</a>
            <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contato</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Começar Grátis</Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border px-4 py-4 space-y-4">
            <a href="#recursos" className="block text-sm font-medium">Recursos</a>
            <a href="#como-funciona" className="block text-sm font-medium">Como Funciona</a>
            <a href="#precos" className="block text-sm font-medium">Preços</a>
            <Link href="/login" className="block">
              <Button className="w-full">Começar Grátis</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <p className="text-lg text-muted-foreground max-w-lg">
                Crie guias digitais automáticos para cada imóvel. Compartilhe por WhatsApp e e-mail em um clique. Padronize a experiência do seu hóspede.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                <div className="rounded-xl bg-muted p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Flat Elegance Paulista</p>
                      <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: MapPin, label: 'Check-in' },
                      { icon: MapPin, label: 'Check-out' },
                      { icon: Wifi, label: 'Wi-Fi' },
                      { icon: Lock, label: 'Regras' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg bg-background p-3 border border-border/50">
                        <item.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Você ainda manda instruções manualmente?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Muitos gestores perdem tempo repetindo as mesmas informações para cada hóspede.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Toda reserva, mesma mensagem', desc: 'Você digita as instruções manualmente a cada check-in.' },
              { icon: MessageCircle, title: 'Esqueceu de mandar a senha do Wi-Fi?', desc: 'Informações importantes são esquecidas no meio da correria.' },
              { icon: Shield, title: 'Cada imóvel com um formato diferente', desc: 'Sem padronização entre seus imóveis e equipes.' },
              { icon: Smartphone, title: 'Hóspedes perguntam as mesmas coisas', desc: 'Você responde as mesmas dúvidas repetidamente.' },
              { icon: BarChart3, title: 'Sem controle do que foi enviado', desc: 'Não sabe se o hóspede recebeu ou leu as informações.' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-6 shadow-card">
                <item.icon className="h-8 w-8 text-destructive mb-4" />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-20 bg-gradient-brand-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Feito para quem recebe hóspedes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Do anfitrião individual à operação de múltiplos imóveis.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Anfitriões do Airbnb',
                desc: 'Automatize as mensagens de boas-vindas e pare de repetir as mesmas instruções para cada reserva.',
                icon: '🏠',
              },
              {
                title: 'Gestores de Imóveis',
                desc: 'Padronize a experiência em dezenas de imóveis com guias profissionais e centralizados.',
                icon: '🏢',
              },
              {
                title: 'Operações de Hospedagem',
                desc: 'Reduza o volume de perguntas repetidas e ofereça uma experiência premium sem aumentar custos.',
                icon: '🏨',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-8 shadow-card text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="mt-3 text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solução */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Um guia para cada imóvel.
                <br />
                <span className="text-primary">Criado uma vez, enviado sempre.</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Nossa plataforma transforma o processo manual em algo automático, profissional e rastreável.
                Preencha as informações do imóvel uma única vez e gere guias digitais sempre que precisar.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Formulário estruturado por imóvel',
                  'Template padronizado e profissional',
                  'Geração automática do guia digital',
                  'Compartilhamento por WhatsApp e e-mail',
                  'Rastreamento de envios e leituras',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl border border-border bg-card p-8 shadow-elevated">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Passo 1 de 3</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-8 rounded-full bg-primary" />
                    <div className="h-2 w-8 rounded-full bg-muted" />
                    <div className="h-2 w-8 rounded-full bg-muted" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Informações do Imóvel</h3>
                  <p className="text-sm text-muted-foreground mt-1">Preencha os dados estruturados do imóvel</p>
                </div>
                <div className="space-y-3">
                  <div className="h-10 rounded-lg bg-muted border border-border" />
                  <div className="h-10 rounded-lg bg-muted border border-border" />
                  <div className="h-20 rounded-lg bg-muted border border-border" />
                </div>
                <Button className="w-full">Próximo Passo</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Como Funciona</h2>
            <p className="mt-4 text-lg text-muted-foreground">Três passos simples para revolucionar a experiência do seu hóspede.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Cadastre seu Imóvel', desc: 'Preencha as informações estruturadas: check-in, Wi-Fi, regras, equipamentos, contatos e dicas locais.' },
              { step: '02', title: 'Gere o Guia Automaticamente', desc: 'O guia é criado instantaneamente com design profissional e padronizado. Visualize antes de publicar.' },
              { step: '03', title: 'Compartilhe com o Hóspede', desc: 'Envie por WhatsApp, e-mail ou link direto. O hóspede acessa tudo no celular, sem instalar nada.' },
            ].map((item, i) => (
              <div key={i} className="relative rounded-xl border border-border bg-background p-8 shadow-card text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-xl">{item.title}</h3>
                <p className="mt-3 text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="recursos" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Tudo que você precisa</h2>
            <p className="mt-4 text-lg text-muted-foreground">Uma plataforma completa para gestão profissional de guias de boas-vindas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Formulário Estruturado', desc: 'Preencha todas as informações do imóvel de forma organizada.' },
              { icon: Zap, title: 'Guia Automático', desc: 'Gere guias digitais profissionais em segundos, não em horas.' },
              { icon: MessageCircle, title: 'Compartilhamento WhatsApp', desc: 'Envie o guia diretamente pelo WhatsApp do hóspede.' },
              { icon: Mail, title: 'Envio por E-mail', desc: 'Templates profissionais de e-mail com o link do guia.' },
              { icon: Smartphone, title: 'Preview em Tempo Real', desc: 'Veja exatamente como o hóspede verá o guia antes de publicar.' },
              { icon: Building2, title: 'Múltiplos Imóveis', desc: 'Gerencie dezenas de imóveis com consistência visual.' },
              { icon: Share2, title: 'Links Dinâmicos', desc: 'Cada guia tem um link único e personalizado.' },
              { icon: Plug, title: 'Integração Airbnb', desc: 'Sincronize dados com seu anúncio do Airbnb via iCal.' },
              { icon: BarChart3, title: 'Analytics', desc: 'Acompanhe acessos, compartilhamentos e engajamento.' },
            ].map((item, i) => (
              <div key={i} className="group rounded-xl border border-border bg-background p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { value: '90%', label: 'Menos tempo em instruções', desc: 'Automatize o que você faz manualmente hoje.' },
                  { value: '100%', label: 'Padronização', desc: 'Mesma qualidade em todos os seus imóveis.' },
                  { value: '5x', label: 'Mais profissionalismo', desc: 'Impressão premium para seus hóspedes.' },
                  { value: '24/7', label: 'Controle centralizado', desc: 'Saiba o que foi publicado e compartilhado.' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-border bg-background p-6 shadow-card">
                    <p className="text-3xl font-bold text-primary">{item.value}</p>
                    <p className="font-semibold mt-2">{item.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Benefícios que fazem a diferença
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Não é apenas sobre economizar tempo. É sobre oferecer uma experiência consistente,
                profissional e memorável para cada hóspede, em cada imóvel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compartilhamento */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Um link. Um clique.
                <br />
                <span className="text-primary">O hóspede recebe tudo.</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Compartilhe o guia pelo canal que seu hóspede prefere. WhatsApp, e-mail ou link direto.
                O hóspede acessa no celular, sem precisar instalar nada.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-card">
                  <MessageCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Mensagem pronta para envio</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-card">
                  <Mail className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-semibold">E-mail</p>
                    <p className="text-sm text-muted-foreground">Template profissional</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-elevated">
                <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">Agora</p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3 text-sm space-y-2">
                    <p>Olá Maria! 👋</p>
                    <p>Seja bem-vinda ao Flat Elegance Paulista! Seu guia digital está pronto:</p>
                    <p className="text-primary underline">guiahospedes.com/g/flat-elegance...</p>
                    <p className="text-muted-foreground text-xs">Wi-Fi, check-in, regras e dicas locais em um só lugar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integração Airbnb */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#FF5A5F] text-white flex items-center justify-center font-bold text-sm">
                      air
                    </div>
                    <div>
                      <p className="font-semibold">Airbnb</p>
                      <p className="text-xs text-muted-foreground">Integração ativa</p>
                    </div>
                  </div>
                  <div className="flex h-6 items-center rounded-full bg-emerald-100 px-3 text-xs font-medium text-emerald-700">
                    Conectado
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Sincronização iCal</span>
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Mapeamento de Imóveis</span>
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Logs de Sincronização</span>
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
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
                Sincronize dados com seu anúncio do Airbnb via iCal. Vincule listings internos
                e externos. Mantenha tudo atualizado automaticamente.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Sincronização de calendário via iCal',
                  'Mapeamento entre imóveis internos e listings',
                  'Logs detalhados de cada sincronização',
                  'Arquitetura preparada para API oficial',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Comece grátis, escale quando precisar
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Teste a plataforma sem compromisso. Sem cartão de crédito.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Grátis',
                price: 'R$ 0',
                period: '/mês',
                desc: 'Ideal para testar e anfitriões individuais',
                features: ['1 imóvel', 'Guia digital completo', 'Compartilhamento via link', 'Suporte por e-mail'],
                cta: 'Começar Grátis',
                popular: false,
              },
              {
                name: 'Pro',
                price: 'R$ 49',
                period: '/mês',
                desc: 'Para gestores com múltiplos imóveis',
                features: ['Até 10 imóveis', 'Todos os canais de compartilhamento', 'QR Code personalizado', 'Templates de mensagem', 'Estatísticas de acesso'],
                cta: 'Começar Pro',
                popular: true,
              },
              {
                name: 'Empresa',
                price: 'R$ 149',
                period: '/mês',
                desc: 'Para operações e times de hospedagem',
                features: ['Imóveis ilimitados', 'Múltiplos usuários', 'Integração Airbnb', 'API de acesso', 'Suporte prioritário'],
                cta: 'Falar com Vendas',
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-xl border p-8 shadow-card ${
                  plan.popular
                    ? 'border-primary bg-background'
                    : 'border-border bg-background'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Mais Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/login">
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">O que dizem os gestores</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Ana Paula R.', role: 'Gestora de 12 imóveis', text: 'Economizo horas toda semana. Antigo enviava manualmente, agora é um clique. Meus hóspedes elogiam a organização do guia.' },
              { name: 'Ricardo M.', role: 'Anfitrião Airbnb', text: 'A integração com Airbnb é um diferencial. Consigo manter tudo sincronizado e os hóspedes recebem o guia automaticamente.' },
              { name: 'Juliana F.', role: 'Operadora de hospedagem', text: 'Padronizamos a experiência em todos os nossos 30 imóveis. A equipe adora a facilidade e os hóspedes notam a diferença.' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-6 shadow-card">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{item.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-slate-950 text-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Crie seu primeiro guia agora
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Grátis para começar. Sem cartão de crédito. Configure seu primeiro imóvel em minutos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                Começar Grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/g/flat-elegance-paulista" target="_blank">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Ver Demonstração
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-heading text-lg font-semibold">GuiaHóspedes</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Guias digitais profissionais para imóveis de hospedagem. Criado uma vez, enviado sempre.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#recursos" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#como-funciona" className="hover:text-foreground transition-colors">Como Funciona</a></li>
                <li><a href="#precos" className="hover:text-foreground transition-colors">Preços</a></li>
                <li>
                  <Link href="/g/flat-elegance-paulista" target="_blank" className="hover:text-foreground transition-colors">
                    Ver Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Conta</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground transition-colors">Entrar</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Criar Conta</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} GuiaHóspedes. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
