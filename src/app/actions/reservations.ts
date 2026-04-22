'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
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
  redirect('/app/reservas')
}

export async function deleteReservation(id: string) {
  await db.reservation.delete({ where: { id } })
  revalidatePath('/app/reservas')
}

export async function updateReservationStatus(
  id: string,
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED'
) {
  await db.reservation.update({
    where: { id },
    data: { status },
  })
  revalidatePath('/app/reservas')
}
