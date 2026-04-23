import { notFound } from 'next/navigation'
import { MapPin, Clock, KeyRound, Navigation } from 'lucide-react'
import { CopyButton } from '@/components/shared/copy-button'
import {
  GuidePageTemplate,
  PrimaryCard,
  SecondaryCard,
  InfoRow,
  TimelineItem,
  ActionButton,
} from '@/components/shared/guide-page-template'
import { getGuideProperty, buildGuideQuery, GuideContact, GuideDevice, GuideRecommendation, GuideLink } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, loadDictionary } from '@/lib/i18n'
import { getPropertyTranslations, translateField, translatePath } from '@/lib/translate'

export default async function CheckInPage({
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
    include: { checkIn: true, contacts: true },
  })
  if (!property || !property.checkIn) notFound()

  const hostContact = property.contacts.find((c: GuideContact) => c.role === 'HOST')
  const translations = getPropertyTranslations(property.translations, locale)
  const t = (path: string) => translatePath(translations, path)

  const instructions = translateField(property.checkIn.instructions, t('checkIn.instructions'))
  const accessMethod = translateField(property.checkIn.accessMethod, t('checkIn.accessMethod'))
  const notes = translateField(property.checkIn.notes, t('checkIn.notes'))

  return (
    <GuidePageTemplate
      slug={slug}
      title={d.checkIn.title}
      subtitle={d.checkIn.subtitle}
      icon={MapPin}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={query}
      locale={locale}
    >
      <div className="space-y-5">
        {/* Primary: Horario */}
        <PrimaryCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <InfoRow
              label={d.checkIn.checkInTime}
              value={property.checkIn.time || d.checkIn.timeToBeArranged}
              highlight
            />
          </div>
          {property.checkIn.time && (
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
              {d.checkIn.contactHostIfLate}
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
            title={d.checkIn.beforeArrival}
            description={d.checkIn.beforeArrivalDesc}
            isActive
          />
          <TimelineItem
            step={2}
            title={d.checkIn.onArrival}
            description={accessMethod || d.checkIn.onArrivalFallback}
            isActive
          />
          <TimelineItem
            step={3}
            title={d.checkIn.duringStay}
            description={d.checkIn.duringStayDesc}
            isLast
          />
        </SecondaryCard>

        {/* Metodo de acesso */}
        {accessMethod && (
          <PrimaryCard>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-amber-600" />
              </div>
              <InfoRow label={d.checkIn.accessMethod} value={accessMethod} />
            </div>
          </PrimaryCard>
        )}

        {/* Instrucoes */}
        {instructions && (
          <PrimaryCard>
            <InfoRow label={d.checkIn.arrivalInstructions} value={instructions} />
          </PrimaryCard>
        )}

        {/* Endereço */}
        {property.address && (
          <PrimaryCard>
            <div className="space-y-3">
              <InfoRow label={d.checkIn.address} value={property.address} />
              <div className="flex gap-2">
                <ActionButton
                  href={`https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
                  icon={Navigation}
                  label={d.common.openInMaps}
                  color="blue"
                  ariaLabel={`${d.common.openInMaps}: ${property.address}`}
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <span className="text-sm text-slate-600 truncate flex-1">{property.address}</span>
                <CopyButton
                  text={property.address}
                  className="h-8 w-8 shrink-0"
                  ariaLabel="Copiar endereco"
                  successMessage="Endereco copiado!"
                />
              </div>
            </div>
          </PrimaryCard>
        )}

        {/* Observacoes */}
        {notes && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-medium text-amber-800 mb-1">{d.common.importantNote}</p>
            <p className="text-sm text-amber-700 leading-relaxed">{notes}</p>
          </div>
        )}
      </div>
    </GuidePageTemplate>
  )
}
