'use client'

import { useState, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Copy,
  MessageCircle,
  Mail,
  Link as LinkIcon,
  QrCode,
  Check,
  Loader2,
  Smartphone,
  Globe,
  AlertTriangle,
  ExternalLink,
  Send,
  Filter,
  Eye,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import { shareGuide } from '@/app/actions/share-guide'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { TEMPLATE_TYPES } from '@/lib/constants'
import { copyQrSvg, downloadQrSvg } from '@/lib/qr-code'

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

const channelConfig = {
  WHATSAPP: {
    label: 'WhatsApp',
    description: 'Envio rápido direto no celular do hóspede',
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
    label: 'Link Direto',
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
}

export default function SharingClient({ properties, templates, initialLogs, appUrl }: SharingClientProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestContact, setGuestContact] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [logs, setLogs] = useState<ShareLog[]>(initialLogs)
  const [filterChannel, setFilterChannel] = useState('')
  const [filterProperty, setFilterProperty] = useState('')
  const qrCodeRef = useRef<HTMLDivElement | null>(null)

  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === selectedPropertyId),
    [selectedPropertyId, properties]
  )

  const guideUrl = useMemo(() => {
    if (!selectedProperty?.guide) return ''
    return `${appUrl}/g/${selectedProperty.guide.slug.replace('guia-', '')}`
  }, [selectedProperty, appUrl])

  const guideStatus = selectedProperty?.guide?.status
  const isPublished = guideStatus === 'PUBLISHED'

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId),
    [selectedTemplateId, templates]
  )

  const generatedMessage = useMemo(() => {
    let msg = customMessage
    if (!msg && selectedTemplate) {
      msg = selectedTemplate.body
    }
    if (!msg) {
      msg = 'Olá {{guestName}}! Seja bem-vindo(a) ao nosso espaço. Aqui está o guia com todas as informações do imóvel: {{guideLink}}'
    }
    return msg
      .replace(/\{\{guestName\}\}/g, guestName || 'hóspede')
      .replace(/\{\{propertyName\}\}/g, selectedProperty?.name || '')
      .replace(/\{\{guideLink\}\}/g, guideUrl)
  }, [customMessage, selectedTemplate, guestName, selectedProperty, guideUrl])

  const handleCopyLink = async () => {
    if (!guideUrl) return
    await navigator.clipboard.writeText(guideUrl)
    setCopied(true)
    toast.success('Link copiado para a área de transferência!')
    setTimeout(() => setCopied(false), 2000)
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

    downloadQrSvg(svg, `qr-guia-${selectedProperty.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`)
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
      toast.error('Selecione um imóvel com guia publicado')
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
      toast.success('Compartilhamento registrado!')
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          channel: 'WHATSAPP',
          recipient: guestContact,
          sentAt: new Date().toISOString(),
          status: 'SENT',
          guide: { property: { name: selectedProperty.name } },
        },
        ...prev,
      ])

      const waMessage = encodeURIComponent(generatedMessage)
      const waUrl = phone
        ? `https://wa.me/${phone}?text=${waMessage}`
        : `https://wa.me/?text=${waMessage}`
      window.open(waUrl, '_blank')
    } else {
      toast.error(result.error || 'Erro ao compartilhar')
    }

    setIsSharing(false)
  }

  const handleEmail = async () => {
    if (!guideUrl || !selectedProperty?.guide) {
      toast.error('Selecione um imóvel com guia publicado')
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
      toast.success('Compartilhamento registrado!')
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          channel: 'EMAIL',
          recipient: guestContact,
          sentAt: new Date().toISOString(),
          status: 'SENT',
          guide: { property: { name: selectedProperty.name } },
        },
        ...prev,
      ])

      const subject = encodeURIComponent(`Guia do imóvel - ${selectedProperty.name}`)
      const body = encodeURIComponent(generatedMessage)
      window.location.href = `mailto:${guestContact}?subject=${subject}&body=${body}`
    } else {
      toast.error(result.error || 'Erro ao compartilhar')
    }

    setIsSharing(false)
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesChannel = !filterChannel || log.channel === filterChannel
      const matchesProperty = !filterProperty || log.guide.property.name === filterProperty
      return matchesChannel && matchesProperty
    })
  }, [logs, filterChannel, filterProperty])

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="min-w-0 space-y-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight">Compartilhamento</h1>
        <p className="max-w-2xl text-muted-foreground">
          Envie guias aos hóspedes pelo canal ideal para cada situação
        </p>
      </div>

      {/* Property Selector */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Imóvel</label>
              <Select value={selectedPropertyId} onValueChange={(v) => setSelectedPropertyId(v || '')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha um imóvel..." />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedProperty && (
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Badge
                  variant={isPublished ? 'default' : 'destructive'}
                  className={cn(
                    isPublished ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                  )}
                >
                  {isPublished ? 'Publicado' : 'Não publicado'}
                </Badge>
                {isPublished && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    Público
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedProperty && !isPublished && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Guia não publicado</p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Este imóvel ainda não possui um guia público. Publique-o antes de compartilhar.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
                  onClick={() => window.open(`/app/imoveis/${selectedProperty.id}`, '_blank')}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Ir para o imóvel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedProperty && isPublished && (
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Left: Configuration */}
          <div className="space-y-6 xl:col-span-1">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Dados do Hóspede</CardTitle>
                <CardDescription>Personalize a mensagem antes de enviar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Modelo de Mensagem</label>
                  <Select value={selectedTemplateId} onValueChange={(v) => setSelectedTemplateId(v || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Padrão (sem template)</SelectItem>
                      {Object.entries(TEMPLATE_TYPES).map(([type, label]) => {
                        const typeTemplates = templates.filter((t) => t.type === type)
                        if (typeTemplates.length === 0) return null
                        return (
                          <div key={type}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              {label}
                            </div>
                            {typeTemplates.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </div>
                        )
                      })}
                      {templates.filter((t) => !t.type || !TEMPLATE_TYPES[t.type as keyof typeof TEMPLATE_TYPES]).length > 0 && (
                        <div>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Outros
                          </div>
                          {templates
                            .filter((t) => !t.type || !TEMPLATE_TYPES[t.type as keyof typeof TEMPLATE_TYPES])
                            .map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name}
                              </SelectItem>
                            ))}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nome do Hóspede</label>
                  <Input
                    placeholder="Ex: Maria Silva"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Telefone / E-mail</label>
                  <Input
                    placeholder="WhatsApp ou e-mail do hóspede"
                    value={guestContact}
                    onChange={(e) => setGuestContact(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Mensagem</label>
                  <Textarea
                    placeholder="Sua mensagem aqui... Use {{guestName}}, {{propertyName}} e {{guideLink}} como variáveis"
                    rows={5}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  />
                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Variáveis: {'{{guestName}}'}, {'{{propertyName}}'}, {'{{guideLink}}'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={handleCopyMessage}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar mensagem
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Channel Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Escolha o canal</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={handleWhatsApp}
                  disabled={isSharing}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                    channelConfig.WHATSAPP.color,
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-sm font-medium">WhatsApp</span>
                  <span className="text-[10px] opacity-80 text-center leading-tight">Mais usado</span>
                </button>
                <button
                  onClick={handleEmail}
                  disabled={isSharing}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                    channelConfig.EMAIL.color,
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <Mail className="h-6 w-6" />
                  <span className="text-sm font-medium">E-mail</span>
                  <span className="text-[10px] opacity-80 text-center leading-tight">Corporativo</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                    channelConfig.LINK.color
                  )}
                >
                  {copied ? <Check className="h-6 w-6" /> : <LinkIcon className="h-6 w-6" />}
                  <span className="text-sm font-medium">{copied ? 'Copiado!' : 'Link'}</span>
                  <span className="text-[10px] opacity-80 text-center leading-tight">Copiar URL</span>
                </button>
                <Dialog>
                  <DialogTrigger>
                    <div
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all cursor-pointer',
                        channelConfig.QR.color
                      )}
                    >
                      <QrCode className="h-6 w-6" />
                      <span className="text-sm font-medium">QR Code</span>
                      <span className="text-[10px] opacity-80 text-center leading-tight">Visualizar</span>
                    </div>
                  </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>QR Code do Guia</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4 py-4">
                      <div ref={qrCodeRef} className="rounded-xl border p-4 bg-white">
                        <QRCode value={guideUrl} size={240} />
                      </div>
                      <p className="text-sm text-muted-foreground text-center break-all max-w-xs">
                        {guideUrl}
                      </p>
                      <div className="flex w-full flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={handleCopyLink} className="gap-2 sm:flex-1">
                          <Copy className="h-4 w-4" />
                          Copiar link
                        </Button>
                        <Button variant="outline" onClick={handleCopyQr} className="gap-2 sm:flex-1">
                          <ImageIcon className="h-4 w-4" />
                          Copiar QR
                        </Button>
                        <Button variant="outline" onClick={handleDownloadQr} className="gap-2 sm:flex-1">
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

          {/* Center: Preview */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-card border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">Preview da Mensagem</CardTitle>
                    <CardDescription>Veja como o hóspede receberá</CardDescription>
                  </div>
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl bg-slate-50 border p-4 space-y-3">
                  {/* Phone mockup */}
                  <div className="mx-auto max-w-xs">
                    <div className="rounded-3xl border-4 border-slate-200 bg-white p-4 shadow-sm">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b pb-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">Guia do Imóvel</p>
                            <p className="text-[10px] text-muted-foreground">Agora</p>
                          </div>
                        </div>
                        <div className="rounded-2xl rounded-tl-sm bg-green-50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                          {generatedMessage}
                        </div>
                        {guideUrl && (
                          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Globe className="h-3.5 w-3.5 text-primary" />
                              <span className="text-xs font-medium text-primary">Link do Guia</span>
                            </div>
                            <p className="text-xs text-muted-foreground break-all">{guideUrl}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto py-1 px-2 mt-1 text-xs text-primary"
                              onClick={handleCopyLink}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copiar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="shadow-card">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-medium">Informações do Guia</h3>
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Slug</p>
                    <p className="font-mono text-xs truncate">{selectedProperty.guide?.slug || '-'}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
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
                    Ver público
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

          {/* Right: History */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Histórico de Envios</CardTitle>
                <CardDescription>Últimos compartilhamentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Select value={filterChannel} onValueChange={(v) => setFilterChannel(v || '')}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="EMAIL">E-mail</SelectItem>
                      <SelectItem value="LINK">Link</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterProperty} onValueChange={(v) => setFilterProperty(v || '')}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.name}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <Send className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum compartilhamento encontrado
                      </p>
                    </div>
                  ) : (
                    filteredLogs.map((item) => {
                      const config = channelConfig[item.channel as keyof typeof channelConfig]
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className={cn('mt-0.5 rounded-full p-1.5', config?.badge || 'bg-slate-600')}>
                            {config && <config.icon className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.guide.property.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {config?.label || item.channel} • {formatDate(item.sentAt)}
                            </p>
                            {item.recipient && (
                              <p className="text-xs text-muted-foreground truncate">{item.recipient}</p>
                            )}
                          </div>
                          <Badge
                            variant={item.status === 'SENT' ? 'default' : 'outline'}
                            className="text-[10px] h-5 shrink-0"
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
      )}
    </div>
  )
}
