import { notFound } from 'next/navigation'
import { Wifi, Smartphone } from 'lucide-react'
import { CopyButton } from '@/components/shared/copy-button'
import { GuidePageTemplate, PrimaryCard } from '@/components/shared/guide-page-template'
import { getGuideProperty, buildGuideQuery } from '@/lib/guide-utils'
import { getLocaleFromSearchParams, getDictionary } from '@/lib/i18n'
import { getPropertyTranslations, translateField, translatePath } from '@/lib/translate'

export default async function WiFiPage({
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
    include: { wifi: true, contacts: true },
  })
  if (!property || !property.wifi) notFound()

  const hostContact = property.contacts.find((c: any) => c.role === 'HOST')
  const translations = getPropertyTranslations(property.translations, locale)
  const notes = translateField(property.wifi.notes, translatePath(translations, 'wifi.notes'))

  return (
    <GuidePageTemplate
      slug={slug}
      title={d.wifi.title}
      subtitle={d.wifi.subtitle}
      icon={Wifi}
      iconColor="text-emerald-600"
      iconBgColor="bg-emerald-50"
      propertyName={property.name}
      hostWhatsapp={hostContact?.whatsapp}
      previewQuery={query}
      locale={locale}
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
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{d.wifi.networkName}</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xl font-bold text-slate-900">{property.wifi.networkName}</p>
              <CopyButton
                text={property.wifi.networkName}
                className="h-8 w-8"
                ariaLabel="Copiar nome da rede Wi-Fi"
                successMessage="Nome da rede copiado!"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 text-center space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{d.wifi.password}</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xl font-bold text-slate-900 font-mono tracking-wide">{property.wifi.password}</p>
              <CopyButton
                text={property.wifi.password}
                className="h-8 w-8"
                ariaLabel="Copiar senha do Wi-Fi"
                successMessage="Senha do Wi-Fi copiada!"
              />
            </div>
          </div>
        </PrimaryCard>

        {/* Dica Mobile */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3">
          <Smartphone className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-700">{d.wifi.connectionTip}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {d.wifi.connectionTipDesc.replace('{networkName}', property.wifi.networkName)}
            </p>
          </div>
        </div>

        {/* Observacoes */}
        {notes && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-sm font-medium text-emerald-800 mb-1">{d.wifi.notes}</p>
            <p className="text-sm text-emerald-700 leading-relaxed">{notes}</p>
          </div>
        )}
      </div>
    </GuidePageTemplate>
  )
}
