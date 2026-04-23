'use server'

import { db } from '@/lib/db'
import { requireOrganizationAccess, requireSession } from '@/lib/authorization'
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
    await requireOrganizationAccess(input.id)

    const existing = await db.organization.findUnique({ where: { id: input.id } })
    if (!existing) {
      throw new Error('Organização não encontrada')
    }

    // Verifica unicidade de slug se estiver sendo alterado
    if (input.slug && input.slug !== existing.slug) {
      const slugExists = await db.organization.findUnique({
        where: { slug: input.slug },
      })
      if (slugExists) {
        throw new Error('Este slug já está em uso. Escolha outro.')
      }
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
    const session = await requireSession()
    const organization = await db.organization.findUnique({
      where: { id: session.organizationId },
    })
    return { success: true, organization }
  } catch (error: any) {
    console.error('Erro ao buscar organização:', error)
    return { success: false, error: error.message || 'Erro ao buscar organização' }
  }
}
