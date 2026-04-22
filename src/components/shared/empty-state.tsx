import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  secondaryActionLabel?: string
  secondaryActionHref?: string
  hint?: string
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  hint,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-gradient-to-b from-muted/50 to-background p-8 text-center shadow-sm sm:p-10',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 ring-8 ring-brand-50/70">
        <Icon className="h-6 w-6" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {hint && (
          <p className="mx-auto max-w-sm text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
            {hint}
          </p>
        )}
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
          {actionLabel && actionHref && (
            <Link href={actionHref} className="w-full sm:w-auto">
              <Button className="w-full gap-2 sm:w-auto">{actionLabel}</Button>
            </Link>
          )}

          {actionLabel && onAction && !actionHref && (
            <Button className="w-full gap-2 sm:w-auto" onClick={onAction}>
              {actionLabel}
            </Button>
          )}

          {secondaryActionLabel && secondaryActionHref && (
            <Link href={secondaryActionHref} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                {secondaryActionLabel}
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
