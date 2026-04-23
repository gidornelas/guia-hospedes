'use client'

import { useMemo, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Mail,
  MessageCircle,
  QrCode,
  Send,
  Share2,
  Smartphone,
} from 'lucide-react'
import { shareGuide } from '@/app/actions/share-guide'
import { DashboardMetricCard } from '@/components/dashboard/dashboard-metric-card'
import { DashboardSectionCard } from '@/components/dashboard/dashboard-section-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { TEMPLATE_TYPES } from '@/lib/constants'
import { copyQrSvg, downloadQrSvg } from '@/lib/qr-code'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PropertyWithGuide {
  id: string
  name: string
  guide: { id: string; slug: string; status: string } | null
  contacts: Array<{ role: string; phone: string | null; whatsapp: string | null }>
}

interface MessageTemplate {
  id: string
  name: string
  body: string
  type: string
}

interface ShareLog {
  id: string
  channel: string
  recipient: string | null
  sentAt: string
  status: string
  guide: {
    property: { name: string }
  }
}

interface SharingClientProps {
  properties: PropertyWithGuide[]
  templates: MessageTemplate[]
  initialLogs: ShareLog[]
  appUrl: string
}

const NO_TEMPLATE_VALUE = '__NO_TEMPLATE__'
const ALL_FILTER = '__ALL__'

const channelConfig = {
  WHATSAPP: {
    label: 'WhatsApp',
    description: 'Envio rapido direto no celular do hospede',
    icon: MessageCircle,
    color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    badge: 'bg-green-600',
  },
  EMAIL: {
    label: 'E-mail',
    description: 'Mais formal, ideal para reservas corporativas',
    icon: Mail,
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    badge: 'bg-blue-600',
  },
  LINK: {
    label: 'Link direto',
    description: 'Copie e cole onde preferir',
    icon: LinkIcon,
    color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
    badge: 'bg-slate-600',
  },
  QR: {
    label: 'QR Code',
    description: 'Imprima ou envie como imagem',
    icon: QrCode,
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    badge: 'bg-purple-600',
  },
} as const

function groupTemplatesByType(templates: MessageTemplate[]) {
  const grouped: Array<{ type: string; label: string; templates: MessageTemplate[] }> = []
  const recognizedTypes = Object.keys(TEMPLATE_TYPES)
  recognizedTypes.forEach((type) => {
    const typedTemplates = templates.filter((template) => template.type === type)

    if (typedTemplates.length > 0) {
      grouped.push({
        type,
        label: TEMPLATE_TYPES[type as keyof typeof TEMPLATE_TYPES],
        templates: typedTemplates,
      })
    }
  })

  const otherTemplates = templates.filter((template) => !recognizedTypes.includes(template.type))

  if (otherTemplates.length > 0) {
    grouped.push({
      type: 'OTHER',
      label: 'Outros',
      templates: otherTemplates,
    })
  }

  return grouped
}

