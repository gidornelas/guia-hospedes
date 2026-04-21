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
export function ensureValidUrl(url: string): string {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}
