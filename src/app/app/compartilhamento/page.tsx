import { db } from '@/lib/db'
import { env } from '@/lib/env'
import SharingClient from './sharing-client'

async function getPropertiesWithGuides() {
  return db.property.findMany({
    where: { deletedAt: null, guide: { status: 'PUBLISHED' } },
    include: {
      guide: {
        select: { id: true, slug: true, status: true },
      },
      contacts: {
        select: { role: true, phone: true, whatsapp: true },
      },
    },
    orderBy: { name: 'asc' },
  })
}

async function getMessageTemplates() {
  return db.messageTemplate.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

async function getShareHistory() {
  const logs = await db.shareLog.findMany({
    include: {
      guide: {
        include: {
          property: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { sentAt: 'desc' },
    take: 50,
  })

  return logs.map((log) => ({
    ...log,
    sentAt: log.sentAt.toISOString(),
  }))
}

export default async function SharingPage() {
  const [properties, templates, logs] = await Promise.all([
    getPropertiesWithGuides(),
    getMessageTemplates(),
    getShareHistory(),
  ])

  const appUrl = env.appUrl

  return (
    <SharingClient
      properties={properties}
      templates={templates}
      initialLogs={logs}
      appUrl={appUrl}
    />
  )
}
