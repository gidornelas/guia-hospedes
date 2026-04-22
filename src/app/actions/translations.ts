'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { translateText, getApiLangCode } from '@/lib/translation-api'
import { Locale } from '@/lib/i18n/types'
import { AllTranslations, PropertyTranslations } from '@/lib/translate'

const targetLocales: Locale[] = ['en', 'es']

interface TranslationBatch {
  path: string
  text: string
}

function extractTranslatableTexts(property: any): TranslationBatch[] {
  const batches: TranslationBatch[] = []

  if (property.welcomeMessage) {
    batches.push({ path: 'welcomeMessage', text: property.welcomeMessage })
  }
  if (property.shortDescription) {
    batches.push({ path: 'shortDescription', text: property.shortDescription })
  }
  if (property.checkIn) {
    if (property.checkIn.instructions) {
      batches.push({ path: 'checkIn.instructions', text: property.checkIn.instructions })
    }
    if (property.checkIn.accessMethod) {
      batches.push({ path: 'checkIn.accessMethod', text: property.checkIn.accessMethod })
    }
    if (property.checkIn.notes) {
      batches.push({ path: 'checkIn.notes', text: property.checkIn.notes })
    }
  }
  if (property.checkOut) {
    if (property.checkOut.instructions) {
      batches.push({ path: 'checkOut.instructions', text: property.checkOut.instructions })
    }
    if (property.checkOut.exitChecklist) {
      batches.push({ path: 'checkOut.exitChecklist', text: property.checkOut.exitChecklist })
    }
  }
  if (property.wifi?.notes) {
    batches.push({ path: 'wifi.notes', text: property.wifi.notes })
  }
  if (property.rules) {
    if (property.rules.silence) {
      batches.push({ path: 'rules.silence', text: property.rules.silence })
    }
    if (property.rules.visits) {
      batches.push({ path: 'rules.visits', text: property.rules.visits })
    }
    if (property.rules.trash) {
      batches.push({ path: 'rules.trash', text: property.rules.trash })
    }
    if (property.rules.equipmentUse) {
      batches.push({ path: 'rules.equipmentUse', text: property.rules.equipmentUse })
    }
    if (property.rules.notes) {
      batches.push({ path: 'rules.notes', text: property.rules.notes })
    }
  }
  for (const device of property.devices || []) {
    if (device.name) {
      batches.push({ path: `devices.${device.id}.name`, text: device.name })
    }
    if (device.instructions) {
      batches.push({ path: `devices.${device.id}.instructions`, text: device.instructions })
    }
  }
  for (const contact of property.contacts || []) {
    if (contact.name) {
      batches.push({ path: `contacts.${contact.id}.name`, text: contact.name })
    }
  }
  for (const rec of property.recommendations || []) {
    if (rec.name) {
      batches.push({ path: `recommendations.${rec.id}.name`, text: rec.name })
    }
    if (rec.description) {
      batches.push({ path: `recommendations.${rec.id}.description`, text: rec.description })
    }
  }
  for (const link of property.links || []) {
    if (link.label) {
      batches.push({ path: `links.${link.id}.label`, text: link.label })
    }
  }

  return batches
}

function setNestedValue(obj: any, path: string, value: string) {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}

/**
 * Gera traduções automáticas para um imóvel usando a API configurada.
 * Traduz do português para inglês e espanhol.
 */
export async function generateTranslations(propertyId: string) {
  const property = await db.property.findUnique({
    where: { id: propertyId },
    include: {
      checkIn: true,
      checkOut: true,
      wifi: true,
      rules: true,
      devices: true,
      contacts: true,
      recommendations: true,
      links: true,
    },
  })

  if (!property) {
    return { success: false, error: 'Imóvel não encontrado' }
  }

  const batches = extractTranslatableTexts(property)

  if (batches.length === 0) {
    return { success: false, error: 'Nenhum conteúdo para traduzir' }
  }

  const results: Record<Locale, PropertyTranslations> = {
    'pt-BR': {},
    'en': {},
    'es': {},
  }

  const errors: string[] = []

  for (const locale of targetLocales) {
    const localeTranslations: PropertyTranslations = {}

    for (const batch of batches) {
      const result = await translateText({
        text: batch.text,
        sourceLang: getApiLangCode('pt-BR'),
        targetLang: getApiLangCode(locale),
      })

      if (result.success) {
        setNestedValue(localeTranslations, batch.path, result.text)
      } else {
        errors.push(`${locale}/${batch.path}: ${result.error}`)
      }
    }

    results[locale] = localeTranslations
  }

  // Merge com traduções existentes
  const existing = (property.translations as unknown as AllTranslations) || {}
  const merged: AllTranslations = {
    'pt-BR': existing['pt-BR'] || {},
    'en': { ...existing['en'], ...results['en'] },
    'es': { ...existing['es'], ...results['es'] },
  }

  await db.property.update({
    where: { id: propertyId },
    data: { translations: merged as any },
  })

  revalidatePath(`/app/imoveis/${propertyId}`)
  revalidatePath(`/app/imoveis/${propertyId}/traducoes`)

  return {
    success: true,
    translatedCount: batches.length,
    errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * Atualiza manualmente as traduções de um imóvel.
 */
export async function updatePropertyTranslations(
  propertyId: string,
  translations: AllTranslations
) {
  await db.property.update({
    where: { id: propertyId },
    data: { translations: translations as any },
  })

  revalidatePath(`/app/imoveis/${propertyId}`)
  revalidatePath(`/app/imoveis/${propertyId}/traducoes`)

  return { success: true }
}
