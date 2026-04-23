import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Garante que uma string de URL tenha um protocolo (http:// ou https://).
 * Útil quando plataformas de deploy (Railway, etc.) injetam domínios
 * sem protocolo em variáveis de ambiente ou headers.
 */
export function ensureValidUrl(url: string | URL | null | undefined): string {
  if (!url) return 'http://localhost:3000'
  if (url instanceof URL) return url.toString()
  const urlStr = String(url)
  if (/^https?:\/\//i.test(urlStr)) return urlStr
  if (urlStr.startsWith('//')) return `https:${urlStr}`
  return `https://${urlStr}`
}

/**
 * Sanitiza uma URL para uso em href, removendo protocolos perigosos como javascript:
 * Retorna null se a URL for considerada insegura.
 */
export function sanitizeHref(url: string | null | undefined): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null
  // Bloqueia protocolos perigosos
  const dangerous = /^(javascript|data|vbscript|file):/i
  if (dangerous.test(trimmed)) return null
  // Permite http, https, mailto, tel, e URLs relativas
  return trimmed
}
