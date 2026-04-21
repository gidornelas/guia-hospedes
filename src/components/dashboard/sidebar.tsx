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
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const icons: Record<string, React.ReactNode> = {
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

function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/app" className="flex items-center gap-3" onClick={onNavigate}>
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
        {DASHBOARD_NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-primary',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                collapsed && 'justify-center px-2'
              )}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <span className={cn('shrink-0', isActive && 'text-sidebar-primary')} aria-hidden="true">{icons[item.icon]}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2">
        {!collapsed && (
          <button
            onClick={logout}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-primary',
              collapsed && 'justify-center px-2'
            )}
            aria-label="Sair da conta"
            title={collapsed ? 'Sair' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Sair</span>}
          </button>
        )}
      </div>
    </>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 hidden lg:flex h-screen flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent collapsed={collapsed} />
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-primary"
            aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            title={collapsed ? 'Expandir' : 'Recolher'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />}
            {!collapsed && <span className="text-sm">Recolher</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 bg-sidebar p-0 border-r-0">
            <div className="flex h-full flex-col">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export function MobileMenuButton() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <LayoutDashboard className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-sidebar p-0 border-r-0">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
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
            <MobileNav onNavigate={() => setMobileOpen(false)} />
          </nav>
          <div className="border-t border-sidebar-border p-2">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {DASHBOARD_NAV.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-primary',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={cn('shrink-0', isActive && 'text-sidebar-primary')} aria-hidden="true">{icons[item.icon]}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </>
  )
}
