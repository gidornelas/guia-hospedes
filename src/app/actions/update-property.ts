'use server'

import { PropertyType, DeviceType, ContactRole, RecommendationCategory } from '@prisma/client'
import { db } from '@/lib/db'
import { requirePropertyAccess } from '@/lib/authorization'
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
  recommendations?: Array<{
    name: string
    category: string
    description?: string
    address?: string
    mapUrl?: string
    instagram?: string
    image?: string
    distance?: string
  }>
}

export async function updateProperty(input: UpdatePropertyInput) {
  try {
    const { id, ...data } = input

    await requirePropertyAccess(id)

    await db.$transaction(async (tx) => {
      // Atualiza propriedades básicas
      await tx.property.update({
        where: { id },
        data: {
          name: data.name,
          internalCode: data.internalCode ?? null,
          type: data.type as PropertyType,
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

      // Atualiza dispositivos com merge inteligente (preserva IDs)
      if (data.devices !== undefined) {
        const existingDevices = await tx.propertyDevice.findMany({
          where: { propertyId: id },
        })
        const incomingKeys = new Set(data.devices.map((d) => `${d.name}|${d.type}`))
        const toDelete = existingDevices.filter((ed) => !incomingKeys.has(`${ed.name}|${ed.type}`))
        if (toDelete.length > 0) {
          await tx.propertyDevice.deleteMany({
            where: { id: { in: toDelete.map((d) => d.id) } },
          })
        }
        for (const d of data.devices) {
          const existing = existingDevices.find((ed) => ed.name === d.name && ed.type === d.type)
          if (existing) {
            await tx.propertyDevice.update({
              where: { id: existing.id },
              data: {
                instructions: d.instructions || null,
                brand: d.brand || null,
              },
            })
          } else {
            await tx.propertyDevice.create({
              data: {
                propertyId: id,
                name: d.name,
                type: d.type as DeviceType,
                instructions: d.instructions || null,
                brand: d.brand || null,
              },
            })
          }
        }
      }

      // Atualiza contatos com merge inteligente (preserva IDs)
      if (data.contacts !== undefined) {
        const existingContacts = await tx.propertyContact.findMany({
          where: { propertyId: id },
        })
        const incomingKeys = new Set(data.contacts.map((c) => `${c.name}|${c.role}`))
        const toDelete = existingContacts.filter((ec) => !incomingKeys.has(`${ec.name}|${ec.role}`))
        if (toDelete.length > 0) {
          await tx.propertyContact.deleteMany({
            where: { id: { in: toDelete.map((c) => c.id) } },
          })
        }
        for (const c of data.contacts) {
          const existing = existingContacts.find((ec) => ec.name === c.name && ec.role === c.role)
          if (existing) {
            await tx.propertyContact.update({
              where: { id: existing.id },
              data: {
                phone: c.phone || null,
                email: c.email || null,
                whatsapp: c.whatsapp || null,
              },
            })
          } else {
            await tx.propertyContact.create({
              data: {
                propertyId: id,
                name: c.name,
                role: c.role as ContactRole,
                phone: c.phone || null,
                email: c.email || null,
                whatsapp: c.whatsapp || null,
              },
            })
          }
        }
      }

      // Atualiza recomendações com merge inteligente (preserva IDs)
      if (data.recommendations !== undefined) {
        const existingRecs = await tx.localRecommendation.findMany({
          where: { propertyId: id },
        })
        const incomingKeys = new Set(data.recommendations.map((r) => `${r.name}|${r.category}`))
        const toDelete = existingRecs.filter((er) => !incomingKeys.has(`${er.name}|${er.category}`))
        if (toDelete.length > 0) {
          await tx.localRecommendation.deleteMany({
            where: { id: { in: toDelete.map((r) => r.id) } },
          })
        }
        for (const r of data.recommendations) {
          const existing = existingRecs.find((er) => er.name === r.name && er.category === r.category)
          if (existing) {
            await tx.localRecommendation.update({
              where: { id: existing.id },
              data: {
                description: r.description || null,
                address: r.address || null,
                mapUrl: r.mapUrl || null,
                instagram: r.instagram || null,
                image: r.image || null,
                distance: r.distance || null,
              },
            })
          } else {
            await tx.localRecommendation.create({
              data: {
                propertyId: id,
                name: r.name,
                category: r.category as RecommendationCategory,
                description: r.description || null,
                address: r.address || null,
                mapUrl: r.mapUrl || null,
                instagram: r.instagram || null,
                image: r.image || null,
                distance: r.distance || null,
              },
            })
          }
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
