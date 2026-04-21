'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, User, Menu } from 'lucide-react'
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
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

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

export function Topbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Mobile Menu Button */}
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" aria-label="Abrir menu de navegação">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <MobileNavSheet />
      </Sheet>

      {/* Breadcrumbs */}
      <nav className="flex flex-1 items-center gap-2 text-sm text-muted-foreground overflow-hidden">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2 shrink-0">
            {index > 0 && <span className="text-border">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-foreground transition-colors truncate">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground truncate">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Search */}
      <div className="relative hidden w-64 lg:w-80 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Buscar imóveis, guias..."
          className="pl-9 bg-muted/50 border-none focus:bg-background"
          aria-label="Buscar imóveis e guias"
        />
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative hidden sm:flex" aria-label="Notificações">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="relative h-9 w-9 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0" aria-label={`Menu do usuário: ${session?.user?.name || 'Usuário'}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={session?.user?.image || undefined} alt="" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/app/configuracoes">Configurações</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

function MobileNavSheet() {
  const pathname = usePathname()

  const navItems = [
    { href: '/app', label: 'Visão Geral', icon: 'LayoutDashboard' },
    { href: '/app/imoveis', label: 'Imóveis', icon: 'Building2' },
    { href: '/app/guias', label: 'Guias', icon: 'BookOpen' },
    { href: '/app/compartilhamento', label: 'Compartilhamento', icon: 'Share2' },
    { href: '/app/modelos-mensagem', label: 'Modelos', icon: 'MessageSquare' },
    { href: '/app/integracoes', label: 'Integrações', icon: 'Plug' },
    { href: '/app/analytics', label: 'Analytics', icon: 'BarChart3' },
    { href: '/app/configuracoes', label: 'Configurações', icon: 'Settings' },
  ]

  return (
    <SheetContent side="left" className="w-72 bg-sidebar p-0 border-r-0">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Link href="/app" className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground">
              GuiaHóspedes
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-primary',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={cn('shrink-0', isActive && 'text-sidebar-primary')} aria-hidden="true">
                  {item.icon === 'LayoutDashboard' && <LayoutDashboard className="h-5 w-5" />}
                  {item.icon === 'Building2' && <Building2 className="h-5 w-5" />}
                  {item.icon === 'BookOpen' && <BookOpen className="h-5 w-5" />}
                  {item.icon === 'Share2' && <Share2 className="h-5 w-5" />}
                  {item.icon === 'MessageSquare' && <MessageSquare className="h-5 w-5" />}
                  {item.icon === 'Plug' && <Plug className="h-5 w-5" />}
                  {item.icon === 'BarChart3' && <BarChart3 className="h-5 w-5" />}
                  {item.icon === 'Settings' && <Settings className="h-5 w-5" />}
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </SheetContent>
  )
}

// Icons for mobile nav
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Share2,
  MessageSquare,
  Plug,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
