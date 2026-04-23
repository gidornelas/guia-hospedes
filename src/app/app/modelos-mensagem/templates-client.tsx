'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
import { DashboardMetricCard } from '@/components/dashboard/dashboard-metric-card'
import { DashboardSectionCard } from '@/components/dashboard/dashboard-section-card'
import { deleteMessageTemplate } from '@/app/actions/message-templates'
import { toast } from 'sonner'
import {
  Edit,
  FileCode2,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Trash2,
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

function parseVariables(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function TemplatesClient({ templates }: TemplatesClientProps) {
  const searchInputId = 'message-templates-search'
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<MessageTemplate | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return templates

    return templates.filter((template) => {
      return (
        template.name.toLowerCase().includes(query) ||
        template.body.toLowerCase().includes(query) ||
        (typeLabels[template.type] || '').toLowerCase().includes(query)
      )
    })
  }, [search, templates])

  const metrics = useMemo(() => {
    const templatesWithVariables = templates.filter(
      (template) => parseVariables(template.variables).length > 0,
    ).length
    const recurringTemplates = templates.filter((template) =>
      ['WELCOME', 'PRE_CHECKIN', 'POST_CHECKOUT'].includes(template.type),
    ).length
    const customTemplates = templates.filter((template) => template.type === 'CUSTOM').length

    return [
      {
        title: 'Total de modelos',
        value: templates.length,
        hint: 'Biblioteca atual da operacao',
        icon: MessageSquare,
        tone: 'brand' as const,
      },
      {
        title: 'Com variaveis',
        value: templatesWithVariables,
        hint: 'Prontos para personalizacao automatica',
        icon: FileCode2,
        tone: 'blue' as const,
      },
      {
        title: 'Fluxos recorrentes',
        value: recurringTemplates,
        hint: 'Boas-vindas, pre-check-in e pos-check-out',
        icon: Sparkles,
        tone: 'emerald' as const,
      },
      {
        title: 'Customizados',
        value: customTemplates,
        hint: 'Templates livres para casos especiais',
        icon: Edit,
        tone: 'amber' as const,
      },
    ]
  }, [templates])

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
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
        title="Biblioteca de templates"
        description="Busque modelos, revise o melhor uso de cada mensagem e mantenha a operacao pronta para compartilhar sem retrabalho."
        action={
          <div className="relative w-full sm:w-[280px]">
            <label htmlFor={searchInputId} className="sr-only">
              Buscar templates por nome, conteudo ou tipo
            </label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={searchInputId}
              placeholder="Buscar templates..."
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar templates por nome, conteudo ou tipo"
            />
          </div>
        }
        contentClassName="space-y-4"
      >
        {templates.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Nenhum template criado ainda"
            description="Monte sua biblioteca de mensagens para acelerar compartilhamentos e manter o tom da marca consistente."
            hint="Comece pelos momentos mais recorrentes"
            actionLabel="Criar primeiro template"
            onAction={handleCreate}
          />
        ) : filteredTemplates.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum template encontrado"
            description="Tente ajustar os termos de busca para localizar um modelo da biblioteca."
            actionLabel="Limpar busca"
            onAction={() => setSearch('')}
          />
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
                {filteredTemplates.length} resultado
                {filteredTemplates.length === 1 ? '' : 's'} no recorte atual
              </p>
              <Badge variant="outline" className="bg-background">
                {templates.length} template{templates.length === 1 ? '' : 's'} no total
              </Badge>
            </div>

            <div className="space-y-3">
              {filteredTemplates.map((template) => {
                const variables = parseVariables(template.variables)

                return (
                  <Card
                    key={template.id}
                    className="shadow-card transition-shadow hover:shadow-card-hover"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {typeLabels[template.type] || template.type}
                            </Badge>
                            {variables.length > 0 ? (
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                {variables.length} variavel{variables.length === 1 ? '' : 'eis'}
                              </Badge>
                            ) : null}
                          </div>

                          <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                            <div className="space-y-3">
                              {template.subject ? (
                                <div className="space-y-1">
                                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Assunto
                                  </p>
                                  <p className="text-sm text-foreground">{template.subject}</p>
                                </div>
                              ) : null}

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

                              {variables.length > 0 ? (
                                <div className="rounded-xl border border-border bg-background p-4">
                                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Variaveis disponiveis
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {variables.map((variable) => (
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
                              ) : (
                                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
                                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Variaveis disponiveis
                                  </p>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Este template ainda nao usa placeholders dinamicos.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="ml-0 flex gap-2 self-end lg:ml-4 lg:self-start">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(template)}
                            aria-label={`Editar template ${template.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingTemplate(template)}
                            aria-label={`Excluir template ${template.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </DashboardSectionCard>

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
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
