'use server'

import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { requireSession, requireGuideAccess } from '@/lib/authorization'

interface ShareGuideInput {
  guideId: string
  channel: 'WHATSAPP' | 'EMAIL' | 'LINK' | 'QR'
  recipient?: string
  message?: string
}

export async function shareGuide(input: ShareGuideInput) {
  try {
    await requireGuideAccess(input.guideId)

    const shareLog = await db.shareLog.create({
      data: {
        guideId: input.guideId,
        channel: input.channel,
        recipient: input.recipient || null,
        message: input.message || null,
        status: 'SENT',
      },
    })

    revalidateTag('dashboard', {})
    return { success: true, shareLog }
  } catch (error: any) {
    console.error('Erro ao registrar compartilhamento:', error)
    return { success: false, error: error.message || 'Erro ao registrar compartilhamento' }
  }
}

export async function getShareHistory(guideId?: string) {
  try {
    const session = await requireSession()

    const logs = await db.shareLog.findMany({
      where: guideId
        ? {
            guideId,
            guide: { property: { organizationId: session.organizationId } },
          }
        : {
            guide: { property: { organizationId: session.organizationId } },
          },
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

    return { success: true, logs }
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error)
    return { success: false, error: error.message || 'Erro ao buscar histórico' }
  }
}
