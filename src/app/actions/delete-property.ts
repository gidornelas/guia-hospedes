'use server'

import { db } from '@/lib/db'
import { requirePropertyAccess } from '@/lib/authorization'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function deleteProperty(id: string) {
  try {
    await requirePropertyAccess(id)

    await db.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    revalidatePath('/app/imoveis')
    revalidateTag('dashboard', {})

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao excluir imóvel:', error)
    return { success: false, error: error.message || 'Erro ao excluir imóvel' }
  }
}
