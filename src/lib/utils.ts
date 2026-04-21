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
