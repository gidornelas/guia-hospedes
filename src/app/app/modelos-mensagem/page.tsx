import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import {
  Edit,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'

async function getMessageTemplates() {
  return db.messageTemplate.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

const typeLabels: Record<string, string> = {
  WELCOME: 'Boas-vindas',
  PRE_CHECKIN: 'Pré-check-in',
  DURING_STAY: 'Durante Estadia',
  POST_CHECKOUT: 'Pós-check-out',
  CUSTOM: 'Personalizado',
}

const typeDescriptions: Record<string, string> = {
  WELCOME: 'Ótimo para enviar o guia logo após a confirmação.',
  PRE_CHECKIN: 'Ideal para lembrar horários, acesso e orientações finais.',
  DURING_STAY: 'Útil para mensagens curtas durante a estadia.',
  POST_CHECKOUT: 'Funciona bem para fechamento e pedido de avaliação.',
  CUSTOM: 'Use para fluxos próprios da operação.',
}

export default async function MessageTemplatesPage() {
  const templates = await getMessageTemplates()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comunicação"
        title="Modelos de Mensagem"
        description="Crie e gerencie templates para compartilhamento de guias, mantendo consistência nos principais momentos da jornada do hóspede."
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
        <Button className="w-full gap-2 sm:w-auto">
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
                Padronize o tom da operação e reduza retrabalho no envio de guias.
              </p>
            </div>
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar templates..." className="pl-9" />
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
                <p className="font-medium text-brand-900">Próximo melhor passo</p>
                <p className="text-sm text-brand-800">
                  Garanta pelo menos um modelo de boas-vindas e um de pré-check-in
                  para deixar o compartilhamento pronto sem edição manual.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Templates disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="Nenhum template criado ainda"
                description="Monte sua biblioteca de mensagens para acelerar compartilhamentos e manter o tom da marca consistente."
                hint="Comece pelos momentos mais recorrentes"
                actionLabel="Criar primeiro template"
                actionHref="/app/modelos-mensagem"
              />
            ) : (
              templates.map((template) => (
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
                              <p className="text-sm text-foreground">
                                {template.subject}
                              </p>
                            </div>
                          )}

                          <div className="rounded-xl bg-muted p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                              Prévia da mensagem
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
                                'Template flexível para adaptar à operação.'}
                            </p>
                          </div>

                          {(() => {
                            try {
                              const vars = JSON.parse(template.variables)
                              if (Array.isArray(vars) && vars.length > 0) {
                                return (
                                  <div className="rounded-xl border border-border bg-background p-4">
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                      Variáveis disponíveis
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {vars.map((v: string) => (
                                        <span
                                          key={v}
                                          className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                                        >
                                          {'{{'}
                                          {v}
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
                                  Variáveis disponíveis
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Este template ainda não usa placeholders dinâmicos.
                                </p>
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="ml-0 flex gap-2 self-end lg:ml-4 lg:self-start">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
    </div>
  )
}
