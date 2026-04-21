'use server'

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'properties')

export async function uploadPropertyCover(propertyId: string, formData: FormData) {
  try {
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

    // Cria pasta se não existir
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Gera nome único
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const fileName = `${propertyId}-${Date.now()}.${ext}`
    const filePath = path.join(UPLOAD_DIR, fileName)

    // Salva arquivo
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // URL pública
    const publicUrl = `/images/properties/${fileName}`

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
