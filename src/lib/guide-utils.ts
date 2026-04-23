import { db } from '@/lib/db'

// Tipos inferidos para uso no guia público
export type GuideContact = Awaited<ReturnType<typeof getGuideProperty>> extends infer R
  ? R extends { contacts: (infer C)[] } ? C : never
  : never

export type GuideDevice = Awaited<ReturnType<typeof getGuideProperty>> extends infer R
  ? R extends { devices: (infer D)[] } ? D : never
  : never

export type GuideRecommendation = Awaited<ReturnType<typeof getGuideProperty>> extends infer R
  ? R extends { recommendations: (infer Rec)[] } ? Rec : never
  : never

export type GuideLink = Awaited<ReturnType<typeof getGuideProperty>> extends infer R
  ? R extends { links: (infer L)[] } ? L : never
  : never

interface GuideFetchOptions {
  slug: string
  allowPreview?: boolean
  include?: {
    checkIn?: boolean
    checkOut?: boolean
    wifi?: boolean
    rules?: boolean
    devices?: boolean
    contacts?: boolean
    recommendations?: boolean
    links?: boolean
  }
}

export async function getGuideProperty(options: GuideFetchOptions) {
  const { slug, allowPreview = false, include = {} } = options

  const guide = await db.guide.findUnique({
    where: { slug: `guia-${slug}` },
    include: {
      property: {
        include: {
          checkIn: include.checkIn || false,
          checkOut: include.checkOut || false,
          wifi: include.wifi || false,
          rules: include.rules || false,
          devices: include.devices || false,
          contacts: include.contacts || false,
          recommendations: include.recommendations || false,
          links: include.links || false,
        },
      },
    },
  })

  if (!guide || guide.property.deletedAt) return null

  // Em modo preview (dashboard), ignora verificação de status
  if (allowPreview) {
    return { ...guide.property, guideId: guide.id, guideStatus: guide.status }
  }

  // Modo público: apenas guias publicados
  return guide.status === 'PUBLISHED'
    ? { ...guide.property, guideId: guide.id, guideStatus: guide.status }
    : null
}

export async function getGuideIdBySlug(slug: string) {
  const guide = await db.guide.findUnique({
    where: { slug: `guia-${slug}` },
    select: { id: true, status: true, property: { select: { deletedAt: true } } },
  })
  if (guide?.property?.deletedAt) return null
  return guide
}

export function buildGuideQuery(searchParams: { preview?: string; lang?: string }): string {
  const params = new URLSearchParams()
  if (searchParams.preview === '1') params.set('preview', '1')
  if (searchParams.lang) params.set('lang', searchParams.lang)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}
