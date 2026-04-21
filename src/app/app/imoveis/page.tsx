import { db } from '@/lib/db'
import PropertiesClient from './properties-client'

async function getProperties() {
  return db.property.findMany({
    include: {
      guide: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function PropertiesPage() {
  const properties = await getProperties()

  return <PropertiesClient properties={properties} />
}
