import Link from 'next/link'
import {
  BookOpen,
  Building2,
  Clock,
  Plus,
  Share2,
  TrendingUp,
} from 'lucide-react'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { cn } from '@/lib/utils'

async function getDashboardData() {
  const [totalProperties, totalGuides, publishedGuides, draftGuides, recentShares] =
    await Promise.all([
      db.property.count(),
      db.guide.count(),
      db.guide.count({ where: { status: 'PUBLISHED' } }),
      db.guide.count({ where: { status: 'DRAFT' } }),
      db.shareLog.findMany({
        take: 5,
        orderBy: { sentAt: 'desc' },
        include: { guide: { include: { property: true } } },
      }),
    ])

  return { totalProperties, totalGuides, publishedGuides, draftGuides, recentShares }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const stats = [
    {
      title: 'Total de imóveis',
      value: data.totalProperties,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      hint: 'Base cadastrada',
    },
    {
      title: 'Guias publicados',
      value: data.publishedGuides,
      icon: BookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      hint: 'Prontos para compartilhar',
    },
    {
      title: 'Guias em rascunho',
      value: data.draftGuides,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      hint: 'Precisam de revisão',
    },
    {
      title: 'Total de guias',
      value: data.totalGuides,
      icon: TrendingUp,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      hint: 'Todos os status',
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Painel"
        title="Visão Geral"
        description="Acompanhe o status dos seus imóveis, identifique o que ainda falta publicar e acione os próximos passos sem sair da home."
      >
        <Link href="/app/imoveis/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo imóvel
          </Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.hint}</p>
                </div>
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    stat.bg,
                  )}
                >
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Atalhos rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/app/imoveis/novo">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Plus className="h-4 w-4" />
                Cadastrar novo imóvel
              </Button>
            </Link>
            <Link href="/app/imoveis">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Building2 className="h-4 w-4" />
                Ver todos os imóveis
              </Button>
            </Link>
            <Link href="/app/compartilhamento">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Share2 className="h-4 w-4" />
                Compartilhar guia
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Compartilhamentos recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentShares.length === 0 ? (
              <EmptyState
                icon={Share2}
                title="Nenhum compartilhamento ainda"
                description="Assim que você publicar um guia e enviá-lo por WhatsApp, e-mail ou link, os últimos envios aparecerão aqui."
                hint="Publique um guia e faça o primeiro envio"
                actionLabel="Ir para compartilhamento"
                actionHref="/app/compartilhamento"
                secondaryActionLabel="Ver imóveis"
                secondaryActionHref="/app/imoveis"
                className="border-none bg-transparent p-0 shadow-none sm:p-2"
              />
            ) : (
              <div className="space-y-3">
                {data.recentShares.map((share) => (
                  <div
                    key={share.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {share.guide?.property?.name || 'Imóvel'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {share.channel === 'WHATSAPP'
                          ? 'WhatsApp'
                          : share.channel === 'EMAIL'
                            ? 'E-mail'
                            : share.channel === 'QR'
                              ? 'QR Code'
                              : 'Link'}
                        {' — '}
                        {share.sentAt.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {share.status === 'SENT' ? 'Enviado' : 'Pendente'}
                      </span>
                      <div
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          share.status === 'SENT' ? 'bg-emerald-500' : 'bg-amber-500',
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
