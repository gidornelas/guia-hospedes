'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface UpdatePropertyInput {
  id: string
  name?: string
  internalCode?: string
  type?: string
  address?: string
  city?: string
  state?: string
  welcomeMessage?: string
  shortDescription?: string
  checkInTime?: string
  checkInInstructions?: string
  checkInAccessMethod?: string
  checkOutTime?: string
  checkOutInstructions?: string
  wifiNetwork?: string
  wifiPassword?: string
  rulesSilence?: string
  rulesVisits?: string
  rulesPets?: boolean
  rulesSmoking?: boolean
  rulesParties?: boolean
  devices?: Array<{ name: string; type: string; instructions: string; brand: string }>
  contacts?: Array<{ name: string; role: string; phone: string; email: string; whatsapp: string }>
}

export async function updateProperty(input: UpdatePropertyInput) {
  try {
    const { id, ...data } = input

    const existing = await db.property.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('Imóvel não encontrado')
    }

    await db.$transaction(async (tx) => {
      // Atualiza propriedades básicas
      await tx.property.update({
        where: { id },
        data: {
          name: data.name,
          internalCode: data.internalCode ?? null,
          type: data.type as any,
          address: data.address ?? null,
          city: data.city ?? null,
          state: data.state ?? null,
          welcomeMessage: data.welcomeMessage ?? null,
          shortDescription: data.shortDescription ?? null,
        },
      })

      // Atualiza ou cria check-in
      if (data.checkInTime !== undefined || data.checkInInstructions !== undefined || data.checkInAccessMethod !== undefined) {
        await tx.propertyCheckIn.upsert({
          where: { propertyId: id },
          create: {
            propertyId: id,
            time: data.checkInTime || null,
            instructions: data.checkInInstructions || null,
            accessMethod: data.checkInAccessMethod || null,
          },
          update: {
            time: data.checkInTime || null,
            instructions: data.checkInInstructions || null,
            accessMethod: data.checkInAccessMethod || null,
          },
        })
      }

      // Atualiza ou cria check-out
      if (data.checkOutTime !== undefined || data.checkOutInstructions !== undefined) {
        await tx.propertyCheckOut.upsert({
          where: { propertyId: id },
          create: {
            propertyId: id,
            time: data.checkOutTime || null,
            instructions: data.checkOutInstructions || null,
          },
          update: {
            time: data.checkOutTime || null,
            instructions: data.checkOutInstructions || null,
          },
        })
      }

      // Atualiza ou cria Wi-Fi
      if (data.wifiNetwork !== undefined || data.wifiPassword !== undefined) {
        await tx.propertyWiFi.upsert({
          where: { propertyId: id },
          create: {
            propertyId: id,
            networkName: data.wifiNetwork || '',
            password: data.wifiPassword || '',
          },
          update: {
            networkName: data.wifiNetwork || '',
            password: data.wifiPassword || '',
          },
        })
      }

      // Atualiza ou cria regras
      if (
        data.rulesSilence !== undefined ||
        data.rulesVisits !== undefined ||
        data.rulesPets !== undefined ||
        data.rulesSmoking !== undefined ||
        data.rulesParties !== undefined
      ) {
        await tx.propertyRules.upsert({
          where: { propertyId: id },
          create: {
            propertyId: id,
            silence: data.rulesSilence || null,
            visits: data.rulesVisits || null,
            pets: data.rulesPets ?? false,
            smoking: data.rulesSmoking ?? false,
            parties: data.rulesParties ?? false,
          },
          update: {
            silence: data.rulesSilence || null,
            visits: data.rulesVisits || null,
            pets: data.rulesPets ?? false,
            smoking: data.rulesSmoking ?? false,
            parties: data.rulesParties ?? false,
          },
        })
      }

      // Atualiza dispositivos: deleta todos e recria
      if (data.devices !== undefined) {
        await tx.propertyDevice.deleteMany({ where: { propertyId: id } })
        if (data.devices.length > 0) {
          await tx.propertyDevice.createMany({
            data: data.devices.map((d) => ({
              propertyId: id,
              name: d.name,
              type: d.type as any,
              instructions: d.instructions || null,
              brand: d.brand || null,
            })),
          })
        }
      }

      // Atualiza contatos: deleta todos e recria
      if (data.contacts !== undefined) {
        await tx.propertyContact.deleteMany({ where: { propertyId: id } })
        if (data.contacts.length > 0) {
          await tx.propertyContact.createMany({
            data: data.contacts.map((c) => ({
              propertyId: id,
              name: c.name,
              role: c.role as any,
              phone: c.phone || null,
              email: c.email || null,
              whatsapp: c.whatsapp || null,
            })),
          })
        }
      }
    })

    revalidatePath('/app/imoveis')
    revalidatePath(`/app/imoveis/${id}`)

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao atualizar imóvel:', error)
    return { success: false, error: error.message || 'Erro ao atualizar imóvel' }
  }
}
