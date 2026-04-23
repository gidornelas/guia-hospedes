import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  Circle,
  Clock,
  Edit,
  Eye,
  ExternalLink,
  FileDown,
  Languages,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Shield,
  Star,
  Tv,
  Wifi,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/shared/empty-state'
import { ImageUpload } from '@/components/shared/image-upload'
import {
  CONTACT_ROLES,
  DEVICE_TYPES,
  GUIDE_STATUS,
  PROPERTY_STATUS,
} from '@/lib/constants'
import { db } from '@/lib/db'
import { env } from '@/lib/env'
import { ShareModal } from '@/components/shared/share-modal'
import { cn } from '@/lib/utils'
import { PropertyActions } from './property-actions'
import RecommendationsManager from '@/components/dashboard/recommendations-manager'

async function getProperty(id: string) {
  return db.property.findUnique({
    where: { id, deletedAt: null },
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

async function getMessageTemplates() {
  return db.messageTemplate.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [property, templates] = await Promise.all([
    getProperty(id),
    getMessageTemplates(),
  ])

  if (!property) notFound()

  const statusConfig = PROPERTY_STATUS[property.status as keyof typeof PROPERTY_STATUS]
  const guideStatus = property.guide
    ? GUIDE_STATUS[property.guide.status as keyof typeof GUIDE_STATUS]
    : null
  const publicPath = property.guide?.slug
    ? `/g/${property.guide.slug.replace('guia-', '')}`
    : null
  const publicUrl = publicPath ? `${env.appUrl}${publicPath}` : null

  const readinessItems = [
    { label: 'Informações gerais', filled: !!property.name && !!property.type },
    { label: 'Check-in', filled: !!property.checkIn },
    { label: 'Check-out', filled: !!property.checkOut },
    { label: 'Wi-Fi', filled: !!property.wifi },
    { label: 'Regras', filled: !!property.rules },
    { label: 'Contatos', filled: property.contacts.length > 0 },
    { label: 'Equipamentos', filled: property.devices.length > 0 },
    { label: 'Capa', filled: !!property.coverImage },
    {
      label: 'Dicas ou links úteis',
      filled: property.recommendations.length > 0 || property.links.length > 0,
    },
  ]

  const readinessCount = readinessItems.filter((item) => item.filled).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/app/imoveis">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {property.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge
                variant={property.status === 'ACTIVE' ? 'default' : 'secondary'}
                className={cn(
                  property.status === 'ACTIVE' &&
                    'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
                )}
              >
                {statusConfig?.label}
              </Badge>
              {property.internalCode && (
                <span className="text-sm text-muted-foreground">
                  {property.internalCode}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <Link href={`/app/imoveis/${property.id}/editar`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full gap-2 sm:w-auto">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </Link>
          {property.guide && (
            <Link
              href={`/app/imoveis/${property.id}/preview`}
              className="w-full sm:w-auto"
            >
              <Button size="sm" className="w-full gap-2 sm:w-auto">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </Link>
          )}
          <PropertyActions propertyId={property.id} guideStatus={property.guide?.status} />
        </div>
      </div>

      <Tabs defaultValue="resumo" className="space-y-6">
        <TabsList className="w-full bg-muted lg:w-fit">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="guia">Guia</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="regiao">Região</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Completude do Cadastro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Informações gerais', filled: !!property.name && !!property.type, icon: Building2 },
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
                        : 'border-border bg-muted/30',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        item.filled
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {item.filled ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <item.icon className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          !item.filled && 'text-muted-foreground',
                        )}
                      >
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

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
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
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span>{property.address}</span>
                  </div>
                )}
                {property.welcomeMessage && (
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="mb-1 text-muted-foreground">
                      Mensagem de boas-vindas
                    </p>
                    <p>{property.welcomeMessage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Check-in & Check-out
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.checkIn && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Check-in</span>
                      <Badge variant="outline">
                        {property.checkIn.time || 'Não definido'}
                      </Badge>
                    </div>
                    {property.checkIn.instructions && (
                      <p className="text-sm text-muted-foreground">
                        {property.checkIn.instructions}
                      </p>
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
                      <Badge variant="outline">
                        {property.checkOut.time || 'Não definido'}
                      </Badge>
                    </div>
                    {property.checkOut.instructions && (
                      <p className="text-sm text-muted-foreground">
                        {property.checkOut.instructions}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {property.wifi && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wifi className="h-5 w-5 text-primary" />
                    Wi-Fi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
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
                  <CardTitle className="flex items-center gap-2 text-lg">
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
                        guideStatus?.color === 'success' &&
                          'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
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
                  <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                    <Link
                      href={`/app/imoveis/${property.id}/preview`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </Link>
                    <div className="flex-1">
                      <ShareModal
                        propertyId={property.id}
                        propertyName={property.name}
                        guideId={property.guide?.id}
                        guideSlug={property.guide?.slug}
                        guideStatus={property.guide?.status}
                        appUrl={env.appUrl}
                        templates={templates}
                        trigger={
                          <Button className="w-full gap-2">
                            <Share2 className="h-4 w-4" />
                            Compartilhar
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="guia" className="space-y-6">
          {property.guide ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-card">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-sm text-muted-foreground">Status atual</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          guideStatus?.color === 'success' ? 'default' : 'secondary'
                        }
                        className={cn(
                          guideStatus?.color === 'success' &&
                            'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
                        )}
                      >
                        {guideStatus?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {property.guide.status === 'PUBLISHED'
                        ? 'O guia já pode ser acessado e compartilhado.'
                        : 'Ainda vale revisar e publicar antes de enviar ao hóspede.'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-sm text-muted-foreground">Publicação</p>
                    <p className="text-lg font-semibold">
                      {property.guide.publishedAt
                        ? property.guide.publishedAt.toLocaleDateString('pt-BR')
                        : 'Ainda não publicado'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Criado em {property.guide.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-sm text-muted-foreground">URL pública</p>
                    <p className="break-all text-sm font-medium text-foreground">
                      {publicUrl ?? 'Disponível após gerar slug do guia'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Versão atual: v{property.guide.version}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {property.guide.status !== 'PUBLISHED' && (
                <Card className="border-amber-200 bg-amber-50 shadow-card">
                  <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-amber-900">
                          Próximo melhor passo
                        </p>
                        <p className="text-sm text-amber-800">
                          Revise o preview e publique o guia para liberar o link
                          público e o compartilhamento completo.
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                      <Link href={`/app/imoveis/${property.id}/preview`}>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Ver preview
                        </Button>
                      </Link>
                      <PropertyActions
                        propertyId={property.id}
                        guideStatus={property.guide.status}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Prontidão para publicação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">
                          {readinessCount} de {readinessItems.length} blocos preenchidos
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Quanto mais completo, melhor a experiência do hóspede.
                        </p>
                      </div>
                      <Badge variant="outline">{Math.round((readinessCount / readinessItems.length) * 100)}%</Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {readinessItems.map((item) => (
                        <div
                          key={item.label}
                          className={cn(
                            'flex items-center gap-3 rounded-lg border p-3',
                            item.filled
                              ? 'border-emerald-200 bg-emerald-50/60'
                              : 'border-border bg-background',
                          )}
                        >
                          {item.filled ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Share2 className="h-5 w-5 text-primary" />
                        Ações rápidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link href={`/app/imoveis/${property.id}/preview`}>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Eye className="h-4 w-4" />
                          Abrir preview completo
                        </Button>
                      </Link>
                      <Link
                        href={`/api/guides/${property.id}/pdf`}
                        target="_blank"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <FileDown className="h-4 w-4" />
                          Baixar PDF do guia
                        </Button>
                      </Link>
                      <ShareModal
                        propertyId={property.id}
                        propertyName={property.name}
                        guideId={property.guide?.id}
                        guideSlug={property.guide?.slug}
                        guideStatus={property.guide?.status}
                        appUrl={env.appUrl}
                        templates={templates}
                        trigger={
                          <Button className="w-full justify-start gap-2">
                            <Share2 className="h-4 w-4" />
                            Compartilhar guia
                          </Button>
                        }
                      />
                      <Link href={`/app/imoveis/${property.id}/editar`}>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Edit className="h-4 w-4" />
                          Editar conteúdo do guia
                        </Button>
                      </Link>
                      <Link href={`/app/imoveis/${property.id}/traducoes`}>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Languages className="h-4 w-4" />
                          Traduções
                        </Button>
                      </Link>
                      {publicUrl && property.guide.status === 'PUBLISHED' && (
                        <Link href={publicUrl} target="_blank">
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Abrir guia público
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Link2 className="h-5 w-5 text-primary" />
                        Canais recomendados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          icon: MessageCircle,
                          title: 'WhatsApp',
                          desc: 'Ideal para envio imediato no pré-check-in.',
                        },
                        {
                          icon: Mail,
                          title: 'E-mail',
                          desc: 'Bom para confirmações e mensagens mais completas.',
                        },
                        {
                          icon: Link2,
                          title: 'Link direto',
                          desc: 'Útil para copiar, testar e incluir em outros fluxos.',
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="rounded-lg border border-border bg-background p-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <item.icon className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <EmptyState
                icon={BookOpen}
                title="Nenhum guia criado"
                description="O guia será gerado automaticamente quando você completar o cadastro do imóvel."
                actionLabel="Editar imóvel"
                actionHref={`/app/imoveis/${property.id}/editar`}
              />

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">O que ajuda a publicar bem</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    'Definir horários de check-in e check-out',
                    'Cadastrar Wi-Fi com rede e senha',
                    'Adicionar contatos principais do hóspede',
                    'Revisar regras importantes da estadia',
                    'Subir uma boa imagem de capa',
                    'Adicionar dicas locais ou links úteis',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-border bg-muted/30 p-4 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="equipamentos" className="space-y-6">
          {property.devices.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {property.devices.map((device) => (
                <Card
                  key={device.id}
                  className="shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                        <Tv className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{device.name}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {DEVICE_TYPES[device.type as keyof typeof DEVICE_TYPES]}
                        </Badge>
                      </div>
                    </div>
                    {device.brand && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Marca/Modelo:{' '}
                        <span className="font-medium text-foreground">
                          {device.brand}
                        </span>
                      </p>
                    )}
                    {device.instructions && (
                      <div className="mt-3 rounded-lg bg-muted p-3">
                        <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                          Instruções
                        </p>
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
              actionLabel="Editar imóvel"
              actionHref={`/app/imoveis/${property.id}/editar`}
            />
          )}
        </TabsContent>

        <TabsContent value="contatos" className="space-y-6">
          {property.contacts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {property.contacts.map((contact) => {
                const roleColor =
                  contact.role === 'HOST'
                    ? 'bg-brand-100 text-brand-600'
                    : contact.role === 'EMERGENCY'
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-muted text-muted-foreground'

                return (
                  <Card
                    key={contact.id}
                    className="shadow-card transition-shadow hover:shadow-card-hover"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                            roleColor,
                          )}
                        >
                          <Phone className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{contact.name}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {
                              CONTACT_ROLES[
                                contact.role as keyof typeof CONTACT_ROLES
                              ]
                            }
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
                            <span className="text-muted-foreground">
                              {contact.email}
                            </span>
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
              actionLabel="Editar imóvel"
              actionHref={`/app/imoveis/${property.id}/editar`}
            />
          )}
        </TabsContent>

        <TabsContent value="regiao" className="space-y-6">
          <RecommendationsManager
            propertyId={property.id}
            recommendations={property.recommendations}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
