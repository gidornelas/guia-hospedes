import { notFound } from 'next/navigation'
import { Phone, Mail, MessageCircle, Star, AlertTriangle, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
  SecondaryCard,
} from '@/components/shared/guide-page-template'
import { getGuideProperty } from '@/lib/guide-utils'

const roleLabels: Record<string, string> = {
  HOST: 'Anfitrião',
  SUPPORT: 'Suporte',
  MAINTENANCE: 'Manutenção',
  CONCIERGE: 'Portaria',
  EMERGENCY: 'Emergência',
}

const rolePriority: Record<string, number> = {
  HOST: 1,
  EMERGENCY: 2,
  SUPPORT: 3,
  MAINTENANCE: 4,
  CONCIERGE: 5,
}

interface ContactCardProps {
  contact: {
    id: string
    name: string
    role: string
    phone: string | null
    email: string | null
    whatsapp: string | null
  }
  priority: 'host' | 'emergency' | 'normal'
}

function ContactCard({ contact, priority }: ContactCardProps) {
  const styles = {
    host: {
      card: 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent',
      badge: 'bg-primary/10 text-primary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    emergency: {
      card: 'border-red-200 bg-red-50/50',
      badge: 'bg-red-100 text-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    normal: {
      card: 'border-slate-200',
      badge: 'bg-slate-100 text-slate-600',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-500',
    },
  }

  const s = styles[priority]

  return (
    <div className={cn('rounded-xl border p-4 shadow-sm', s.card)}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('h-10 w-10 rounded-full flex items-center justify-center shrink-0', s.iconBg)}>
          {priority === 'host' ? (
            <Heart className={cn('h-5 w-5', s.iconColor)} />
          ) : priority === 'emergency' ? (
            <AlertTriangle className={cn('h-5 w-5', s.iconColor)} />
          ) : (
            <Phone className={cn('h-5 w-5', s.iconColor)} />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 truncate">{contact.name}</p>
          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', s.badge)}>
            {roleLabels[contact.role] || contact.role}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 p-2.5 text-sm text-slate-700 hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{contact.phone}</span>
            <span className="ml-auto text-[10px] text-primary font-medium shrink-0">Ligar</span>
          </a>
        )}
        {contact.whatsapp && (
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg bg-green-50 border border-green-200 p-2.5 text-sm text-green-700 hover:bg-green-100 transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-green-600 shrink-0" />
            <span className="truncate">{contact.whatsapp}</span>
            <span className="ml-auto text-[10px] text-green-700 font-medium shrink-0">WhatsApp</span>
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2.5 rounded-lg bg-white border border-slate-200 p-2.5 text-sm text-slate-700 hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{contact.email}</span>
            <span className="ml-auto text-[10px] text-primary font-medium shrink-0">E-mail</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default async function ContactsPage({
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
    include: { contacts: true },
  })
  if (!property || property.contacts.length === 0) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')

  // Sort by priority
  const sortedContacts = [...property.contacts].sort((a: any, b: any) => {
    const pa = rolePriority[a.role] || 99
    const pb = rolePriority[b.role] || 99
    return pa - pb
  })

  const host = sortedContacts.find((c: any) => c.role === 'HOST')
  const emergency = sortedContacts.filter((c: any) => c.role === 'EMERGENCY')
  const others = sortedContacts.filter((c: any) => c.role !== 'HOST' && c.role !== 'EMERGENCY')
  const previewQuery = preview === '1' ? '?preview=1' : ''

  return (
    <GuidePageTemplate
      slug={slug}
      title="Contatos"
      subtitle="Quem você pode chamar"
      icon={Phone}
      iconColor="text-rose-600"
      iconBgColor="bg-rose-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={previewQuery}
    >
      <div className="space-y-5">
        {/* Anfitrião — destaque especial */}
        {host && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Star className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Seu anfitrião
              </span>
            </div>
            <ContactCard contact={host} priority="host" />
          </div>
        )}

        {/* Emergência */}
        {emergency.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                Emergência
              </span>
            </div>
            {emergency.map((contact: any) => (
              <ContactCard key={contact.id} contact={contact} priority="emergency" />
            ))}
          </div>
        )}

        {/* Outros contatos */}
        {others.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Outros contatos
              </span>
            </div>
            <div className="space-y-3">
              {others.map((contact: any) => (
                <ContactCard key={contact.id} contact={contact} priority="normal" />
              ))}
            </div>
          </div>
        )}
      </div>
    </GuidePageTemplate>
  )
}
