import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LandingCtaFinal() {
  return (
    <section className="bg-slate-950 py-20 text-slate-50">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Crie seu primeiro guia agora
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Gratis para comecar. Sem cartao de credito. Configure seu primeiro imovel em poucos minutos.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
              Comecar gratis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/g/flat-elegance-paulista" target="_blank">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Ver demonstracao
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
