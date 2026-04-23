import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Languages, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { getPropertyTranslations } from '@/lib/translate'
import { Locale } from '@/lib/i18n/types'
import Link from 'next/link'
import { TranslationsEditor } from './translations-editor'

async function getProperty(id: string) {
  return db.property.findUnique({
    where: { id, deletedAt: null },
    include: {
      checkIn: true,
      checkOut: true,
      wifi: true,
      rules: true,
      devices: true,
      contacts: true,
      recommendations: true,
      links: true,
      guide: true,
    },
  })
}

export default async function TranslationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) notFound()

  const en = getPropertyTranslations(property.translations, 'en')
  const es = getPropertyTranslations(property.translations, 'es')

  const provider = process.env.TRANSLATION_API_PROVIDER || 'libretranslate'
  const needsKey = provider === 'deepl' || provider === 'google'
  const hasApiKey = !!process.env.TRANSLATION_API_KEY
  const canAutoTranslate = !needsKey || hasApiKey

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/app/imoveis/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Traduções</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as traduções de {property.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Idiomas disponíveis
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">🇧🇷 Português (original)</Badge>
              <Badge variant={en.welcomeMessage || Object.keys(en).length > 0 ? 'default' : 'secondary'}>
                🇬🇧 Inglês
              </Badge>
              <Badge variant={es.welcomeMessage || Object.keys(es).length > 0 ? 'default' : 'secondary'}>
                🇪🇸 Espanhol
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {needsKey && !hasApiKey && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-4 text-sm text-amber-800">
              Provedor <strong>{provider}</strong> requer chave de API. Configure <code className="bg-amber-100 px-1 rounded">TRANSLATION_API_KEY</code> no .env ou mude para <strong>libretranslate</strong> (gratuito, sem chave).
            </div>
          )}
          <TranslationsEditor property={property} hasApiKey={canAutoTranslate} />
        </CardContent>
      </Card>
    </div>
  )
}
