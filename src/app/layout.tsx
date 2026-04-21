import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SessionProvider } from 'next-auth/react'

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const dmSerif = DM_Serif_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400'],
})

export const metadata: Metadata = {
  title: {
    default: 'GuiaHóspedes — Guias Digitais para Imóveis de Hospedagem',
    template: '%s | GuiaHóspedes',
  },
  description:
    'Crie guias digitais automáticos para seus imóveis de hospedagem. Compartilhe por WhatsApp e e-mail em um clique. Padronize a experiência do seu hóspede.',
  keywords: ['guia digital', 'hospedagem', 'airbnb', 'hóspede', 'anfitrião', 'gestão de imóveis'],
  authors: [{ name: 'GuiaHóspedes' }],
  openGraph: {
    title: 'GuiaHóspedes',
    description: 'Guias digitais profissionais para imóveis de hospedagem',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SessionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'border-border shadow-card',
            },
          }}
        />
      </body>
    </html>
  )
}
