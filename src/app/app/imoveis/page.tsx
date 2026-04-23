import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { env } from '@/lib/env'
import PropertiesClient from './properties-client'

async function getProperties(organizationId: string) {
  return db.property.findMany({
    where: { organizationId, deletedAt: null },
    include: {
      guide: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

async function getMessageTemplates(organizationId: string) {
  return db.messageTemplate.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function PropertiesPage() {
  const session = await getSession()
  if (!session) {
    return null
  }

  const [properties, templates] = await Promise.all([
    getProperties(session.organizationId),
    getMessageTemplates(session.organizationId),
  ])

  return (
    <PropertiesClient
      properties={properties}
      templates={templates}
      appUrl={env.appUrl}
    />
  )
}
