import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, BookOpen, Share2, Clock, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
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
      title: 'Total de Imóveis',
      value: data.totalProperties,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Guias Publicados',
      value: data.publishedGuides,
      icon: BookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Guias em Rascunho',
      value: data.draftGuides,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Total de Guias',
      value: data.totalGuides,
      icon: TrendingUp,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Visão Geral</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o status dos seus imóveis e guias
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/app/imoveis/novo">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Imóvel
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Atalhos Rápidos</CardTitle>
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
            <CardTitle className="text-lg">Compartilhamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentShares.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum compartilhamento ainda</p>
            ) : (
              <div className="space-y-3">
                {data.recentShares.map((share: { id: string; channel: string; sentAt: Date; status: string; guide: { property: { name: string } | null } | null }) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
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
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        share.status === 'SENT' ? 'bg-emerald-500' : 'bg-amber-500'
                      )}
                    />
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
