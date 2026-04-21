'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface UpdateOrganizationInput {
  id: string
  name?: string
  slug?: string
  domain?: string | null
  brandSettings?: Record<string, any>
}

export async function updateOrganization(input: UpdateOrganizationInput) {
  try {
    const existing = await db.organization.findUnique({ where: { id: input.id } })
    if (!existing) {
      throw new Error('Organização não encontrada')
    }

    await db.organization.update({
      where: { id: input.id },
      data: {
        name: input.name,
        slug: input.slug,
        domain: input.domain,
        brandSettings: input.brandSettings ? JSON.stringify(input.brandSettings) : undefined,
      },
    })

    revalidatePath('/app/configuracoes')

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao atualizar organização:', error)
    return { success: false, error: error.message || 'Erro ao atualizar organização' }
  }
}

export async function getOrganization() {
  try {
    const organization = await db.organization.findFirst()
    return { success: true, organization }
  } catch (error: any) {
    console.error('Erro ao buscar organização:', error)
    return { success: false, error: error.message || 'Erro ao buscar organização' }
  }
}
