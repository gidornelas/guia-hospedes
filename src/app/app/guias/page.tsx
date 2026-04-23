import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { GuidesClient } from './guides-client'

async function getGuides(organizationId: string) {
  return db.guide.findMany({
    where: { property: { organizationId } },
    include: {
      property: true,
      _count: {
        select: { shareLogs: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function GuidesPage() {
  const session = await getSession()
  if (!session) {
    return null
  }

  const guides = await getGuides(session.organizationId)

  return <GuidesClient guides={guides} />
}
