import { db } from '@/lib/db'
import { env } from '@/lib/env'
import PropertiesClient from './properties-client'

async function getProperties() {
  return db.property.findMany({
    include: {
      guide: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

async function getMessageTemplates() {
  return db.messageTemplate.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function PropertiesPage() {
  const [properties, templates] = await Promise.all([
    getProperties(),
    getMessageTemplates(),
  ])

  return (
    <PropertiesClient
      properties={properties}
      templates={templates}
      appUrl={env.appUrl}
    />
  )
}
