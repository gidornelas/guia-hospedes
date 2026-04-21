import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, BookOpen, Share2, MessageCircle, Mail, Link as LinkIcon, QrCode } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/shared/page-header'

async function getGuides() {
  return db.guide.findMany({
    include: {
      property: true,
      _count: {
        select: { shareLogs: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function GuidesPage() {
  const guides = await getGuides()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guias"
        description="Gerencie todos os guias digitais dos seus imóveis"
      />

      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar guias..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {guides.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                <p>Nenhum guia criado ainda</p>
              </div>
            ) : (
              guides.map((guide: { id: string; property: { name: string }; status: string; version: number; _count: { shareLogs: number }; propertyId: string }) => (
                <div
                  key={guide.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{guide.property.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            guide.status === 'PUBLISHED'
                              ? 'default'
                              : guide.status === 'DRAFT'
                                ? 'secondary'
                                : 'outline'
                          }
                          className={
                            guide.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : guide.status === 'DRAFT'
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                : ''
                          }
                        >
                          {guide.status === 'PUBLISHED'
                            ? 'Publicado'
                            : guide.status === 'DRAFT'
                              ? 'Rascunho'
                              : guide.status === 'REVIEW'
                                ? 'Em Revisão'
                                : 'Despublicado'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          v{guide.version} • {guide._count.shareLogs} compartilhamentos
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/app/imoveis/${guide.propertyId}/preview`}>
                      <Button variant="ghost" size="sm">
                        Preview
                      </Button>
                    </Link>
                    <Link href={`/app/compartilhamento?property=${guide.propertyId}`}>
                      <Button size="sm" className="gap-2">
                        <Share2 className="h-3.5 w-3.5" />
                        Compartilhar
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
