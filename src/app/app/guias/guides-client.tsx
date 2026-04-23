'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Eye, FileEdit, Search, Share2, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { DashboardMetricCard } from '@/components/dashboard/dashboard-metric-card'
import { DashboardSectionCard } from '@/components/dashboard/dashboard-section-card'
import { cn } from '@/lib/utils'

interface GuideItem {
  id: string
  propertyId: string
  status: string
  version: number
  property: {
    name: string
  }
  _count: {
    shareLogs: number
  }
}

interface GuidesClientProps {
  guides: GuideItem[]
}

function getGuideStatusLabel(status: string) {
  if (status === 'PUBLISHED') return 'Publicado'
  if (status === 'DRAFT') return 'Rascunho'
  if (status === 'REVIEW') return 'Em revisao'
  return 'Despublicado'
}

function getGuideStatusClasses(status: string) {
  if (status === 'PUBLISHED') {
    return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
  }
  if (status === 'DRAFT') {
    return 'bg-amber-100 text-amber-700 hover:bg-amber-100'
  }
  if (status === 'REVIEW') {
    return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
  }
  return ''
}

export function GuidesClient({ guides }: GuidesClientProps) {
  const searchInputId = 'guides-search'
  const [search, setSearch] = useState('')

  const filteredGuides = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return guides

    return guides.filter((guide) => {
      return (
        guide.property.name.toLowerCase().includes(query) ||
        getGuideStatusLabel(guide.status).toLowerCase().includes(query)
      )
    })
  }, [guides, search])

  const metrics = useMemo(() => {
    const totalShares = guides.reduce((acc, guide) => acc + guide._count.shareLogs, 0)
    const published = guides.filter((guide) => guide.status === 'PUBLISHED').length
    const inProgress = guides.filter((guide) => guide.status !== 'PUBLISHED').length

    return [
      {
        title: 'Total de guias',
        value: guides.length,
        hint: 'Biblioteca ativa da operação',
        icon: BookOpen,
        tone: 'brand' as const,
      },
      {
        title: 'Publicados',
        value: published,
        hint: 'Prontos para compartilhar',
        icon: TrendingUp,
        tone: 'emerald' as const,
      },
      {
        title: 'Em ajuste',
        value: inProgress,
        hint: 'Rascunho, revisao ou despublicado',
        icon: FileEdit,
        tone: 'amber' as const,
      },
      {
        title: 'Compartilhamentos',
        value: totalShares,
        hint: 'Historico acumulado dos guias',
        icon: Share2,
        tone: 'blue' as const,
      },
    ]
  }, [guides])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Biblioteca"
        title="Guias"
        description="Gerencie todos os guias digitais dos seus imóveis com foco em status, preview e proximos passos de compartilhamento."
        meta={
          <>
            <Badge className="bg-brand-100 text-brand-700 hover:bg-brand-100">
              {guides.length} guias
            </Badge>
            <Badge variant="outline" className="bg-background">
              Fluxo centralizado
            </Badge>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            hint={metric.hint}
            icon={metric.icon}
            tone={metric.tone}
          />
        ))}
      </div>

      <DashboardSectionCard
        title="Biblioteca de guias"
        description="Busque rapidamente um guia pelo nome do imóvel e acompanhe status, versao e compartilhamentos no mesmo padrao visual das outras telas."
        action={
          <div className="relative w-full sm:w-[280px]">
            <label htmlFor={searchInputId} className="sr-only">
              Buscar guias por nome do imóvel ou status
            </label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={searchInputId}
              placeholder="Buscar guias..."
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar guias por nome do imóvel ou status"
            />
          </div>
        }
        contentClassName="space-y-4"
      >
        {guides.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nenhum guia criado ainda"
            description="Assim que você concluir o cadastro de um imóvel, o guia passa a ficar disponivel aqui para preview e compartilhamento."
            hint="Comece criando um imóvel completo"
            actionLabel="Criar imóvel"
            actionHref="/app/imóveis/novo"
            secondaryActionLabel="Ver demo publica"
            secondaryActionHref="/g/flat-elegance-paulista"
          />
        ) : filteredGuides.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum guia encontrado"
            description="Tente outro termo de busca para localizar um guia da biblioteca."
            actionLabel="Limpar busca"
            onAction={() => setSearch('')}
          />
        ) : (
          <div className="space-y-3">
            {filteredGuides.map((guide) => (
              <Card
                key={guide.id}
                className="shadow-card transition-shadow hover:shadow-card-hover"
              >
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">{guide.property.name}</p>
                        <Badge
                          variant={
                            guide.status === 'PUBLISHED'
                              ? 'default'
                              : guide.status === 'DRAFT'
                                ? 'secondary'
                                : 'outline'
                          }
                          className={cn(getGuideStatusClasses(guide.status))}
                        >
                          {getGuideStatusLabel(guide.status)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>v{guide.version}</span>
                        <span>{guide._count.shareLogs} compartilhamento(s)</span>
                        <span>
                          {guide.status === 'PUBLISHED'
                            ? 'Pronto para envio'
                            : 'Revisar antes de compartilhar'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Link
                      href={`/app/imóveis/${guide.propertyId}/preview`}
                      className="w-full sm:w-auto"
                    >
                      <Button variant="outline" size="sm" className="w-full gap-2 sm:w-auto">
                        <Eye className="h-3.5 w-3.5" />
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DashboardSectionCard>
    </div>
  )
}
