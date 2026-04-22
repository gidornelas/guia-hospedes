'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface RecommendationInput {
  propertyId: string
  name: string
  category: string
  description?: string
  address?: string
  mapUrl?: string
  instagram?: string
  image?: string
  distance?: string
}

export async function createRecommendation(input: RecommendationInput) {
  try {
    const recommendation = await db.localRecommendation.create({
      data: {
        propertyId: input.propertyId,
        name: input.name,
        category: input.category as any,
        description: input.description || null,
        address: input.address || null,
        mapUrl: input.mapUrl || null,
        instagram: input.instagram || null,
        image: input.image || null,
        distance: input.distance || null,
      },
    })

    revalidatePath(`/app/imoveis/${input.propertyId}`)
    return { success: true, recommendation }
  } catch (error: any) {
    console.error('Erro ao criar recomendação:', error)
    return { success: false, error: error.message || 'Erro ao criar recomendação' }
  }
}

export async function updateRecommendation(
  id: string,
  input: Omit<RecommendationInput, 'propertyId'>
) {
  try {
    const existing = await db.localRecommendation.findUnique({ where: { id } })
    if (!existing) throw new Error('Recomendação não encontrada')

    const recommendation = await db.localRecommendation.update({
      where: { id },
      data: {
        name: input.name,
        category: input.category as any,
        description: input.description || null,
        address: input.address || null,
        mapUrl: input.mapUrl || null,
        instagram: input.instagram || null,
        image: input.image || null,
        distance: input.distance || null,
      },
    })

    revalidatePath(`/app/imoveis/${existing.propertyId}`)
    return { success: true, recommendation }
  } catch (error: any) {
    console.error('Erro ao atualizar recomendação:', error)
    return { success: false, error: error.message || 'Erro ao atualizar recomendação' }
  }
}

export async function deleteRecommendation(id: string) {
  try {
    const existing = await db.localRecommendation.findUnique({ where: { id } })
    if (!existing) throw new Error('Recomendação não encontrada')

    await db.localRecommendation.delete({ where: { id } })

    revalidatePath(`/app/imoveis/${existing.propertyId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao excluir recomendação:', error)
    return { success: false, error: error.message || 'Erro ao excluir recomendação' }
  }
}
