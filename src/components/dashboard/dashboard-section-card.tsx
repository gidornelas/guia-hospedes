import { ReactNode } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardSectionCardProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function DashboardSectionCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  contentClassName,
}: DashboardSectionCardProps) {
  return (
    <Card className={cn('shadow-card', className)}>
      {title || description || action ? (
        <CardHeader className={cn('gap-3 pb-4', headerClassName)}>
          {(title || description) && (
            <div className="space-y-1">
              {title ? <CardTitle className="text-lg">{title}</CardTitle> : null}
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
          )}
          {action ? <CardAction className="w-full sm:w-auto">{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}
