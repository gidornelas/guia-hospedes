import { notFound } from 'next/navigation'
import {
  Shield,
  Volume2,
  Users,
  Dog,
  CigaretteOff,
  PartyPopper,
  Trash2,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
  SecondaryCard,
} from '@/components/shared/guide-page-template'
import { getGuideProperty } from '@/lib/guide-utils'

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
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', item.bgColor)}>
        <item.icon className={cn('h-5 w-5', item.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 text-sm">{item.label}</p>
        <p className={cn('text-sm', item.type === 'positive' ? 'text-emerald-600' : item.type === 'negative' ? 'text-slate-600' : 'text-slate-600')}>
          {item.value}
        </p>
      </div>
      {item.type === 'positive' && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
      {item.type === 'negative' && <XCircle className="h-5 w-5 text-slate-300 shrink-0" />}
    </div>
  )
}

export default async function RulesPage({
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
    include: { rules: true, contacts: true },
  })
  if (!property || !property.rules) notFound()

  const rules = property.rules
  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')
  const previewQuery = preview === '1' ? '?preview=1' : ''

  // Build rule items with positive language
  const ruleItems: RuleItem[] = []

  if (rules.silence) {
    ruleItems.push({
      label: 'Momento de descanso',
      value: rules.silence,
      icon: Volume2,
      type: 'text',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    })
  }

  if (rules.visits) {
    ruleItems.push({
      label: 'Visitas',
      value: rules.visits,
      icon: Users,
      type: 'text',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    })
  }

  if (rules.pets !== null && rules.pets !== undefined) {
    ruleItems.push({
      label: rules.pets ? 'Pets bem-vindos' : 'Sem animais de estimação',
      value: rules.pets
        ? 'Seu pet pode acompanhar você nesta estadia.'
        : 'Para garantir o conforto de todos, não aceitamos animais de estimação.',
      icon: Dog,
      type: rules.pets ? 'positive' : 'negative',
      color: rules.pets ? 'text-emerald-600' : 'text-slate-500',
      bgColor: rules.pets ? 'bg-emerald-50' : 'bg-slate-100',
    })
  }

  if (rules.smoking !== null && rules.smoking !== undefined) {
    ruleItems.push({
      label: rules.smoking ? 'Ambiente para fumantes' : 'Ambiente livre de fumaça',
      value: rules.smoking
        ? 'É permitido fumar no imóvel. Respeite os espaços comuns.'
        : 'O imóvel é 100% livre de fumaça para garantir o bem-estar de todos.',
      icon: CigaretteOff,
      type: rules.smoking ? 'positive' : 'negative',
      color: rules.smoking ? 'text-emerald-600' : 'text-slate-500',
      bgColor: rules.smoking ? 'bg-emerald-50' : 'bg-slate-100',
    })
  }

  if (rules.parties !== null && rules.parties !== undefined) {
    ruleItems.push({
      label: rules.parties ? 'Eventos permitidos' : 'Ambiente tranquilo',
      value: rules.parties
        ? 'Pequenos encontros são bem-vindos. Comunique com antecedência.'
        : 'O espaço é ideal para descanso. Não são permitidos eventos ou festas.',
      icon: PartyPopper,
      type: rules.parties ? 'positive' : 'negative',
      color: rules.parties ? 'text-emerald-600' : 'text-slate-500',
      bgColor: rules.parties ? 'bg-emerald-50' : 'bg-slate-100',
    })
  }

  if (rules.equipmentUse) {
    ruleItems.push({
      label: 'Cuidado com os equipamentos',
      value: rules.equipmentUse,
      icon: Info,
      type: 'text',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    })
  }

  return (
    <GuidePageTemplate
      slug={slug}
      title="Regras da Casa"
      subtitle="Para uma estadia agradável para todos"
      icon={Shield}
      iconColor="text-amber-600"
      iconBgColor="bg-amber-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={previewQuery}
    >
      <div className="space-y-5">
        {/* Intro */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Regras de convivência</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Estas normas existem para garantir que você e os próximos hóspedes tenham uma experiência incrível. Obrigado por respeitá-las!
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
        {rules.notes && (
          <PrimaryCard>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">Observações</p>
                <p className="text-sm text-slate-600 leading-relaxed">{rules.notes}</p>
              </div>
            </div>
          </PrimaryCard>
        )}
      </div>
    </GuidePageTemplate>
  )
}
