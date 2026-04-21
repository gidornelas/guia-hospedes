import { db } from '@/lib/db'
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
import { cn } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
} from '@/components/shared/guide-page-template'

async function getGuideProperty(slug: string) {
  const guide = await db.guide.findUnique({
    where: { slug: `guia-${slug}` },
    include: {
      property: {
        include: {
          links: true,
          contacts: true,
        },
      },
    },
  })
  return guide?.status === 'PUBLISHED' ? guide.property : null
}

const typeLabels: Record<string, string> = {
  GOOGLE_MAPS: 'Google Maps',
  WHATSAPP: 'WhatsApp',
  INSTAGRAM: 'Instagram',
  LISTING: 'Anúncio',
  MANUAL: 'Manual',
  VIDEO: 'Vídeo',
  OTHER: 'Link',
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; labelColor: string }> = {
  GOOGLE_MAPS: { icon: MapPin, color: 'text-red-600', bgColor: 'bg-red-50', labelColor: 'text-red-700' },
  WHATSAPP: { icon: MessageCircle, color: 'text-green-600', bgColor: 'bg-green-50', labelColor: 'text-green-700' },
  INSTAGRAM: { icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-50', labelColor: 'text-pink-700' },
  LISTING: { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50', labelColor: 'text-blue-700' },
  MANUAL: { icon: FileText, color: 'text-slate-600', bgColor: 'bg-slate-100', labelColor: 'text-slate-700' },
  VIDEO: { icon: Video, color: 'text-red-600', bgColor: 'bg-red-50', labelColor: 'text-red-700' },
  OTHER: { icon: Globe, color: 'text-slate-600', bgColor: 'bg-slate-100', labelColor: 'text-slate-700' },
}

export default async function LinksPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getGuideProperty(slug)
  if (!property || property.links.length === 0) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')

  return (
    <GuidePageTemplate
      slug={slug}
      title="Links Úteis"
      subtitle="Recursos adicionais"
      icon={Link2}
      iconColor="text-cyan-600"
      iconBgColor="bg-cyan-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
    >
      <div className="space-y-5">
        <div className="space-y-3">
          {property.links.map((link: any) => {
            const config = typeConfig[link.type] || typeConfig.OTHER
            const Icon = config.icon

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm active:scale-[0.98] transition-all hover:shadow-md hover:border-slate-300"
              >
                <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', config.bgColor)}>
                  <Icon className={cn('h-5 w-5', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{link.label}</p>
                  <p className="text-xs text-slate-500 truncate">{link.url}</p>
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
