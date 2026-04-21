import { db } from '@/lib/db'
import { env } from '@/lib/env'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Share2, BookOpen, Smartphone, Monitor } from 'lucide-react'
import { GUIDE_STATUS } from '@/lib/constants'
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

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getPropertyWithGuide(id)
  if (!property) notFound()

  const guideStatus = property.guide
    ? GUIDE_STATUS[property.guide.status as keyof typeof GUIDE_STATUS]
    : null

  const publicUrl = property.guide?.slug
    ? `${env.appUrl}/g/${property.guide.slug.replace('guia-', '')}`
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/app/imoveis/${property.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Preview do Guia</h1>
            <p className="text-muted-foreground mt-1">{property.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {publicUrl && (
            <Link href={publicUrl} target="_blank">
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Ver Público
              </Button>
            </Link>
          )}
          {property.guide && (
            <Link href={`/app/compartilhamento?property=${property.id}`}>
              <Button className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="mobile" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="mobile" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="desktop" className="gap-2">
            <Monitor className="h-4 w-4" />
            Desktop
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mobile">
          <div className="flex justify-center">
            <div className="w-[375px] h-[812px] rounded-[3rem] border-8 border-slate-800 bg-slate-800 overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-slate-50 overflow-y-auto">
                {publicUrl ? (
                  <iframe
                    src={publicUrl}
                    className="w-full h-full border-0"
                    title="Preview do Guia"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Guia não publicado
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="desktop">
          <div className="rounded-xl border border-border overflow-hidden shadow-card">
            <div className="bg-slate-50 h-[600px] overflow-y-auto">
              {publicUrl ? (
                <iframe
                  src={publicUrl}
                  className="w-full h-full border-0"
                  title="Preview do Guia"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Guia não publicado
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
