import { Locale } from '@/lib/i18n/types'
import { getDictionary } from '@/lib/i18n'

export interface PropertyTranslations {
  welcomeMessage?: string
  shortDescription?: string
  checkIn?: {
    instructions?: string
    accessMethod?: string
    notes?: string
  }
  checkOut?: {
    instructions?: string
    exitChecklist?: string
  }
  wifi?: {
    notes?: string
  }
  rules?: {
    silence?: string
    visits?: string
    trash?: string
    equipmentUse?: string
    notes?: string
  }
  devices?: Record<string, {
    name?: string
    instructions?: string
  }>
  contacts?: Record<string, {
    name?: string
  }>
  recommendations?: Record<string, {
    name?: string
    description?: string
  }>
  links?: Record<string, {
    label?: string
  }>
}

export type AllTranslations = Record<Locale, PropertyTranslations>

/**
 * Obtém as traduções de um imóvel para um locale específico.
 * Fallback para vazio se não existir.
 */
export function getPropertyTranslations(
  translationsJson: unknown,
  locale: Locale
): PropertyTranslations {
  if (!translationsJson || typeof translationsJson !== 'object') return {}
  const all = translationsJson as AllTranslations
  return all[locale] || {}
}

/**
 * Retorna o valor traduzido de um campo, com fallback para o valor original.
 */
export function translateField(
  originalValue: string | null | undefined,
  translatedValue: string | null | undefined
): string | null | undefined {
  if (translatedValue && translatedValue.trim().length > 0) {
    return translatedValue
  }
  return originalValue
}

/**
 * Helper para traduzir um campo aninhado das traduções.
 * Ex: translatePath(translations, 'checkIn.instructions')
 */
export function translatePath(
  translations: PropertyTranslations,
  path: string
): string | undefined {
  const keys = path.split('.')
  let value: unknown = translations

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return typeof value === 'string' ? value : undefined
}

/**
 * Retorna o dicionário de labels traduzidos para enums e categorias.
 */
export function getTranslatedLabels(locale: Locale) {
  const d = getDictionary(locale)
  return {
    linkTypeLabels: d.links.typeLabels,
    deviceTypeLabels: getDeviceTypeLabels(locale),
    contactRoleLabels: getContactRoleLabels(locale),
    categoryLabels: getCategoryLabels(locale),
  }
}

function getDeviceTypeLabels(locale: Locale): Record<string, string> {
  if (locale === 'en') {
    return {
      TV: 'Television',
      AC: 'Air Conditioning',
      STOVE: 'Stove',
      SHOWER: 'Shower',
      INTERNET: 'Internet',
      LOCK: 'Lock',
      OTHER: 'Other',
    }
  }
  if (locale === 'es') {
    return {
      TV: 'Televisión',
      AC: 'Aire acondicionado',
      STOVE: 'Estufa',
      SHOWER: 'Ducha',
      INTERNET: 'Internet',
      LOCK: 'Cerradura',
      OTHER: 'Otro',
    }
  }
  return {
    TV: 'Televisão',
    AC: 'Ar-condicionado',
    STOVE: 'Fogão',
    SHOWER: 'Chuveiro',
    INTERNET: 'Internet',
    LOCK: 'Fechadura',
    OTHER: 'Outro',
  }
}

function getContactRoleLabels(locale: Locale): Record<string, string> {
  if (locale === 'en') {
    return {
      HOST: 'Host',
      SUPPORT: 'Support',
      MAINTENANCE: 'Maintenance',
      CONCIERGE: 'Concierge',
      EMERGENCY: 'Emergency',
    }
  }
  if (locale === 'es') {
    return {
      HOST: 'Anfitrión',
      SUPPORT: 'Soporte',
      MAINTENANCE: 'Mantenimiento',
      CONCIERGE: 'Conserje',
      EMERGENCY: 'Emergencia',
    }
  }
  return {
    HOST: 'Anfitrião',
    SUPPORT: 'Suporte',
    MAINTENANCE: 'Manutenção',
    CONCIERGE: 'Portaria',
    EMERGENCY: 'Emergência',
  }
}

function getCategoryLabels(locale: Locale): Record<string, string> {
  if (locale === 'en') {
    return {
      RESTAURANT: 'Restaurant',
      CAFE: 'Café',
      BAR: 'Bar',
      BAKERY: 'Bakery',
      MARKET: 'Market',
      PHARMACY: 'Pharmacy',
      SHOPPING: 'Shopping',
      NIGHTCLUB: 'Nightclub',
      ATTRACTION: 'Attraction',
      BEACH: 'Beach',
      PARK: 'Park',
      GYM: 'Gym',
      HOSPITAL: 'Hospital',
      TRANSPORT: 'Transport',
    }
  }
  if (locale === 'es') {
    return {
      RESTAURANT: 'Restaurante',
      CAFE: 'Café',
      BAR: 'Bar',
      BAKERY: 'Panadería',
      MARKET: 'Mercado',
      PHARMACY: 'Farmacia',
      SHOPPING: 'Compras',
      NIGHTCLUB: 'Discoteca',
      ATTRACTION: 'Atracción',
      BEACH: 'Playa',
      PARK: 'Parque',
      GYM: 'Gimnasio',
      HOSPITAL: 'Hospital',
      TRANSPORT: 'Transporte',
    }
  }
  return {
    RESTAURANT: 'Restaurante',
    CAFE: 'Café',
    BAR: 'Bar',
    BAKERY: 'Padaria',
    MARKET: 'Mercado',
    PHARMACY: 'Farmácia',
    SHOPPING: 'Shopping',
    NIGHTCLUB: 'Boate',
    ATTRACTION: 'Atração',
    BEACH: 'Praia',
    PARK: 'Parque',
    GYM: 'Academia',
    HOSPITAL: 'Hospital',
    TRANSPORT: 'Transporte',
  }
}
