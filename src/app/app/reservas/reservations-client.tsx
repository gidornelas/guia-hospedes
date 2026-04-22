'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  ChevronDown,
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteReservation, updateReservationStatus } from '@/app/actions/reservations'
import { toast } from 'sonner'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  CHECKED_IN: 'Check-in realizado',
  CHECKED_OUT: 'Check-out realizado',
  CANCELLED: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  CONFIRMED: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  CHECKED_IN: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  CHECKED_OUT: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  CANCELLED: 'bg-rose-100 text-rose-700 hover:bg-rose-100',
}

const SOURCE_LABELS: Record<string, string> = {
  AIRBNB: 'Airbnb',
  BOOKING: 'Booking.com',
  DIRECT: 'Direto',
  WHATSAPP: 'WhatsApp',
  EMAIL: 'E-mail',
  OTHER: 'Outro',
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
  property: { id: string; name: string }
}

interface ReservationsClientProps {
  reservations: Reservation[]
  properties: { id: string; name: string }[]
}

export function ReservationsClient({
  reservations,
  properties,
}: ReservationsClientProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [propertyFilter, setPropertyFilter] = useState<string>('ALL')

  const filtered = reservations.filter((r) => {
    const matchesSearch = r.guestName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter
    const matchesProperty = propertyFilter === 'ALL' || r.propertyId === propertyFilter
    return matchesSearch && matchesStatus && matchesProperty
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = filtered.filter(
    (r) => new Date(r.checkInDate) >= today && r.status !== 'CANCELLED'
  )
  const past = filtered.filter(
    (r) => new Date(r.checkInDate) < today || r.status === 'CHECKED_OUT'
  )
  const active = filtered.filter(
    (r) => r.status === 'CHECKED_IN'
  )

  async function handleDelete(id: string) {
    await deleteReservation(id)
    toast.success('Reserva excluída')
  }

  async function handleStatusChange(
    id: string,
    status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED'
  ) {
    await updateReservationStatus(id, status)
    toast.success('Status atualizado')
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-bold">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Hóspedes ativos</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">{active.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Próximos check-ins</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{upcoming.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Finalizadas</p>
            <p className="mt-1 text-2xl font-bold text-slate-600">{past.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por hóspede..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="ALL">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="CONFIRMED">Confirmada</option>
          <option value="CHECKED_IN">Check-in realizado</option>
          <option value="CHECKED_OUT">Check-out realizado</option>
          <option value="CANCELLED">Cancelada</option>
        </select>
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="ALL">Todos os imóveis</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((reservation) => (
          <Card
            key={reservation.id}
            className="transition-shadow hover:shadow-card-hover"
          >
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{reservation.guestName}</h3>
                  <Badge
                    variant="secondary"
                    className={STATUS_COLORS[reservation.status] || ''}
                  >
                    {STATUS_LABELS[reservation.status] || reservation.status}
                  </Badge>
                  <Badge variant="outline">
                    {SOURCE_LABELS[reservation.source] || reservation.source}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {reservation.property.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} —{' '}
                    {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {reservation.numberOfGuests} hóspede
                    {reservation.numberOfGuests > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  {reservation.guestEmail && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {reservation.guestEmail}
                    </span>
                  )}
                  {reservation.guestPhone && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {reservation.guestPhone}
                    </span>
                  )}
                  {reservation.totalAmount ? (
                    <span className="font-medium text-foreground">
                      R$ {reservation.totalAmount.toFixed(2)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/app/reservas/${reservation.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Ver
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => window.location.href = `/app/reservas/${reservation.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = `/app/reservas/${reservation.id}/editar`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <div className="my-1 h-px bg-border" />
                    {reservation.status !== 'CHECKED_IN' && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(reservation.id, 'CHECKED_IN')}
                      >
                        Marcar check-in
                      </DropdownMenuItem>
                    )}
                    {reservation.status !== 'CHECKED_OUT' && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(reservation.id, 'CHECKED_OUT')}
                      >
                        Marcar check-out
                      </DropdownMenuItem>
                    )}
                    {reservation.status !== 'CONFIRMED' && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')}
                      >
                        Confirmar reserva
                      </DropdownMenuItem>
                    )}
                    {reservation.status !== 'CANCELLED' && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(reservation.id, 'CANCELLED')}
                        className="text-rose-600"
                      >
                        Cancelar reserva
                      </DropdownMenuItem>
                    )}
                      <Dialog>
                      <DialogTrigger>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-rose-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Excluir reserva</DialogTitle>
                          <DialogDescription>
                            Tem certeza que deseja excluir a reserva de{' '}
                            <strong>{reservation.guestName}</strong>? Esta ação não pode
                            ser desfeita.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(reservation.id)}
                          >
                            Excluir
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
