'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateReservation } from '@/app/actions/reservations'

interface Property {
  id: string
  name: string
}

interface Reservation {
  id: string
  propertyId: string
  guestName: string
  guestEmail: string | null
  guestPhone: string | null
  checkInDate: Date
  checkOutDate: Date
  numberOfGuests: number
  status: string
  source: string
  totalAmount: number | null
  notes: string | null
  property: { id: string; name: string }
}

export function EditReservationForm({
  reservation,
  properties,
}: {
  reservation: Reservation
  properties: Property[]
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      return updateReservation(reservation.id, _prevState, formData)
    },
    null
  )

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app/reservas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Editar Reserva
          </h1>
          <p className="text-sm text-muted-foreground">
            {reservation.guestName} — {reservation.property.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="propertyId">Imóvel *</Label>
              <select
                id="propertyId"
                name="propertyId"
                required
                defaultValue={reservation.propertyId}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione um imóvel</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {state?.error?.propertyId && (
                <p className="text-sm text-red-600">{state.error.propertyId[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestName">Nome do hóspede *</Label>
              <Input
                id="guestName"
                name="guestName"
                required
                defaultValue={reservation.guestName}
              />
              {state?.error?.guestName && (
                <p className="text-sm text-red-600">{state.error.guestName[0]}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guestEmail">E-mail</Label>
                <Input
                  id="guestEmail"
                  name="guestEmail"
                  type="email"
                  defaultValue={reservation.guestEmail || ''}
                />
                {state?.error?.guestEmail && (
                  <p className="text-sm text-red-600">{state.error.guestEmail[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestPhone">Telefone</Label>
                <Input
                  id="guestPhone"
                  name="guestPhone"
                  defaultValue={reservation.guestPhone || ''}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="checkInDate">Check-in *</Label>
                <Input
                  id="checkInDate"
                  name="checkInDate"
                  type="date"
                  required
                  defaultValue={formatDate(reservation.checkInDate)}
                />
                {state?.error?.checkInDate && (
                  <p className="text-sm text-red-600">{state.error.checkInDate[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutDate">Check-out *</Label>
                <Input
                  id="checkOutDate"
                  name="checkOutDate"
                  type="date"
                  required
                  defaultValue={formatDate(reservation.checkOutDate)}
                />
                {state?.error?.checkOutDate && (
                  <p className="text-sm text-red-600">{state.error.checkOutDate[0]}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="numberOfGuests">Hóspedes *</Label>
                <Input
                  id="numberOfGuests"
                  name="numberOfGuests"
                  type="number"
                  min={1}
                  required
                  defaultValue={reservation.numberOfGuests}
                />
                {state?.error?.numberOfGuests && (
                  <p className="text-sm text-red-600">{state.error.numberOfGuests[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={reservation.status}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="PENDING">Pendente</option>
                  <option value="CHECKED_IN">Check-in realizado</option>
                  <option value="CHECKED_OUT">Check-out realizado</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <select
                  id="source"
                  name="source"
                  defaultValue={reservation.source}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="DIRECT">Direto</option>
                  <option value="AIRBNB">Airbnb</option>
                  <option value="BOOKING">Booking.com</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">E-mail</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">Valor total (R$)</Label>
              <Input
                id="totalAmount"
                name="totalAmount"
                type="number"
                step="0.01"
                min={0}
                defaultValue={reservation.totalAmount || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={reservation.notes || ''}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/app/reservas" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
