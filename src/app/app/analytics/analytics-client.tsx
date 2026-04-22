'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Clock,
  Eye,
  Lightbulb,
  Monitor,
  Share2,
  Smartphone,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/shared/page-header'
import { cn } from '@/lib/utils'

interface AccessLog {
  guide: string
  date: string
  device: string
}

interface GuideStat {
  name: string
  views: number
  shares: number
}

interface ChannelStat {
  channel: string
  count: number
  color: string
  icon: React.ElementType
}

interface AnalyticsData {
  totalAccesses: number
  totalShares: number
  publishedGuides: number
  shareRate: number
  channels: ChannelStat[]
  guides: GuideStat[]
  recentAccesses: AccessLog[]
  mobilePercentage: number
}

const periods = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: 'all', label: 'Todo período' },
]

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const [period, setPeriod] = useState('30d')
  const [sortBy, setSortBy] = useState<'views' | 'shares'>('views')

  const stats = [
    {
      title: 'Total de acessos',
      value: data.totalAccesses.toLocaleString('pt-BR'),
      icon: Eye,
      description: 'Visualizações dos guias públicos',
    },
    {
      title: 'Compartilhamentos',
      value: data.totalShares.toLocaleString('pt-BR'),
      icon: Share2,
      description: 'Guias enviados aos hóspedes',
    },
    {
      title: 'Guias publicados',
      value: data.publishedGuides.toString(),
      icon: BookOpen,
      description: 'Guias ativos no momento',
    },
    {
      title: 'Taxa de abertura',
      value: `${data.shareRate}%`,
      icon: TrendingUp,
      description: 'Acessos por compartilhamento',
    },
  ]

  const sortedGuides = useMemo(
    () => [...data.guides].sort((a, b) => b[sortBy] - a[sortBy]),
    [sortBy, data.guides],
  )

  const maxViews = Math.max(...data.guides.map((g) => g.views), 1)
  const maxChannels = Math.max(...data.channels.map((c) => c.count), 1)

  const insights = [
    {
      type: 'positive' as const,
      message:
        data.mobilePercentage > 60
          ? `${data.mobilePercentage}% dos acessos vêm de mobile. Seu guia está otimizado para celular.`
          : 'Seus guias estão recebendo acessos. Continue compartilhando para aumentar o engajamento.',
    },
    {
      type: 'tip' as const,
      message:
        data.totalShares > 0
          ? 'Cada compartilhamento é uma oportunidade de oferecer uma experiência melhor ao hóspede.'
          : 'Comece compartilhando seus guias publicados para ver métricas de engajamento.',
    },
    {
      type: 'warning' as const,
      message:
        data.publishedGuides === 0
          ? 'Você ainda não tem guias publicados. Publique um guia para começar a receber acessos.'
          : data.totalShares === 0
            ? 'Seus guias estão publicados mas ainda não foram compartilhados. Envie o primeiro!'
            : 'Acompanhe regularmente quais imóveis têm mais acessos para entender o perfil dos hóspedes.',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Leitura executiva"
        title="Analytics"
        description="Acompanhe o desempenho dos seus guias, entenda os canais mais fortes e priorize os imóveis com maior potencial de engajamento."
        meta={
          <>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {data.totalAccesses} acessos
            </Badge>
            <Badge variant="outline" className="bg-background">
              {data.mobilePercentage}% mobile
            </Badge>
          </>
        }
      >
        <Button variant="outline" className="gap-2" disabled>
          <CalendarDays className="h-4 w-4" />
          Exportar resumo
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Visão rápida do período</p>
              <p className="text-sm text-muted-foreground">
                Compare acessos, canais e comportamento de leitura dos hóspedes.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Dados atualizados em tempo real</span>
              </div>
              <Select value={period} onValueChange={(v) => setPeriod(v || '30d')}>
                <SelectTrigger className="h-9 w-full text-sm sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-brand-200 bg-brand-50/40">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-brand-900">Próximo melhor passo</p>
                <p className="text-sm text-brand-800">
                  Priorize o guia com maior alta de acessos e valide se ele já está
                  sendo enviado pelo canal mais eficiente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Insights
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((insight, index) => (
            <Card
              key={index}
              className={cn(
                'border-l-4',
                insight.type === 'positive' && 'border-l-emerald-500',
                insight.type === 'warning' && 'border-l-amber-500',
                insight.type === 'tip' && 'border-l-blue-500',
              )}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <Lightbulb
                  className={cn(
                    'mt-0.5 h-5 w-5 shrink-0',
                    insight.type === 'positive' && 'text-emerald-500',
                    insight.type === 'warning' && 'text-amber-500',
                    insight.type === 'tip' && 'text-blue-500',
                  )}
                />
                <p className="text-sm leading-relaxed text-slate-700">
                  {insight.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Guias mais acessados</CardTitle>
                <CardDescription>Ranking por visualizações</CardDescription>
              </div>
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as 'views' | 'shares')}
              >
                <SelectTrigger className="h-9 w-full text-xs sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="views">Por acessos</SelectItem>
                  <SelectItem value="shares">Por compartilhamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedGuides.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum dado de acesso disponível ainda.
              </p>
            ) : (
              sortedGuides.map((guide, index) => (
                <div key={guide.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                          index === 0
                            ? 'bg-amber-100 text-amber-700'
                            : index === 1
                              ? 'bg-slate-200 text-slate-700'
                              : index === 2
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{guide.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {guide.views} acessos • {guide.shares} compartilhamentos
                        </p>
                      </div>
                    </div>
                    <span className="w-10 text-right text-sm font-semibold">
                      {guide.views}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(guide.views / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Canais de compartilhamento</CardTitle>
            <CardDescription>
              Por onde os hóspedes recebem os guias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.channels.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum compartilhamento registrado ainda.
              </p>
            ) : (
              <>
                {data.channels.map((item) => (
                  <div key={item.channel} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg',
                            item.color,
                          )}
                        >
                          <item.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{item.channel}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {Math.round((item.count / data.totalShares) * 100)}%
                        </span>
                        <span className="w-8 text-right text-sm font-semibold">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn('h-full rounded-full transition-all', item.color)}
                        style={{ width: `${(item.count / maxChannels) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total de compartilhamentos
                    </span>
                    <span className="font-semibold">{data.totalShares}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Acessos recentes</CardTitle>
              <CardDescription>Últimas visualizações dos guias</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentAccesses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum acesso registrado recentemente.
              </p>
            ) : (
              data.recentAccesses.map((access, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        access.device === 'Mobile'
                          ? 'bg-blue-50'
                          : 'bg-purple-50',
                      )}
                    >
                      {access.device === 'Mobile' ? (
                        <Smartphone className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Monitor className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{access.guide}</p>
                      <p className="text-xs text-muted-foreground">
                        {access.device}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit shrink-0 bg-background">
                    {access.date}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
