'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plug,
  Plus,
  Settings,
  Share2,
} from 'lucide-react'
import { DASHBOARD_NAV } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const sidebarIcons: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  Plus: <Plus className="h-5 w-5" />,
  CalendarDays: <CalendarDays className="h-5 w-5" />,
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

export const navItemBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary/50 active:scale-[0.98]'

export const navItemActive = 'bg-sidebar-accent text-sidebar-accent-foreground'
export const navItemInactive =
  'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'

export const actionBtnBase =
  'flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary/50 active:scale-[0.98]'

function matchesNavItem(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function getActiveNavHref(pathname: string) {
  const matches = DASHBOARD_NAV.filter((item) => matchesNavItem(pathname, item.href))
  if (matches.length === 0) return null

  return matches.reduce((mostSpecific, item) =>
    item.href.length > mostSpecific.href.length ? item : mostSpecific,
  ).href
}

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
  const activeHref = getActiveNavHref(pathname)
  const isActive = activeHref === item.href

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        navItemBase,
        isActive ? navItemActive : navItemInactive,
        collapsed && 'justify-center px-2',
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
        collapsed && 'justify-center px-2',
      )}
      aria-label="Sair da conta"
      title={collapsed ? 'Sair' : undefined}
    >
      <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span>Sair</span>}
    </button>
  )
}

export function Sidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out xl:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
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

      <nav className="flex-1 space-y-1 px-2 py-4">
        {DASHBOARD_NAV.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <LogoutButton collapsed={collapsed} />
      </div>

      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className={cn(
            actionBtnBase,
            'justify-center p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
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
