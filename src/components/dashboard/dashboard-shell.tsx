'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { cn } from '@/lib/utils'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo principal
      </a>

      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-[padding] duration-300',
          collapsed ? 'xl:pl-16' : 'xl:pl-64',
        )}
      >
        <Topbar />
        <main
          id="main-content"
          className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 xl:px-8"
          tabIndex={-1}
        >
          <div className="mx-auto w-full max-w-[1480px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
