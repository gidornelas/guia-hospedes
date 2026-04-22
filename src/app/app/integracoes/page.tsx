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
  ChevronRight,
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
  CONNECTED: { label: 'Conectado', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
  DISCONNECTED: { label: 'Desconectado', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  ERROR: { label: 'Erro', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
}

const PROVIDER_CONFIG: Record<string, { icon: React.ElementType; iconColor: string; description: string }> = {
  AIRBNB: { icon: Link2, iconColor: 'bg-[#FF5A5F]', description: 'Sincronização de calendário e listings' },
  WHATSAPP: { icon: Wifi, iconColor: 'bg-green-500', description: 'Envio de guias via WhatsApp' },
  EMAIL: { icon: Mail, iconColor: 'bg-blue-500', description: 'Envio de guias por e-mail' },
  STORAGE: { icon: HardDrive, iconColor: 'bg-slate-600', description: 'Armazenamento de mídia e arquivos' },
}

function HealthBar({ value }: { value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Saúde da conexão</span>
        <span className={cn(
          'font-medium',
          value >= 80 ? 'text-emerald-600' : value >= 50 ? 'text-amber-600' : 'text-red-600'
        )}>
          {value}%
        </span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DISCONNECTED
  return (
    <Badge className={cn(c.className)}>
      {status === 'CONNECTED' && <CheckCircle className="h-3 w-3 mr-1" />}
      {status === 'ERROR' && <AlertCircle className="h-3 w-3 mr-1" />}
      {status === 'DISCONNECTED' && <AlertTriangle className="h-3 w-3 mr-1" />}
      {c.label}
    </Badge>
  )
}

export default async function IntegrationsPage() {
  const dbIntegrations = await getIntegrations()

  // Mapear integrações do banco para o formato de exibição
  const integrations = (['AIRBNB', 'WHATSAPP', 'EMAIL', 'STORAGE'] as const).map((provider) => {
    const dbInt = dbIntegrations.find((i) => i.provider === provider)
    const config = PROVIDER_CONFIG[provider]
    return {
      id: provider.toLowerCase(),
      name: provider === 'AIRBNB' ? 'Airbnb' : provider === 'WHATSAPP' ? 'WhatsApp' : provider === 'EMAIL' ? 'E-mail' : 'Armazenamento',
      status: (dbInt?.status?.toLowerCase() || 'disconnected') as 'connected' | 'disconnected' | 'error',
      lastSync: dbInt?.syncLogs[0]?.startedAt
        ? new Date(dbInt.syncLogs[0].startedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        : undefined,
      health: dbInt?.status === 'CONNECTED' ? 100 : dbInt?.status === 'ERROR' ? 30 : 0,
      icon: config.icon,
      iconColor: config.iconColor,
      description: config.description,
      syncLogs: dbInt?.syncLogs || [],
    }
  })

  const connectedCount = integrations.filter((i) => i.status === 'connected').length

  const checklistItems = [
    { label: 'Conectar conta Airbnb', done: integrations.find((i) => i.id === 'airbnb')?.status === 'connected' },
    { label: 'Mapear imóveis', done: false },
    { label: 'Configurar sincronização automática', done: false },
    { label: 'Testar importação iCal', done: false },
  ]

  const completedChecklist = checklistItems.filter((item) => item.done).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Conectividade"
        title="Integrações"
        description="Conecte sua operação com outras plataformas"
        meta={
          <>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              {connectedCount} integração{connectedCount !== 1 ? 'es' : ''} ativa{connectedCount !== 1 ? 's' : ''}
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

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="shadow-card hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className={cn('h-10 w-10 rounded-lg text-white flex items-center justify-center', integration.iconColor)}>
                  <integration.icon className="h-5 w-5" />
                </div>
                <StatusBadge status={integration.status} />
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
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#FF5A5F] text-white flex items-center justify-center font-bold text-sm">
                        air
                      </div>
                      <div>
                        <CardTitle className="text-lg">Airbnb</CardTitle>
                        <CardDescription>Sincronização de calendário e listings</CardDescription>
                      </div>
                    </div>
                    <div className="sm:self-start">
                      <StatusBadge status={integrations.find((i) => i.id === 'airbnb')?.status || 'disconnected'} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted p-4 space-y-4">
                    <h4 className="font-medium text-sm">Configuração iCal</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">URL do Calendário iCal</Label>
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
                          <p className="text-sm font-medium">Sincronização Automática</p>
                          <p className="text-xs text-muted-foreground">Atualiza a cada 6 horas</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-3">Logs de Sincronização</h4>
                    <div className="space-y-2">
                      {integrations.find((i) => i.id === 'airbnb')?.syncLogs.length ? (
                        integrations.find((i) => i.id === 'airbnb')?.syncLogs.map((log) => (
                          <div key={log.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                            <div>
                              <p className="font-medium">{log.type === 'ICAL_IMPORT' ? 'Importação iCal' : 'Sincronização'}</p>
                              <p className="text-xs text-muted-foreground">{log.details ? JSON.stringify(log.details) : 'Sem detalhes'}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs">{log.status === 'SUCCESS' ? 'Sucesso' : log.status === 'PARTIAL' ? 'Parcial' : 'Falha'}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">{new Date(log.startedAt).toLocaleDateString('pt-BR')}</p>
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
                  <CardTitle className="text-base">Checklist de Configuração</CardTitle>
                  <CardDescription>Complete para ativar todas as funcionalidades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklistItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center shrink-0',
                        item.done ? 'bg-emerald-500' : 'border-2 border-muted-foreground/30'
                      )}>
                        {item.done && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Progress value={completedChecklist * 25} className="h-1.5 mt-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {completedChecklist} de {checklistItems.length} concluídos
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-amber-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <CardTitle className="text-base text-amber-800">Avisos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-sm text-amber-800 font-medium">Dependência ativa</p>
                    <p className="text-xs text-amber-700 mt-1">
                      A sincronização do Airbnb depende da URL iCal estar sempre atualizada.
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-sm text-amber-800 font-medium">Risco de conflito</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Reservas manuais podem conflitar com importações automáticas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500 text-white flex items-center justify-center">
                        <Wifi className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">WhatsApp</CardTitle>
                        <CardDescription>Envio de guias via WhatsApp</CardDescription>
                      </div>
                    </div>
                    <StatusBadge status={integrations.find((i) => i.id === 'whatsapp')?.status || 'disconnected'} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-medium mb-2">Modo Atual: Links wa.me</h4>
                    <p className="text-sm text-muted-foreground">
                      O sistema gera links diretos para WhatsApp (wa.me) que abrem automaticamente
                      uma conversa com a mensagem pré-preenchida.
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800">WhatsApp Cloud API (Em Breve)</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          A arquitetura está preparada para integração com a WhatsApp Cloud API.
                          Quando disponível, será possível enviar mensagens diretamente pela plataforma.
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
                    { label: 'Número de WhatsApp configurado', done: integrations.find((i) => i.id === 'whatsapp')?.status === 'connected' },
                    { label: 'Teste de envio realizado', done: false },
                    { label: 'Cloud API ativada', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center shrink-0',
                        item.done ? 'bg-emerald-500' : 'border-2 border-muted-foreground/30'
                      )}>
                        {item.done && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Progress value={0} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">E-mail</CardTitle>
                        <CardDescription>Envio de guias por e-mail</CardDescription>
                      </div>
                    </div>
                    <StatusBadge status={integrations.find((i) => i.id === 'email')?.status || 'disconnected'} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted p-4 space-y-4">
                    <h4 className="font-medium text-sm">Configuração SMTP</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">SMTP Host</Label>
                        <Input readOnly value={process.env.SMTP_HOST || 'Não configurado'} className="bg-background mt-1.5" />
                      </div>
                      <div>
                        <Label className="text-sm">Porta</Label>
                        <Input readOnly value={process.env.SMTP_PORT || '587'} className="bg-background mt-1.5" />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm">E-mail de Envio</Label>
                        <Input readOnly value={process.env.SMTP_FROM || 'Não configurado'} className="bg-background mt-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">Status</p>
                        <p className="text-xs text-emerald-700 mt-1">
                          {integrations.find((i) => i.id === 'email')?.status === 'connected'
                            ? 'E-mail configurado e funcionando.'
                            : 'Configure as variáveis SMTP no arquivo .env para ativar o envio de e-mails.'}
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
                    { label: 'SMTP configurado', done: integrations.find((i) => i.id === 'email')?.status === 'connected' },
                    { label: 'E-mail de envio validado', done: false },
                    { label: 'Teste de entrega realizado', done: false },
                    { label: 'Templates de e-mail ativos', done: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center shrink-0',
                        item.done ? 'bg-emerald-500' : 'border-2 border-muted-foreground/30'
                      )}>
                        {item.done && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Progress value={25} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-600 text-white flex items-center justify-center">
                        <HardDrive className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Armazenamento</CardTitle>
                        <CardDescription>Armazenamento de mídia e arquivos</CardDescription>
                      </div>
                    </div>
                    <StatusBadge status={integrations.find((i) => i.id === 'storage')?.status || 'disconnected'} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-medium mb-2">Modo Atual: Local</h4>
                    <p className="text-sm text-muted-foreground">
                      As imagens e arquivos são armazenados localmente. A arquitetura está preparada
                      para integração com S3, Cloudinary ou outros provedores de armazenamento.
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
                    { label: 'S3/Cloudinary conectado', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center shrink-0',
                        item.done ? 'bg-emerald-500' : 'border-2 border-muted-foreground/30'
                      )}>
                        {item.done && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <Progress value={33} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
