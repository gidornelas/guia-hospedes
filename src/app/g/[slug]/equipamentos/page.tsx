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
  SecondaryCard,
} from '@/components/shared/guide-page-template'
import { getGuideProperty, buildGuideQuery } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, getDictionary } from '@/lib/i18n'
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm">{name}</p>
          <p className="text-[10px] text-slate-500">{label}</p>
        </div>
      </div>
      {device.brand && (
        <p className="text-xs text-slate-500 mb-2">{device.brand}</p>
      )}
      {instructions && (
        <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3">
          <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">{instructions}</p>
        </div>
      )}
    </div>
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
  const d = getDictionary(locale)
  const query = buildGuideQuery(sp)

  const property = await getGuideProperty({
    slug,
    allowPreview: sp.preview === '1',
    include: { devices: true, contacts: true },
  })
  if (!property || property.devices.length === 0) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')

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
            <Info className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-sm text-purple-700 leading-relaxed">
              {d.devices.intro}
            </p>
          </div>
        </div>

        {/* Devices */}
        <div className="space-y-3">
          {property.devices.map((device: any) => (
            <DeviceCard key={device.id} device={{ ...device, _parentTranslations: property.translations }} locale={locale} />
          ))}
        </div>
      </div>
    </GuidePageTemplate>
  )
}
