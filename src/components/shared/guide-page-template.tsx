import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowLeft, Home, MessageCircle } from 'lucide-react'
import { ReactNode } from 'react'
import { LanguageSwitcher } from './language-switcher'
import { Locale } from '@/lib/i18n/types'
import { getDictionary } from '@/lib/i18n'

interface GuidePageTemplateProps {
  slug: string
  title: string
  subtitle?: string
  icon: React.ElementType
  iconColor: string
  iconBgColor: string
  children: ReactNode
  propertyName: string
  hostWhatsapp?: string | null
  showBottomBar?: boolean
  previewQuery?: string
  locale: Locale
}

export function GuidePageTemplate({
  slug,
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
  children,
  propertyName,
  hostWhatsapp,
  showBottomBar = true,
  previewQuery = '',
  locale,
}: GuidePageTemplateProps) {
  const d = getDictionary(locale)

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Skip to content */}
      <a
        href="#guide-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm"
      >
        {d.common.skipToContent}
      </a>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={`/g/${slug}${previewQuery}`}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors shrink-0"
            aria-label={d.common.backToHome}
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" aria-hidden="true" />
          </Link>
          <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', iconBgColor)}>
            <Icon className={cn('h-5 w-5', iconColor)} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-base text-slate-900 leading-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-slate-500 truncate">{subtitle}</p>
            )}
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Content */}
      <main id="guide-content" className="max-w-lg mx-auto px-4 py-5" tabIndex={-1}>
        {children}
      </main>

      {/* Bottom Bar */}
      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link
              href={`/g/${slug}${previewQuery}`}
              className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-slate-100 text-slate-700 py-3 text-sm font-medium transition-colors hover:bg-slate-200 active:scale-[0.98]"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              {d.common.backToHome}
            </Link>
            {hostWhatsapp && (
              <a
                href={`https://wa.me/${hostWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-green-500 text-white py-3 text-sm font-medium transition-colors hover:bg-green-600 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {d.common.host}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* Primary Card — info essencial, destaque */
export function PrimaryCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200 p-6 shadow-sm', className)}>
      {children}
    </div>
  )
}

/* Secondary Card — info complementar, mais compacto */
export function SecondaryCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-4 shadow-sm', className)}>
      {children}
    </div>
  )
}

/* Info Row — label + value em linha */
export function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: ReactNode
  highlight?: boolean
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      {highlight ? (
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      ) : (
        <p className="text-sm text-slate-700">{value}</p>
      )}
    </div>
  )
}

/* Timeline Item */
export function TimelineItem({
  step,
  title,
  description,
  isActive = false,
  isLast = false,
}: {
  step: number
  title: string
  description?: string
  isActive?: boolean
  isLast?: boolean
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-slate-100 text-slate-500'
          )}
        >
          {step}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-200 mt-2" />}
      </div>
      <div className={cn('pb-6', isLast && 'pb-0')}>
        <p className={cn('font-semibold text-sm', isActive ? 'text-slate-900' : 'text-slate-500')}>
          {title}
        </p>
        {description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>}
      </div>
    </div>
  )
}

/* Action Button — CTA grande e escaneável */
export function ActionButton({
  href,
  icon: Icon,
  label,
  color = 'primary',
}: {
  href: string
  icon: React.ElementType
  label: string
  color?: 'primary' | 'green' | 'blue' | 'slate'
}) {
  const colors = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    green: 'bg-green-500 text-white hover:bg-green-600',
    blue: 'bg-blue-500 text-white hover:bg-blue-600',
    slate: 'bg-slate-800 text-white hover:bg-slate-700',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-center gap-2 w-full rounded-xl py-3.5 font-medium transition-all active:scale-[0.98]',
        colors[color]
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </a>
  )
}
