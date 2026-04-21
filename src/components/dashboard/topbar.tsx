'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, User, Menu, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import {
  NavLink,
  LogoutButton,
  sidebarIcons,
  navItemBase,
  navItemActive,
  navItemInactive,
  actionBtnBase,
} from '@/components/dashboard/sidebar'
import { DASHBOARD_NAV } from '@/lib/constants'

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const breadcrumbs: { label: string; href?: string }[] = []

  if (parts[0] === 'app') {
    breadcrumbs.push({ label: 'Dashboard', href: '/app' })
  }

  if (parts[1] === 'imoveis') {
    breadcrumbs.push({ label: 'Imóveis', href: '/app/imoveis' })
    if (parts[2] && parts[2] !== 'novo') {
      breadcrumbs.push({ label: 'Detalhes' })
    }
    if (parts[2] === 'novo') {
      breadcrumbs.push({ label: 'Novo Imóvel' })
    }
  }

  if (parts[1] === 'guias') breadcrumbs.push({ label: 'Guias' })
  if (parts[1] === 'compartilhamento') breadcrumbs.push({ label: 'Compartilhamento' })
  if (parts[1] === 'modelos-mensagem') breadcrumbs.push({ label: 'Modelos de Mensagem' })
  if (parts[1] === 'integracoes') breadcrumbs.push({ label: 'Integrações' })
  if (parts[1] === 'analytics') breadcrumbs.push({ label: 'Analytics' })
  if (parts[1] === 'configuracoes') breadcrumbs.push({ label: 'Configurações' })

  return breadcrumbs
}

function useUser() {
  const [user, setUser] = useState<{
    name: string | null
    email: string | null
    image: string | null
  } | null>(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => setUser(null))
  }, [])

  return user
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/'
}

/* ------------------------------------------------------------------ */
/*  Topbar                                                            */
/* ------------------------------------------------------------------ */
export function Topbar() {
  const pathname = usePathname()
  const user = useUser()
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Mobile Menu */}
      <MobileMenu />

      {/* Breadcrumbs */}
      <nav className="flex flex-1 items-center gap-2 text-sm text-muted-foreground overflow-hidden">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2 shrink-0">
            {index > 0 && <span className="text-border">/</span>}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors duration-200 rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground truncate">
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Search */}
      <div className="relative hidden w-64 lg:w-80 md:block">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          placeholder="Buscar imóveis, guias..."
          className="pl-9 bg-muted/50 border-none focus:bg-background transition-colors duration-200"
          aria-label="Buscar imóveis e guias"
        />
      </div>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative hidden sm:flex transition-all duration-200 ease-in-out active:scale-95 focus-visible:ring-2 focus-visible:ring-ring/50"
        aria-label="Notificações"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        <span
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"
          aria-hidden="true"
        />
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="relative h-9 w-9 rounded-full outline-none transition-all duration-200 ease-in-out active:scale-95 focus-visible:ring-2 focus-visible:ring-ring/50 shrink-0"
          aria-label={`Menu do usuário: ${user?.name || 'Usuário'}`}
        >
          <Avatar className="h-9 w-9 transition-opacity duration-200">
            <AvatarImage src={user?.image || undefined} alt="" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.location.href = '/app/configuracoes'}>
            Configurações
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Mobile Menu (Sheet)                                               */
/* ------------------------------------------------------------------ */
function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
      <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0 transition-all duration-200 ease-in-out active:scale-95 focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-72 bg-sidebar p-0 border-r-0">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-sidebar-border px-4">
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80 active:scale-[0.98]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
                GuiaHóspedes
              </span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {DASHBOARD_NAV.map((item) => (
              <div key={item.href} onClick={() => setOpen(false)}>
                <NavLink item={item} />
              </div>
            ))}
          </nav>

          {/* Bottom */}
          <div className="border-t border-sidebar-border p-2">
            <LogoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
