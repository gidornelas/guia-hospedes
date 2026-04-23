'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createReservation } from '@/app/actions/reservations'
import { PageHeader } from '@/components/shared/page-header'

interface Property {
  id: string
  name: string
}

export function NewReservationForm({ properties }: { properties: Property[] }) {
  const [state, formAction, isPending] = useActionState(createReservation, null)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        eyebrow="Nova reserva"
        title="Cadastre uma reserva manualmente"
        description="Preencha os dados do hóspede, período da estadia e origem da reserva para manter a operação organizada."
      >
        <Link href="/app/reservas">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para reservas
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Informações da reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="propertyId">Imóvel *</Label>
              <Select name="propertyId" required>
                <SelectTrigger id="propertyId">
                  <SelectValue placeholder="Selecione um imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.error?.propertyId && (
                <p className="text-sm text-red-600">{state.error.propertyId[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestName">Nome do hospede *</Label>
              <Input id="guestName" name="guestName" required placeholder="Ex: Maria Silva" />
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
                  placeholder="maria@email.com"
                />
                {state?.error?.guestEmail && (
                  <p className="text-sm text-red-600">{state.error.guestEmail[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestPhone">Telefone</Label>
                <Input id="guestPhone" name="guestPhone" placeholder="(11) 99999-9999" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="checkInDate">Check-in *</Label>
                <Input id="checkInDate" name="checkInDate" type="date" required />
                {state?.error?.checkInDate && (
                  <p className="text-sm text-red-600">{state.error.checkInDate[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutDate">Check-out *</Label>
                <Input id="checkOutDate" name="checkOutDate" type="date" required />
                {state?.error?.checkOutDate && (
                  <p className="text-sm text-red-600">{state.error.checkOutDate[0]}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 min-[480px]:grid-cols-2 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="numberOfGuests">Hospedes *</Label>
                <Input
                  id="numberOfGuests"
                  name="numberOfGuests"
                  type="number"
                  min={1}
                  defaultValue={1}
                  required
                />
                {state?.error?.numberOfGuests && (
                  <p className="text-sm text-red-600">{state.error.numberOfGuests[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="CONFIRMED">
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="CHECKED_IN">Check-in realizado</SelectItem>
                    <SelectItem value="CHECKED_OUT">Check-out realizado</SelectItem>
                    <SelectItem value="CANCELLED">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Select name="source" defaultValue="DIRECT">
                  <SelectTrigger id="source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIRECT">Direto</SelectItem>
                    <SelectItem value="AIRBNB">Airbnb</SelectItem>
                    <SelectItem value="BOOKING">Booking.com</SelectItem>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="EMAIL">E-mail</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
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
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observacoes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Informações adicionais sobre a reserva..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/app/reservas" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar reserva'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
