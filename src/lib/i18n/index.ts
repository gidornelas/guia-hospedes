import { Locale, TranslationDictionary } from './types'
import { ptBR } from './pt-BR'

export const locales: Locale[] = ['pt-BR', 'en', 'es']

export const localeLabels: Record<Locale, string> = {
  'pt-BR': 'Português',
  'en': 'English',
  'es': 'Español',
}

const dictionaryCache = new Map<Locale, TranslationDictionary>([['pt-BR', ptBR]])

/** Síncrono — retorna do cache ou pt-BR como fallback */
export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaryCache.get(locale) || ptBR
}

/** Assíncrono — carrega dicionários sob demanda com lazy loading */
export async function loadDictionary(locale: Locale): Promise<TranslationDictionary> {
  const cached = dictionaryCache.get(locale)
  if (cached) return cached

  let dictionary: TranslationDictionary
  switch (locale) {
    case 'en':
      dictionary = (await import('./en')).en
      break
    case 'es':
      dictionary = (await import('./es')).es
      break
    case 'pt-BR':
    default:
      dictionary = (await import('./pt-BR')).ptBR
      break
  }

  dictionaryCache.set(locale, dictionary)
  return dictionary
}

export function t(
  dictionary: TranslationDictionary,
  path: string
): string {
  const keys = path.split('.')
  let value: unknown = dictionary

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      return path
    }
  }

  if (typeof value === 'string') {
    return value
  }

  return path
}

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getLocaleFromSearchParams(searchParams: { lang?: string } | URLSearchParams): Locale {
  let raw: string | null = null
  if (searchParams instanceof URLSearchParams) {
    raw = searchParams.get('lang')
  } else {
    raw = searchParams.lang || null
  }
  return isValidLocale(raw || '') ? raw as Locale : 'pt-BR'
}
