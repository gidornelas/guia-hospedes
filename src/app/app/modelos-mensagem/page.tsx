import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

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

export default async function MessageTemplatesPage() {
  const templates = await getMessageTemplates()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modelos de Mensagem"
        description="Crie e gerencie templates para compartilhamento de guias"
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </PageHeader>

      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar templates..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <p>Nenhum template criado ainda</p>
              </div>
            ) : (
              templates.map((template: { id: string; name: string; type: string; subject: string | null; body: string; variables: string }) => (
                <div
                  key={template.id}
                  className="rounded-xl border border-border p-5 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[template.type] || template.type}
                        </Badge>
                      </div>
                      {template.subject && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Assunto: {template.subject}
                        </p>
                      )}
                      <div className="rounded-lg bg-muted p-3 mt-3">
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {template.body}
                        </p>
                      </div>
                      {(() => {
                        try {
                          const vars = JSON.parse(template.variables)
                          if (Array.isArray(vars) && vars.length > 0) {
                            return (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {vars.map((v: string) => (
                                  <span
                                    key={v}
                                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                                  >
                                    {'{{'}{v}{'}}'}
                                  </span>
                                ))}
                              </div>
                            )
                          }
                        } catch {}
                        return null
                      })()}
                    </div>
                    <div className="flex gap-1 ml-4">
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
