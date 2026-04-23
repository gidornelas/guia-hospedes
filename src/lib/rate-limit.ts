/**
 * Rate limiting simples em memória para API routes e server actions.
 * Em deploy multi-instance, considere Redis ou banco de dados.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

function getKey(identifier: string, windowMs: number): string {
  const windowStart = Math.floor(Date.now() / windowMs)
  return `${identifier}:${windowStart}`
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetAt: number
}

export function rateLimit(
  identifier: string,
  options: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const limit = options.limit ?? 5
  const windowMs = options.windowMs ?? 60_000 // 1 minuto padrão

  const key = getKey(identifier, windowMs)
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || now > existing.resetAt) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs }
    store.set(key, entry)
    return { success: true, limit, remaining: limit - 1, resetAt: entry.resetAt }
  }

  if (existing.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return {
    success: true,
    limit,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  }
}

/** Limpa entradas expiradas a cada 5 minutos para evitar vazamento de memória */
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)
