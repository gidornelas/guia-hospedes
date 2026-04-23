'use server'

import { db } from '@/lib/db'
import { requireSession, requirePropertyAccess, requireReservationAccess } from '@/lib/authorization'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const reservationSchema = z.object({
  propertyId: z.string().min(1, 'Selecione um imóvel'),
  guestName: z.string().min(1, 'Nome do hóspede é obrigatório'),
  guestEmail: z.string().email('E-mail inválido').optional().or(z.literal('')),
  guestPhone: z.string().optional().or(z.literal('')),
  checkInDate: z.string().min(1, 'Data de check-in é obrigatória'),
  checkOutDate: z.string().min(1, 'Data de check-out é obrigatória'),
  numberOfGuests: z.coerce.number().min(1, 'Mínimo 1 hóspede'),
  status: z.enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED']),
  source: z.enum(['AIRBNB', 'BOOKING', 'DIRECT', 'WHATSAPP', 'EMAIL', 'OTHER']),
  totalAmount: z.coerce.number().optional(),
  notes: z.string().optional().or(z.literal('')),
})

const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CHECKED_IN', 'CANCELLED'],
  CHECKED_IN: ['CHECKED_OUT', 'CANCELLED'],
  CHECKED_OUT: [],
  CANCELLED: [],
}

export async function createReservation(_prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = reservationSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const {
    propertyId,
    guestName,
    guestEmail,
    guestPhone,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    status,
    source,
    totalAmount,
    notes,
  } = parsed.data

  // Verifica se o imóvel pertence à organização do usuário logado
  await requirePropertyAccess(propertyId)

  await db.reservation.create({
    data: {
      propertyId,
      guestName,
      guestEmail: guestEmail || null,
      guestPhone: guestPhone || null,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfGuests,
      status,
      source,
      totalAmount: totalAmount || null,
      notes: notes || null,
    },
  })

  revalidatePath('/app/reservas')
  revalidateTag('dashboard', {})
  redirect('/app/reservas')
}

export async function updateReservation(
  id: string,
  _prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries())
  const parsed = reservationSchema.safeParse(data)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const {
    propertyId,
    guestName,
    guestEmail,
    guestPhone,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    status,
    source,
    totalAmount,
    notes,
  } = parsed.data

  // Verifica ownership da reserva existente e do novo imóvel (se alterado)
  const { reservation } = await requireReservationAccess(id)
  if (propertyId !== reservation.propertyId) {
    await requirePropertyAccess(propertyId)
  }

  await db.reservation.update({
    where: { id },
    data: {
      propertyId,
      guestName,
      guestEmail: guestEmail || null,
      guestPhone: guestPhone || null,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      numberOfGuests,
      status,
      source,
      totalAmount: totalAmount || null,
      notes: notes || null,
    },
  })

  revalidatePath('/app/reservas')
  revalidatePath(`/app/reservas/${id}`)
  revalidateTag('dashboard', {})
  redirect('/app/reservas')
}

export async function deleteReservation(id: string) {
  await requireReservationAccess(id)

  await db.reservation.delete({ where: { id } })
  revalidatePath('/app/reservas')
  revalidateTag('dashboard', {})
}

export async function updateReservationStatus(
  id: string,
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED'
) {
  const { reservation } = await requireReservationAccess(id)

  // Valida transição de status
  const allowedTransitions = VALID_STATUS_TRANSITIONS[reservation.status] || []
  if (!allowedTransitions.includes(status)) {
    throw new Error(
      `Transição inválida: não é possível alterar de "${reservation.status}" para "${status}".`
    )
  }

  await db.reservation.update({
    where: { id },
    data: { status },
  })
  revalidatePath('/app/reservas')
  revalidateTag('dashboard', {})
}
