'use server'

import { db } from '@/lib/db'
import { requireSession } from '@/lib/authorization'
import { revalidatePath } from 'next/cache'

interface CreateTemplateInput {
  name: string
  type: string
  subject?: string
  body: string
  variables?: string[]
}

export async function createMessageTemplate(input: CreateTemplateInput) {
  try {
    const session = await requireSession()

    const template = await db.messageTemplate.create({
      data: {
        organizationId: session.organizationId,
        name: input.name,
        type: input.type as any,
        subject: input.subject || null,
        body: input.body,
        variables: JSON.stringify(input.variables || []),
      },
    })

    revalidatePath('/app/modelos-mensagem')
    return { success: true, template }
  } catch (error: any) {
    console.error('Erro ao criar template:', error)
    return { success: false, error: error.message || 'Erro ao criar template' }
  }
}

interface UpdateTemplateInput {
  id: string
  name: string
  type: string
  subject?: string
  body: string
  variables?: string[]
}

export async function updateMessageTemplate(input: UpdateTemplateInput) {
  try {
    const session = await requireSession()

    const existing = await db.messageTemplate.findFirst({
      where: { id: input.id, organizationId: session.organizationId },
    })

    if (!existing) {
      return { success: false, error: 'Template não encontrado' }
    }

    const template = await db.messageTemplate.update({
      where: { id: input.id },
      data: {
        name: input.name,
        type: input.type as any,
        subject: input.subject || null,
        body: input.body,
        variables: JSON.stringify(input.variables || []),
      },
    })

    revalidatePath('/app/modelos-mensagem')
    return { success: true, template }
  } catch (error: any) {
    console.error('Erro ao atualizar template:', error)
    return { success: false, error: error.message || 'Erro ao atualizar template' }
  }
}

export async function deleteMessageTemplate(id: string) {
  try {
    const session = await requireSession()

    const existing = await db.messageTemplate.findFirst({
      where: { id, organizationId: session.organizationId },
    })

    if (!existing) {
      return { success: false, error: 'Template não encontrado' }
    }

    await db.messageTemplate.delete({
      where: { id },
    })

    revalidatePath('/app/modelos-mensagem')
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao excluir template:', error)
    return { success: false, error: error.message || 'Erro ao excluir template' }
  }
}
