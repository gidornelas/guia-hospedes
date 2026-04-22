import { db } from '@/lib/db'
import { NewReservationForm } from './new-reservation-form'

async function getProperties() {
  return db.property.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })
}

export default async function NewReservationPage() {
  const properties = await getProperties()
  return <NewReservationForm properties={properties} />
}
