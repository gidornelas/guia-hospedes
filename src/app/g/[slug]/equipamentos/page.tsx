import { notFound } from 'next/navigation'
import {
  Tv,
  Info,
  Wind,
  Refrigerator,
  Coffee,
  Waves,
  Flame,
  Droplets,
  Microwave,
  WashingMachine,
  Fan,
  Lamp,
  Speaker,
  Router,
  Zap,
  Umbrella,
  Armchair,
  BedDouble,
  Bath,
  Car,
  KeyRound,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  GuidePageTemplate,
  PrimaryCard,
} from '@/components/shared/guide-page-template'
import { getGuideProperty, buildGuideQuery, GuideContact, GuideDevice, GuideRecommendation, GuideLink } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, loadDictionary } from '@/lib/i18n'
import { getPropertyTranslations, translateField, translatePath, getTranslatedLabels } from '@/lib/translate'

// Map device types to semantic icons
const deviceIconMap: Record<string, LucideIcon> = {
  TV: Tv,
  AIR_CONDITIONING: Wind,
  REFRIGERATOR: Refrigerator,
  COFFEE_MACHINE: Coffee,
  STOVE: Flame,
  MICROWAVE: Microwave,
  WASHING_MACHINE: WashingMachine,
  DRYER: Wind,
  FAN: Fan,
  HEATER: Flame,
  HAIR_DRYER: Wind,
  IRON: Zap,
  VACUUM: Wind,
  BLENDER: Zap,
  TOASTER: Flame,
  WATER_HEATER: Droplets,
  PURIFIER: Wind,
  HUMIDIFIER: Droplets,
  ROUTER: Router,
  SPEAKER: Speaker,
  LAMP: Lamp,
  SAFE: KeyRound,
  SHOWER: Bath,
  BATHTUB: Bath,
  BED: BedDouble,
  SOFA: Armchair,
  PARKING: Car,
  UMBRELLA: Umbrella,
  GRILL: Flame,
  POOL: Waves,
  OTHER: Tv,
}

function DeviceCard({ device, locale }: { device: any; locale: string }) {
  const Icon = deviceIconMap[device.type] || Tv
  const labels = getTranslatedLabels(locale as any).deviceTypeLabels
  const label = labels[device.type] || device.type

  const translations = getPropertyTranslations(device._parentTranslations, locale as any)
  const deviceTranslations = translations.devices?.[device.id]
  const name = translateField(device.name, deviceTranslations?.name)
  const instructions = translateField(device.instructions, deviceTranslations?.instructions)

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
          <Icon className="h-5 w-5 text-purple-600" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm">{name}</p>
          <p className="text-[10px] text-slate-500">{label}</p>
        </div>
      </div>
      {device.brand ? <p className="mb-2 text-xs text-slate-500">{device.brand}</p> : null}
      {instructions && (
        <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <p className="text-sm text-slate-600 leading-relaxed">{instructions}</p>
        </div>
      )}
    </article>
  )
}

export default async function DevicesPage({
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
    include: { devices: true, contacts: true },
  })
  if (!property || property.devices.length === 0) notFound()

  const hostContact = property.contacts.find((c: GuideContact) => c.role === 'HOST')

  return (
    <GuidePageTemplate
      slug={slug}
      title={d.devices.title}
      subtitle={d.devices.subtitle}
      icon={Tv}
      iconColor="text-purple-600"
      iconBgColor="bg-purple-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={query}
      locale={locale}
    >
      <div className="space-y-5">
        {/* Intro */}
        <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" aria-hidden="true" />
            <p className="text-sm leading-6 text-purple-700">
              {d.devices.intro}
            </p>
          </div>
        </div>

        {/* Devices */}
        <div className="space-y-3">
          {property.devices.map((device: GuideDevice) => (
            <DeviceCard key={device.id} device={{ ...device, _parentTranslations: property.translations }} locale={locale} />
          ))}
        </div>
      </div>
    </GuidePageTemplate>
  )
}
