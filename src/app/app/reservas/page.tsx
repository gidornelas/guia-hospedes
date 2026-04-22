import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, Grid3X3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { EmptyState } from '@/components/shared/empty-state'
import { ReservationsClient } from './reservations-client'

async function getReservations() {
  return db.reservation.findMany({
    orderBy: { checkInDate: 'asc' },
    include: { property: { select: { id: true, name: true } } },
  })
}

async function getProperties() {
  return db.property.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })
}

export default async function ReservationsPage() {
  const [reservations, properties] = await Promise.all([
    getReservations(),
    getProperties(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Reservas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as reservas dos seus imóveis.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/reservas/calendario">
            <Button variant="outline" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              Calendário
            </Button>
          </Link>
          <Link href="/app/reservas/novo">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Reserva
            </Button>
          </Link>
        </div>
      </div>

      {reservations.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhuma reserva encontrada"
          description="Cadastre reservas para acompanhar check-ins e check-outs."
          actionLabel="Nova Reserva"
          actionHref="/app/reservas/novo"
        />
      ) : (
        <ReservationsClient
          reservations={reservations}
          properties={properties}
        />
      )}
    </div>
  )
}
