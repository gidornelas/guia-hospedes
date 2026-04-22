'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  LogIn,
  LogOut,
  Send,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type AlertType =
  | 'CHECKIN_TOMORROW'
  | 'CHECKIN_TODAY_NOT_DONE'
  | 'CHECKOUT_TODAY_NOT_DONE'
  | 'GUIDE_NOT_PUBLISHED'
  | 'RESERVE_NO_SHARE'

export interface DashboardAlert {
  id: string
  type: AlertType
  title: string
  message: string
  severity: 'info' | 'warning' | 'error'
  link?: string
  linkLabel?: string
}

const ALERT_STORAGE_KEY = 'guiahospedes:dismissed-alerts'

const severityConfig = {
  info: { border: 'border-blue-200', bg: 'bg-blue-50/40', icon: Bell, iconColor: 'text-blue-600', titleColor: 'text-blue-900' },
  warning: { border: 'border-amber-200', bg: 'bg-amber-50/40', icon: AlertTriangle, iconColor: 'text-amber-600', titleColor: 'text-amber-900' },
  error: { border: 'border-rose-200', bg: 'bg-rose-50/40', icon: AlertTriangle, iconColor: 'text-rose-600', titleColor: 'text-rose-900' },
}

export function DashboardAlerts({ alerts }: { alerts: DashboardAlert[] }) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ALERT_STORAGE_KEY)
      if (saved) setDismissed(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  const visibleAlerts = alerts.filter((a) => !dismissed.includes(a.id))

  if (!mounted || visibleAlerts.length === 0) return null

  function dismiss(id: string) {
    const next = [...dismissed, id]
    setDismissed(next)
    try {
      localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert) => {
        const config = severityConfig[alert.severity]
        const Icon = config.icon
        return (
          <Card
            key={alert.id}
            className={cn(
              'shadow-card transition-all',
              config.border,
              config.bg,
            )}
          >
            <CardContent className="flex items-start gap-3 p-4">
              <div className={cn('mt-0.5 shrink-0', config.iconColor)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-semibold', config.titleColor)}>
                  {alert.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {alert.message}
                </p>
                {alert.link && (
                  <div className="mt-2">
                    <Link href={alert.link}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-7 gap-1 px-2',
                          alert.severity === 'info' && 'text-blue-700 hover:bg-blue-100',
                          alert.severity === 'warning' && 'text-amber-700 hover:bg-amber-100',
                          alert.severity === 'error' && 'text-rose-700 hover:bg-rose-100',
                        )}
                      >
                        {alert.linkLabel || 'Resolver'}
                        <CalendarDays className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <button
                onClick={() => dismiss(alert.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
                aria-label="Descartar alerta"
              >
                <X className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
