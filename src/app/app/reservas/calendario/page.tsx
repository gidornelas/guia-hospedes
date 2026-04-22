import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  CHECKED_IN: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CHECKED_OUT: 'bg-slate-100 text-slate-700 border-slate-200',
  CANCELLED: 'bg-rose-100 text-rose-700 border-rose-200 line-through opacity-60',
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

async function getCalendarData(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const reservations = await db.reservation.findMany({
    where: {
      OR: [
        {
          checkInDate: { lte: lastDay },
          checkOutDate: { gte: firstDay },
        },
      ],
    },
    orderBy: { checkInDate: 'asc' },
    include: { property: { select: { id: true, name: true } } },
  })

  return { reservations, firstDay, lastDay }
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const sp = await searchParams
  const now = new Date()
  const currentYear = sp.year ? parseInt(sp.year) : now.getFullYear()
  const currentMonth = sp.month ? parseInt(sp.month) : now.getMonth()

  if (isNaN(currentYear) || isNaN(currentMonth) || currentMonth < 0 || currentMonth > 11) {
    notFound()
  }

  const { reservations, firstDay, lastDay } = await getCalendarData(currentYear, currentMonth)

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const cells: Array<{
    day: number | null
    date: Date | null
    reservations: typeof reservations
  }> = []

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: null, date: null, reservations: [] })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const dayReservations = reservations.filter((reservation) => {
      const checkIn = new Date(reservation.checkInDate)
      const checkOut = new Date(reservation.checkOutDate)
      checkIn.setHours(0, 0, 0, 0)
      checkOut.setHours(0, 0, 0, 0)
      return date >= checkIn && date <= checkOut
    })

    cells.push({ day, date, reservations: dayReservations })
  }

  const weeks: typeof cells[] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  const lastWeek = weeks[weeks.length - 1]
  while (lastWeek.length < 7) {
    lastWeek.push({ day: null, date: null, reservations: [] })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Calendario"
        title="Veja a ocupacao do mes com mais contexto"
        description="Acompanhe check-ins, estadias e saidas em uma visao mensal para identificar janelas, conflitos e proximos movimentos."
      >
        <div className="flex items-center gap-2">
          <Link href={`/app/reservas/calendario?month=${prevMonth}&year=${prevYear}`}>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <span className="min-w-[160px] text-center text-sm font-medium capitalize">
            {monthLabel}
          </span>
          <Link href={`/app/reservas/calendario?month=${nextMonth}&year=${nextYear}`}>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Link href="/app/reservas">
          <Button variant="outline" className="gap-2">
            <List className="h-4 w-4" />
            Ver lista
          </Button>
        </Link>
      </PageHeader>

      <Card className="overflow-hidden shadow-card">
        <div className="grid grid-cols-7 border-b bg-muted/40">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {weekday}
            </div>
          ))}
        </div>
        <div className="divide-y">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 divide-x">
              {week.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={cn(
                    'min-h-[100px] p-1.5 sm:min-h-[120px] sm:p-2',
                    cell.date && isToday(cell.date) ? 'bg-primary/5' : 'bg-background',
                    !cell.day && 'bg-muted/20'
                  )}
                >
                  {cell.day && (
                    <>
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            'text-xs font-medium',
                            cell.date && isToday(cell.date)
                              ? 'rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {cell.day}
                        </span>
                        {cell.reservations.length > 0 && (
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {cell.reservations.length}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 space-y-1">
                        {cell.reservations.map((reservation) => (
                          <Link
                            key={reservation.id}
                            href={`/app/reservas/${reservation.id}`}
                            className="block"
                          >
                            <div
                              className={cn(
                                'rounded border px-1 py-0.5 text-[10px] leading-tight transition-colors hover:brightness-95 sm:px-1.5 sm:text-xs',
                                STATUS_COLORS[reservation.status] ||
                                  'bg-slate-100 text-slate-700 border-slate-200'
                              )}
                            >
                              <span className="block truncate font-medium">{reservation.guestName}</span>
                              <span className="block truncate opacity-80">{reservation.property.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-muted-foreground">Legenda:</span>
        {[
          { label: 'Confirmada', className: 'bg-blue-100 text-blue-700 border-blue-200' },
          { label: 'Check-in realizado', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
          { label: 'Check-out realizado', className: 'bg-slate-100 text-slate-700 border-slate-200' },
          { label: 'Pendente', className: 'bg-amber-100 text-amber-700 border-amber-200' },
          { label: 'Cancelada', className: 'bg-rose-100 text-rose-700 border-rose-200 line-through opacity-60' },
        ].map((item) => (
          <div
            key={item.label}
            className={cn('flex items-center gap-1.5 rounded border px-2 py-1', item.className)}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
