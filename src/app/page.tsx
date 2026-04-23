'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LandingHeader } from '@/components/landing/header'
import { LandingHero } from '@/components/landing/hero'
import { LandingProblem } from '@/components/landing/problem'
import { LandingAudience } from '@/components/landing/audience'
import { LandingSolution } from '@/components/landing/solution'
import { LandingHowItWorks } from '@/components/landing/how-it-works'
import { LandingFeatures } from '@/components/landing/features'
import { LandingBenefits } from '@/components/landing/benefits'
import { LandingSharing } from '@/components/landing/sharing-block'
import { LandingAirbnb } from '@/components/landing/airbnb-integration'
import { LandingPricing } from '@/components/landing/pricing'
import { LandingTestimonials } from '@/components/landing/testimonials'
import { LandingFaq } from '@/components/landing/faq'
import { LandingCtaFinal } from '@/components/landing/cta-final'
import { LandingFooter } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col pb-28 md:pb-0">
      <LandingHeader />
      <LandingHero />
      <LandingProblem />
      <LandingAudience />
      <LandingSolution />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingBenefits />
      <LandingSharing />
      <LandingAirbnb />
      <LandingPricing />
      <LandingTestimonials />
      <LandingFaq />

      <section id="contato" className="scroll-mt-24 border-y border-border bg-gradient-brand-soft py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Contato e demonstracao
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Quer validar o produto com a sua operação?
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Fale com a equipe, teste a demo publica e entenda como organizar onboarding, compartilhamento e experiencia do hospede sem depender de mensagens repetidas.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Comecar agora
                </Button>
              </Link>
              <Link href="/g/demo" target="_blank">
                <Button size="lg" variant="outline">
                  Abrir demonstracao
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">E-mail de contato</p>
                <a
                  href="mailto:oi@guiahospedes.com"
                  className="mt-1 block text-lg font-semibold text-foreground transition-colors hover:text-primary"
                >
                  oi@guiahospedes.com
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ideal para</p>
                <p className="mt-1 text-sm text-foreground">
                  anfitrioes individuais, gestores com multiplos imóveis e times de operação.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Proximo passo sugerido</p>
                <p className="mt-1 text-sm text-foreground">
                  Criar o primeiro imóvel, publicar o guia e testar o envio por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingCtaFinal />
      <LandingFooter />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 py-3 shadow-lg backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Link href="/login" className="flex-1">
            <Button className="w-full">Comecar gratis</Button>
          </Link>
          <Link href="/g/demo" target="_blank" className="flex-1">
            <Button variant="outline" className="w-full">
              Ver demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
