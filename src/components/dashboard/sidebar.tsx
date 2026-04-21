'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DASHBOARD_NAV } from '@/lib/constants'
import {
  LayoutDashboard,
  Building2,
  Plus,
  BookOpen,
  Share2,
  MessageSquare,
  Plug,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

export const sidebarIcons: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  Plus: <Plus className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  Share2: <Share2 className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Plug: <Plug className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/'
}

/* ------------------------------------------------------------------ */
/*  Tokens de estilo padronizados                                      */
/* ------------------------------------------------------------------ */
export const navItemBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary/50 active:scale-[0.98]'

export const navItemActive = 'bg-sidebar-accent text-sidebar-accent-foreground'
export const navItemInactive =
  'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'

export const actionBtnBase =
  'flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary/50 active:scale-[0.98]'

/* ------------------------------------------------------------------ */
/*  Componentes internos reutilizáveis                                 */
/* ------------------------------------------------------------------ */
export function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: (typeof DASHBOARD_NAV)[number]
  collapsed?: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        navItemBase,
        isActive ? navItemActive : navItemInactive,
        collapsed && 'justify-center px-2'
      )}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
    >
      <span
        className={cn('shrink-0', isActive && 'text-sidebar-primary')}
        aria-hidden="true"
      >
        {sidebarIcons[item.icon]}
      </span>
      {!collapsed && <span>{item.label}</span>}
    </Link>
  )
}

export function LogoutButton({ collapsed }: { collapsed?: boolean }) {
  return (
    <button
      onClick={logout}
      className={cn(
        actionBtnBase,
        'px-3 py-2.5 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
        collapsed && 'justify-center px-2'
      )}
      aria-label="Sair da conta"
      title={collapsed ? 'Sair' : undefined}
    >
      <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span>Sair</span>}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Sidebar principal (apenas desktop)                                */
/* ------------------------------------------------------------------ */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 hidden lg:flex h-screen flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link
          href="/app"
          className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80 active:scale-[0.98]"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="font-heading text-lg font-semibold tracking-tight">
              GuiaHóspedes
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {DASHBOARD_NAV.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2">
        <LogoutButton collapsed={collapsed} />
      </div>

      {/* Toggle */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            actionBtnBase,
            'justify-center p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
          )}
          aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
