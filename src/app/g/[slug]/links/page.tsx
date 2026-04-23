import { notFound } from 'next/navigation'
import {
  Link2,
  ExternalLink,
  MapPin,
  MessageCircle,
  Instagram,
  FileText,
  Video,
  Globe,
} from 'lucide-react'
import { cn, sanitizeHref } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
} from '@/components/shared/guide-page-template'
import { getGuideProperty, buildGuideQuery, GuideContact, GuideDevice, GuideRecommendation, GuideLink } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, loadDictionary } from '@/lib/i18n'
import { getPropertyTranslations, translateField } from '@/lib/translate'

const typeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; labelColor: string }> = {
  GOOGLE_MAPS: { icon: MapPin, color: 'text-red-600', bgColor: 'bg-red-50', labelColor: 'text-red-700' },
  WHATSAPP: { icon: MessageCircle, color: 'text-green-600', bgColor: 'bg-green-50', labelColor: 'text-green-700' },
  INSTAGRAM: { icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-50', labelColor: 'text-pink-700' },
  LISTING: { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50', labelColor: 'text-blue-700' },
  MANUAL: { icon: FileText, color: 'text-slate-600', bgColor: 'bg-slate-100', labelColor: 'text-slate-700' },
  VIDEO: { icon: Video, color: 'text-red-600', bgColor: 'bg-red-50', labelColor: 'text-red-700' },
  OTHER: { icon: Globe, color: 'text-slate-600', bgColor: 'bg-slate-100', labelColor: 'text-slate-700' },
}

export default async function LinksPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string; lang?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const locale = getLocaleFromSearchParams(sp)
  const d = await loadDictionary(locale)
  const query = buildGuideQuery(sp)

  const property = await getGuideProperty({
    slug,
    allowPreview: sp.preview === '1',
    include: { links: true, contacts: true },
  })
  if (!property || property.links.length === 0) notFound()

  const hostContact = property.contacts.find((c: GuideContact) => c.role === 'HOST')
  const typeLabels = d.links.typeLabels
  const translations = getPropertyTranslations(property.translations, locale)

  interface SafeLink extends GuideLink {
    safeUrl: string
  }

  const safeLinks = property.links
    .map((link: GuideLink) => {
      const linkTranslations = translations.links?.[link.id]
      const label = translateField(link.label, linkTranslations?.label)
      const safeUrl = sanitizeHref(link.url)
      return safeUrl ? ({ ...link, label, safeUrl } as SafeLink) : null
    })
    .filter((l): l is SafeLink => l !== null)

  return (
    <GuidePageTemplate
      slug={slug}
      title={d.links.title}
      subtitle={d.links.subtitle}
      icon={Link2}
      iconColor="text-cyan-600"
      iconBgColor="bg-cyan-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={query}
      locale={locale}
    >
      <div className="space-y-5">
        <div className="space-y-3">
          {safeLinks.map((link) => {
            const config = typeConfig[link.type] || typeConfig.OTHER
            const Icon = config.icon

            return (
              <a
                key={link.id}
                href={link.safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label}. ${typeLabels[link.type] || link.type}`}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', config.bgColor)}>
                  <Icon className={cn('h-5 w-5', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{link.label}</p>
                  <p className="text-xs text-slate-500">{typeLabels[link.type] || link.type}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 shrink-0" />
              </a>
            )
          })}
        </div>
      </div>
    </GuidePageTemplate>
  )
}
