'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleGuideStatus(propertyId: string) {
  try {
    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: { guide: true },
    })

    if (!property) {
      throw new Error('Imóvel não encontrado')
    }

    if (!property.guide) {
      throw new Error('Guia não encontrado para este imóvel')
    }

    const currentStatus = property.guide.status
    let newStatus: 'PUBLISHED' | 'DRAFT' | 'UNPUBLISHED'
    let publishedAt: Date | null = property.guide.publishedAt

    if (currentStatus === 'PUBLISHED') {
      newStatus = 'UNPUBLISHED'
      publishedAt = null
    } else {
      newStatus = 'PUBLISHED'
      publishedAt = new Date()
    }

    await db.guide.update({
      where: { id: property.guide.id },
      data: {
        status: newStatus,
        publishedAt,
        version: { increment: 1 },
      },
    })

    revalidatePath('/app/imoveis')
    revalidatePath(`/app/imoveis/${propertyId}`)

    return { success: true, status: newStatus }
  } catch (error: any) {
    console.error('Erro ao alternar status do guia:', error)
    return { success: false, error: error.message || 'Erro ao alterar status do guia' }
  }
}
