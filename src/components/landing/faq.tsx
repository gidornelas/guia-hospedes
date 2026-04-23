import Link from 'next/link'
import { CircleHelp, ShieldCheck, Sparkles } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { faqs, trustPoints } from '@/lib/data/faq'

const iconMap = {
  Sparkles,
  ShieldCheck,
} as const

export function LandingFaq() {
  return (
    <section className="border-t border-border/60 bg-[linear-gradient(180deg,_rgba(255,250,248,0.85)_0%,_rgba(255,255,255,1)_100%)] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <CircleHelp className="h-3.5 w-3.5" />
              Objeções comuns
            </span>
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                O que normalmente trava a decisão de adotar o guia
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Reunimos as dúvidas mais comuns de anfitriões e gestores para deixar claro o que o
                produto resolve hoje e o que vale validar na sua operação.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {trustPoints.map((point) => {
              const Icon = iconMap[point.iconName]
              return (
              <div
                key={point.title}
                className="rounded-2xl border border-border/70 bg-background/90 p-5 shadow-card"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.description}</p>
              </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Testar o fluxo real
              </Button>
            </Link>
            <Link href="/g/flat-elegance-paulista" target="_blank">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver guia publicado
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-background/95 p-5 shadow-[0_24px_80px_-48px_rgba(44,7,3,0.45)] sm:p-7">
          <Accordion defaultValue={['tempo']} className="space-y-3" multiple>
            {faqs.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="rounded-2xl border border-border/70 bg-white/80 px-4 py-1 shadow-sm"
              >
                <AccordionTrigger className="py-4 text-base font-semibold text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
