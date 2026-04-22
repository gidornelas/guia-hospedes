import { Locale, TranslationDictionary } from './types'
import { ptBR } from './pt-BR'
import { en } from './en'
import { es } from './es'

export const locales: Locale[] = ['pt-BR', 'en', 'es']

export const localeLabels: Record<Locale, string> = {
  'pt-BR': 'Português',
  'en': 'English',
  'es': 'Español',
}

const dictionaries: Record<Locale, TranslationDictionary> = {
  'pt-BR': ptBR,
  'en': en,
  'es': es,
}

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale] || ptBR
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
