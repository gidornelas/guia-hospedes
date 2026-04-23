import Link from 'next/link'
import { CalendarDays, Grid3X3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
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
  const [reservations, properties] = await Promise.all([getReservations(), getProperties()])

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Reservas"
        title="Organize check-ins, estadias e saidas"
        description="Acompanhe as reservas dos seus imoveis, filtre por status e acione o proximo passo sem perder contexto."
      >
        <Link href="/app/reservas/calendario">
          <Button variant="outline" className="gap-2">
            <Grid3X3 className="h-4 w-4" />
            Calendario
          </Button>
        </Link>
        <Link href="/app/reservas/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova reserva
          </Button>
        </Link>
      </PageHeader>

      {reservations.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhuma reserva encontrada"
          description="Cadastre reservas para acompanhar check-ins, estadias e check-outs em um so lugar."
          actionLabel="Nova reserva"
          actionHref="/app/reservas/novo"
        />
      ) : (
        <ReservationsClient reservations={reservations} properties={properties} />
      )}
    </div>
  )
}
