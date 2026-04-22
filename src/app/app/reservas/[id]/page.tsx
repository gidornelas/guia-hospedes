import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CalendarDays,
  Edit,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import { env } from '@/lib/env'
import { ShareModal } from '@/components/shared/share-modal'
import { PageHeader } from '@/components/shared/page-header'

async function getReservation(id: string) {
  return db.reservation.findUnique({
    where: { id },
    include: {
      property: {
        include: {
          guide: true,
          organization: { select: { id: true, name: true } },
        },
      },
    },
  })
}

async function getMessageTemplates() {
  return db.messageTemplate.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

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

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [reservation, templates] = await Promise.all([
    getReservation(id),
    getMessageTemplates(),
  ])

  if (!reservation) notFound()

  const { property } = reservation
  const guide = property.guide
  const publicUrl = guide?.slug ? `${env.appUrl}/g/${guide.slug.replace('guia-', '')}` : null

  const nights = Math.ceil(
    (new Date(reservation.checkOutDate).getTime() -
      new Date(reservation.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Reserva"
        title={reservation.guestName}
        description={`Estadia em ${property.name}`}
        meta={
          <>
            <Badge variant="secondary" className={STATUS_COLORS[reservation.status] || ''}>
              {STATUS_LABELS[reservation.status] || reservation.status}
            </Badge>
            <Badge variant="outline">
              {SOURCE_LABELS[reservation.source] || reservation.source}
            </Badge>
          </>
        }
      >
        <Link href="/app/reservas">
          <Button variant="outline">Voltar para reservas</Button>
        </Link>
        <Link href={`/app/reservas/${reservation.id}/editar`}>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="text-sm font-semibold">
                {new Date(reservation.checkInDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Check-out</p>
              <p className="text-sm font-semibold">
                {new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hospedes</p>
              <p className="text-sm font-semibold">{reservation.numberOfGuests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Noites</p>
              <p className="text-sm font-semibold">{nights}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Imovel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nome</span>
                <span className="text-sm font-medium">{property.name}</span>
              </div>
              {property.address && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Endereco</span>
                  <span className="text-sm">{property.address}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cidade</span>
                <span className="text-sm">
                  {property.city || '-'}, {property.state || '-'}
                </span>
              </div>
              <div className="pt-2">
                <Link href={`/app/imoveis/${property.id}`}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    Ver detalhes do imovel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Dados do hospede
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nome</span>
                <span className="text-sm font-medium">{reservation.guestName}</span>
              </div>
              {reservation.guestEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">E-mail</span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {reservation.guestEmail}
                  </span>
                </div>
              )}
              {reservation.guestPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Telefone</span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    {reservation.guestPhone}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {reservation.notes && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Observacoes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{reservation.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reservation.totalAmount && (
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="text-sm text-muted-foreground">Valor total</span>
                  <span className="text-lg font-bold">
                    R$ {reservation.totalAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Criada em</span>
                  <span>{reservation.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ultima atualizacao</span>
                  <span>{reservation.updatedAt.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="h-5 w-5 text-primary" />
                Acoes rapidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {guide?.status === 'PUBLISHED' && publicUrl && (
                <>
                  <ShareModal
                    propertyId={property.id}
                    propertyName={property.name}
                    guideId={guide.id}
                    guideSlug={guide.slug}
                    guideStatus={guide.status}
                    appUrl={env.appUrl}
                    templates={templates}
                    trigger={
                      <Button className="w-full justify-start gap-2">
                        <Share2 className="h-4 w-4" />
                        Enviar guia ao hospede
                      </Button>
                    }
                  />
                  <Link href={publicUrl} target="_blank">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Abrir guia publico
                    </Button>
                  </Link>
                </>
              )}
              {(!guide || guide.status !== 'PUBLISHED') && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs text-amber-800">
                    Publique o guia do imovel para liberar o compartilhamento com o hospede.
                  </p>
                  <Link href={`/app/imoveis/${property.id}`} className="mt-2 block">
                    <Button variant="outline" size="sm" className="w-full">
                      Ir para o imovel
                    </Button>
                  </Link>
                </div>
              )}
              <Link href={`/app/reservas/${reservation.id}/editar`}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Edit className="h-4 w-4" />
                  Editar reserva
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
