'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BookOpen,
  Share2,
  TrendingUp,
  Eye,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  CalendarDays,
  Users,
} from 'lucide-react'
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

// Mock data that could be replaced with real data from props
const periods = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
  { value: 'all', label: 'Todo período' },
]

const stats = [
  { title: 'Total de Acessos', value: '1.247', change: '+12%', changeType: 'up' as const, icon: Eye, description: 'Visualizações únicas dos guias' },
  { title: 'Compartilhamentos', value: '89', change: '+24%', changeType: 'up' as const, icon: Share2, description: 'Guias enviados aos hóspedes' },
  { title: 'Guias Publicados', value: '12', change: '+3', changeType: 'up' as const, icon: BookOpen, description: 'Guias ativos no momento' },
  { title: 'Taxa de Abertura', value: '78%', change: '+5%', changeType: 'up' as const, icon: TrendingUp, description: 'Hóspedes que abriram o guia' },
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
  { guide: 'Flat Elegance Paulista', date: 'Hoje, 14:32', device: 'Mobile', location: 'São Paulo, SP', duration: '3m 12s' },
  { guide: 'Casa do Lago', date: 'Hoje, 11:15', device: 'Desktop', location: 'Florianópolis, SC', duration: '5m 45s' },
  { guide: 'Apt Copa Beach', date: 'Ontem, 20:45', device: 'Mobile', location: 'Rio de Janeiro, RJ', duration: '2m 30s' },
  { guide: 'Flat Elegance Paulista', date: 'Ontem, 16:20', device: 'Mobile', location: 'Curitiba, PR', duration: '4m 18s' },
]

const insights = [
  { type: 'positive', message: 'O Flat Elegance Paulista teve 12% mais acessos esta semana. Considere adicionar mais dicas da região.' },
  { type: 'warning', message: 'A Casa do Lago teve queda de 5% nos acessos. O guia está atualizado?' },
  { type: 'tip', message: '78% dos hóspedes abrem o guia no mobile. Mantenha as informações curtas e escaneáveis.' },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d')
  const [sortBy, setSortBy] = useState<'views' | 'shares'>('views')

  const sortedGuides = useMemo(() => {
    return [...guidesData].sort((a, b) => b[sortBy] - a[sortBy])
  }, [sortBy])

  const maxViews = Math.max(...guidesData.map((g) => g.views))
  const maxChannels = Math.max(...channelsData.map((c) => c.count))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Acompanhe o desempenho dos seus guias e imóveis"
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Select value={period} onValueChange={(v) => setPeriod(v || '30d')}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Dados atualizados em tempo real</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-card hover:shadow-md transition-shadow">
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
                    <span className={cn(
                      'text-xs font-medium',
                      stat.changeType === 'up' ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs período anterior</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <Card
              key={i}
              className={cn(
                'border-l-4',
                insight.type === 'positive' && 'border-l-emerald-500',
                insight.type === 'warning' && 'border-l-amber-500',
                insight.type === 'tip' && 'border-l-blue-500'
              )}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <Lightbulb className={cn(
                  'h-5 w-5 shrink-0 mt-0.5',
                  insight.type === 'positive' && 'text-emerald-500',
                  insight.type === 'warning' && 'text-amber-500',
                  insight.type === 'tip' && 'text-blue-500'
                )} />
                <p className="text-sm text-slate-700 leading-relaxed">{insight.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Guides */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Guias Mais Acessados</CardTitle>
                <CardDescription>Ranking por visualizações</CardDescription>
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'views' | 'shares')}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
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
            {sortedGuides.map((guide, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-slate-200 text-slate-700' :
                      i === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{guide.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {guide.views} acessos • {guide.shares} compartilhamentos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {guide.trend !== 0 && (
                      <Badge variant="outline" className={cn(
                        'text-xs h-5',
                        guide.trend > 0 ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-red-600 border-red-200 bg-red-50'
                      )}>
                        {guide.trend > 0 ? '+' : ''}{guide.trend}%
                      </Badge>
                    )}
                    <span className="text-sm font-semibold w-10 text-right">{guide.views}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(guide.views / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Channels */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Canais de Compartilhamento</CardTitle>
            <CardDescription>Por onde os hóspedes recebem os guias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {channelsData.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', item.color)}>
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{item.channel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {Math.round((item.count / channelsData.reduce((a, b) => a + b.count, 0)) * 100)}%
                    </span>
                    <span className="text-sm font-semibold w-8 text-right">{item.count}</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', item.color)}
                    style={{ width: `${(item.count / maxChannels) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de compartilhamentos</span>
                <span className="font-semibold">{channelsData.reduce((a, b) => a + b.count, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Access */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Acessos Recentes</CardTitle>
              <CardDescription>Últimas visualizações dos guias</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentAccess.map((access, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                    access.device === 'Mobile' ? 'bg-blue-50' : 'bg-purple-50'
                  )}>
                    {access.device === 'Mobile' ? (
                      <Smartphone className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Monitor className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{access.guide}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{access.location}</span>
                      <span>•</span>
                      <span>{access.duration}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{access.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
