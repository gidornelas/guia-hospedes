import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Wifi,
  Mail,
  HardDrive,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Link2,
  AlertTriangle,
  Check,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { cn } from '@/lib/utils'
import { db } from '@/lib/db'

async function getIntegrations() {
  return db.integration.findMany({
    orderBy: { createdAt: 'desc' },
    include: { syncLogs: { orderBy: { startedAt: 'desc' }, take: 3 } },
  })
}

const STATUS_CONFIG = {
  CONNECTED: {
    label: 'Conectado',
    className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  },
  DISCONNECTED: {
    label: 'Desconectado',
    className: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  },
  ERROR: { label: 'Erro', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
}

const PROVIDER_CONFIG: Record<
  string,
  { icon: React.ElementType; iconColor: string; description: string }
> = {
  AIRBNB: {
    icon: Link2,
    iconColor: 'bg-[#FF5A5F]',
    description: 'Sincronização de calendário e listings',
  },
  WHATSAPP: {
    icon: Wifi,
    iconColor: 'bg-green-500',
    description: 'Envio de guias via WhatsApp',
  },
  EMAIL: {
    icon: Mail,
    iconColor: 'bg-blue-500',
    description: 'Envio de guias por e-mail',
  },
  STORAGE: {
    icon: HardDrive,
    iconColor: 'bg-slate-600',
    description: 'Armazenamento de mídia e arquivos',
  },
}

function HealthBar({ value }: { value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Saúde da conexão</span>
        <span
          className={cn(
            'font-medium',
            value >= 80 ? 'text-emerald-600' : value >= 50 ? 'text-amber-600' : 'text-red-600',
          )}
        >
          {value}%
        </span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DISCONNECTED

  return (
    <Badge className={cn(config.className)}>
      {status === 'CONNECTED' && <CheckCircle className="mr-1 h-3 w-3" />}
      {status === 'ERROR' && <AlertCircle className="mr-1 h-3 w-3" />}
      {status === 'DISCONNECTED' && <AlertTriangle className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  )
}

export default async function IntegrationsPage() {
  const dbIntegrations = await getIntegrations()

  const integrations = (['AIRBNB', 'WHATSAPP', 'EMAIL', 'STORAGE'] as const).map((provider) => {
    const dbIntegration = dbIntegrations.find((item) => item.provider === provider)
    const config = PROVIDER_CONFIG[provider]

    return {
      id: provider.toLowerCase(),
      name:
        provider === 'AIRBNB'
          ? 'Airbnb'
          : provider === 'WHATSAPP'
            ? 'WhatsApp'
            : provider === 'EMAIL'
              ? 'E-mail'
              : 'Armazenamento',
      status: (dbIntegration?.status?.toLowerCase() || 'disconnected') as
        | 'connected'
        | 'disconnected'
        | 'error',
      lastSync: dbIntegration?.syncLogs[0]?.startedAt
        ? new Date(dbIntegration.syncLogs[0].startedAt).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        : undefined,
      health:
        dbIntegration?.status === 'CONNECTED' ? 100 : dbIntegration?.status === 'ERROR' ? 30 : 0,
      icon: config.icon,
      iconColor: config.iconColor,
      description: config.description,
      syncLogs: dbIntegration?.syncLogs || [],
    }
  })

  const connectedCount = integrations.filter((integration) => integration.status === 'connected').length
  const checklistItems = [
    {
      label: 'Conectar conta Airbnb',
      done: integrations.find((integration) => integration.id === 'airbnb')?.status === 'connected',
    },
    { label: 'Mapear imóveis', done: false },
    { label: 'Configurar sincronizacao automatica', done: false },
    { label: 'Testar importacao iCal', done: false },
  ]
  const completedChecklist = checklistItems.filter((item) => item.done).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Conectividade"
        title="Integrações"
        description="Conecte sua operação com outras plataformas e acompanhe a saúde de cada canal."
        meta={
          <>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {connectedCount} integracao{connectedCount !== 1 ? 'oes' : ''} ativa
              {connectedCount !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="bg-background">
              Próxima revisão: hoje
            </Badge>
          </>
        }
      >
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar status
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="shadow-card transition-shadow hover:shadow-md">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg text-white',
                    integration.iconColor,
                  )}
                >
                  <integration.icon className="h-5 w-5" />
                </div>
                <StatusBadge status={integration.status.toUpperCase()} />
              </div>
              <div>
                <p className="font-semibold">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
              </div>
              <HealthBar value={integration.health} />
              {integration.lastSync && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Última sync: {integration.lastSync}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="airbnb" className="space-y-6">
        <TabsList className="w-full bg-muted lg:w-fit">
          <TabsTrigger value="airbnb">Airbnb</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="email">E-mail</TabsTrigger>
          <TabsTrigger value="storage">Armazenamento</TabsTrigger>
        </TabsList>

        <TabsContent value="airbnb" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF5A5F] text-sm font-bold text-white">
                        air
                      </div>
                      <div>
                        <CardTitle className="text-lg">Airbnb</CardTitle>
                        <CardDescription>Sincronização de calendário e listings</CardDescription>
                      </div>
                    </div>
                    <div className="sm:self-start">
                      <StatusBadge
                        status={
                          integrations.find((integration) => integration.id === 'airbnb')?.status.toUpperCase() ||
                          'DISCONNECTED'
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 rounded-lg bg-muted p-4">
                    <h4 className="text-sm font-medium">Configuração iCal</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">URL do calendário iCal</Label>
                        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                          <Input
                            readOnly
                            placeholder="https://www.airbnb.com/calendar/ical/..."
                            className="bg-background text-sm"
                          />
                          <Button variant="outline" size="icon" className="shrink-0 self-start">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">Sincronização automática</p>
                          <p className="text-xs text-muted-foreground">Atualiza a cada 6 horas</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-medium">Logs de sincronização</h4>
                    <div className="space-y-2">
                      {integrations.find((integration) => integration.id === 'airbnb')?.syncLogs.length ? (
                        integrations
                          .find((integration) => integration.id === 'airbnb')
                          ?.syncLogs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center justify-between rounded-lg border p-3 text-sm"
                            >
                              <div>
                                <p className="font-medium">
                                  {log.type === 'ICAL_IMPORT' ? 'Importação iCal' : 'Sincronização'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {log.details ? JSON.stringify(log.details) : 'Sem detalhes'}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="text-xs">
                                  {log.status === 'SUCCESS'
                                    ? 'Sucesso'
                                    : log.status === 'PARTIAL'
                                      ? 'Parcial'
                                      : 'Falha'}
                                </Badge>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {new Date(log.startedAt).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                          Nenhum log de sincronização encontrado.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Checklist de configuração</CardTitle>
                  <CardDescription>Complete para ativar as partes críticas do canal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                          item.done ? 'bg-emerald-500' : 'border-2 border-muted-foreground/30',
                        )}
                      >
                        {item.done && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Progress value={completedChecklist * 25} className="mt-2 h-1.5" />
                  <p className="text-center text-xs text-muted-foreground">
                    {completedChecklist} de {checklistItems.length} concluidos
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <CardTitle className="text-base text-amber-800">Avisos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-800">Dependência ativa</p>
                    <p className="mt-1 text-xs text-amber-700">
                      A sincronização do Airbnb depende da URL iCal estar sempre atualizada.
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-800">Risco de conflito</p>
                    <p className="mt-1 text-xs text-amber-700">
                      Reservas manuais podem conflitar com importações automáticas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white">
                        <Wifi className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">WhatsApp</CardTitle>
                        <CardDescription>Envio de guias via WhatsApp</CardDescription>
                      </div>
                    </div>
                    <StatusBadge
                      status={
                        integrations.find((integration) => integration.id === 'whatsapp')?.status.toUpperCase() ||
                        'DISCONNECTED'
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-2 font-medium">Modo atual: links wa.me</h4>
                    <p className="text-sm text-muted-foreground">
                      O sistema gera links diretos para WhatsApp que abrem uma conversa com a
                      mensagem pré-preenchida.
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                      <div>
                        <h4 className="font-medium text-amber-800">WhatsApp Cloud API em breve</h4>
                        <p className="mt-1 text-sm text-amber-700">
                          A arquitetura está pronta para integração com a WhatsApp Cloud API.
                          Quando ela entrar, será possível enviar mensagens diretamente pela plataforma.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: 'Número de WhatsApp configurado',
                      done:
                        integrations.find((integration) => integration.id === 'whatsapp')?.status ===
                        'connected',
                    },
                    { label: 'Teste de envio realizado', done: false },
                    { label: 'Cloud API ativada', done: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                          item.done ? 'bg-emerald-500' : 'border-2 border-muted-foreground/30',
                        )}
                      >
                        {item.done && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Progress value={0} className="mt-2 h-1.5" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">E-mail</CardTitle>
                        <CardDescription>Envio de guias por e-mail</CardDescription>
                      </div>
                    </div>
                    <StatusBadge
                      status={
                        integrations.find((integration) => integration.id === 'email')?.status.toUpperCase() ||
                        'DISCONNECTED'
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 rounded-lg bg-muted p-4">
                    <h4 className="text-sm font-medium">Configuração SMTP</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm">SMTP host</Label>
                        <Input
                          readOnly
                          value={process.env.SMTP_HOST || 'Não configurado'}
                          className="mt-1.5 bg-background"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Porta</Label>
                        <Input
                          readOnly
                          value={process.env.SMTP_PORT || '587'}
                          className="mt-1.5 bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm">E-mail de envio</Label>
                        <Input
                          readOnly
                          value={process.env.EMAIL_FROM || process.env.SMTP_FROM || 'Não configurado'}
                          className="mt-1.5 bg-background"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">Status</p>
                        <p className="mt-1 text-xs text-emerald-700">
                          {integrations.find((integration) => integration.id === 'email')?.status ===
                          'connected'
                            ? 'E-mail configurado e funcionando.'
                            : 'Configure as variáveis SMTP no ambiente para ativar o envio de e-mails.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: 'SMTP configurado',
                      done:
                        integrations.find((integration) => integration.id === 'email')?.status ===
                        'connected',
                    },
                    { label: 'E-mail de envio validado', done: false },
                    { label: 'Teste de entrega realizado', done: false },
                    { label: 'Templates de e-mail ativos', done: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                          item.done ? 'bg-emerald-500' : 'border-2 border-muted-foreground/30',
                        )}
                      >
                        {item.done && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Progress value={25} className="mt-2 h-1.5" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-600 text-white">
                        <HardDrive className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Armazenamento</CardTitle>
                        <CardDescription>Armazenamento de midia e arquivos</CardDescription>
                      </div>
                    </div>
                    <StatusBadge
                      status={
                        integrations.find((integration) => integration.id === 'storage')?.status.toUpperCase() ||
                        'DISCONNECTED'
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-2 font-medium">Modo atual: local</h4>
                    <p className="text-sm text-muted-foreground">
                      As imagens e arquivos são armazenados localmente. A arquitetura já está pronta
                      para integração com S3, Cloudinary ou outros provedores.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Armazenamento local ativo', done: true },
                    { label: 'Backup configurado', done: false },
                    { label: 'S3 ou Cloudinary conectado', done: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                          item.done ? 'bg-emerald-500' : 'border-2 border-muted-foreground/30',
                        )}
                      >
                        {item.done && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Progress value={33} className="mt-2 h-1.5" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
