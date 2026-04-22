'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { TemplateFormDialog } from '@/components/shared/template-form-dialog'
import { deleteMessageTemplate } from '@/app/actions/message-templates'
import { toast } from 'sonner'
import {
  Edit,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Loader2,
} from 'lucide-react'

interface MessageTemplate {
  id: string
  name: string
  type: string
  subject: string | null
  body: string
  variables: string
  createdAt: Date
}

interface TemplatesClientProps {
  templates: MessageTemplate[]
}

const typeLabels: Record<string, string> = {
  WELCOME: 'Boas-vindas',
  PRE_CHECKIN: 'Pre-check-in',
  DURING_STAY: 'Durante a estadia',
  POST_CHECKOUT: 'Pos-check-out',
  CUSTOM: 'Personalizado',
}

const typeDescriptions: Record<string, string> = {
  WELCOME: 'Otimo para enviar o guia logo apos a confirmacao.',
  PRE_CHECKIN: 'Ideal para lembrar horarios, acesso e orientacoes finais.',
  DURING_STAY: 'Util para mensagens curtas durante a estadia.',
  POST_CHECKOUT: 'Funciona bem para fechamento e pedido de avaliacao.',
  CUSTOM: 'Use para fluxos proprios da operacao.',
}

export default function TemplatesClient({ templates }: TemplatesClientProps) {
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<MessageTemplate | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase()) ||
    template.body.toLowerCase().includes(search.toLowerCase()) ||
    (typeLabels[template.type] || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (template: MessageTemplate) => {
    setEditingTemplate(template)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingTemplate(null)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingTemplate) return
    setIsDeleting(true)

    const result = await deleteMessageTemplate(deletingTemplate.id)

    if (result.success) {
      toast.success('Template excluido')
      setDeletingTemplate(null)
    } else {
      toast.error(result.error || 'Erro ao excluir')
    }

    setIsDeleting(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comunicacao"
        title="Modelos de mensagem"
        description="Crie e gerencie templates para compartilhamento de guias, mantendo consistencia nos principais momentos da jornada do hospede."
        meta={
          <>
            <Badge className="bg-brand-100 text-brand-700 hover:bg-brand-100">
              {templates.length} modelos
            </Badge>
            <Badge variant="outline" className="bg-background">
              Fluxo centralizado
            </Badge>
          </>
        }
      >
        <Button className="w-full gap-2 sm:w-auto" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Novo template
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="shadow-card">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Biblioteca de mensagens
              </p>
              <p className="text-sm text-muted-foreground">
                Padronize o tom da operacao e reduza retrabalho no envio de guias.
              </p>
            </div>
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-200 bg-brand-50/40 shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-brand-900">Proximo melhor passo</p>
                <p className="text-sm text-brand-800">
                  Garanta pelo menos um modelo de boas-vindas e um de pre-check-in
                  para deixar o compartilhamento pronto sem edicao manual.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Templates disponiveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTemplates.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title={search ? 'Nenhum template encontrado' : 'Nenhum template criado ainda'}
                description={
                  search
                    ? 'Tente ajustar os termos de busca.'
                    : 'Monte sua biblioteca de mensagens para acelerar compartilhamentos e manter o tom da marca consistente.'
                }
                hint={search ? undefined : 'Comece pelos momentos mais recorrentes'}
              />
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-2xl border border-border p-5 transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[template.type] || template.type}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                        <div className="space-y-3">
                          {template.subject && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                Assunto
                              </p>
                              <p className="text-sm text-foreground">{template.subject}</p>
                            </div>
                          )}

                          <div className="rounded-xl bg-muted p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                              Previa da mensagem
                            </p>
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                              {template.body}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="rounded-xl border border-border bg-background p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                              Melhor uso
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {typeDescriptions[template.type] ||
                                'Template flexivel para adaptar a operacao.'}
                            </p>
                          </div>

                          {(() => {
                            try {
                              const vars = JSON.parse(template.variables)
                              if (Array.isArray(vars) && vars.length > 0) {
                                return (
                                  <div className="rounded-xl border border-border bg-background p-4">
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                      Variaveis disponiveis
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {vars.map((variable: string) => (
                                        <span
                                          key={variable}
                                          className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                                        >
                                          {'{{'}
                                          {variable}
                                          {'}}'}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )
                              }
                            } catch {}

                            return (
                              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                  Variaveis disponiveis
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Este template ainda nao usa placeholders dinamicos.
                                </p>
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="ml-0 flex gap-2 self-end lg:ml-4 lg:self-start">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletingTemplate(template)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <TemplateFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        template={editingTemplate}
        onSuccess={() => {
          window.location.reload()
        }}
      />

      <Dialog
        open={!!deletingTemplate}
        onOpenChange={(open) => !open && setDeletingTemplate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir template</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o template &quot;{deletingTemplate?.name}&quot;?
              Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingTemplate(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
