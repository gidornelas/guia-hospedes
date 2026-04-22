import { db } from '@/lib/db'
import TemplatesClient from './templates-client'

async function getMessageTemplates() {
  return db.messageTemplate.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function MessageTemplatesPage() {
  const templates = await getMessageTemplates()

  return <TemplatesClient templates={templates} />
}
