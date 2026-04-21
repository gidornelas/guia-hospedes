import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building2,
  MapPin,
  Wifi,
  Clock,
  Shield,
  Tv,
  Phone,
  Utensils,
  Link2,
  Edit,
  BookOpen,
  Share2,
  ArrowLeft,
  Eye,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Home,
  Star,
  Mail,
  MessageCircle,
} from 'lucide-react'
import { PROPERTY_STATUS, GUIDE_STATUS, DEVICE_TYPES, CONTACT_ROLES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { PropertyActions } from './property-actions'
import { ImageUpload } from '@/components/shared/image-upload'
import { EmptyState } from '@/components/shared/empty-state'

async function getProperty(id: string) {
  return db.property.findUnique({
    where: { id },
    include: {
      checkIn: true,
      checkOut: true,
      wifi: true,
      rules: true,
      devices: true,
      contacts: true,
      recommendations: true,
      links: true,
      guide: true,
    },
  })
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const statusConfig = PROPERTY_STATUS[property.status as keyof typeof PROPERTY_STATUS]
  const guideStatus = property.guide
    ? GUIDE_STATUS[property.guide.status as keyof typeof GUIDE_STATUS]
    : null

  return (
    <div className="space-y-6">
      {/* Header / Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app/imoveis">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">{property.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={property.status === 'ACTIVE' ? 'default' : 'secondary'}
                className={cn(
                  property.status === 'ACTIVE' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                )}
              >
                {statusConfig?.label}
              </Badge>
              {property.internalCode && (
                <span className="text-sm text-muted-foreground">{property.internalCode}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/app/imoveis/${property.id}/editar`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </Link>
          {property.guide && (
            <Link href={`/app/imoveis/${property.id}/preview`}>
              <Button size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </Link>
          )}
          <PropertyActions propertyId={property.id} guideStatus={property.guide?.status} />
        </div>
      </div>

      <Tabs defaultValue="resumo" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="guia">Guia</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="space-y-6">
          {/* Completude do Cadastro */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Completude do Cadastro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: 'Informações Gerais', filled: !!property.name && !!property.type, icon: Building2 },
                  { label: 'Check-in', filled: !!property.checkIn, icon: Clock },
                  { label: 'Check-out', filled: !!property.checkOut, icon: Clock },
                  { label: 'Wi-Fi', filled: !!property.wifi, icon: Wifi },
                  { label: 'Regras', filled: !!property.rules, icon: Shield },
                  { label: 'Equipamentos', filled: property.devices.length > 0, icon: Tv },
                  { label: 'Contatos', filled: property.contacts.length > 0, icon: Phone },
                  { label: 'Capa', filled: !!property.coverImage, icon: Star },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3',
                      item.filled
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-border bg-muted/30'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        item.filled ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {item.filled ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <item.icon className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className={cn('text-sm font-medium', !item.filled && 'text-muted-foreground')}>
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.filled ? 'Preenchido' : 'Pendente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Imagem de Capa</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload propertyId={property.id} currentImage={property.coverImage} />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tipo</p>
                    <p className="font-medium">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cidade</p>
                    <p className="font-medium">{property.city || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estado</p>
                    <p className="font-medium">{property.state || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">País</p>
                    <p className="font-medium">{property.country}</p>
                  </div>
                </div>
                {property.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{property.address}</span>
                  </div>
                )}
                {property.welcomeMessage && (
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="text-muted-foreground mb-1">Mensagem de Boas-vindas</p>
                    <p>{property.welcomeMessage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Check-in & Check-out
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.checkIn && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Check-in</span>
                      <Badge variant="outline">{property.checkIn.time || 'Não definido'}</Badge>
                    </div>
                    {property.checkIn.instructions && (
                      <p className="text-sm text-muted-foreground">{property.checkIn.instructions}</p>
                    )}
                    {property.checkIn.accessMethod && (
                      <p className="text-sm text-muted-foreground">
                        Acesso: {property.checkIn.accessMethod}
                      </p>
                    )}
                  </div>
                )}
                {property.checkOut && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Check-out</span>
                      <Badge variant="outline">{property.checkOut.time || 'Não definido'}</Badge>
                    </div>
                    {property.checkOut.instructions && (
                      <p className="text-sm text-muted-foreground">{property.checkOut.instructions}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {property.wifi && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-primary" />
                    Wi-Fi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rede</p>
                      <p className="font-medium">{property.wifi.networkName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Senha</p>
                      <p className="font-medium">{property.wifi.password}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {property.guide && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Status do Guia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge
                      variant={guideStatus?.color === 'success' ? 'default' : 'secondary'}
                      className={cn(
                        guideStatus?.color === 'success' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                      )}
                    >
                      {guideStatus?.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Versão</span>
                    <span className="text-sm font-medium">v{property.guide.version}</span>
                  </div>
                  {property.guide.publishedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Publicado em</span>
                      <span className="text-sm font-medium">
                        {property.guide.publishedAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/app/imoveis/${property.id}/preview`} className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </Link>
                    <Link href={`/app/compartilhamento?property=${property.id}`} className="flex-1">
                      <Button className="w-full gap-2">
                        <Share2 className="h-4 w-4" />
                        Compartilhar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="guia" className="space-y-6">
          {property.guide ? (
            <Card className="shadow-card">
              <CardContent className="p-6">
                <p>Guia criado em {property.guide.createdAt.toLocaleDateString('pt-BR')}</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/app/imoveis/${property.id}/preview`}>
                    <Button>Visualizar Preview</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Nenhum guia criado</h3>
                <p className="text-muted-foreground mt-2">
                  O guia será gerado automaticamente quando você completar o cadastro do imóvel.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="equipamentos" className="space-y-6">
          {property.devices.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.devices.map((device: { id: string; name: string; type: string; instructions: string | null; brand: string | null }) => (
                <Card key={device.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                        <Tv className="h-5 w-5 text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{device.name}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {DEVICE_TYPES[device.type as keyof typeof DEVICE_TYPES]}
                        </Badge>
                      </div>
                    </div>
                    {device.brand && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Marca/Modelo: <span className="font-medium text-foreground">{device.brand}</span>
                      </p>
                    )}
                    {device.instructions && (
                      <div className="mt-3 rounded-lg bg-muted p-3">
                        <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Instruções</p>
                        <p className="text-sm">{device.instructions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Tv}
              title="Nenhum equipamento cadastrado"
              description="Adicione equipamentos e instruções de uso para seus hóspedes."
              actionLabel="Editar Imóvel"
              actionHref={`/app/imoveis/${property.id}/editar`}
            />
          )}
        </TabsContent>

        <TabsContent value="contatos" className="space-y-6">
          {property.contacts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.contacts.map((contact: { id: string; name: string; role: string; phone: string | null; email: string | null; whatsapp: string | null }) => {
                const roleColor = contact.role === 'HOST' ? 'bg-brand-100 text-brand-600' :
                  contact.role === 'EMERGENCY' ? 'bg-rose-100 text-rose-600' :
                  'bg-muted text-muted-foreground'

                return (
                  <Card key={contact.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", roleColor)}>
                          <Phone className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{contact.name}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {CONTACT_ROLES[contact.role as keyof typeof CONTACT_ROLES]}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{contact.email}</span>
                          </div>
                        )}
                        {contact.whatsapp && (
                          <div className="flex items-center gap-2 text-sm">
                            <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                            <span>{contact.whatsapp}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={Phone}
              title="Nenhum contato cadastrado"
              description="Adicione contatos importantes para seus hóspedes."
              actionLabel="Editar Imóvel"
              actionHref={`/app/imoveis/${property.id}/editar`}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
