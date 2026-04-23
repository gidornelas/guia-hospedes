'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  CheckCircle2,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { EmptyState } from '@/components/shared/empty-state'
import { DashboardMetricCard } from '@/components/dashboard/dashboard-metric-card'
import { DashboardSectionCard } from '@/components/dashboard/dashboard-section-card'
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
  const searchInputId = 'reservations-search'
  const statusFilterId = 'reservations-status-filter'
  const propertyFilterId = 'reservations-property-filter'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [propertyFilter, setPropertyFilter] = useState<string>('ALL')

  const filtered = reservations.filter((reservation) => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || reservation.status === statusFilter
    const matchesProperty = propertyFilter === 'ALL' || reservation.propertyId === propertyFilter
    return matchesSearch && matchesStatus && matchesProperty
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = filtered.filter(
    (reservation) =>
      new Date(reservation.checkInDate) >= today && reservation.status !== 'CANCELLED',
  )
  const past = filtered.filter(
    (reservation) =>
      new Date(reservation.checkInDate) < today || reservation.status === 'CHECKED_OUT',
  )
  const active = filtered.filter((reservation) => reservation.status === 'CHECKED_IN')

  async function handleDelete(id: string) {
    await deleteReservation(id)
    toast.success('Reserva excluida')
    window.location.reload()
  }

  const VALID_TRANSITIONS: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['CHECKED_IN', 'CANCELLED'],
    CHECKED_IN: ['CHECKED_OUT', 'CANCELLED'],
    CHECKED_OUT: [],
    CANCELLED: [],
  }

  async function handleStatusChange(
    id: string,
    newStatus: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED',
    currentStatus: string
  ) {
    const allowed = VALID_TRANSITIONS[currentStatus] || []
    if (!allowed.includes(newStatus)) {
      toast.error(`Não é possível alterar de "${STATUS_LABELS[currentStatus]}" para "${STATUS_LABELS[newStatus]}"`)
      return
    }
    await updateReservationStatus(id, newStatus)
    toast.success('Status atualizado')
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Total"
          value={filtered.length}
          hint="Reservas no recorte atual"
          icon={CalendarDays}
          tone="brand"
        />
        <DashboardMetricCard
          title="Hospedes ativos"
          value={active.length}
          hint="Em estadia neste momento"
          icon={Users}
          tone="blue"
        />
        <DashboardMetricCard
          title="Proximos check-ins"
          value={upcoming.length}
          hint="Entradas previstas a partir de hoje"
          icon={CalendarDays}
          tone="emerald"
        />
        <DashboardMetricCard
          title="Finalizadas"
          value={past.length}
          hint="Reservas concluidas ou passadas"
          icon={CheckCircle2}
          tone="slate"
        />
      </div>

      <DashboardSectionCard
        title="Reservas cadastradas"
        description="Filtre por hospede, status ou imóvel sem sair do mesmo ritmo visual usado nas telas principais do dashboard."
        action={
          <Badge variant="outline" className="bg-background">
            {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
          </Badge>
        }
        contentClassName="space-y-5"
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <label htmlFor={searchInputId} className="sr-only">
              Buscar reservas por nome do hospede
            </label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={searchInputId}
              placeholder="Buscar por hospede..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar reservas por nome do hospede"
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'ALL')}>
            <label htmlFor={statusFilterId} className="sr-only">
              Filtrar reservas por status
            </label>
            <SelectTrigger
              id={statusFilterId}
              className="w-full lg:w-[220px]"
              aria-label="Filtrar reservas por status"
            >
              <SelectValue placeholder="Status da reserva" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="CONFIRMED">Confirmada</SelectItem>
              <SelectItem value="CHECKED_IN">Check-in realizado</SelectItem>
              <SelectItem value="CHECKED_OUT">Check-out realizado</SelectItem>
              <SelectItem value="CANCELLED">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={propertyFilter}
            onValueChange={(value) => setPropertyFilter(value || 'ALL')}
          >
            <label htmlFor={propertyFilterId} className="sr-only">
              Filtrar reservas por imóvel
            </label>
            <SelectTrigger
              id={propertyFilterId}
              className="w-full lg:w-[240px]"
              aria-label="Filtrar reservas por imóvel"
            >
              <SelectValue placeholder="Todos os imóveis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os imóveis</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Nenhuma reserva encontrada"
            description="Ajuste os filtros ou limpe a busca para reencontrar as reservas cadastradas."
            actionLabel="Limpar filtros"
            onAction={() => {
              setSearch('')
              setStatusFilter('ALL')
              setPropertyFilter('ALL')
            }}
            secondaryActionLabel="Nova reserva"
            secondaryActionHref="/app/reservas/novo"
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((reservation) => (
              <Card
                key={reservation.id}
                className="shadow-card transition-shadow hover:shadow-card-hover"
              >
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{reservation.guestName}</h3>
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
                        {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')} -{' '}
                        {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {reservation.numberOfGuests} hospede
                        {reservation.numberOfGuests > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      {reservation.guestEmail ? (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {reservation.guestEmail}
                        </span>
                      ) : null}
                      {reservation.guestPhone ? (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {reservation.guestPhone}
                        </span>
                      ) : null}
                      {reservation.totalAmount ? (
                        <span className="font-medium text-foreground">
                          R$ {reservation.totalAmount.toFixed(2)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <Link href={`/app/reservas/${reservation.id}`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full gap-2 sm:w-auto">
                        <Edit className="h-4 w-4" />
                        Ver detalhes
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        aria-label={`Abrir acoes da reserva de ${reservation.guestName}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => (window.location.href = `/app/reservas/${reservation.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            (window.location.href = `/app/reservas/${reservation.id}/editar`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <div className="my-1 h-px bg-border" />
                        {reservation.status !== 'CHECKED_IN' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(reservation.id, 'CHECKED_IN', reservation.status)}
                          >
                            Marcar check-in
                          </DropdownMenuItem>
                        ) : null}
                        {reservation.status !== 'CHECKED_OUT' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(reservation.id, 'CHECKED_OUT', reservation.status)}
                          >
                            Marcar check-out
                          </DropdownMenuItem>
                        ) : null}
                        {reservation.status !== 'CONFIRMED' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(reservation.id, 'CONFIRMED', reservation.status)}
                          >
                            Confirmar reserva
                          </DropdownMenuItem>
                        ) : null}
                        {reservation.status !== 'CANCELLED' ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(reservation.id, 'CANCELLED', reservation.status)}
                            className="text-rose-600"
                          >
                            Cancelar reserva
                          </DropdownMenuItem>
                        ) : null}

                        <Dialog>
                          <DialogTrigger
                            className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm text-rose-600 outline-hidden transition-colors hover:bg-accent focus-visible:bg-accent"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Excluir reserva</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja excluir a reserva de{' '}
                                <strong>{reservation.guestName}</strong>? Esta ação não
                                pode ser desfeita.
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
        )}
      </DashboardSectionCard>
    </div>
  )
}
