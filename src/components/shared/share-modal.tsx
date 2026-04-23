'use client'

import { useState, useMemo, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Copy,
  MessageCircle,
  Mail,
  Link as LinkIcon,
  QrCode,
  Check,
  Loader2,
  Globe,
  AlertTriangle,
  ExternalLink,
  Share2,
  Smartphone,
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

interface MessageTemplate {
  id: string
  name: string
  body: string
  type: string
}

interface ShareModalProps {
  propertyId: string
  propertyName: string
  guideId?: string | null
  guideSlug?: string | null
  guideStatus?: string | null
  appUrl: string
  templates: MessageTemplate[]
  trigger?: React.ReactNode
  onShare?: () => void
}

const channelConfig = {
  WHATSAPP: {
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  },
  EMAIL: {
    label: 'E-mail',
    icon: Mail,
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  },
  LINK: {
    label: 'Link Direto',
    icon: LinkIcon,
    color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
  },
  QR: {
    label: 'QR Code',
    icon: QrCode,
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  },
}

export function ShareModal({
  propertyId,
  propertyName,
  guideId,
  guideSlug,
  guideStatus,
  appUrl,
  templates,
  trigger,
  onShare,
}: ShareModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestContact, setGuestContact] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const qrCodeRef = useRef<HTMLDivElement | null>(null)

  const isPublished = guideStatus === 'PUBLISHED'
  const guideUrl = useMemo(() => {
    if (!guideSlug) return ''
    return `${appUrl}/g/${guideSlug.replace('guia-', '')}`
  }, [guideSlug, appUrl])

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
      .replace(/\{\{propertyName\}\}/g, propertyName || '')
      .replace(/\{\{guideLink\}\}/g, guideUrl)
  }, [customMessage, selectedTemplate, guestName, propertyName, guideUrl])

  const handleCopyLink = async () => {
    if (!guideUrl) return
    await navigator.clipboard.writeText(guideUrl)
    setCopied(true)
    toast.success('Link copiado para a área de transferência!')
    setTimeout(() => setCopied(false), 2000)
    if (guideId) {
      await shareGuide({ guideId, channel: 'LINK', message: guideUrl })
      onShare?.()
    }
  }

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(generatedMessage)
    toast.success('Mensagem copiada!')
  }

  const registerQrShare = async () => {
    if (!guideId) return

    await shareGuide({ guideId, channel: 'QR', message: guideUrl })
    onShare?.()
  }

  const handleDownloadQr = async () => {
    const svg = qrCodeRef.current?.querySelector('svg')

    if (!svg) {
      toast.error('QR Code indisponivel no momento')
      return
    }

    downloadQrSvg(svg, `qr-guia-${propertyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`)
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
      toast.error('Seu navegador não suporta copiar imagem do QR diretamente')
    }
  }

  const handleWhatsApp = async () => {
    if (!guideUrl || !guideId) {
      toast.error('Guia não disponível para compartilhar')
      return
    }

    setIsSharing(true)

    const phone = guestContact.replace(/\D/g, '')

    const result = await shareGuide({
      guideId,
      channel: 'WHATSAPP',
      recipient: guestContact || undefined,
      message: generatedMessage,
    })

    if (result.success) {
      toast.success('Compartilhamento registrado!')
      onShare?.()

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
    if (!guideUrl || !guideId) {
      toast.error('Guia não disponível para compartilhar')
      return
    }

    setIsSharing(true)

    const result = await shareGuide({
      guideId,
      channel: 'EMAIL',
      recipient: guestContact || undefined,
      message: generatedMessage,
    })

    if (result.success) {
      toast.success('Compartilhamento registrado!')
      onShare?.()

      const subject = encodeURIComponent(`Guia do imóvel - ${propertyName}`)
      const body = encodeURIComponent(generatedMessage)
      window.location.href = `mailto:${guestContact}?subject=${subject}&body=${body}`
    } else {
      toast.error(result.error || 'Erro ao compartilhar')
    }

    setIsSharing(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Compartilhar Guia
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Property Info */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">{propertyName}</p>
            <div className="mt-1 flex items-center gap-2">
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
          </div>

          {isPublished && guideUrl ? (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                </button>
                <button
                  onClick={() => setShowQr(!showQr)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                    channelConfig.QR.color
                  )}
                >
                  <QrCode className="h-6 w-6" />
                  <span className="text-sm font-medium">QR Code</span>
                </button>
              </div>

              {/* QR Code */}
              {showQr && (
                <div className="flex flex-col items-center gap-3 rounded-xl border p-4 bg-white">
                  <div ref={qrCodeRef} className="rounded-xl border p-4 bg-white">
                    <QRCode value={guideUrl} size={200} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center break-all max-w-sm">
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
              )}

              {/* Link Display */}
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Link público</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 px-2 text-xs"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground break-all font-mono">{guideUrl}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => window.open(guideUrl, '_blank')}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Abrir guia público
                </Button>
              </div>

              {/* Message Configuration */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-sm font-medium">Personalizar mensagem</h3>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Modelo</label>
                  <Select value={selectedTemplateId} onValueChange={(v) => setSelectedTemplateId(v || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Padrão</SelectItem>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                          {t.type && (
                            <span className="ml-1 text-muted-foreground">
                              ({TEMPLATE_TYPES[t.type as keyof typeof TEMPLATE_TYPES] || t.type})
                            </span>
                          )}
                        </SelectItem>
                      ))}
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
                  <label className="text-sm font-medium mb-1.5 block">Contato do Hóspede</label>
                  <Input
                    placeholder="WhatsApp ou e-mail"
                    value={guestContact}
                    onChange={(e) => setGuestContact(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Mensagem</label>
                  <Textarea
                    placeholder="Sua mensagem aqui... Use {{guestName}}, {{propertyName}} e {{guideLink}}"
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  />
                  <div className="mt-1.5 flex items-center justify-between">
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
              </div>

              {/* Message Preview */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Preview da mensagem</h3>
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </div>
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
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
                  onClick={() => window.open(`/app/imoveis/${propertyId}`, '_blank')}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Ir para o imóvel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
