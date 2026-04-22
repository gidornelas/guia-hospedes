'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-heading text-xl font-semibold">GuiaHóspedes</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#recursos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Recursos</a>
          <a href="#como-funciona" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Como Funciona</a>
          <a href="#precos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Preços</a>
          <a href="#contato" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contato</a>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Começar grátis</Button>
          </Link>
        </div>

        <button className="md:hidden" type="button" aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMobileMenuOpen((c) => !c)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="space-y-4 border-t border-border px-4 py-4 md:hidden">
          <a href="#recursos" className="block text-sm font-medium" onClick={closeMobileMenu}>Recursos</a>
          <a href="#como-funciona" className="block text-sm font-medium" onClick={closeMobileMenu}>Como Funciona</a>
          <a href="#precos" className="block text-sm font-medium" onClick={closeMobileMenu}>Preços</a>
          <a href="#contato" className="block text-sm font-medium" onClick={closeMobileMenu}>Contato</a>
          <Link href="/login" className="block" onClick={closeMobileMenu}>
            <Button className="w-full">Começar grátis</Button>
          </Link>
        </div>
      )}
    </header>
  )
}