export default function SharingClient({
  properties,
  templates,
  initialLogs,
  appUrl,
}: SharingClientProps) {
  const propertySelectId = 'sharing-property'
  const templateSelectId = 'sharing-template'
  const guestNameInputId = 'sharing-guest-name'
  const guestContactInputId = 'sharing-guest-contact'
  const messageTextareaId = 'sharing-message'
  const historyChannelId = 'sharing-history-channel'
  const historyPropertyId = 'sharing-history-property'
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestContact, setGuestContact] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [logs, setLogs] = useState<ShareLog[]>(initialLogs)
  const [filterChannel, setFilterChannel] = useState(ALL_FILTER)
  const [filterProperty, setFilterProperty] = useState(ALL_FILTER)
  const qrCodeRef = useRef<HTMLDivElement | null>(null)

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId),
    [properties, selectedPropertyId],
  )

  const guideUrl = useMemo(() => {
    if (!selectedProperty?.guide) return ''
    return `${appUrl}/g/${selectedProperty.guide.slug.replace('guia-', '')}`
  }, [appUrl, selectedProperty])

  const guideStatus = selectedProperty?.guide?.status
  const isPublished = guideStatus === 'PUBLISHED'

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [selectedTemplateId, templates],
  )

  const templateGroups = useMemo(() => groupTemplatesByType(templates), [templates])

  const generatedMessage = useMemo(() => {
    let message = customMessage

    if (!message && selectedTemplate) {
      message = selectedTemplate.body
    }

    if (!message) {
      message =
        'Ola {{guestName}}! Seja bem-vindo(a) ao nosso espaco. Aqui esta o guia com todas as informacoes do imovel: {{guideLink}}'
    }

    return message
      .replace(/\{\{guestName\}\}/g, guestName || 'hospede')
      .replace(/\{\{propertyName\}\}/g, selectedProperty?.name || '')
      .replace(/\{\{guideLink\}\}/g, guideUrl)
  }, [customMessage, guestName, guideUrl, selectedProperty, selectedTemplate])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesChannel = filterChannel === ALL_FILTER || log.channel === filterChannel
      const matchesProperty =
        filterProperty === ALL_FILTER || log.guide.property.name === filterProperty

      return matchesChannel && matchesProperty
    })
  }, [filterChannel, filterProperty, logs])

  const whatsappLogs = logs.filter((log) => log.channel === 'WHATSAPP').length
  const emailLogs = logs.filter((log) => log.channel === 'EMAIL').length

  const sharingMetrics: Array<{
    title: string
    value: string | number
    hint: string
    icon: typeof Globe
    tone: 'brand' | 'emerald' | 'blue' | 'amber' | 'slate'
  }> = [
    {
      title: 'Guias prontos',
      value: properties.length,
      hint: 'Imoveis com guia pronto para envio',
      icon: Globe,
      tone: 'emerald',
    },
    {
      title: 'Modelos',
      value: templates.length,
      hint: 'Base pronta para acelerar mensagens',
      icon: BookOpen,
      tone: 'brand',
    },
    {
      title: 'Envios registrados',
      value: logs.length,
      hint: 'Historico total desta operacao',
      icon: Send,
      tone: 'blue',
    },
    {
      title: 'Canal mais usado',
      value: whatsappLogs >= emailLogs ? 'WhatsApp' : 'E-mail',
      hint: whatsappLogs >= emailLogs ? `${whatsappLogs} envio(s)` : `${emailLogs} envio(s)`,
      icon: whatsappLogs >= emailLogs ? MessageCircle : Mail,
      tone: whatsappLogs >= emailLogs ? 'emerald' : 'slate',
    },
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const appendShareLog = (channel: string) => {
    if (!selectedProperty) return

    setLogs((previous) => [
      {
        id: Date.now().toString(),
        channel,
        recipient: guestContact || null,
        sentAt: new Date().toISOString(),
        status: 'SENT',
        guide: { property: { name: selectedProperty.name } },
      },
      ...previous,
    ])
  }

  const handleCopyLink = async () => {
    if (!guideUrl) return

    await navigator.clipboard.writeText(guideUrl)
    setCopied(true)
    toast.success('Link copiado para a area de transferencia!')
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(generatedMessage)
    toast.success('Mensagem copiada!')
  }

  const registerQrShare = async () => {
    if (!selectedProperty?.guide) return

    await shareGuide({
      guideId: selectedProperty.guide.id,
      channel: 'QR',
      message: guideUrl,
    })
  }

  const handleDownloadQr = async () => {
    const svg = qrCodeRef.current?.querySelector('svg')

    if (!svg || !selectedProperty) {
      toast.error('QR Code indisponivel no momento')
      return
    }

    downloadQrSvg(
      svg,
      `qr-guia-${selectedProperty.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`,
    )
    await registerQrShare()
    toast.success('QR Code baixado com sucesso!')
  }

  const handleCopyQr = async () => {
    const svg = qrCodeRef.current?.querySelector('svg')

    if (!svg) {
      toast.error('QR Code indisponivel no momento')
      return
    }

    try {
      await copyQrSvg(svg)
      await registerQrShare()
      toast.success('QR Code copiado como imagem SVG!')
    } catch {
      toast.error('Seu navegador nao suporta copiar imagem do QR diretamente')
    }
  }

  const handleWhatsApp = async () => {
    if (!guideUrl || !selectedProperty?.guide) {
      toast.error('Selecione um imovel com guia publicado')
      return
    }

    setIsSharing(true)

    const phone = guestContact.replace(/\D/g, '')
    const result = await shareGuide({
      guideId: selectedProperty.guide.id,
      channel: 'WHATSAPP',
      recipient: guestContact || undefined,
      message: generatedMessage,
    })

    if (result.success) {
      appendShareLog('WHATSAPP')
      toast.success('Compartilhamento registrado!')

      const waMessage = encodeURIComponent(generatedMessage)
      const waUrl = phone ? `https://wa.me/${phone}?text=${waMessage}` : `https://wa.me/?text=${waMessage}`
      window.open(waUrl, '_blank')
    } else {
      toast.error(result.error || 'Erro ao compartilhar')
    }

    setIsSharing(false)
  }

  const handleEmail = async () => {
    if (!guideUrl || !selectedProperty?.guide) {
      toast.error('Selecione um imovel com guia publicado')
      return
    }

    setIsSharing(true)

    const result = await shareGuide({
      guideId: selectedProperty.guide.id,
      channel: 'EMAIL',
      recipient: guestContact || undefined,
      message: generatedMessage,
    })

    if (result.success) {
      appendShareLog('EMAIL')
      toast.success('Compartilhamento registrado!')

      const subject = encodeURIComponent(`Guia do imovel - ${selectedProperty.name}`)
      const body = encodeURIComponent(generatedMessage)
      window.location.href = `mailto:${guestContact}?subject=${subject}&body=${body}`
    } else {
      toast.error(result.error || 'Erro ao compartilhar')
    }

    setIsSharing(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compartilhamento"
        title="Escolha o canal certo para cada envio"
        description="Personalize a mensagem, valide o preview e compartilhe o guia pelo canal ideal para cada contexto da estadia."
        meta={
          selectedProperty ? (
            <>
              <Badge
                variant={isPublished ? 'default' : 'destructive'}
                className={cn(isPublished ? 'bg-emerald-600 hover:bg-emerald-700' : '')}
              >
                {isPublished ? 'Publicado' : 'Nao publicado'}
              </Badge>
              {isPublished ? (
                <Badge variant="outline" className="bg-background">
                  Guia pronto para envio
                </Badge>
              ) : null}
            </>
          ) : (
            <Badge variant="outline" className="bg-background">
              Selecione um imovel para comecar
            </Badge>
          )
        }
      />

      {properties.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="Nenhum guia pronto para compartilhar"
          description="Publique pelo menos um guia para liberar envio por WhatsApp, e-mail, link ou QR Code."
          actionLabel="Ver imoveis"
          actionHref="/app/imoveis"
          secondaryActionLabel="Novo imovel"
          secondaryActionHref="/app/imoveis/novo"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sharingMetrics.map((metric) => (
              <DashboardMetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                hint={metric.hint}
                icon={metric.icon}
                tone={metric.tone}
              />
            ))}
          </div>

          <DashboardSectionCard
            title="Escolha o guia para enviar"
            description="Defina primeiro o imovel e depois personalize a mensagem, o canal e o historico do envio."
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <label htmlFor={propertySelectId} className="mb-1.5 block text-sm font-medium">
                    Imovel
                  </label>
                  <Select
                    value={selectedPropertyId}
                    onValueChange={(value) => setSelectedPropertyId(value || '')}
                  >
                    <SelectTrigger
                      id={propertySelectId}
                      className="w-full"
                      aria-label="Selecionar imovel para compartilhar"
                    >
                      <SelectValue placeholder="Escolha um imovel..." />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProperty ? (
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Badge
                      variant={isPublished ? 'default' : 'destructive'}
                      className={cn(isPublished ? 'bg-emerald-600 hover:bg-emerald-700' : '')}
                    >
                      {isPublished ? 'Publicado' : 'Nao publicado'}
                    </Badge>
                    {isPublished ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        Publico
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {selectedProperty && !isPublished ? (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Guia nao publicado</p>
                    <p className="mt-0.5 text-sm text-amber-700">
                      Este imovel ainda nao possui um guia publico. Publique-o antes de compartilhar.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
                      onClick={() => window.open(`/app/imoveis/${selectedProperty.id}`, '_blank')}
                    >
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Ir para o imovel
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </DashboardSectionCard>

          {selectedProperty && isPublished ? (
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="space-y-6 xl:col-span-1">
                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Dados do hospede</CardTitle>
                    <CardDescription>Personalize a mensagem antes de enviar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor={templateSelectId} className="mb-1.5 block text-sm font-medium">
                        Modelo de mensagem
                      </label>
                      <Select
                        value={selectedTemplateId || NO_TEMPLATE_VALUE}
                        onValueChange={(value) =>
                          setSelectedTemplateId(
                            !value || value === NO_TEMPLATE_VALUE ? '' : value,
                          )
                        }
                      >
                        <SelectTrigger
                          id={templateSelectId}
                          aria-label="Selecionar modelo de mensagem"
                        >
                          <SelectValue placeholder="Escolha um template..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NO_TEMPLATE_VALUE}>Padrao (sem template)</SelectItem>
                          {templateGroups.map((group) => (
                            <div key={group.type}>
                              <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {group.label}
                              </div>
                              {group.templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor={guestNameInputId} className="mb-1.5 block text-sm font-medium">
                        Nome do hospede
                      </label>
                      <Input
                        id={guestNameInputId}
                        placeholder="Ex: Maria Silva"
                        value={guestName}
                        onChange={(event) => setGuestName(event.target.value)}
                        aria-describedby="sharing-message-variables"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={guestContactInputId}
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Telefone ou e-mail
                      </label>
                      <Input
                        id={guestContactInputId}
                        placeholder="WhatsApp ou e-mail do hospede"
                        value={guestContact}
                        onChange={(event) => setGuestContact(event.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor={messageTextareaId} className="mb-1.5 block text-sm font-medium">
                        Mensagem
                      </label>
                      <Textarea
                        id={messageTextareaId}
                        placeholder="Sua mensagem aqui... Use {{guestName}}, {{propertyName}} e {{guideLink}} como variaveis"
                        rows={5}
                        value={customMessage}
                        onChange={(event) => setCustomMessage(event.target.value)}
                        aria-describedby="sharing-message-variables sharing-send-status"
                      />
                      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p id="sharing-message-variables" className="text-xs text-muted-foreground">
                          Variaveis: {'{{guestName}}'}, {'{{propertyName}}'}, {'{{guideLink}}'}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto px-2 py-1 text-xs"
                          onClick={handleCopyMessage}
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copiar mensagem
                        </Button>
                      </div>
                      <p id="sharing-send-status" className="sr-only" role="status" aria-live="polite">
                        {isSharing
                          ? 'Compartilhamento em andamento'
                          : 'Mensagem pronta para compartilhar'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Escolha o canal</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      disabled={isSharing}
                      aria-label="Enviar guia por WhatsApp"
                      aria-busy={isSharing}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                        channelConfig.WHATSAPP.color,
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                    >
                      {isSharing ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <MessageCircle className="h-6 w-6" />
                      )}
                      <span className="text-sm font-medium">
                        {isSharing ? 'Enviando...' : channelConfig.WHATSAPP.label}
                      </span>
                      <span className="text-center text-[10px] leading-tight opacity-80">
                        {isSharing ? 'Abrindo o envio' : channelConfig.WHATSAPP.description}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEmail}
                      disabled={isSharing}
                      aria-label="Enviar guia por e-mail"
                      aria-busy={isSharing}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                        channelConfig.EMAIL.color,
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                    >
                      {isSharing ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Mail className="h-6 w-6" />
                      )}
                      <span className="text-sm font-medium">
                        {isSharing ? 'Enviando...' : channelConfig.EMAIL.label}
                      </span>
                      <span className="text-center text-[10px] leading-tight opacity-80">
                        {isSharing ? 'Abrindo o envio' : channelConfig.EMAIL.description}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      aria-label="Copiar link publico do guia"
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                        channelConfig.LINK.color,
                      )}
                    >
                      {copied ? <Check className="h-6 w-6" /> : <LinkIcon className="h-6 w-6" />}
                      <span className="text-sm font-medium">{copied ? 'Copiado!' : 'Link'}</span>
                      <span className="text-center text-[10px] leading-tight opacity-80">
                        {channelConfig.LINK.description}
                      </span>
                    </button>

                    <Dialog>
                      <DialogTrigger
                        aria-label="Abrir QR Code do guia"
                        className={cn(
                          'flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                          channelConfig.QR.color,
                        )}
                      >
                        <QrCode className="h-6 w-6" />
                        <span className="text-sm font-medium">{channelConfig.QR.label}</span>
                        <span className="text-center text-[10px] leading-tight opacity-80">
                          {channelConfig.QR.description}
                        </span>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>QR Code do guia</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                          <div ref={qrCodeRef} className="rounded-xl border bg-white p-4">
                            <QRCode value={guideUrl} size={240} />
                          </div>
                          <p className="max-w-xs break-all text-center text-sm text-muted-foreground">
                            {guideUrl}
                          </p>
                          <div className="flex w-full flex-col gap-2 sm:flex-row">
                            <Button
                              variant="outline"
                              onClick={handleCopyLink}
                              className="gap-2 sm:flex-1"
                            >
                              <Copy className="h-4 w-4" />
                              Copiar link
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCopyQr}
                              className="gap-2 sm:flex-1"
                            >
                              <ImageIcon className="h-4 w-4" />
                              Copiar QR
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleDownloadQr}
                              className="gap-2 sm:flex-1"
                            >
                              <Download className="h-4 w-4" />
                              Baixar SVG
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <div className="space-y-6 xl:col-span-1">
                <Card className="border-primary/20 shadow-card">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-base">Preview da mensagem</CardTitle>
                        <CardDescription>Veja como o hospede recebera</CardDescription>
                      </div>
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 rounded-2xl border bg-slate-50 p-4">
                      <div className="mx-auto max-w-xs">
                        <div className="rounded-3xl border-4 border-slate-200 bg-white p-4 shadow-sm">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 border-b pb-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                <MessageCircle className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs font-medium">Guia do imovel</p>
                                <p className="text-[10px] text-muted-foreground">Agora</p>
                              </div>
                            </div>
                            <div className="whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-green-50 p-3 text-sm leading-relaxed">
                              {generatedMessage}
                            </div>
                            {guideUrl ? (
                              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                                <div className="mb-1 flex items-center gap-2">
                                  <Globe className="h-3.5 w-3.5 text-primary" />
                                  <span className="text-xs font-medium text-primary">
                                    Link do guia
                                  </span>
                                </div>
                                <p className="break-all text-xs text-muted-foreground">{guideUrl}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-1 h-auto px-2 py-1 text-xs text-primary"
                                  onClick={handleCopyLink}
                                >
                                  <Copy className="mr-1 h-3 w-3" />
                                  Copiar
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="space-y-3 p-4">
                    <h3 className="text-sm font-medium">Informacoes do guia</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div className="rounded-lg bg-muted p-3">
                        <p className="mb-1 text-xs text-muted-foreground">Slug</p>
                        <p className="truncate font-mono text-xs">
                          {selectedProperty.guide?.slug || '-'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="mb-1 text-xs text-muted-foreground">Status</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Publicado</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => window.open(guideUrl, '_blank')}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver publico
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={handleCopyLink}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copiar link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6 xl:col-span-1">
                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Historico de envios</CardTitle>
                    <CardDescription>Ultimos compartilhamentos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Select
                        value={filterChannel}
                        onValueChange={(value) => setFilterChannel(value || ALL_FILTER)}
                      >
                        <SelectTrigger
                          id={historyChannelId}
                          className="h-8 text-xs"
                          aria-label="Filtrar historico por canal"
                        >
                          <SelectValue placeholder="Canal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL_FILTER}>Todos</SelectItem>
                          <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                          <SelectItem value="EMAIL">E-mail</SelectItem>
                          <SelectItem value="LINK">Link</SelectItem>
                          <SelectItem value="QR">QR Code</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={filterProperty}
                        onValueChange={(value) => setFilterProperty(value || ALL_FILTER)}
                      >
                        <SelectTrigger
                          id={historyPropertyId}
                          className="h-8 text-xs"
                          aria-label="Filtrar historico por imovel"
                        >
                          <SelectValue placeholder="Imovel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL_FILTER}>Todos</SelectItem>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.name}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <p className="sr-only" role="status" aria-live="polite">
                      {filteredLogs.length} envio{filteredLogs.length === 1 ? '' : 's'} no historico
                      filtrado
                    </p>

                    <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
                      {filteredLogs.length === 0 ? (
                        <EmptyState
                          icon={Send}
                          title="Nenhum compartilhamento encontrado"
                          description="Envie um guia ou ajuste os filtros para visualizar melhor o historico recente."
                          className="border-none bg-transparent p-0 shadow-none sm:p-0"
                        />
                      ) : (
                        filteredLogs.map((item) => {
                          const config = channelConfig[item.channel as keyof typeof channelConfig]

                          return (
                            <div
                              key={item.id}
                              className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                            >
                              <div
                                className={cn(
                                  'mt-0.5 rounded-full p-1.5',
                                  config?.badge || 'bg-slate-600',
                                )}
                              >
                                {config ? <config.icon className="h-3 w-3 text-white" /> : null}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {item.guide.property.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {config?.label || item.channel} · {formatDate(item.sentAt)}
                                </p>
                                {item.recipient ? (
                                  <p className="truncate text-xs text-muted-foreground">
                                    {item.recipient}
                                  </p>
                                ) : null}
                              </div>
                              <Badge
                                variant={item.status === 'SENT' ? 'default' : 'outline'}
                                className="h-5 shrink-0 text-[10px]"
                              >
                                {item.status === 'SENT' ? 'Enviado' : item.status}
                              </Badge>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}

          {!selectedProperty ? (
            <DashboardSectionCard
              title="Selecione um imovel para continuar"
              description="Assim que voce escolher um guia publicado, a tela libera configuracao, preview e historico no mesmo fluxo visual."
            >
              <EmptyState
                icon={Share2}
                title="Nenhum guia selecionado ainda"
                description="Escolha um imovel publicado para abrir o preview da mensagem e usar os canais disponiveis."
                actionLabel="Selecionar primeiro guia"
                onAction={() => setSelectedPropertyId(properties[0]?.id || '')}
              />
            </DashboardSectionCard>
          ) : null}
        </>
      )}
    </div>
  )
}
