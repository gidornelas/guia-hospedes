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
import { getGuideProperty } from '@/lib/guide-utils'

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

const deviceTypeLabels: Record<string, string> = {
  TV: 'Televisão',
  AIR_CONDITIONING: 'Ar-condicionado',
  REFRIGERATOR: 'Geladeira',
  COFFEE_MACHINE: 'Cafeteira',
  STOVE: 'Fogão',
  MICROWAVE: 'Micro-ondas',
  WASHING_MACHINE: 'Máquina de lavar',
  DRYER: 'Secadora',
  FAN: 'Ventilador',
  HEATER: 'Aquecedor',
  HAIR_DRYER: 'Secador de cabelo',
  IRON: 'Ferro de passar',
  VACUUM: 'Aspirador',
  BLENDER: 'Liquidificador',
  TOASTER: 'Torradeira',
  WATER_HEATER: 'Aquecedor de água',
  PURIFIER: 'Purificador de ar',
  HUMIDIFIER: 'Umidificador',
  ROUTER: 'Roteador Wi-Fi',
  SPEAKER: 'Caixa de som',
  LAMP: 'Iluminação',
  SAFE: 'Cofre',
  SHOWER: 'Chuveiro',
  BATHTUB: 'Banheira',
  BED: 'Cama',
  SOFA: 'Sofá',
  PARKING: 'Estacionamento',
  UMBRELLA: 'Guarda-sol',
  GRILL: 'Churrasqueira',
  POOL: 'Piscina',
  OTHER: 'Equipamento',
}

function DeviceCard({ device }: { device: any }) {
  const Icon = deviceIconMap[device.type] || Tv
  const label = deviceTypeLabels[device.type] || device.type

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm">{device.name}</p>
          <p className="text-[10px] text-slate-500">{label}</p>
        </div>
      </div>
      {device.brand && (
        <p className="text-xs text-slate-500 mb-2">{device.brand}</p>
      )}
      {device.instructions && (
        <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3">
          <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">{device.instructions}</p>
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
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const { preview } = await searchParams
  const property = await getGuideProperty({
    slug,
    allowPreview: preview === '1',
    include: { devices: true, contacts: true },
  })
  if (!property || property.devices.length === 0) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')
  const previewQuery = preview === '1' ? '?preview=1' : ''

  return (
    <GuidePageTemplate
      slug={slug}
      title="Equipamentos"
      subtitle="Tudo que você pode usar"
      icon={Tv}
      iconColor="text-purple-600"
      iconBgColor="bg-purple-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={previewQuery}
    >
      <div className="space-y-5">
        {/* Intro */}
        <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-sm text-purple-700 leading-relaxed">
              Sinta-se em casa! Abaixo estão os equipamentos disponíveis e instruções de uso. Em caso de dúvida, entre em contato com o anfitrião.
            </p>
          </div>
        </div>

        {/* Devices */}
        <div className="space-y-3">
          {property.devices.map((device: any) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    </GuidePageTemplate>
  )
}
