import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { EditReservationForm } from './edit-reservation-form'

async function getReservation(id: string) {
  return db.reservation.findUnique({
    where: { id },
    include: { property: { select: { id: true, name: true } } },
  })
}

async function getProperties() {
  return db.property.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })
}

export default async function EditReservationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [reservation, properties] = await Promise.all([
    getReservation(id),
    getProperties(),
  ])

  if (!reservation) notFound()

  return <EditReservationForm reservation={reservation} properties={properties} />
}
