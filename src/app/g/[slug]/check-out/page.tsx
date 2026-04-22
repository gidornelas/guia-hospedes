import { notFound } from 'next/navigation'
import { MapPin, Clock, ClipboardList } from 'lucide-react'
import { InteractiveChecklist } from '@/components/shared/interactive-checklist'
import {
  GuidePageTemplate,
  PrimaryCard,
  SecondaryCard,
  InfoRow,
  TimelineItem,
} from '@/components/shared/guide-page-template'
import { getGuideProperty } from '@/lib/guide-utils'

export default async function CheckOutPage({
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
    include: { checkOut: true, contacts: true },
  })
  if (!property || !property.checkOut) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')
  const checklistItems = property.checkOut.exitChecklist
    ? property.checkOut.exitChecklist.split('.').filter(Boolean)
    : []
  const previewQuery = preview === '1' ? '?preview=1' : ''

  return (
    <GuidePageTemplate
      slug={slug}
      title="Check-out"
      subtitle="Sua saída do imóvel"
      icon={MapPin}
      iconColor="text-indigo-600"
      iconBgColor="bg-indigo-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={previewQuery}
    >
      <div className="space-y-5">
        {/* Primary: Horário */}
        <PrimaryCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
            <InfoRow
              label="Horário de Check-out"
              value={property.checkOut.time || 'A combinar com o anfitrião'}
              highlight
            />
          </div>
          {property.checkOut.time && (
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
              Solicite uma saída tardia com antecedência. O anfitrião pode cobrar uma taxa adicional.
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
            title="No dia da saída"
            description="Organize suas malas com antecedência e verifique se não esqueceu nada."
            isActive
          />
          <TimelineItem
            step={2}
            title="Antes de sair"
            description="Siga o checklist ao lado para deixar o imóvel em ordem."
            isActive
          />
          <TimelineItem
            step={3}
            title="Após a saída"
            description="Feche portas e janelas, e devolva as chaves conforme combinado."
            isLast
          />
        </SecondaryCard>

        {/* Checklist Interativo */}
        {checklistItems.length > 0 && (
          <PrimaryCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Checklist de Saída</p>
                <p className="text-xs text-slate-500">Toque para marcar o que já fez</p>
              </div>
            </div>
            <InteractiveChecklist
              items={checklistItems}
              storageKey={`checkout-checklist-${slug}`}
            />
          </PrimaryCard>
        )}

        {/* Instruções */}
        {property.checkOut.instructions && (
          <PrimaryCard>
            <InfoRow label="Instruções de Saída" value={property.checkOut.instructions} />
          </PrimaryCard>
        )}
      </div>
    </GuidePageTemplate>
  )
}
