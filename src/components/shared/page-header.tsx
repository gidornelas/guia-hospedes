import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  meta?: ReactNode
  children?: ReactNode
  className?: string
  descriptionClassName?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  meta,
  children,
  className,
  descriptionClassName,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between',
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}

        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                'max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base',
                descriptionClassName,
              )}
            >
              {description}
            </p>
          )}
        </div>

        {meta && <div className="flex flex-wrap items-center gap-2">{meta}</div>}
      </div>

      {children && (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap lg:justify-end">
          {children}
        </div>
      )}
    </div>
  )
}
