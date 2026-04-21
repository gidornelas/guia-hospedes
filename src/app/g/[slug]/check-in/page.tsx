import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { MapPin, Clock, KeyRound, Copy, Navigation } from 'lucide-react'
import { CopyButton } from '@/components/shared/copy-button'
import {
  GuidePageTemplate,
  PrimaryCard,
  SecondaryCard,
  InfoRow,
  TimelineItem,
  ActionButton,
} from '@/components/shared/guide-page-template'

async function getGuideProperty(slug: string) {
  const guide = await db.guide.findUnique({
    where: { slug: `guia-${slug}` },
    include: {
      property: {
        include: {
          checkIn: true,
          contacts: true,
        },
      },
    },
  })
  return guide?.status === 'PUBLISHED' ? guide.property : null
}

export default async function CheckInPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getGuideProperty(slug)
  if (!property || !property.checkIn) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')

  return (
    <GuidePageTemplate
      slug={slug}
      title="Check-in"
      subtitle="Sua chegada ao imóvel"
      icon={MapPin}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
    >
      <div className="space-y-5">
        {/* Primary: Horário */}
        <PrimaryCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <InfoRow
              label="Horário de Check-in"
              value={property.checkIn.time || 'A combinar com o anfitrião'}
              highlight
            />
          </div>
          {property.checkIn.time && (
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
              Se precisar chegar fora deste horário, entre em contato com o anfitrião com antecedência.
            </p>
          )}
        </PrimaryCard>

        {/* Timeline */}
        <SecondaryCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Passo a passo
          </p>
          <TimelineItem
            step={1}
            title="Antes de chegar"
            description="Confirme seu horário de chegada e avise o anfitrião se houver alguma mudança."
            isActive
          />
          <TimelineItem
            step={2}
            title="Na chegada"
            description={property.checkIn.accessMethod || 'Procure o anfitrião ou siga as instruções de acesso.'}
            isActive
          />
          <TimelineItem
            step={3}
            title="Durante a estadia"
            description="Aproveite! Se precisar de algo, o anfitrião está a um toque de distância."
            isLast
          />
        </SecondaryCard>

        {/* Método de Acesso */}
        {property.checkIn.accessMethod && (
          <PrimaryCard>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-amber-600" />
              </div>
              <InfoRow label="Método de Acesso" value={property.checkIn.accessMethod} />
            </div>
          </PrimaryCard>
        )}

        {/* Instruções */}
        {property.checkIn.instructions && (
          <PrimaryCard>
            <InfoRow label="Instruções de Chegada" value={property.checkIn.instructions} />
          </PrimaryCard>
        )}

        {/* Endereço */}
        {property.address && (
          <PrimaryCard>
            <div className="space-y-3">
              <InfoRow label="Endereço" value={property.address} />
              <div className="flex gap-2">
                <ActionButton
                  href={`https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
                  icon={Navigation}
                  label="Abrir no Maps"
                  color="blue"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <span className="text-sm text-slate-600 truncate flex-1">{property.address}</span>
                <CopyButton text={property.address} className="h-8 w-8 shrink-0" />
              </div>
            </div>
          </PrimaryCard>
        )}

        {/* Observações */}
        {property.checkIn.notes && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-medium text-amber-800 mb-1">Observação importante</p>
            <p className="text-sm text-amber-700 leading-relaxed">{property.checkIn.notes}</p>
          </div>
        )}
      </div>
    </GuidePageTemplate>
  )
}
