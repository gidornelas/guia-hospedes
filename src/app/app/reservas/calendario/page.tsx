import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  MapPin,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  CHECKED_IN: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CHECKED_OUT: 'bg-slate-100 text-slate-700 border-slate-200',
  CANCELLED: 'bg-rose-100 text-rose-700 border-rose-200 line-through opacity-60',
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

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

  if (
    isNaN(currentYear) ||
    isNaN(currentMonth) ||
    currentMonth < 0 ||
    currentMonth > 11
  ) {
    notFound()
  }

  const { reservations, firstDay, lastDay } = await getCalendarData(
    currentYear,
    currentMonth
  )

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString(
    'pt-BR',
    { month: 'long', year: 'numeric' }
  )

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

  // Build calendar grid
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const cells: Array<{
    day: number | null
    date: Date | null
    reservations: typeof reservations
  }> = []

  // Empty cells before first day
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: null, date: null, reservations: [] })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d)
    const dayReservations = reservations.filter((r) => {
      const checkIn = new Date(r.checkInDate)
      const checkOut = new Date(r.checkOutDate)
      checkIn.setHours(0, 0, 0, 0)
      checkOut.setHours(0, 0, 0, 0)
      return date >= checkIn && date <= checkOut
    })
    cells.push({ day: d, date, reservations: dayReservations })
  }

  // Group into weeks
  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  // Fill last week if needed
  const lastWeek = weeks[weeks.length - 1]
  while (lastWeek.length < 7) {
    lastWeek.push({ day: null, date: null, reservations: [] })
  }

  const isToday = (date: Date) => {
    const t = new Date()
    return (
      date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear()
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app/reservas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Calendário de Reservas
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualize a ocupação dos seus imóveis por mês.
            </p>
          </div>
        </div>
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
          <Link href="/app/reservas">
            <Button variant="outline" className="gap-2">
              <List className="h-4 w-4" />
              Lista
            </Button>
          </Link>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="shadow-card overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/40">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {wd}
            </div>
          ))}
        </div>
        <div className="divide-y">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 divide-x">
              {week.map((cell, ci) => (
                <div
                  key={ci}
                  className={cn(
                    'min-h-[100px] p-1.5 sm:min-h-[120px] sm:p-2',
                    cell.date && isToday(cell.date)
                      ? 'bg-primary/5'
                      : 'bg-background',
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
                        {cell.reservations.map((r) => (
                          <Link
                            key={r.id}
                            href={`/app/reservas/${r.id}`}
                            className="block"
                          >
                            <div
                              className={cn(
                                'rounded border px-1 py-0.5 text-[10px] leading-tight transition-colors hover:brightness-95 sm:px-1.5 sm:text-xs',
                                STATUS_COLORS[r.status] ||
                                  'bg-slate-100 text-slate-700 border-slate-200'
                              )}
                            >
                              <span className="font-medium truncate block">
                                {r.guestName}
                              </span>
                              <span className="truncate block opacity-80">
                                {r.property.name}
                              </span>
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

      {/* Legend */}
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
            className={cn(
              'flex items-center gap-1.5 rounded border px-2 py-1',
              item.className
            )}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
