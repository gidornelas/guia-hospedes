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
  MapPin,
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
  device: 'Mobile' | 'Desktop'
  location: string
  duration?: string
}

interface GuideStat {
  name: string
  views: number
  shares: number
  trend: number
}

interface ChannelStat {
  channel: string
  count: number
  color: string
  icon: React.ElementType
}

const periods = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: 'all', label: 'Todo período' },
]

const stats = [
  {
    title: 'Total de acessos',
    value: '1.247',
    change: '+12%',
    changeType: 'up' as const,
    icon: Eye,
    description: 'Visualizações únicas dos guias',
  },
  {
    title: 'Compartilhamentos',
    value: '89',
    change: '+24%',
    changeType: 'up' as const,
    icon: Share2,
    description: 'Guias enviados aos hóspedes',
  },
  {
    title: 'Guias publicados',
    value: '12',
    change: '+3',
    changeType: 'up' as const,
    icon: BookOpen,
    description: 'Guias ativos no momento',
  },
  {
    title: 'Taxa de abertura',
    value: '78%',
    change: '+5%',
    changeType: 'up' as const,
    icon: TrendingUp,
    description: 'Hóspedes que abriram o guia',
  },
]

const guidesData: GuideStat[] = [
  { name: 'Flat Elegance Paulista', views: 432, shares: 34, trend: 12 },
  { name: 'Casa do Lago', views: 298, shares: 21, trend: -5 },
  { name: 'Apt Copa Beach', views: 187, shares: 15, trend: 8 },
  { name: 'Chalé Monte Verde', views: 156, shares: 12, trend: 3 },
]

const channelsData: ChannelStat[] = [
  { channel: 'WhatsApp', count: 52, color: 'bg-green-500', icon: Smartphone },
  { channel: 'E-mail', count: 21, color: 'bg-blue-500', icon: Monitor },
  { channel: 'Link Direto', count: 11, color: 'bg-slate-500', icon: Share2 },
  { channel: 'QR Code', count: 5, color: 'bg-purple-500', icon: BarChart3 },
]

const recentAccess: AccessLog[] = [
  {
    guide: 'Flat Elegance Paulista',
    date: 'Hoje, 14:32',
    device: 'Mobile',
    location: 'São Paulo, SP',
    duration: '3m 12s',
  },
  {
    guide: 'Casa do Lago',
    date: 'Hoje, 11:15',
    device: 'Desktop',
    location: 'Florianópolis, SC',
    duration: '5m 45s',
  },
  {
    guide: 'Apt Copa Beach',
    date: 'Ontem, 20:45',
    device: 'Mobile',
    location: 'Rio de Janeiro, RJ',
    duration: '2m 30s',
  },
  {
    guide: 'Flat Elegance Paulista',
    date: 'Ontem, 16:20',
    device: 'Mobile',
    location: 'Curitiba, PR',
    duration: '4m 18s',
  },
]

const insights = [
  {
    type: 'positive',
    message:
      'O Flat Elegance Paulista teve 12% mais acessos esta semana. Considere adicionar mais dicas da região.',
  },
  {
    type: 'warning',
    message:
      'A Casa do Lago teve queda de 5% nos acessos. O guia está atualizado?',
  },
  {
    type: 'tip',
    message:
      '78% dos hóspedes abrem o guia no mobile. Mantenha as informações curtas e escaneáveis.',
  },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d')
  const [sortBy, setSortBy] = useState<'views' | 'shares'>('views')

  const sortedGuides = useMemo(
    () => [...guidesData].sort((a, b) => b[sortBy] - a[sortBy]),
    [sortBy],
  )

  const maxViews = Math.max(...guidesData.map((g) => g.views))
  const maxChannels = Math.max(...channelsData.map((c) => c.count))
  const totalShares = channelsData.reduce((total, item) => total + item.count, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Leitura executiva"
        title="Analytics"
        description="Acompanhe o desempenho dos seus guias, entenda os canais mais fortes e priorize os imóveis com maior potencial de engajamento."
        meta={
          <>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              +12% na semana
            </Badge>
            <Badge variant="outline" className="bg-background">
              Mobile lidera com 78%
            </Badge>
          </>
        }
      >
        <Button variant="outline" className="gap-2">
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
                  <div className="flex items-center gap-1">
                    {stat.changeType === 'up' ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span
                      className={cn(
                        'text-xs font-medium',
                        stat.changeType === 'up'
                          ? 'text-emerald-600'
                          : 'text-red-600',
                      )}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs período anterior
                    </span>
                  </div>
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
            {sortedGuides.map((guide, index) => (
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
                  <div className="flex shrink-0 items-center gap-2">
                    {guide.trend !== 0 && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-5 text-xs',
                          guide.trend > 0
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                            : 'border-red-200 bg-red-50 text-red-600',
                        )}
                      >
                        {guide.trend > 0 ? '+' : ''}
                        {guide.trend}%
                      </Badge>
                    )}
                    <span className="w-10 text-right text-sm font-semibold">
                      {guide.views}
                    </span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(guide.views / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
            {channelsData.map((item) => (
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
                      {Math.round((item.count / totalShares) * 100)}%
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
                <span className="font-semibold">{totalShares}</span>
              </div>
            </div>
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
            {recentAccess.map((access, index) => (
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
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{access.location}</span>
                      <span>•</span>
                      <span>{access.duration}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit shrink-0 bg-background">
                  {access.date}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
