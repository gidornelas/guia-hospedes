'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Save,
  Loader2,
  AlertTriangle,
  Shield,
  Globe,
  Palette,
  Mail,
  Smartphone,
  Bell,
  Signature,
  Sparkles,
  Check,
  Eye,
} from 'lucide-react'
import { updateOrganization } from '@/app/actions/update-organization'
import { PageHeader } from '@/components/shared/page-header'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Organization {
  id: string
  name: string
  slug: string
  domain: string | null
  brandSettings: any
}

interface SettingsClientProps {
  organization: Organization
}

const colorPresets = [
  { name: 'Rosa Vinho', value: '#B6465F' },
  { name: 'Verde Esmeralda', value: '#059669' },
  { name: 'Azul Royal', value: '#2563EB' },
  { name: 'Roxo', value: '#7C3AED' },
  { name: 'Laranja', value: '#EA580C' },
  { name: 'Slate', value: '#475569' },
]

export default function SettingsClient({ organization }: SettingsClientProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('perfil')
  const [formData, setFormData] = useState({
    name: organization.name || '',
    slug: organization.slug || '',
    domain: organization.domain || '',
    phone: '',
    managerName: '',
    email: '',
    whatsapp: '',
    primaryColor: '#B6465F',
    notificationsEnabled: true,
    signatureEnabled: true,
    autoWelcome: false,
    darkMode: false,
  })

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateOrganization({
        id: organization.id,
        name: formData.name,
        slug: formData.slug,
        domain: formData.domain || null,
      })

      if (result.success) {
        toast.success('Configurações salvas com sucesso!')
      } else {
        toast.error(result.error || 'Erro ao salvar')
      }
    } catch {
      toast.error('Erro inesperado ao salvar')
    } finally {
      setIsSaving(false)
    }
  }

  const hasDomain = !!formData.domain
  const hasEmail = !!formData.email
  const hasWhatsApp = !!formData.whatsapp
  const brandConfigured = !!formData.name && !!formData.primaryColor

  const settingsSummary = [
    {
      label: 'Domínio',
      value: hasDomain ? 'Configurado' : 'Pendente',
      hint: hasDomain ? formData.domain : 'Use um domínio próprio para mais confiança',
      tone: hasDomain ? 'emerald' : 'amber',
      icon: Globe,
    },
    {
      label: 'E-mail',
      value: hasEmail ? 'Ativo' : 'Pendente',
      hint: hasEmail ? formData.email : 'Necessário para envio por e-mail',
      tone: hasEmail ? 'emerald' : 'amber',
      icon: Mail,
    },
    {
      label: 'WhatsApp',
      value: hasWhatsApp ? 'Ativo' : 'Pendente',
      hint: hasWhatsApp ? formData.whatsapp : 'Necessário para contato rápido',
      tone: hasWhatsApp ? 'emerald' : 'amber',
      icon: Smartphone,
    },
    {
      label: 'Marca',
      value: brandConfigured ? 'Pronta' : 'Em ajuste',
      hint: brandConfigured ? formData.primaryColor : 'Defina cor e nome da operação',
      tone: brandConfigured ? 'brand' : 'slate',
      icon: Palette,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Configurações"
        description="Gerencie identidade, domínio, mensagens e canais críticos da sua operação em um só lugar."
        meta={
          <>
            <Badge variant="outline" className="bg-background">
              {organization.slug}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                hasDomain
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700',
              )}
            >
              {hasDomain ? 'Domínio configurado' : 'Domínio pendente'}
            </Badge>
          </>
        }
        children={
          <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar alterações
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {settingsSummary.map((item) => {
          const toneClasses =
            item.tone === 'emerald'
              ? 'bg-emerald-100 text-emerald-700'
              : item.tone === 'amber'
                ? 'bg-amber-100 text-amber-700'
                : item.tone === 'brand'
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-slate-100 text-slate-700'

          return (
            <Card key={item.label} className="shadow-card">
              <CardContent className="flex items-start gap-3 p-5">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    toneClasses,
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.hint}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-muted lg:w-fit">
          <TabsTrigger value="perfil">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="marca">
            <Palette className="h-3.5 w-3.5 mr-1.5" />
            Marca
          </TabsTrigger>
          <TabsTrigger value="dominio">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            Domínio
          </TabsTrigger>
          <TabsTrigger value="mensagens">
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Mensagens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Informações da Empresa</CardTitle>
                  <CardDescription>Dados básicos da sua operação</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da Empresa *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="GuiaHóspedes"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nome do Gestor</Label>
                      <Input
                        value={formData.managerName}
                        onChange={(e) => updateField('managerName', e.target.value)}
                        placeholder="João Silva"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="(11) 98765-4321"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="joao@guiahospedes.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp Principal</Label>
                      <Input
                        value={formData.whatsapp}
                        onChange={(e) => updateField('whatsapp', e.target.value)}
                        placeholder="5511987654321"
                      />
                    </div>
                  </div>
                  <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card border-amber-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <CardTitle className="text-base text-amber-800">Dependências</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className={cn('rounded-lg p-3', hasEmail ? 'bg-emerald-50' : 'bg-amber-50')}>
                    <div className="flex items-center gap-2">
                      <Mail className={cn('h-4 w-4', hasEmail ? 'text-emerald-600' : 'text-amber-600')} />
                      <span className={cn('text-sm font-medium', hasEmail ? 'text-emerald-800' : 'text-amber-800')}>
                        E-mail
                      </span>
                      {hasEmail && <Check className="h-3.5 w-3.5 text-emerald-600 ml-auto" />}
                    </div>
                    <p className={cn('text-xs mt-1', hasEmail ? 'text-emerald-700' : 'text-amber-700')}>
                      {hasEmail ? 'Configurado. Os hóspedes podem receber guias por e-mail.' : 'Necessário para envio de guias por e-mail.'}
                    </p>
                  </div>
                  <div className={cn('rounded-lg p-3', hasWhatsApp ? 'bg-emerald-50' : 'bg-amber-50')}>
                    <div className="flex items-center gap-2">
                      <Smartphone className={cn('h-4 w-4', hasWhatsApp ? 'text-emerald-600' : 'text-amber-600')} />
                      <span className={cn('text-sm font-medium', hasWhatsApp ? 'text-emerald-800' : 'text-amber-800')}>
                        WhatsApp
                      </span>
                      {hasWhatsApp && <Check className="h-3.5 w-3.5 text-emerald-600 ml-auto" />}
                    </div>
                    <p className={cn('text-xs mt-1', hasWhatsApp ? 'text-emerald-700' : 'text-amber-700')}>
                      {hasWhatsApp ? 'Configurado. Os hóspedes podem contatar o anfitrião.' : 'Necessário para o botão de contato no guia público.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marca" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Identidade Visual</CardTitle>
                  <CardDescription>Personalize a aparência dos seus guias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Cor Primária</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => updateField('primaryColor', preset.value)}
                          className={cn(
                            'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
                            formData.primaryColor === preset.value
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-border hover:border-muted-foreground/30'
                          )}
                        >
                          <div
                            className="h-5 w-5 rounded-full border"
                            style={{ backgroundColor: preset.value }}
                          />
                          {preset.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                        className="w-32 font-mono text-sm"
                      />
                      <div
                        className="h-10 w-10 rounded-lg border shrink-0"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="rounded-lg border border-dashed border-border p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                      <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Arraste uma imagem ou clique para fazer upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou SVG. Máx. 2MB.</p>
                    </div>
                  </div>

                  <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Brand Preview */}
            <div className="space-y-6">
              <Card className="shadow-card border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Preview da Marca</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl bg-slate-50 border p-4 space-y-3">
                    {/* Mini guide preview */}
                    <div className="rounded-lg bg-white border shadow-sm p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${formData.primaryColor}20` }}
                        >
                          <Sparkles className="h-4 w-4" style={{ color: formData.primaryColor }} />
                        </div>
                        <div>
                          <p className="text-xs font-medium">{formData.name || 'Sua Empresa'}</p>
                          <p className="text-[10px] text-muted-foreground">Guia do Hóspede</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: `${formData.primaryColor}30`, width: '60%' }}
                        />
                        <div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: `${formData.primaryColor}20`, width: '80%' }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="h-8 flex-1 rounded-md"
                          style={{ backgroundColor: formData.primaryColor }}
                        />
                        <div className="h-8 flex-1 rounded-md bg-slate-100" />
                      </div>
                    </div>

                    <div className="rounded-lg bg-white border shadow-sm p-3">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Botões do guia</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: i === 1 ? `${formData.primaryColor}15` : '#f1f5f9' }}
                          >
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: i === 1 ? formData.primaryColor : '#94a3b8' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dominio" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Domínio Público</CardTitle>
                  <CardDescription>Configure um domínio personalizado para seus guias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Domínio dos Guias</Label>
                    <Input
                      value={formData.domain}
                      onChange={(e) => updateField('domain', e.target.value)}
                      placeholder="guia.guiahospedes.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Os guias públicos serão acessíveis através deste domínio.
                    </p>
                  </div>

                  {!hasDomain && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Domínio não configurado</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Sem um domínio personalizado, os guias usarão o domínio padrão da plataforma.
                            Isso é aceitável para começar, mas um domínio próprio transmite mais confiança.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasDomain && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-emerald-800">Domínio configurado</p>
                          <p className="text-xs text-emerald-700 mt-1">
                            Seus guias estarão disponíveis em: https://{formData.domain}/g/seu-slug
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar Domínio
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Checklist DNS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Domínio registrado', done: hasDomain },
                    { label: 'Registro CNAME configurado', done: false },
                    { label: 'SSL/TLS ativo', done: false },
                    { label: 'Redirecionamento www', done: false },
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
                </CardContent>
              </Card>

              <Card className="shadow-card border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Risco de segurança</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Certifique-se de que seu domínio tenha SSL configurado. Guias sem HTTPS
                        podem ser marcados como inseguros pelos navegadores.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mensagens" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Preferências de Mensagens</CardTitle>
                  <CardDescription>Controle como e quando seus hóspedes são notificados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">Notificações de Compartilhamento</p>
                        </div>
                        <p className="text-sm text-muted-foreground">Receber notificações quando um guia for compartilhado</p>
                      </div>
                      <Switch
                        checked={formData.notificationsEnabled}
                        onCheckedChange={(v) => updateField('notificationsEnabled', v)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Signature className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">Assinatura Padrão</p>
                        </div>
                        <p className="text-sm text-muted-foreground">Incluir assinatura nos e-mails enviados</p>
                      </div>
                      <Switch
                        checked={formData.signatureEnabled}
                        onCheckedChange={(v) => updateField('signatureEnabled', v)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">Mensagem de Boas-vindas Automática</p>
                        </div>
                        <p className="text-sm text-muted-foreground">Enviar guia automaticamente após confirmação de reserva</p>
                      </div>
                      <Switch
                        checked={formData.autoWelcome}
                        onCheckedChange={(v) => updateField('autoWelcome', v)}
                      />
                    </div>
                  </div>
                  <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar Preferências
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Notificações</span>
                    <Badge variant={formData.notificationsEnabled ? 'default' : 'outline'} className="text-xs">
                      {formData.notificationsEnabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assinatura</span>
                    <Badge variant={formData.signatureEnabled ? 'default' : 'outline'} className="text-xs">
                      {formData.signatureEnabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Auto-welcome</span>
                    <Badge variant={formData.autoWelcome ? 'default' : 'outline'} className="text-xs">
                      {formData.autoWelcome ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Dica</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Ative a mensagem automática de boas-vindas para reduzir em 60% as dúvidas
                        repetidas dos hóspedes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
