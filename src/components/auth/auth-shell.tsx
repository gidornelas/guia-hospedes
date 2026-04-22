import type { ReactNode } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AuthShellProps {
  title: string
  description: string
  eyebrow?: string
  children: ReactNode
  footer?: ReactNode
}

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

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center justify-center px-4 py-10 lg:py-14">
        <div className="w-full max-w-[420px]">
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
      </main>
    </div>
  )
}
