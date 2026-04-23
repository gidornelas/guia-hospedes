import { db } from '@/lib/db'
import { GuidesClient } from './guides-client'

async function getGuides() {
  return db.guide.findMany({
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
  const guides = await getGuides()

  return <GuidesClient guides={guides} />
}
