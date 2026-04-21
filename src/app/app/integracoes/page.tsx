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
  ExternalLink,
  Shield,
  AlertTriangle,
  Check,
  ChevronRight,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { cn } from '@/lib/utils'

// Status types
interface IntegrationStatus {
  id: string
  name: string
  status: 'connected' | 'partial' | 'disconnected' | 'pending'
  lastSync?: string
  nextSync?: string
  health: number // 0-100
  icon: React.ElementType
  iconColor: string
  description: string
}

const integrations: IntegrationStatus[] = [
  {
    id: 'airbnb',
    name: 'Airbnb',
    status: 'connected',
    lastSync: 'Hoje, 08:00',
    nextSync: 'Hoje, 14:00',
    health: 92,
    icon: Link2,
    iconColor: 'bg-[#FF5A5F]',
    description: 'Sincronização de calendário e listings',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    status: 'partial',
    health: 60,
    icon: Wifi,
    iconColor: 'bg-green-500',
    description: 'Envio de guias via WhatsApp',
  },
  {
    id: 'email',
    name: 'E-mail',
    status: 'connected',
    lastSync: 'Hoje, 10:30',
    nextSync: 'Automático',
    health: 100,
    icon: Mail,
    iconColor: 'bg-blue-500',
    description: 'Envio de guias por e-mail',
  },
  {
    id: 'storage',
    name: 'Armazenamento',
    status: 'connected',
    health: 85,
    icon: HardDrive,
    iconColor: 'bg-slate-600',
    description: 'Armazenamento de mídia e arquivos',
  },
]

const checklistItems = [
  { label: 'Conectar conta Airbnb', done: true },
  { label: 'Mapear imóveis', done: true },
  { label: 'Configurar sincronização automática', done: true },
  { label: 'Testar importação iCal', done: false },
]

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

function StatusBadge({ status }: { status: IntegrationStatus['status'] }) {
  const config = {
    connected: { label: 'Conectado', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
    partial: { label: 'Parcial', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
    disconnected: { label: 'Desconectado', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
    pending: { label: 'Pendente', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  }
  const c = config[status]
  return (
    <Badge className={cn(c.className)}>
      {status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
      {status === 'partial' && <AlertCircle className="h-3 w-3 mr-1" />}
      {status === 'disconnected' && <AlertTriangle className="h-3 w-3 mr-1" />}
      {c.label}
    </Badge>
  )
}

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrações"
        description="Conecte sua operação com outras plataformas"
      />

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
        <TabsList className="bg-muted">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#FF5A5F] text-white flex items-center justify-center font-bold text-sm">
                        air
                      </div>
                      <div>
                        <CardTitle className="text-lg">Airbnb</CardTitle>
                        <CardDescription>Sincronização de calendário e listings</CardDescription>
                      </div>
                    </div>
                    <StatusBadge status="connected" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted p-4 space-y-4">
                    <h4 className="font-medium text-sm">Configuração iCal</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">URL do Calendário iCal</Label>
                        <div className="flex gap-2 mt-1.5">
                          <Input
                            readOnly
                            value="https://www.airbnb.com/calendar/ical/123456.ics"
                            className="bg-background text-sm"
                          />
                          <Button variant="outline" size="icon">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium">Sincronização Automática</p>
                          <p className="text-xs text-muted-foreground">Atualiza a cada 6 horas</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-3">Mapeamento de Imóveis</h4>
                    <div className="rounded-lg border overflow-hidden">
                      <div className="grid grid-cols-3 gap-4 p-3 text-xs font-medium border-b bg-muted/50">
                        <span>Imóvel Interno</span>
                        <span>Listing Airbnb</span>
                        <span>Status</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-3 text-sm items-center">
                        <span>Flat Elegance Paulista</span>
                        <span className="text-muted-foreground">Flat Elegance Paulista - Airbnb</span>
                        <Badge className="bg-emerald-100 text-emerald-700 w-fit text-xs">Sincronizado</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-3">Logs de Sincronização</h4>
                    <div className="space-y-2">
                      {[
                        { type: 'ICAL_IMPORT', status: 'SUCCESS', date: 'Hoje, 08:00', details: '12 datas importadas' },
                        { type: 'MANUAL', status: 'SUCCESS', date: 'Ontem, 18:30', details: 'Sincronização manual' },
                      ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                          <div>
                            <p className="font-medium">{log.type === 'ICAL_IMPORT' ? 'Importação iCal' : 'Sincronização Manual'}</p>
                            <p className="text-xs text-muted-foreground">{log.details}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">{log.status === 'SUCCESS' ? 'Sucesso' : 'Falha'}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{log.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Checklist & Risks */}
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
                  <Progress value={75} className="h-1.5 mt-2" />
                  <p className="text-xs text-muted-foreground text-center">3 de 4 concluídos</p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-amber-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
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
                    <StatusBadge status="partial" />
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
                        >
                          Entrar na lista de espera
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
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
                    { label: 'Número de WhatsApp configurado', done: true },
                    { label: 'Teste de envio realizado', done: true },
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
                  <Progress value={67} className="h-1.5 mt-2" />
                </CardContent>
              </Card>

              <Card className="shadow-card border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Limitação atual</p>
                      <p className="text-xs text-amber-700 mt-1">
                        O modo wa.me requer que o usuário tenha o WhatsApp instalado no dispositivo.
                      </p>
                    </div>
                  </div>
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
                    <StatusBadge status="connected" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted p-4 space-y-4">
                    <h4 className="font-medium text-sm">Configuração SMTP</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">SMTP Host</Label>
                        <Input readOnly value="smtp.gmail.com" className="bg-background mt-1.5" />
                      </div>
                      <div>
                        <Label className="text-sm">Porta</Label>
                        <Input readOnly value="587" className="bg-background mt-1.5" />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm">E-mail de Envio</Label>
                        <Input readOnly value="noreply@guiahospedes.com" className="bg-background mt-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">Configuração válida</p>
                        <p className="text-xs text-emerald-700 mt-1">
                          Último teste de envio: Hoje, 10:30. Todos os e-mails estão sendo entregues.
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
                    { label: 'SMTP configurado', done: true },
                    { label: 'E-mail de envio validado', done: true },
                    { label: 'Teste de entrega realizado', done: true },
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
                  <Progress value={100} className="h-1.5 mt-2" />
                  <p className="text-xs text-emerald-600 text-center font-medium">Tudo pronto!</p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Risco de spam</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Configure SPF e DKIM no seu domínio para melhorar a entregabilidade.
                      </p>
                    </div>
                  </div>
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
                    <StatusBadge status="connected" />
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

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Uso de Armazenamento</span>
                      <span className="text-sm text-muted-foreground">45 MB / 500 MB</span>
                    </div>
                    <Progress value={9} className="h-2" />
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
