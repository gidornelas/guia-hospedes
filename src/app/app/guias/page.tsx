import Link from 'next/link'
import { BookOpen, Search, Share2 } from 'lucide-react'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/shared/empty-state'
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar guias..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {guides.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Nenhum guia criado ainda"
                description="Assim que você concluir o cadastro de um imóvel, o guia passa a ficar disponível aqui para preview e compartilhamento."
                hint="Comece criando um imóvel completo"
                actionLabel="Criar imóvel"
                actionHref="/app/imoveis/novo"
                secondaryActionLabel="Ver demo pública"
                secondaryActionHref="/g/flat-elegance-paulista"
              />
            ) : (
              guides.map((guide) => (
                <div
                  key={guide.id}
                  className="flex flex-col gap-4 rounded-xl border border-border p-4 transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{guide.property.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
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
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Link
                      href={`/app/imoveis/${guide.propertyId}/preview`}
                      className="w-full sm:w-auto"
                    >
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                        Preview
                      </Button>
                    </Link>
                    <Link
                      href={`/app/compartilhamento?property=${guide.propertyId}`}
                      className="w-full sm:w-auto"
                    >
                      <Button size="sm" className="w-full gap-2 sm:w-auto">
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
