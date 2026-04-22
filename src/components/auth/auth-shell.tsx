import type { ReactNode } from 'react'
import Link from 'next/link'
import { BookOpen, CircleCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AuthShellProps {
  title: string
  description: string
  eyebrow?: string
  children: ReactNode
  footer?: ReactNode
}

const highlights = [
  {
    icon: Sparkles,
    title: 'Experiencia mais profissional',
    description: 'Centralize login, cadastro e acessos sem depender de contas demo.',
  },
  {
    icon: ShieldCheck,
    title: 'Recuperacao de senha',
    description: 'O usuario pode redefinir o acesso por e-mail quando necessario.',
  },
  {
    icon: CircleCheck,
    title: 'Google e senha no mesmo fluxo',
    description: 'Quem preferir pode entrar com Google ou criar uma conta tradicional.',
  },
]

export function AuthShell({
  title,
  description,
  eyebrow = 'Acesso seguro',
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(218,159,147,0.2),_transparent_38%),linear-gradient(180deg,_#fffdfc_0%,_#fff7f5_100%)]">
      <header className="border-b border-border/70 bg-background/70 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-85"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="font-heading text-xl leading-none font-semibold">GuiaHospedes</div>
              <div className="text-xs text-muted-foreground">Guias digitais para hospedagem</div>
            </div>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:py-14">
        <div className="order-2 lg:order-1">
          <Card className="border-border/60 bg-background/95 shadow-[0_24px_80px_-40px_rgba(44,7,3,0.42)]">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {eyebrow}
                </span>
                <div className="space-y-2">
                  <h1 className="font-heading text-3xl leading-tight font-semibold text-foreground">
                    {title}
                  </h1>
                  <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </div>

              {children}

              {footer ? <div className="border-t border-border/70 pt-5">{footer}</div> : null}
            </CardContent>
          </Card>
        </div>

        <aside className="order-1 rounded-[2rem] border border-border/60 bg-[#fffaf8] p-6 shadow-[0_24px_80px_-48px_rgba(44,7,3,0.42)] lg:order-2 lg:p-10">
          <div className="max-w-xl space-y-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f6e3dd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#890620]">
                Novo fluxo de autenticacao
              </span>
              <h2 className="font-heading text-3xl leading-tight font-semibold text-[#2c0703] sm:text-4xl">
                Um acesso real, sem atalhos de demonstracao.
              </h2>
              <p className="max-w-lg text-sm leading-7 text-[#6b4e48] sm:text-base">
                O login agora pode acompanhar o crescimento do produto: usuarios se cadastram, entram com Google e recuperam a senha quando precisarem.
              </p>
            </div>

            <div className="grid gap-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#ead7d1] bg-white/80 p-4 shadow-sm"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-[#2c0703]">{item.title}</h3>
                    <p className="text-sm leading-6 text-[#6b4e48]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
