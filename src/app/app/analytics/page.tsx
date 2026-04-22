import { db } from '@/lib/db'
import {
  BarChart3,
  Monitor,
  Share2,
  Smartphone,
} from 'lucide-react'
import AnalyticsClient from './analytics-client'

async function getAnalyticsData() {
  const [
    totalAccesses,
    totalShares,
    publishedGuides,
    shareChannels,
    guideAccesses,
    guideShares,
    recentAccesses,
    mobileAccesses,
  ] = await Promise.all([
    db.guideAccess.count(),
    db.shareLog.count(),
    db.guide.count({ where: { status: 'PUBLISHED' } }),
    db.shareLog.groupBy({
      by: ['channel'],
      _count: { channel: true },
    }),
    db.guideAccess.groupBy({
      by: ['guideId'],
      _count: { guideId: true },
    }),
    db.shareLog.groupBy({
      by: ['guideId'],
      _count: { guideId: true },
    }),
    db.guideAccess.findMany({
      take: 10,
      orderBy: { accessedAt: 'desc' },
      include: {
        guide: {
          include: {
            property: {
              select: { name: true },
            },
          },
        },
      },
    }),
    db.guideAccess.count({
      where: { deviceType: 'Mobile' },
    }),
  ])

  // Buscar nomes das propriedades para guias com acessos
  const guideIdsWithAccess = guideAccesses.map((g) => g.guideId)
  const guidesWithProperties = await db.guide.findMany({
    where: { id: { in: guideIdsWithAccess } },
    include: {
      property: { select: { name: true } },
    },
  })

  const guideNameMap = new Map(
    guidesWithProperties.map((g) => [g.id, g.property.name])
  )

  // Combinar acessos e compartilhamentos por guia
  const guideStatsMap = new Map<string, { views: number; shares: number; name: string }>()

  guideAccesses.forEach((ga) => {
    const name = guideNameMap.get(ga.guideId) || 'Imóvel'
    guideStatsMap.set(ga.guideId, {
      views: ga._count.guideId,
      shares: 0,
      name,
    })
  })

  guideShares.forEach((gs) => {
    const existing = guideStatsMap.get(gs.guideId)
    if (existing) {
      existing.shares = gs._count.guideId
    } else {
      const name = guideNameMap.get(gs.guideId) || 'Imóvel'
      guideStatsMap.set(gs.guideId, {
        views: 0,
        shares: gs._count.guideId,
        name,
      })
    }
  })

  const guides = Array.from(guideStatsMap.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  const channels = [
    {
      channel: 'WhatsApp',
      count: shareChannels.find((c) => c.channel === 'WHATSAPP')?._count.channel || 0,
      color: 'bg-green-500',
      icon: Smartphone,
    },
    {
      channel: 'E-mail',
      count: shareChannels.find((c) => c.channel === 'EMAIL')?._count.channel || 0,
      color: 'bg-blue-500',
      icon: Monitor,
    },
    {
      channel: 'Link Direto',
      count: shareChannels.find((c) => c.channel === 'LINK')?._count.channel || 0,
      color: 'bg-slate-500',
      icon: Share2,
    },
    {
      channel: 'QR Code',
      count: shareChannels.find((c) => c.channel === 'QR')?._count.channel || 0,
      color: 'bg-purple-500',
      icon: BarChart3,
    },
  ].filter((c) => c.count > 0)

  const formattedRecentAccesses = recentAccesses.map((access) => ({
    guide: access.guide?.property?.name || 'Imóvel',
    date: access.accessedAt.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    device: access.deviceType || 'Desktop',
  }))

  const mobilePercentage = totalAccesses > 0
    ? Math.round((mobileAccesses / totalAccesses) * 100)
    : 0

  const shareRate = totalShares > 0
    ? Math.round((totalAccesses / totalShares) * 100)
    : 0

  return {
    totalAccesses,
    totalShares,
    publishedGuides,
    shareRate,
    channels,
    guides,
    recentAccesses: formattedRecentAccesses,
    mobilePercentage,
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  return <AnalyticsClient data={data} />
}
