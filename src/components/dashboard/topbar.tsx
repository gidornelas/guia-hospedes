'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bell, BookOpen, Menu, Search, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DASHBOARD_NAV } from '@/lib/constants'
import { NavLink, LogoutButton } from '@/components/dashboard/sidebar'

interface BreadcrumbItem {
  label: string
  href?: string
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const parts = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  if (parts[0] !== 'app') {
    return breadcrumbs
  }

  breadcrumbs.push({ label: 'Dashboard', href: '/app' })

  if (parts[1] === 'imoveis') {
    breadcrumbs.push({ label: 'Imoveis', href: '/app/imoveis' })

    if (parts[2] === 'novo') {
      breadcrumbs.push({ label: 'Novo imóvel' })
      return breadcrumbs
    }

    if (parts[2]) {
      breadcrumbs.push({ label: 'Detalhes', href: `/app/imoveis/${parts[2]}` })

      if (parts[3] === 'editar') {
        breadcrumbs.push({ label: 'Editar imóvel' })
      }

      if (parts[3] === 'preview') {
        breadcrumbs.push({ label: 'Preview do guia' })
      }
    }

    return breadcrumbs
  }

  if (parts[1] === 'reservas') {
    breadcrumbs.push({ label: 'Reservas', href: '/app/reservas' })

    if (parts[2] === 'novo') {
      breadcrumbs.push({ label: 'Nova reserva' })
      return breadcrumbs
    }

    if (parts[2] === 'calendario') {
      breadcrumbs.push({ label: 'Calendario' })
      return breadcrumbs
    }

    if (parts[2]) {
      breadcrumbs.push({ label: 'Detalhes da reserva', href: `/app/reservas/${parts[2]}` })

      if (parts[3] === 'editar') {
        breadcrumbs.push({ label: 'Editar reserva' })
      }
    }

    return breadcrumbs
  }

  if (parts[1] === 'guias') breadcrumbs.push({ label: 'Guias' })
  if (parts[1] === 'compartilhamento') breadcrumbs.push({ label: 'Compartilhamento' })
  if (parts[1] === 'modelos-mensagem') breadcrumbs.push({ label: 'Modelos de mensagem' })
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

export function Topbar() {
  const pathname = usePathname()
  const user = useUser()
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:px-6 xl:flex-nowrap">
        <div className="flex min-w-0 flex-1 items-center gap-3 xl:flex-initial">
          <MobileMenu />

          <nav
            aria-label="Breadcrumb"
            className="min-w-0 flex-1 overflow-hidden text-sm text-muted-foreground"
          >
            <ol className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {breadcrumbs.map((crumb, index) => (
                <li
                  key={`${crumb.label}-${index}`}
                  className="flex min-w-0 items-center gap-2"
                >
                  {index > 0 && <span className="text-border">/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded px-1 py-0.5 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="truncate font-medium text-foreground">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="hidden w-full max-w-xs flex-1 xl:block">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Buscar imoveis, guias..."
              className="border-none bg-muted/60 pl-9 transition-colors duration-200 focus:bg-background"
              aria-label="Buscar imoveis e guias"
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden transition-all duration-200 ease-in-out active:scale-95 focus-visible:ring-2 focus-visible:ring-ring/50 sm:flex"
            aria-label="Notificacoes"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"
              aria-hidden="true"
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="relative h-9 w-9 rounded-full outline-none transition-all duration-200 ease-in-out active:scale-95 focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label={`Menu do usuario: ${user?.name || 'Usuario'}`}
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
              <DropdownMenuItem
                onClick={() => (window.location.href = '/app/configuracoes')}
              >
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 xl:hidden"
            aria-label="Abrir menu de navegacao"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-[88vw] max-w-80 border-r-0 bg-sidebar p-0">
        <div className="flex h-full flex-col">
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
                GuiaHospedes
              </span>
            </Link>
          </div>

          <div className="border-b border-sidebar-border px-4 py-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/50"
                aria-hidden="true"
              />
              <Input
                placeholder="Buscar imoveis, guias..."
                className="border-sidebar-border bg-sidebar-accent pl-9 text-sidebar-foreground placeholder:text-sidebar-foreground/50"
                aria-label="Buscar imoveis e guias"
              />
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {DASHBOARD_NAV.map((item) => (
              <div key={item.href} onClick={() => setOpen(false)}>
                <NavLink item={item} />
              </div>
            ))}
          </nav>

          <div className="border-t border-sidebar-border p-2">
            <LogoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
