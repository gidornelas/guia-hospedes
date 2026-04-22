import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Monitor,
  Share2,
  Smartphone,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GUIDE_STATUS } from '@/lib/constants'
import { db } from '@/lib/db'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'

async function getPropertyWithGuide(id: string) {
  return db.property.findUnique({
    where: { id },
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

function getGuideStatusClasses(status?: keyof typeof GUIDE_STATUS) {
  switch (status) {
    case 'PUBLISHED':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'REVIEW':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    case 'UNPUBLISHED':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    default:
      return 'border-amber-200 bg-amber-50 text-amber-700'
  }
}

function PreviewEmptyState({ propertyId }: { propertyId: string }) {
  return (
    <div className="flex h-full min-h-[20rem] items-center justify-center px-6 text-center text-muted-foreground">
      <div className="space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <p className="font-medium text-foreground">Guia ainda não publicado</p>
          <p className="text-sm">
            Publique este guia para visualizar a versão pública completa aqui.
          </p>
          <p className="text-sm">
            Próximo passo recomendado: revisar os dados do imóvel e publicar o
            guia na tela de detalhes.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <Link href={`/app/imoveis/${propertyId}`}>
            <Button size="sm">Abrir detalhes do imóvel</Button>
          </Link>
          <Link href={`/app/imoveis/${propertyId}/editar`}>
            <Button size="sm" variant="outline">
              Editar conteúdo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getPropertyWithGuide(id)
  if (!property) notFound()

  const guideStatusKey = property.guide?.status as
    | keyof typeof GUIDE_STATUS
    | undefined
  const guideStatus = guideStatusKey ? GUIDE_STATUS[guideStatusKey] : null
  const publicUrl = property.guide?.slug
    ? `${env.appUrl}/g/${property.guide.slug.replace('guia-', '')}`
    : null

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
          <Link href={`/app/imoveis/${property.id}`} className="shrink-0">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="min-w-0 space-y-3">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Preview do Guia
              </h1>
              <p className="truncate text-muted-foreground">{property.name}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'border-transparent',
                  getGuideStatusClasses(guideStatusKey),
                )}
              >
                {guideStatus?.label ?? 'Sem guia publicado'}
              </Badge>
              {property.guide?.slug && (
                <Badge
                  variant="outline"
                  className="bg-background text-muted-foreground"
                >
                  /g/{property.guide.slug.replace('guia-', '')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap xl:justify-end">
          {publicUrl && (
            <Link href={publicUrl} target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                <ExternalLink className="h-4 w-4" />
                Ver público
              </Button>
            </Link>
          )}
          {property.guide && (
            <Link
              href={`/app/compartilhamento?property=${property.id}`}
              className="w-full sm:w-auto"
            >
              <Button className="w-full gap-2 sm:w-auto">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>Visualização responsiva do guia</CardTitle>
              <p className="text-sm text-muted-foreground">
                Valide a experiência mobile e desktop sem depender de uma moldura
                fixa.
              </p>
            </div>

            <Tabs defaultValue="mobile" className="w-full gap-4 lg:w-auto">
              <TabsList className="w-full bg-muted lg:w-fit">
                <TabsTrigger value="mobile" className="gap-2 md:flex-none md:px-4">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger
                  value="desktop"
                  className="gap-2 md:flex-none md:px-4"
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mobile" className="mt-0">
                <CardContent className="px-0 pb-0 pt-2">
                  <div className="flex justify-center rounded-2xl bg-muted/40 p-3 sm:p-6">
                    <div className="w-full max-w-[390px]">
                      <div className="aspect-[9/19.5] w-full rounded-[2.5rem] border border-slate-300 bg-slate-900 p-2 shadow-2xl">
                        <div className="h-full overflow-hidden rounded-[2rem] bg-slate-50">
                          {publicUrl ? (
                            <iframe
                              src={publicUrl}
                              className="h-full w-full border-0"
                              title="Preview mobile do guia"
                            />
                          ) : (
                            <PreviewEmptyState propertyId={property.id} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="desktop" className="mt-0">
                <CardContent className="px-0 pb-0 pt-2">
                  <div className="overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm">
                    <div className="h-[min(70vh,720px)] min-h-[420px] bg-slate-50">
                      {publicUrl ? (
                        <iframe
                          src={publicUrl}
                          className="h-full w-full border-0"
                          title="Preview desktop do guia"
                        />
                      ) : (
                        <PreviewEmptyState propertyId={property.id} />
                      )}
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
