import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import {
  UtensilsCrossed,
  MapPin,
  Navigation,
  ExternalLink,
  Info,
  Clock,
  Phone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
  SecondaryCard,
} from '@/components/shared/guide-page-template'

async function getGuideProperty(slug: string) {
  const guide = await db.guide.findUnique({
    where: { slug: `guia-${slug}` },
    include: {
      property: {
        include: {
          recommendations: true,
          contacts: true,
        },
      },
    },
  })
  return guide?.status === 'PUBLISHED' ? guide.property : null
}

const categoryLabels: Record<string, string> = {
  RESTAURANT: 'Restaurante',
  CAFE: 'Café',
  MARKET: 'Mercado',
  PHARMACY: 'Farmácia',
  ATTRACTION: 'Atração',
  TRANSPORT: 'Transporte',
}

const categoryColors: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  RESTAURANT: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', iconBg: 'bg-orange-100' },
  CAFE: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', iconBg: 'bg-amber-100' },
  MARKET: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', iconBg: 'bg-green-100' },
  PHARMACY: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', iconBg: 'bg-red-100' },
  ATTRACTION: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', iconBg: 'bg-blue-100' },
  TRANSPORT: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', iconBg: 'bg-purple-100' },
}

export default async function TipsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getGuideProperty(slug)
  if (!property || property.recommendations.length === 0) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')

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
      title="Dicas da Região"
      subtitle="Recomendações do anfitrião"
      icon={UtensilsCrossed}
      iconColor="text-orange-600"
      iconBgColor="bg-orange-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
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
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {item.distance && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{item.distance}</span>
                            </div>
                          )}
                          {item.phone && (
                            <a
                              href={`tel:${item.phone}`}
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              <span>Ligar</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      {item.address && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(item.name + ' ' + item.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 flex-1 justify-center rounded-lg bg-blue-50 text-blue-700 py-2 text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          Como chegar
                        </a>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 flex-1 justify-center rounded-lg bg-slate-100 text-slate-700 py-2 text-xs font-medium hover:bg-slate-200 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Ver mais
                        </a>
                      )}
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
