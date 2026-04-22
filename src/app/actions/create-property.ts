'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 60)
}

interface CreatePropertyInput {
  name: string
  internalCode?: string
  type: string
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
  rulesPets: boolean
  rulesSmoking: boolean
  rulesParties: boolean
  devices: Array<{ name: string; type: string; instructions: string; brand: string }>
  contacts: Array<{ name: string; role: string; phone: string; email: string; whatsapp: string }>
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

export async function createProperty(input: CreatePropertyInput) {
  try {
    // Busca a primeira organização ou cria uma padrão
    let organization = await db.organization.findFirst()
    
    if (!organization) {
      organization = await db.organization.create({
        data: {
          name: 'Minha Organização',
          slug: 'minha-organizacao',
        },
      })
    }

    const slug = generateSlug(input.name)
    const guideSlug = `guia-${slug}`

    // Verifica se o slug já existe
    const existingProperty = await db.property.findUnique({
      where: { slug },
    })

    if (existingProperty) {
      throw new Error('Já existe um imóvel com esse nome. Escolha um nome diferente.')
    }

    // Cria o imóvel e todas as relações em uma transação
    const property = await db.property.create({
      data: {
        name: input.name,
        internalCode: input.internalCode || null,
        type: input.type as any,
        address: input.address || null,
        city: input.city || null,
        state: input.state || null,
        welcomeMessage: input.welcomeMessage || null,
        shortDescription: input.shortDescription || null,
        organizationId: organization.id,
        slug,
        status: 'DRAFT',
        checkIn: input.checkInTime || input.checkInInstructions || input.checkInAccessMethod
          ? {
              create: {
                time: input.checkInTime || null,
                instructions: input.checkInInstructions || null,
                accessMethod: input.checkInAccessMethod || null,
              },
            }
          : undefined,
        checkOut: input.checkOutTime || input.checkOutInstructions
          ? {
              create: {
                time: input.checkOutTime || null,
                instructions: input.checkOutInstructions || null,
              },
            }
          : undefined,
        wifi: input.wifiNetwork || input.wifiPassword
          ? {
              create: {
                networkName: input.wifiNetwork || '',
                password: input.wifiPassword || '',
              },
            }
          : undefined,
        rules: {
          create: {
            silence: input.rulesSilence || null,
            visits: input.rulesVisits || null,
            pets: input.rulesPets,
            smoking: input.rulesSmoking,
            parties: input.rulesParties,
          },
        },
        devices: input.devices.length > 0
          ? {
              create: input.devices.map((d) => ({
                name: d.name,
                type: d.type as any,
                instructions: d.instructions || null,
                brand: d.brand || null,
              })),
            }
          : undefined,
        contacts: input.contacts.length > 0
          ? {
              create: input.contacts.map((c) => ({
                name: c.name,
                role: c.role as any,
                phone: c.phone || null,
                email: c.email || null,
                whatsapp: c.whatsapp || null,
              })),
            }
          : undefined,
        recommendations: input.recommendations && input.recommendations.length > 0
          ? {
              create: input.recommendations.map((r) => ({
                name: r.name,
                category: r.category as any,
                description: r.description || null,
                address: r.address || null,
                mapUrl: r.mapUrl || null,
                instagram: r.instagram || null,
                image: r.image || null,
                distance: r.distance || null,
              })),
            }
          : undefined,
        guide: {
          create: {
            status: 'DRAFT',
            slug: guideSlug,
            version: 1,
          },
        },
      },
    })

    revalidatePath('/app/imoveis')
    
    return { success: true, propertyId: property.id }
  } catch (error: any) {
    console.error('Erro ao criar imóvel:', error)
    return { success: false, error: error.message || 'Erro ao criar imóvel' }
  }
}
