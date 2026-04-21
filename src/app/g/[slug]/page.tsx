import { db } from '@/lib/db'
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
  Copy,
  CheckCircle2,
  Lock,
  KeyRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CopyButton } from '@/components/shared/copy-button'

async function getGuideData(slug: string) {
  const guide = await db.guide.findUnique({
    where: { slug: `guia-${slug}` },
    include: {
      property: {
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
      },
    },
  })

  if (!guide || guide.status !== 'PUBLISHED') {
    return null
  }

  return guide
}

interface SectionDef {
  id: string
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  priority: number
}

const sections: SectionDef[] = [
  { id: 'check-in', label: 'Check-in', icon: MapPin, color: 'text-blue-600', bgColor: 'bg-blue-50', priority: 1 },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, color: 'text-emerald-600', bgColor: 'bg-emerald-50', priority: 2 },
  { id: 'contatos', label: 'Contatos', icon: Phone, color: 'text-rose-600', bgColor: 'bg-rose-50', priority: 3 },
  { id: 'check-out', label: 'Check-out', icon: Clock, color: 'text-indigo-600', bgColor: 'bg-indigo-50', priority: 4 },
  { id: 'regras', label: 'Regras', icon: Shield, color: 'text-amber-600', bgColor: 'bg-amber-50', priority: 5 },
  { id: 'equipamentos', label: 'Equipamentos', icon: Tv, color: 'text-purple-600', bgColor: 'bg-purple-50', priority: 6 },
  { id: 'dicas', label: 'Dicas da Região', icon: UtensilsCrossed, color: 'text-orange-600', bgColor: 'bg-orange-50', priority: 7 },
  { id: 'links', label: 'Links Úteis', icon: Link2, color: 'text-cyan-600', bgColor: 'bg-cyan-50', priority: 8 },
]

export default async function GuideHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = await getGuideData(slug)

  if (!guide) {
    notFound()
  }

  const property = guide.property
  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')
  const hasWiFi = !!property.wifi?.networkName
  const hasCheckIn = !!property.checkIn

  // Sort sections by priority
  const sortedSections = [...sections].sort((a, b) => a.priority - b.priority)

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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-slate-900 truncate">{property.name}</h1>
            <p className="text-xs text-slate-500">
              {property.city && property.state ? `${property.city}, ${property.state}` : property.city || property.state || 'Guia do Hóspede'}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Guia oficial do imóvel
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Seja bem-vindo!
          </h2>
          {property.welcomeMessage ? (
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
              {property.welcomeMessage}
            </p>
          ) : (
            <p className="text-slate-500 text-sm">
              Aqui você encontra tudo que precisa para aproveitar sua estadia.
            </p>
          )}
        </div>

        {/* Primeiros Passos - Top Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Primeiros passos
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {hasCheckIn && (
              <Link
                href={`/g/${slug}/check-in`}
                className="flex flex-col items-center gap-2 rounded-xl bg-white border border-slate-200 p-3 shadow-sm transition-all active:scale-95 hover:border-blue-300 hover:shadow-md"
              >
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">Check-in</span>
              </Link>
            )}
            {hasWiFi && (
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">Wi-Fi</span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-md px-1.5 py-0.5">
                  <span className="truncate max-w-[60px]">{property.wifi?.networkName}</span>
                  <CopyButton text={property.wifi?.networkName || ''} className="h-3 w-3" />
                </div>
              </div>
            )}
            {hostContact?.whatsapp && (
              <a
                href={`https://wa.me/${hostContact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3 shadow-sm transition-all active:scale-95 hover:bg-green-100"
              >
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-800 text-center leading-tight">Anfitrião</span>
              </a>
            )}
          </div>
        </div>

        {/* All Sections */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Tudo sobre o imóvel
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {sortedSections.map((section) => {
              const hasData = getHasData(section.id)

              return (
                <Link
                  key={section.id}
                  href={hasData ? `/g/${slug}/${section.id}` : '#'}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all',
                    hasData
                      ? 'border-slate-200 active:scale-95 hover:shadow-md hover:border-slate-300'
                      : 'border-slate-100 opacity-60 cursor-not-allowed'
                  )}
                >
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', section.bgColor)}>
                    <section.icon className={cn('h-5 w-5', section.color)} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-slate-700 block truncate">{section.label}</span>
                    <span className={cn('text-[10px]', hasData ? 'text-emerald-600' : 'text-slate-400')}>
                      {hasData ? 'Disponível' : 'Sem informações'}
                    </span>
                  </div>
                  {hasData && <ArrowRight className="h-4 w-4 text-slate-300 ml-auto shrink-0" />}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Info Card */}
        {(property.address || property.shortDescription) && (
          <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-2">
            {property.shortDescription && (
              <p className="text-sm text-slate-600">{property.shortDescription}</p>
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
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-500 text-white py-3 font-medium transition-colors hover:bg-green-600 active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com o Anfitrião
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center space-y-1 pb-24">
        <p className="text-xs text-slate-400">Powered by GuiaHóspedes</p>
        <p className="text-[10px] text-slate-300">Seu guia digital de boas-vindas</p>
      </footer>
    </div>
  )
}
