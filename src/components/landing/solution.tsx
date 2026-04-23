import Link from 'next/link'
import { CheckCircle, Eye, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  'Formulário estruturado por imóvel',
  'Template padronizado e profissional',
  'Preview real antes de publicar',
  'Compartilhamento por WhatsApp, e-mail, link e QR',
  'Histórico de envios e próximos passos claros',
]

const mockupFields = [
  { label: 'Nome do imóvel', value: 'Casa Serra Azul' },
  { label: 'Check-in', value: '15:00 com fechadura digital' },
  { label: 'Wi-Fi', value: 'Rede principal e senha do hóspede' },
]

export function LandingSolution() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Fluxo operacional
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Um guia para cada imóvel.
                <br />
                <span className="text-primary">Criado uma vez, enviado sempre.</span>
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                A plataforma tira o processo do improviso: você estrutura as informações do imóvel, revisa o preview e compartilha com segurança no momento certo.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium leading-6 text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login">
                <Button size="lg">Testar no dashboard</Button>
              </Link>
              <Link href="/g/flat-elegance-paulista" target="_blank">
                <Button size="lg" variant="outline">
                  Ver resultado final
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-border/70 bg-background/95 p-5 shadow-[0_30px_80px_-48px_rgba(44,7,3,0.45)] sm:p-6">
            <div className="rounded-[1.75rem] border border-border/70 bg-[#fffaf8] p-5">
              <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Editor do imóvel
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-semibold text-foreground">
                    Formulário guiado
                  </h3>
                </div>
                <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Etapa 2 de 8
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {mockupFields.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-semibold">Preview em tempo real</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#6b4e48]">
                    Veja como o hóspede vai navegar antes de publicar o guia.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Send className="h-4 w-4" />
                    <span className="text-sm font-semibold">Pronto para envio</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    Quando estiver completo, o guia já segue para compartilhamento sem retrabalho.
                  </p>
                </div>
              </div>

              <Button className="mt-5 w-full">Próximo passo</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
