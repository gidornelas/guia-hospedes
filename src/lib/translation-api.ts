import { Locale } from '@/lib/i18n/types'

interface TranslateOptions {
  text: string
  sourceLang: string
  targetLang: string
}

interface TranslationResult {
  text: string
  success: boolean
  error?: string
}

/**
 * Detecta qual provedor de traducao esta configurado e traduz o texto.
 * Provedores suportados:
 * - 'libretranslate' — gratuito/open-source (padrao), nao precisa de API key
 * - 'deepl' — requer chave de API (free ou pro)
 * - 'google' — requer chave de API do Google Cloud
 */
export async function translateText(options: TranslateOptions): Promise<TranslationResult> {
  const provider = process.env.TRANSLATION_API_PROVIDER || 'libretranslate'
  const apiKey = process.env.TRANSLATION_API_KEY

  try {
    if (provider === 'libretranslate') {
      return await translateWithLibreTranslate(options)
    }
    if (provider === 'deepl') {
      if (!apiKey) {
        return {
          text: options.text,
          success: false,
          error: 'DeepL requer TRANSLATION_API_KEY. Use libretranslate para traducao gratuita sem chave.',
        }
      }
      return await translateWithDeepL(options, apiKey)
    }
    if (provider === 'google') {
      if (!apiKey) {
        return {
          text: options.text,
          success: false,
          error: 'Google Translate requer TRANSLATION_API_KEY. Use libretranslate para traducao gratuita sem chave.',
        }
      }
      return await translateWithGoogle(options, apiKey)
    }
    return {
      text: options.text,
      success: false,
      error: `Provedor de traducao desconhecido: ${provider}. Use 'libretranslate', 'deepl' ou 'google'.`,
    }
  } catch (err) {
    return {
      text: options.text,
      success: false,
      error: err instanceof Error ? err.message : 'Erro desconhecido na traducao',
    }
  }
}

/**
 * LibreTranslate — API gratuita e open-source.
 * Nao requer API key para uso basico (rate limit aplicado).
 * Voce tambem pode self-hostar: https://github.com/LibreTranslate/LibreTranslate
 */
async function translateWithLibreTranslate(
  { text, sourceLang, targetLang }: TranslateOptions
): Promise<TranslationResult> {
  const baseUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.de/translate'
  const apiKey = process.env.TRANSLATION_API_KEY

  // LibreTranslate usa codigos de 2 letras
  const source = sourceLang.split('-')[0].toLowerCase()
  const target = targetLang.split('-')[0].toLowerCase()

  const body: Record<string, string> = {
    q: text,
    source,
    target,
    format: 'text',
  }
  if (apiKey) {
    body.api_key = apiKey
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`LibreTranslate error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const translated = data.translatedText

  if (!translated) {
    throw new Error('Resposta invalida da LibreTranslate API')
  }

  return { text: translated, success: true }
}

async function translateWithDeepL(
  { text, sourceLang, targetLang }: TranslateOptions,
  apiKey: string
): Promise<TranslationResult> {
  // DeepL usa codigos de idioma em maiusculo (PT, EN, ES)
  const target = targetLang.toUpperCase() === 'PT-BR' ? 'PT-BR' : targetLang.toUpperCase()
  const source = sourceLang.toUpperCase()

  const isFreeKey = apiKey.endsWith(':fx')
  const baseUrl = isFreeKey
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate'

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `DeepL-Auth-Key ${apiKey}`,
    },
    body: new URLSearchParams({
      text,
      source_lang: source,
      target_lang: target,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DeepL API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const translated = data.translations?.[0]?.text

  if (!translated) {
    throw new Error('Resposta invalida da DeepL API')
  }

  return { text: translated, success: true }
}

async function translateWithGoogle(
  { text, sourceLang, targetLang }: TranslateOptions,
  apiKey: string
): Promise<TranslationResult> {
  const target = targetLang.split('-')[0]
  const source = sourceLang.split('-')[0]

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: 'text',
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Google Translate API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const translated = data.data?.translations?.[0]?.translatedText

  if (!translated) {
    throw new Error('Resposta invalida da Google Translate API')
  }

  return { text: translated, success: true }
}

/**
 * Mapeia locale para codigo de idioma da API de traducao.
 */
export function getApiLangCode(locale: Locale): string {
  switch (locale) {
    case 'pt-BR':
      return 'PT'
    case 'en':
      return 'EN'
    case 'es':
      return 'ES'
    default:
      return 'PT'
  }
}
