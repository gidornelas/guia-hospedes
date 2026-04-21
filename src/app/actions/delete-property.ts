'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function deleteProperty(id: string) {
  try {
    const existing = await db.property.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('Imóvel não encontrado')
    }

    await db.property.delete({ where: { id } })

    revalidatePath('/app/imoveis')

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao excluir imóvel:', error)
    return { success: false, error: error.message || 'Erro ao excluir imóvel' }
  }
}
