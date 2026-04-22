import { notFound } from 'next/navigation'
import {
  UtensilsCrossed,
  MapPin,
  Navigation,
  ExternalLink,
  Info,
  Phone,
  Instagram,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
} from '@/components/shared/guide-page-template'
import { getGuideProperty } from '@/lib/guide-utils'

const categoryLabels: Record<string, string> = {
  RESTAURANT: 'Restaurante',
  CAFE: 'Café',
  BAR: 'Bar',
  BAKERY: 'Padaria',
  MARKET: 'Mercado',
  PHARMACY: 'Farmácia',
  SHOPPING: 'Shopping',
  NIGHTCLUB: 'Boate',
  ATTRACTION: 'Atração',
  BEACH: 'Praia',
  PARK: 'Parque',
  GYM: 'Academia',
  HOSPITAL: 'Hospital',
  TRANSPORT: 'Transporte',
}

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
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const { preview } = await searchParams
  const property = await getGuideProperty({
    slug,
    allowPreview: preview === '1',
    include: { recommendations: true, contacts: true },
  })
  if (!property || property.recommendations.length === 0) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')

  // Group by category
  const grouped: Record<string, any[]> = property.recommendations.reduce((acc: any, rec: any) => {
    const cat = rec.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(rec)
    return acc
  }, {})
  const previewQuery = preview === '1' ? '?preview=1' : ''

  return (
    <GuidePageTemplate
      slug={slug}
      title="Dicas da Região"
      subtitle="Recomendações do anfitrião"
      icon={UtensilsCrossed}
      iconColor="text-orange-600"
      iconBgColor="bg-orange-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={previewQuery}
    >
      <div className="space-y-8">
        {/* Intro */}
        <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-sm text-orange-700 leading-relaxed">
              Estas são recomendações pessoais do anfitrião. Locais testados e aprovados para você aproveitar ao máximo sua estadia.
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
                <span className="text-xs text-slate-400">{items.length} recomendação{items.length > 1 ? 'ões' : ''}</span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {/* Foto */}
                    {item.image && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>
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
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{item.distance}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.mapUrl && (
                          <a
                            href={item.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            Ver no Maps
                          </a>
                        )}
                        {item.instagram && (
                          <a
                            href={
                              item.instagram.startsWith('http')
                                ? item.instagram
                                : `https://instagram.com/${item.instagram.replace('@', '')}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 px-3 py-2 text-xs font-medium text-pink-700 hover:bg-pink-100 transition-colors"
                          >
                            <Instagram className="h-3.5 w-3.5" />
                            Instagram
                          </a>
                        )}
                        {item.link && !item.mapUrl && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver mais
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </GuidePageTemplate>
  )
}
