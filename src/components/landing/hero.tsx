import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Lock,
  MapPin,
  MessageCircle,
  Smartphone,
  Wifi,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const guideHighlights = [
  { icon: MapPin, label: 'Check-in guiado', value: 'Endereço, acesso e chegada' },
  { icon: Wifi, label: 'Wi-Fi pronto', value: 'Rede, senha e cópia rápida' },
  { icon: Lock, label: 'Regras claras', value: 'Silêncio, visitas e cuidados' },
]

const dashboardStats = [
  { label: 'Guias ativos', value: '24' },
  { label: 'Publicados hoje', value: '6' },
  { label: 'Envios recentes', value: '18' },
]

export function LandingHero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(182,70,95,0.16),_transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.08fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              <span>Plataforma completa para anfitriões e operações</span>
            </div>

            <div className="space-y-5">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Guie seu hóspede.
                <br />
                <span className="text-primary">Sem repetir.</span>
                <br />
                Sem esquecer.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Crie guias digitais organizados para cada imóvel, revise o preview antes de publicar e compartilhe por WhatsApp, e-mail, link ou QR Code em poucos minutos.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/cadastro">
                <Button size="lg" className="gap-2">
                  Criar meu primeiro guia
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/g/demo" target="_blank">
                <Button size="lg" variant="outline">
                  Ver demo publicada
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
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Fluxo real de publicação e envio</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-36 w-36 rounded-full bg-primary/10 blur-3xl lg:block" />
            <div className="absolute -right-6 bottom-2 hidden h-40 w-40 rounded-full bg-[#e8c7cf] blur-3xl lg:block" />

            <div className="relative mx-auto max-w-2xl">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[2rem] border border-border/70 bg-background/95 p-4 shadow-[0_30px_80px_-42px_rgba(44,7,3,0.45)]">
                  <div className="rounded-[1.5rem] border border-border/70 bg-[#fffaf8] p-4">
                    <div className="flex items-center justify-between border-b border-border/70 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Flat Elegance Paulista</p>
                          <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Publicado
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {guideHighlights.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-start gap-3 rounded-2xl border border-border/70 bg-white p-3.5"
                        >
                          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">{item.label}</p>
                            <p className="text-sm leading-6 text-muted-foreground">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm font-semibold">Mensagem pronta para enviar</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#6b4e48]">
                        Olá, Maria. Aqui está o guia da sua estadia com acesso, Wi-Fi, regras e dicas da região.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[2rem] border border-border/70 bg-background/95 p-5 shadow-[0_24px_80px_-48px_rgba(44,7,3,0.4)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          Dashboard
                        </p>
                        <h3 className="mt-1 font-heading text-2xl font-semibold text-foreground">
                          Operação organizada
                        </h3>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Smartphone className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {dashboardStats.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-2xl border border-border/70 bg-[#fffaf8] px-4 py-3"
                        >
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-lg font-semibold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-border/70 bg-[#2c0703] p-5 text-white shadow-[0_24px_80px_-48px_rgba(44,7,3,0.5)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f6d8df]">
                      Próximo melhor passo
                    </p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold">
                      Publicar, compartilhar e acompanhar
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#f7e8eb]">
                      O fluxo já nasce preparado para produção: cadastro, preview, publicação e envio no canal certo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
