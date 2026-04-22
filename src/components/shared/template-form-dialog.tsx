'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createMessageTemplate,
  updateMessageTemplate,
} from '@/app/actions/message-templates'
import { TEMPLATE_TYPES } from '@/lib/constants'
import { toast } from 'sonner'
import { Loader2, MessageCircle, Eye } from 'lucide-react'

interface MessageTemplate {
  id?: string
  name: string
  type: string
  subject: string | null
  body: string
  variables: string
}

interface TemplateFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: MessageTemplate | null
  onSuccess?: () => void
}

const DEFAULT_VARIABLES = ['guestName', 'propertyName', 'guideLink']

export function TemplateFormDialog({
  open,
  onOpenChange,
  template,
  onSuccess,
}: TemplateFormDialogProps) {
  const isEditing = !!template?.id

  const [name, setName] = useState(template?.name || '')
  const [type, setType] = useState(template?.type || 'CUSTOM')
  const [subject, setSubject] = useState(template?.subject || '')
  const [body, setBody] = useState(template?.body || '')
  const [selectedVars, setSelectedVars] = useState<string[]>(() => {
    try {
      if (template?.variables) {
        const parsed = JSON.parse(template.variables)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
    return []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const previewBody = useMemo(() => {
    return body
      .replace(/\{\{guestName\}\}/g, 'Maria Silva')
      .replace(/\{\{propertyName\}\}/g, 'Flat Elegance Paulista')
      .replace(/\{\{guideLink\}\}/g, 'https://guiahospedes.com/g/flat-elegance')
  }, [body])

  const toggleVariable = (variable: string) => {
    setSelectedVars((prev) =>
      prev.includes(variable)
        ? prev.filter((v) => v !== variable)
        : [...prev, variable]
    )
  }

  const insertVariable = (variable: string) => {
    const varText = `{{${variable}}}`
    const textarea = document.getElementById('template-body') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newBody = body.slice(0, start) + varText + body.slice(end)
      setBody(newBody)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + varText.length, start + varText.length)
      }, 0)
    } else {
      setBody((prev) => prev + ' ' + varText)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !body.trim()) {
      toast.error('Preencha o nome e o corpo da mensagem')
      return
    }

    setIsSubmitting(true)

    const input = {
      name: name.trim(),
      type,
      subject: subject.trim() || undefined,
      body: body.trim(),
      variables: selectedVars,
    }

    const result = isEditing && template?.id
      ? await updateMessageTemplate({ ...input, id: template.id })
      : await createMessageTemplate(input)

    if (result.success) {
      toast.success(isEditing ? 'Template atualizado!' : 'Template criado!')
      onSuccess?.()
      onOpenChange(false)
      if (!isEditing) {
        setName('')
        setType('CUSTOM')
        setSubject('')
        setBody('')
        setSelectedVars([])
      }
    } else {
      toast.error(result.error || 'Erro ao salvar template')
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Template' : 'Novo Template de Mensagem'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template-name">Nome do template</Label>
              <Input
                id="template-name"
                placeholder="Ex: Boas-vindas padrão"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-type">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v || 'CUSTOM')}>
                <SelectTrigger id="template-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TEMPLATE_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-subject">Assunto (opcional)</Label>
            <Input
              id="template-subject"
              placeholder="Ex: Seu guia de boas-vindas chegou"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Usado apenas quando o canal de envio for e-mail.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="template-body">Corpo da mensagem</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-3 w-3 mr-1" />
                {showPreview ? 'Ocultar preview' : 'Ver preview'}
              </Button>
            </div>
            <Textarea
              id="template-body"
              rows={6}
              placeholder="Escreva a mensagem aqui..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Clique para inserir variável:
              </p>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_VARIABLES.map((variable) => (
                  <button
                    key={variable}
                    onClick={() => insertVariable(variable)}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
                  >
                    {'{{'}
                    {variable}
                    {'}}'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {showPreview && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-primary">Preview</p>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {previewBody}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Variáveis utilizadas neste template:
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_VARIABLES.map((variable) => {
                const isSelected = selectedVars.includes(variable)
                return (
                  <button
                    key={variable}
                    onClick={() => toggleVariable(variable)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors border ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {'{{'}
                    {variable}
                    {'}}'}
                    {isSelected && ' ✓'}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Marque as variáveis que este template utiliza. Isso ajuda na organização e validação.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isEditing ? 'Salvar alterações' : 'Criar template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
