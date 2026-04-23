import { db } from '@/lib/db'
import { getSession } from '@/lib/session'

export class AuthorizationError extends Error {
  constructor(message = 'Acesso negado') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export async function requireSession() {
  const session = await getSession()
  if (!session) {
    throw new AuthorizationError('Nao autenticado')
  }
  return session
}

export async function requirePropertyAccess(propertyId: string) {
  const session = await requireSession()
  const property = await db.property.findUnique({
    where: { id: propertyId, deletedAt: null },
    select: { organizationId: true },
  })
  if (!property || property.organizationId !== session.organizationId) {
    throw new AuthorizationError('Imovel nao encontrado ou sem permissao')
  }
  return { session, property }
}

export async function requireReservationAccess(reservationId: string) {
  const session = await requireSession()
  const reservation = await db.reservation.findUnique({
    where: { id: reservationId },
    include: { property: { select: { organizationId: true } } },
  })
  if (!reservation || reservation.property.organizationId !== session.organizationId) {
    throw new AuthorizationError('Reserva nao encontrada ou sem permissao')
  }
  return { session, reservation }
}

export async function requireGuideAccess(guideId: string) {
  const session = await requireSession()
  const guide = await db.guide.findUnique({
    where: { id: guideId },
    include: { property: { select: { organizationId: true } } },
  })
  if (!guide || guide.property.organizationId !== session.organizationId) {
    throw new AuthorizationError('Guia nao encontrado ou sem permissao')
  }
  return { session, guide }
}

export async function requireTemplateAccess(templateId: string) {
  const session = await requireSession()
  const template = await db.messageTemplate.findUnique({
    where: { id: templateId },
    select: { organizationId: true },
  })
  if (!template || template.organizationId !== session.organizationId) {
    throw new AuthorizationError('Template nao encontrado ou sem permissao')
  }
  return { session, template }
}

export async function requireOrganizationAccess(organizationId: string) {
  const session = await requireSession()
  if (session.organizationId !== organizationId) {
    throw new AuthorizationError('Organizacao nao encontrada ou sem permissao')
  }
  return { session }
}
