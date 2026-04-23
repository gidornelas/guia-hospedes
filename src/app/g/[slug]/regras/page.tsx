import { notFound } from 'next/navigation'
import {
  Shield,
  Volume2,
  Users,
  Dog,
  CigaretteOff,
  PartyPopper,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
} from '@/components/shared/guide-page-template'
import { getGuideProperty, buildGuideQuery } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, getDictionary } from '@/lib/i18n'
import { getPropertyTranslations, translateField, translatePath } from '@/lib/translate'

interface RuleItem {
  label: string
  value: string
  icon: React.ElementType
  type: 'positive' | 'negative' | 'text'
  color: string
  bgColor: string
}

function RuleCard({ item }: { item: RuleItem }) {
  return (
    <article className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', item.bgColor)}
      >
        <item.icon className={cn('h-5 w-5', item.color)} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 text-sm">{item.label}</p>
        <p
          className={cn(
            'mt-1 text-sm leading-6',
            item.type === 'positive' ? 'text-emerald-600' : 'text-slate-600',
          )}
        >
          {item.value}
        </p>
      </div>
      {item.type === 'positive' ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
      ) : null}
      {item.type === 'negative' ? (
        <XCircle className="h-5 w-5 shrink-0 text-slate-300" aria-hidden="true" />
      ) : null}
    </article>
  )
}

export default async function RulesPage({
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
    include: { rules: true, contacts: true },
  })
  if (!property || !property.rules) notFound()

  const rules = property.rules
  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')
  const translations = getPropertyTranslations(property.translations, locale)
  const t = (path: string) => translatePath(translations, path)

  const silence = translateField(rules.silence, t('rules.silence'))
  const visits = translateField(rules.visits, t('rules.visits'))
  const equipmentUse = translateField(rules.equipmentUse, t('rules.equipmentUse'))
  const notes = translateField(rules.notes, t('rules.notes'))

  // Build rule items with positive language
  const ruleItems: RuleItem[] = []

  if (silence) {
    ruleItems.push({
      label: d.rules.silenceLabel,
      value: silence,
      icon: Volume2,
      type: 'text',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    })
  }

  if (visits) {
    ruleItems.push({
      label: d.rules.visitsLabel,
      value: visits,
      icon: Users,
      type: 'text',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    })
  }

  if (rules.pets !== null && rules.pets !== undefined) {
    ruleItems.push({
      label: rules.pets ? d.rules.petsWelcome : d.rules.noPets,
      value: rules.pets ? d.rules.petsWelcomeDesc : d.rules.noPetsDesc,
      icon: Dog,
      type: rules.pets ? 'positive' : 'negative',
      color: rules.pets ? 'text-emerald-600' : 'text-slate-500',
      bgColor: rules.pets ? 'bg-emerald-50' : 'bg-slate-100',
    })
  }

  if (rules.smoking !== null && rules.smoking !== undefined) {
    ruleItems.push({
      label: rules.smoking ? d.rules.smokingAllowed : d.rules.noSmoking,
      value: rules.smoking ? d.rules.smokingAllowedDesc : d.rules.noSmokingDesc,
      icon: CigaretteOff,
      type: rules.smoking ? 'positive' : 'negative',
      color: rules.smoking ? 'text-emerald-600' : 'text-slate-500',
      bgColor: rules.smoking ? 'bg-emerald-50' : 'bg-slate-100',
    })
  }

  if (rules.parties !== null && rules.parties !== undefined) {
    ruleItems.push({
      label: rules.parties ? d.rules.eventsAllowed : d.rules.noEvents,
      value: rules.parties ? d.rules.eventsAllowedDesc : d.rules.noEventsDesc,
      icon: PartyPopper,
      type: rules.parties ? 'positive' : 'negative',
      color: rules.parties ? 'text-emerald-600' : 'text-slate-500',
      bgColor: rules.parties ? 'bg-emerald-50' : 'bg-slate-100',
    })
  }

  if (equipmentUse) {
    ruleItems.push({
      label: d.rules.equipmentCare,
      value: equipmentUse,
      icon: Info,
      type: 'text',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    })
  }

  return (
    <GuidePageTemplate
      slug={slug}
      title={d.rules.title}
      subtitle={d.rules.subtitle}
      icon={Shield}
      iconColor="text-amber-600"
      iconBgColor="bg-amber-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={query}
      locale={locale}
    >
      <div className="space-y-5">
        {/* Intro */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-amber-800">{d.rules.coexistenceRules}</p>
              <p className="mt-1 text-sm leading-6 text-amber-700">
                {d.rules.coexistenceDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="space-y-3">
          {ruleItems.map((item, i) => (
            <RuleCard key={i} item={item} />
          ))}
        </div>

        {/* Notes */}
        {notes && (
          <PrimaryCard>
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">{d.common.note}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{notes}</p>
              </div>
            </div>
          </PrimaryCard>
        )}
      </div>
    </GuidePageTemplate>
  )
}
