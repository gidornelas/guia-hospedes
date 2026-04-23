'use server'

import { db } from '@/lib/db'
import { requirePropertyAccess } from '@/lib/authorization'
import { uploadFile } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

export async function uploadPropertyCover(propertyId: string, formData: FormData) {
  try {
    await requirePropertyAccess(propertyId)

    const file = formData.get('image') as File

    if (!file || file.size === 0) {
      return { success: false, error: 'Nenhuma imagem enviada' }
    }

    // Valida tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Tipo de arquivo não suportado. Use JPEG, PNG ou WEBP.' }
    }

    // Valida tamanho (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: 'Imagem muito grande. Máximo 5MB.' }
    }

    // Gera nome único
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const fileName = `${propertyId}-${Date.now()}.${ext}`

    // Converte para buffer e faz upload
    const buffer = Buffer.from(await file.arrayBuffer())
    const publicUrl = await uploadFile(buffer, fileName, file.type)

    // Atualiza no banco
    await db.property.update({
      where: { id: propertyId },
      data: { coverImage: publicUrl },
    })

    revalidatePath('/app/imoveis')
    revalidatePath(`/app/imoveis/${propertyId}`)

    return { success: true, url: publicUrl }
  } catch (error: any) {
    console.error('Erro ao fazer upload:', error)
    return { success: false, error: error.message || 'Erro ao salvar imagem' }
  }
}
