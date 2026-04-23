import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  UtensilsCrossed,
  MapPin,
  Navigation,
  ExternalLink,
  Info,
  Instagram,
  Ruler,
} from 'lucide-react'
import { cn, sanitizeHref } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
} from '@/components/shared/guide-page-template'
import { getGuideProperty, buildGuideQuery, GuideContact, GuideDevice, GuideRecommendation, GuideLink } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, loadDictionary } from '@/lib/i18n'
import { getPropertyTranslations, translateField, translatePath, getTranslatedLabels } from '@/lib/translate'

const categoryColors: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  RESTAURANT: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', iconBg: 'bg-orange-100' },
  CAFE: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', iconBg: 'bg-amber-100' },
  BAR: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', iconBg: 'bg-pink-100' },
  BAKERY: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', iconBg: 'bg-yellow-100' },
  MARKET: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', iconBg: 'bg-green-100' },
  PHARMACY: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', iconBg: 'bg-red-100' },
  SHOPPING: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', iconBg: 'bg-indigo-100' },
  NIGHTCLUB: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200', iconBg: 'bg-fuchsia-100' },
  ATTRACTION: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', iconBg: 'bg-blue-100' },
  BEACH: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', iconBg: 'bg-cyan-100' },
  PARK: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', iconBg: 'bg-emerald-100' },
  GYM: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', iconBg: 'bg-lime-100' },
  HOSPITAL: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', iconBg: 'bg-rose-100' },
  TRANSPORT: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', iconBg: 'bg-purple-100' },
}

export default async function TipsPage({
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
    include: { recommendations: true, contacts: true },
  })
  if (!property || property.recommendations.length === 0) notFound()

  const hostContact = property.contacts.find((c: GuideContact) => c.role === 'HOST')
  const categoryLabels = getTranslatedLabels(locale).categoryLabels
  const translations = getPropertyTranslations(property.translations, locale)

  // Group by category
  const grouped: Record<string, any[]> = property.recommendations.reduce((acc: any, rec: any) => {
    const cat = rec.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(rec)
    return acc
  }, {})

  return (
    <GuidePageTemplate
      slug={slug}
      title={d.tips.title}
      subtitle={d.tips.subtitle}
      icon={UtensilsCrossed}
      iconColor="text-orange-600"
      iconBgColor="bg-orange-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={query}
      locale={locale}
    >
      <div className="space-y-8">
        {/* Intro */}
        <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-sm text-orange-700 leading-relaxed">
              {d.tips.intro}
            </p>
          </div>
        </div>

        {Object.entries(grouped).map(([category, items]) => {
          const colors = categoryColors[category] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', iconBg: 'bg-slate-100' }

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', colors.bg, colors.text, colors.border)}>
                  {categoryLabels[category] || category}
                </span>
                <span className="text-xs text-slate-400">{items.length} {items.length > 1 ? d.tips.recommendations : d.tips.recommendation}</span>
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const recTranslations = translations.recommendations?.[item.id]
                  const name = translateField(item.name, recTranslations?.name)
                  const description = translateField(item.description, recTranslations?.description)

                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      {/* Foto */}
                      {item.image && (
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={name || ''}
                            fill
                            className="object-cover"
                            loading="lazy"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm">{name}</p>
                            {description && (
                              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
                            )}

                            <div className="flex flex-col gap-1 mt-2">
                              {item.address && (
                                <div className="flex items-start gap-1 text-xs text-slate-500">
                                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                  <span>{item.address}</span>
                                </div>
                              )}
                              {item.distance && (
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                  <Ruler className="h-3.5 w-3.5" />
                                  <span>{item.distance}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {sanitizeHref(item.mapUrl) && (
                            <a
                              href={sanitizeHref(item.mapUrl)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${d.common.seeOnMaps}: ${name}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              {d.common.seeOnMaps}
                            </a>
                          )}
                          {item.instagram && (
                            <a
                              href={sanitizeHref(
                                item.instagram.startsWith('http')
                                  ? item.instagram
                                  : `https://instagram.com/${item.instagram.replace('@', '')}`
                              ) || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${d.common.seeOnInstagram}: ${name}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 px-3 py-2 text-xs font-medium text-pink-700 transition-colors hover:bg-pink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                              <Instagram className="h-3.5 w-3.5" />
                              {d.common.seeOnInstagram}
                            </a>
                          )}
                          {item.link && !item.mapUrl && sanitizeHref(item.link) && (
                            <a
                              href={sanitizeHref(item.link)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${d.common.viewMore}: ${name}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              {d.common.viewMore}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </GuidePageTemplate>
  )
}
