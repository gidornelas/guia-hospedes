import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  LogIn,
  LogOut,
  MessageCircle,
  Plus,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { DashboardAlerts, type DashboardAlert } from '@/components/dashboard/dashboard-alerts'
import { cn } from '@/lib/utils'

async function getDashboardData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  const [
    totalProperties,
    totalGuides,
    publishedGuides,
    draftGuides,
    recentShares,
    totalShares,
    whatsappShares,
    emailShares,
    totalReservations,
    upcomingReservations,
    activeGuests,
    checkInsToday,
    checkOutsToday,
    checkInsTomorrow,
    checkInsTodayNotDone,
    checkOutsTodayNotDone,
    unpublishedGuides,
    upcomingConfirmedReservations,
  ] = await Promise.all([
    db.property.count(),
    db.guide.count(),
    db.guide.count({ where: { status: 'PUBLISHED' } }),
    db.guide.count({ where: { status: 'DRAFT' } }),
    db.shareLog.findMany({
      take: 5,
      orderBy: { sentAt: 'desc' },
      include: { guide: { include: { property: true } } },
    }),
    db.shareLog.count(),
    db.shareLog.count({ where: { channel: 'WHATSAPP' } }),
    db.shareLog.count({ where: { channel: 'EMAIL' } }),
    db.reservation.count(),
    db.reservation.findMany({
      where: {
        checkInDate: { gte: today },
        status: { not: 'CANCELLED' },
      },
      orderBy: { checkInDate: 'asc' },
      take: 5,
      include: { property: { select: { id: true, name: true } } },
    }),
    db.reservation.count({ where: { status: 'CHECKED_IN' } }),
    db.reservation.findMany({
      where: {
        checkInDate: { gte: today, lt: tomorrow },
        status: { not: 'CANCELLED' },
      },
      orderBy: { checkInDate: 'asc' },
      include: { property: { select: { id: true, name: true } } },
    }),
    db.reservation.findMany({
      where: {
        checkOutDate: { gte: today, lt: tomorrow },
        status: { not: 'CANCELLED' },
      },
      orderBy: { checkOutDate: 'asc' },
      include: { property: { select: { id: true, name: true } } },
    }),
    db.reservation.findMany({
      where: {
        checkInDate: { gte: tomorrow, lt: dayAfterTomorrow },
        status: 'CONFIRMED',
      },
      orderBy: { checkInDate: 'asc' },
      include: { property: { select: { id: true, name: true } } },
    }),
    db.reservation.findMany({
      where: {
        checkInDate: { gte: today, lt: tomorrow },
        status: 'CONFIRMED',
      },
      orderBy: { checkInDate: 'asc' },
      include: { property: { select: { id: true, name: true } } },
    }),
    db.reservation.findMany({
      where: {
        checkOutDate: { gte: today, lt: tomorrow },
        status: 'CHECKED_IN',
      },
      orderBy: { checkOutDate: 'asc' },
      include: { property: { select: { id: true, name: true } } },
    }),
    db.property.findMany({
      where: {
        guide: { status: { in: ['DRAFT', 'REVIEW'] } },
      },
      select: { id: true, name: true, guide: { select: { status: true } } },
      take: 5,
    }),
    db.reservation.findMany({
      where: {
        checkInDate: { gte: today, lte: dayAfterTomorrow },
        status: 'CONFIRMED',
      },
      orderBy: { checkInDate: 'asc' },
      include: {
        property: {
          select: { id: true, name: true },
        },
      },
      take: 10,
    }),
  ])

  // Build alerts
  const alerts: DashboardAlert[] = []

  for (const r of checkInsTomorrow) {
    alerts.push({
      id: `checkin-tomorrow-${r.id}`,
      type: 'CHECKIN_TOMORROW',
      title: `Check-in amanhã: ${r.guestName}`,
      message: `${r.property.name} · ${r.numberOfGuests} hóspede${r.numberOfGuests > 1 ? 's' : ''} · Lembre-se de enviar o guia ao hóspede.`,
      severity: 'info',
      link: `/app/reservas/${r.id}`,
      linkLabel: 'Ver reserva',
    })
  }

  for (const r of checkInsTodayNotDone) {
    alerts.push({
      id: `checkin-today-${r.id}`,
      type: 'CHECKIN_TODAY_NOT_DONE',
      title: `Check-in hoje pendente: ${r.guestName}`,
      message: `${r.property.name} · A reserva ainda não foi marcada como check-in realizado.`,
      severity: 'warning',
      link: `/app/reservas/${r.id}`,
      linkLabel: 'Marcar check-in',
    })
  }

  for (const r of checkOutsTodayNotDone) {
    alerts.push({
      id: `checkout-today-${r.id}`,
      type: 'CHECKOUT_TODAY_NOT_DONE',
      title: `Check-out hoje: ${r.guestName}`,
      message: `${r.property.name} · A reserva ainda não foi marcada como check-out realizado.`,
      severity: 'warning',
      link: `/app/reservas/${r.id}`,
      linkLabel: 'Marcar check-out',
    })
  }

  for (const p of unpublishedGuides) {
    alerts.push({
      id: `guide-unpublished-${p.id}`,
      type: 'GUIDE_NOT_PUBLISHED',
      title: `Guia não publicado: ${p.name}`,
      message: 'O guia deste imóvel ainda está em rascunho. Publique para liberar o compartilhamento.',
      severity: 'info',
      link: `/app/imoveis/${p.id}`,
      linkLabel: 'Publicar guia',
    })
  }

  return {
    totalProperties,
    totalGuides,
    publishedGuides,
    draftGuides,
    recentShares,
    totalShares,
    whatsappShares,
    emailShares,
    totalReservations,
    upcomingReservations,
    activeGuests,
    checkInsToday,
    checkOutsToday,
    alerts,
  }
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
      title: 'Reservas',
      value: data.totalReservations,
      icon: CalendarDays,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      hint: 'Total de reservas',
    },
    {
      title: 'Hóspedes ativos',
      value: data.activeGuests,
      icon: MessageCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      hint: 'Em estadia agora',
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

      <DashboardAlerts alerts={data.alerts} />

      {/* Alertas de hoje */}
      {(data.checkInsToday.length > 0 || data.checkOutsToday.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.checkInsToday.length > 0 && (
            <Card className="border-emerald-200 bg-emerald-50/40 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-900">
                  <LogIn className="h-5 w-5 text-emerald-600" />
                  Check-ins hoje ({data.checkInsToday.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.checkInsToday.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-emerald-900">
                        {r.guestName}
                      </p>
                      <p className="text-xs text-emerald-700">
                        {r.property.name} · {r.numberOfGuests} hóspede
                        {r.numberOfGuests > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Link href={`/app/reservas/${r.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800">
                        Ver
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {data.checkOutsToday.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/40 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-amber-900">
                  <LogOut className="h-5 w-5 text-amber-600" />
                  Check-outs hoje ({data.checkOutsToday.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.checkOutsToday.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        {r.guestName}
                      </p>
                      <p className="text-xs text-amber-700">
                        {r.property.name} · {r.numberOfGuests} hóspede
                        {r.numberOfGuests > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Link href={`/app/reservas/${r.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
                        Ver
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
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
            <Link href="/app/reservas/novo">
              <Button variant="outline" className="w-full justify-start gap-3">
                <CalendarDays className="h-4 w-4" />
                Nova reserva
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

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Próximos check-ins</CardTitle>
            <Link href="/app/reservas">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.upcomingReservations.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Nenhuma reserva próxima"
                description="Cadastre reservas para acompanhar os próximos check-ins."
                actionLabel="Nova reserva"
                actionHref="/app/reservas/novo"
                className="border-none bg-transparent p-0 shadow-none sm:p-2"
              />
            ) : (
              <div className="space-y-3">
                {data.upcomingReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex flex-col gap-1 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{reservation.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        {reservation.property.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} —{' '}
                      {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
                      {' · '}
                      {reservation.numberOfGuests} hóspede
                      {reservation.numberOfGuests > 1 ? 's' : ''}
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
