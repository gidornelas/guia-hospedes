import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-semibold">GuiaHospedes</span>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Guias digitais profissionais para imóveis de hospedagem. Criado uma vez, enviado
              sempre.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#recursos" className="transition-colors hover:text-foreground">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="transition-colors hover:text-foreground">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#precos" className="transition-colors hover:text-foreground">
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
            <h4 className="mb-4 font-semibold text-foreground">Conta</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="transition-colors hover:text-foreground">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-foreground">
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
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
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
          © {new Date().getFullYear()} GuiaHospedes. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
