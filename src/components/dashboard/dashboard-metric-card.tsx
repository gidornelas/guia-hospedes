import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const toneClasses = {
  brand: 'bg-brand-100 text-brand-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-100 text-slate-700',
} as const

interface DashboardMetricCardProps {
  title: string
  value: ReactNode
  hint?: string
  icon: LucideIcon
  tone?: keyof typeof toneClasses
  className?: string
  valueClassName?: string
}

export function DashboardMetricCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = 'brand',
  className,
  valueClassName,
}: DashboardMetricCardProps) {
  return (
    <Card className={cn('shadow-card transition-shadow hover:shadow-card-hover', className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={cn('text-2xl font-bold tracking-tight', valueClassName)}>{value}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>

        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            toneClasses[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
