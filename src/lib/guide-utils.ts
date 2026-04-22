import { db } from '@/lib/db'

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

  if (!guide) return null

  // Em modo preview (dashboard), ignora verificação de status
  if (allowPreview) {
    return guide.property
  }

  // Modo público: apenas guias publicados
  return guide.status === 'PUBLISHED' ? guide.property : null
}
