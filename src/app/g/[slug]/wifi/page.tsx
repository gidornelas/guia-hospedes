import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Wifi, Smartphone } from 'lucide-react'
import { CopyButton } from '@/components/shared/copy-button'
import {
  GuidePageTemplate,
  PrimaryCard,
  InfoRow,
} from '@/components/shared/guide-page-template'

async function getGuideProperty(slug: string) {
  const guide = await db.guide.findUnique({
    where: { slug: `guia-${slug}` },
    include: {
      property: {
        include: {
          wifi: true,
          contacts: true,
        },
      },
    },
  })
  return guide?.status === 'PUBLISHED' ? guide.property : null
}

export default async function WiFiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getGuideProperty(slug)
  if (!property || !property.wifi) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')

  return (
    <GuidePageTemplate
      slug={slug}
      title="Wi-Fi"
      subtitle="Conecte-se à internet"
      icon={Wifi}
      iconColor="text-emerald-600"
      iconBgColor="bg-emerald-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
    >
      <div className="space-y-5">
        {/* Primary Card: Network Name */}
        <PrimaryCard>
          <div className="flex items-center justify-center mb-5">
            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <Wifi className="h-8 w-8 text-emerald-600" />
            </div>
          </div>

          <div className="text-center space-y-1 mb-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Nome da Rede</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xl font-bold text-slate-900">{property.wifi.networkName}</p>
              <CopyButton text={property.wifi.networkName} className="h-8 w-8" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 text-center space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Senha</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xl font-bold text-slate-900 font-mono tracking-wide">{property.wifi.password}</p>
              <CopyButton text={property.wifi.password} className="h-8 w-8" />
            </div>
          </div>
        </PrimaryCard>

        {/* Dica Mobile */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3">
          <Smartphone className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-700">Como conectar</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Toque e segure a senha para copiar. Depois, vá nas configurações do Wi-Fi do seu celular, 
              selecione a rede <strong>{property.wifi.networkName}</strong> e cole a senha.
            </p>
          </div>
        </div>

        {/* Observações */}
        {property.wifi.notes && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-sm font-medium text-emerald-800 mb-1">Observações</p>
            <p className="text-sm text-emerald-700 leading-relaxed">{property.wifi.notes}</p>
          </div>
        )}
      </div>
    </GuidePageTemplate>
  )
}
