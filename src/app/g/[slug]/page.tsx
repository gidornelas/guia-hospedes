import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Wifi,
  Shield,
  Tv,
  Phone,
  UtensilsCrossed,
  Link2,
  ArrowRight,
  Home,
  MessageCircle,
  Clock,
  CheckCircle2,
  Lock,
  KeyRound,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CopyButton } from '@/components/shared/copy-button'
import { GuideAccessTracker } from '@/components/shared/guide-access-tracker'
import { getGuideProperty, buildGuideQuery } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, getDictionary } from '@/lib/i18n'
import { getPropertyTranslations, translateField } from '@/lib/translate'

interface SectionDef {
  id: string
  icon: React.ElementType
  color: string
  bgColor: string
  priority: number
}

const sections: SectionDef[] = [
  { id: 'check-in', icon: MapPin, color: 'text-blue-600', bgColor: 'bg-blue-50', priority: 1 },
  { id: 'wifi', icon: Wifi, color: 'text-emerald-600', bgColor: 'bg-emerald-50', priority: 2 },
  { id: 'contatos', icon: Phone, color: 'text-rose-600', bgColor: 'bg-rose-50', priority: 3 },
  { id: 'check-out', icon: Clock, color: 'text-indigo-600', bgColor: 'bg-indigo-50', priority: 4 },
  { id: 'regras', icon: Shield, color: 'text-amber-600', bgColor: 'bg-amber-50', priority: 5 },
  { id: 'equipamentos', icon: Tv, color: 'text-purple-600', bgColor: 'bg-purple-50', priority: 6 },
  { id: 'dicas', icon: UtensilsCrossed, color: 'text-orange-600', bgColor: 'bg-orange-50', priority: 7 },
  { id: 'links', icon: Link2, color: 'text-cyan-600', bgColor: 'bg-cyan-50', priority: 8 },
]

export default async function GuideHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string; lang?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const locale = getLocaleFromSearchParams(sp)
  const d = getDictionary(locale)
  const query = buildGuideQuery(sp)

  const property = await getGuideProperty({
    slug,
    allowPreview: sp.preview === '1',
    include: {
      checkIn: true,
      checkOut: true,
      wifi: true,
      rules: true,
      devices: true,
      contacts: true,
      recommendations: true,
      links: true,
    },
  })

  if (!property) notFound()

  const isPreview = sp.preview === '1'
  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')
  const hasWiFi = !!property.wifi?.networkName
  const hasCheckIn = !!property.checkIn

  const translations = getPropertyTranslations(property.translations, locale)
  const welcomeMessage = translateField(property.welcomeMessage, translations.welcomeMessage)
  const shortDescription = translateField(property.shortDescription, translations.shortDescription)

  // Sort sections by priority
  const sortedSections = [...sections].sort((a, b) => a.priority - b.priority)

  const sectionLabels: Record<string, string> = {
    'check-in': d.hub.checkIn,
    'wifi': d.hub.wifi,
    'contatos': d.hub.contacts,
    'check-out': d.hub.checkOut,
    'regras': d.hub.rules,
    'equipamentos': d.hub.devices,
    'dicas': d.hub.tips,
    'links': d.hub.usefulLinks,
  }

  const getHasData = (sectionId: string) => {
    switch (sectionId) {
      case 'check-in':
        return !!property.checkIn
      case 'check-out':
        return !!property.checkOut
      case 'wifi':
        return !!property.wifi
      case 'regras':
        return !!property.rules
      case 'equipamentos':
        return property.devices.length > 0
      case 'contatos':
        return property.contacts.length > 0
      case 'dicas':
        return property.recommendations.length > 0
      case 'links':
        return property.links.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Access Tracker */}
      {!isPreview && 'guideId' in property && (
        <GuideAccessTracker guideId={(property as any).guideId} />
      )}

      {/* Preview Banner */}
      {isPreview && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2">
          <div className="max-w-lg mx-auto flex items-center gap-2 text-amber-800">
            <Eye className="h-4 w-4 shrink-0" />
            <p className="text-xs font-medium">Modo preview - apenas voce ve esta versao</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={cn('bg-white border-b border-slate-200 sticky z-10', isPreview ? 'top-8' : 'top-0')}>
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-slate-900 truncate">{property.name}</h1>
            <p className="text-xs text-slate-500">
              {property.city && property.state ? `${property.city}, ${property.state}` : property.city || property.state || d.common.guideSubtitle}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {d.hub.officialGuide}
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            {d.hub.welcome}
          </h2>
          {welcomeMessage ? (
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
              {welcomeMessage}
            </p>
          ) : (
            <p className="text-slate-500 text-sm">
              {d.hub.welcomeFallback}
            </p>
          )}
        </div>

        {/* Primeiros Passos - Top Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {d.hub.firstSteps}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {hasCheckIn && (
              <Link
                href={`/g/${slug}/check-in${query}`}
                aria-label={`${d.hub.checkIn}. ${d.common.available}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">{d.hub.checkIn}</span>
              </Link>
            )}
            {hasWiFi && (
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">{d.hub.wifi}</span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-md px-1.5 py-0.5">
                  <span className="truncate max-w-[60px]">{property.wifi?.networkName}</span>
                  <CopyButton
                    text={property.wifi?.networkName || ''}
                    className="h-3 w-3"
                    ariaLabel="Copiar nome da rede Wi-Fi"
                    successMessage="Nome da rede copiado!"
                  />
                </div>
              </div>
            )}
            {hostContact?.whatsapp && (
              <a
                href={`https://wa.me/${hostContact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${d.common.host} no WhatsApp`}
                className="flex flex-col items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 shadow-sm transition-all hover:bg-green-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-800 text-center leading-tight">{d.common.host}</span>
              </a>
            )}
          </div>
        </div>

        {/* All Sections */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {d.hub.allAboutProperty}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {sortedSections.map((section) => {
              const hasData = getHasData(section.id)

              return (
                <Link
                  key={section.id}
                  href={hasData ? `/g/${slug}/${section.id}${query}` : '#'}
                  aria-label={`${sectionLabels[section.id]}. ${hasData ? d.common.available : d.common.noInfo}`}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all',
                    hasData
                      ? 'border-slate-200 active:scale-95 hover:shadow-md hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
                      : 'border-slate-100 opacity-60 cursor-not-allowed'
                  )}
                >
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', section.bgColor)}>
                    <section.icon className={cn('h-5 w-5', section.color)} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-slate-700 block truncate">{sectionLabels[section.id]}</span>
                    <span className={cn('text-[10px]', hasData ? 'text-emerald-600' : 'text-slate-400')}>
                      {hasData ? d.common.available : d.common.noInfo}
                    </span>
                  </div>
                  {hasData && <ArrowRight className="h-4 w-4 text-slate-300 ml-auto shrink-0" />}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Info Card */}
        {(property.address || shortDescription) && (
          <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-2">
            {shortDescription && (
              <p className="text-sm text-slate-600">{shortDescription}</p>
            )}
            {property.address && (
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{property.address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Bar */}
      {hostContact?.whatsapp && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200">
          <div className="max-w-lg mx-auto px-4 py-3">
            <a
              href={`https://wa.me/${hostContact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${d.common.callHost} no WhatsApp`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-medium text-white transition-colors hover:bg-green-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <MessageCircle className="h-5 w-5" />
              {d.common.callHost}
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center space-y-1 pb-24">
        <p className="text-xs text-slate-400">{d.common.poweredBy}</p>
        <p className="text-[10px] text-slate-300">{d.common.guideSubtitle}</p>
      </footer>
    </div>
  )
}
