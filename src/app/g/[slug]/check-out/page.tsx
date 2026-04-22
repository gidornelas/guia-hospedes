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
import { getGuideProperty, buildGuideQuery } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, getDictionary } from '@/lib/i18n'
import { getPropertyTranslations, translateField, translatePath } from '@/lib/translate'

export default async function CheckOutPage({
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
    include: { checkOut: true, contacts: true },
  })
  if (!property || !property.checkOut) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')
  const translations = getPropertyTranslations(property.translations, locale)
  const t = (path: string) => translatePath(translations, path)

  const instructions = translateField(property.checkOut.instructions, t('checkOut.instructions'))
  const exitChecklist = translateField(property.checkOut.exitChecklist, t('checkOut.exitChecklist'))

  const checklistItems = exitChecklist
    ? exitChecklist.split('.').filter(Boolean)
    : []

  return (
    <GuidePageTemplate
      slug={slug}
      title={d.checkOut.title}
      subtitle={d.checkOut.subtitle}
      icon={MapPin}
      iconColor="text-indigo-600"
      iconBgColor="bg-indigo-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={query}
      locale={locale}
    >
      <div className="space-y-5">
        {/* Primary: Horário */}
        <PrimaryCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
            <InfoRow
              label={d.checkOut.checkOutTime}
              value={property.checkOut.time || d.checkOut.timeToBeArranged}
              highlight
            />
          </div>
          {property.checkOut.time && (
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
              {d.checkOut.lateCheckoutNote}
            </p>
          )}
        </PrimaryCard>

        {/* Timeline */}
        <SecondaryCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            {d.common.stepByStep}
          </p>
          <TimelineItem
            step={1}
            title={d.checkOut.onCheckoutDay}
            description="Organize suas malas com antecedência e verifique se não esqueceu nada."
            isActive
          />
          <TimelineItem
            step={2}
            title={d.checkOut.beforeLeaving}
            description={d.checkOut.beforeLeavingDesc}
            isActive
          />
          <TimelineItem
            step={3}
            title={d.checkOut.afterLeaving}
            description={d.checkOut.afterLeavingDesc}
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
                <p className="font-semibold text-slate-900">{d.checkOut.exitChecklist}</p>
                <p className="text-xs text-slate-500">{d.checkOut.checklistHint}</p>
              </div>
            </div>
            <InteractiveChecklist
              items={checklistItems}
              storageKey={`checkout-checklist-${slug}`}
            />
          </PrimaryCard>
        )}

        {/* Instruções */}
        {instructions && (
          <PrimaryCard>
            <InfoRow label={d.checkOut.exitInstructions} value={instructions} />
          </PrimaryCard>
        )}
      </div>
    </GuidePageTemplate>
  )
}
