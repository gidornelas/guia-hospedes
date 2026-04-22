'use client'

import { useState } from 'react'
import { Sparkles, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { generateTranslations, updatePropertyTranslations } from '@/app/actions/translations'
import { AllTranslations, PropertyTranslations } from '@/lib/translate'

interface TranslationsEditorProps {
  property: any
  hasApiKey: boolean
}

export function TranslationsEditor({ property, hasApiKey }: TranslationsEditorProps) {
  const existing = (property.translations as AllTranslations) || {}
  const [en, setEn] = useState<PropertyTranslations>(existing['en'] || {})
  const [es, setEs] = useState<PropertyTranslations>(existing['es'] || {})
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await updatePropertyTranslations(property.id, {
      'pt-BR': existing['pt-BR'] || {},
      en,
      es,
    })
    setSaving(false)
    if (result.success) {
      showMessage('success', 'Traduções salvas com sucesso!')
    } else {
      showMessage('error', 'Erro ao salvar traduções.')
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    const result = await generateTranslations(property.id)
    setGenerating(false)
    if (result.success) {
      showMessage('success', `Traduções geradas! ${result.translatedCount} campos traduzidos.`)
      // Recarrega a página para obter as novas traduções
      window.location.reload()
    } else {
      showMessage('error', result.error || 'Erro ao gerar traduções.')
    }
  }

  const updateEn = (path: string, value: string) => {
    setEn((prev) => setPath({ ...prev }, path, value))
  }

  const updateEs = (path: string, value: string) => {
    setEs((prev) => setPath({ ...prev }, path, value))
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Preencha os campos em inglês e espanhol. Deixe em branco para usar o português como fallback.
        </p>
        <div className="flex gap-2">
          {hasApiKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {generating ? 'Gerando...' : 'Gerar automaticamente'}
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Salvando...' : 'Salvar traduções'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">🇬🇧 Inglês</TabsTrigger>
          <TabsTrigger value="es">🇪🇸 Espanhol</TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-4">
          <TranslationFields
            property={property}
            translations={en}
            onChange={updateEn}
          />
        </TabsContent>

        <TabsContent value="es" className="space-y-4">
          <TranslationFields
            property={property}
            translations={es}
            onChange={updateEs}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TranslationFields({
  property,
  translations,
  onChange,
}: {
  property: any
  translations: PropertyTranslations
  onChange: (path: string, value: string) => void
}) {
  const t = (path: string) => getPath(translations, path) || ''

  return (
    <div className="space-y-6">
      {/* Geral */}
      <Section title="Geral">
        <Field
          label="Mensagem de boas-vindas"
          original={property.welcomeMessage}
          value={t('welcomeMessage')}
          onChange={(v) => onChange('welcomeMessage', v)}
          multiline
        />
        <Field
          label="Descrição curta"
          original={property.shortDescription}
          value={t('shortDescription')}
          onChange={(v) => onChange('shortDescription', v)}
          multiline
        />
      </Section>

      {/* Check-in */}
      {property.checkIn && (
        <Section title="Check-in">
          <Field
            label="Instruções"
            original={property.checkIn.instructions}
            value={t('checkIn.instructions')}
            onChange={(v) => onChange('checkIn.instructions', v)}
            multiline
          />
          <Field
            label="Método de acesso"
            original={property.checkIn.accessMethod}
            value={t('checkIn.accessMethod')}
            onChange={(v) => onChange('checkIn.accessMethod', v)}
          />
          <Field
            label="Observações"
            original={property.checkIn.notes}
            value={t('checkIn.notes')}
            onChange={(v) => onChange('checkIn.notes', v)}
            multiline
          />
        </Section>
      )}

      {/* Check-out */}
      {property.checkOut && (
        <Section title="Check-out">
          <Field
            label="Instruções"
            original={property.checkOut.instructions}
            value={t('checkOut.instructions')}
            onChange={(v) => onChange('checkOut.instructions', v)}
            multiline
          />
          <Field
            label="Checklist de saída"
            original={property.checkOut.exitChecklist}
            value={t('checkOut.exitChecklist')}
            onChange={(v) => onChange('checkOut.exitChecklist', v)}
            multiline
          />
        </Section>
      )}

      {/* Wi-Fi */}
      {property.wifi && (
        <Section title="Wi-Fi">
          <Field
            label="Observações"
            original={property.wifi.notes}
            value={t('wifi.notes')}
            onChange={(v) => onChange('wifi.notes', v)}
            multiline
          />
        </Section>
      )}

      {/* Regras */}
      {property.rules && (
        <Section title="Regras">
          <Field
            label="Silêncio"
            original={property.rules.silence}
            value={t('rules.silence')}
            onChange={(v) => onChange('rules.silence', v)}
          />
          <Field
            label="Visitas"
            original={property.rules.visits}
            value={t('rules.visits')}
            onChange={(v) => onChange('rules.visits', v)}
          />
          <Field
            label="Lixo"
            original={property.rules.trash}
            value={t('rules.trash')}
            onChange={(v) => onChange('rules.trash', v)}
          />
          <Field
            label="Uso de equipamentos"
            original={property.rules.equipmentUse}
            value={t('rules.equipmentUse')}
            onChange={(v) => onChange('rules.equipmentUse', v)}
            multiline
          />
          <Field
            label="Observações"
            original={property.rules.notes}
            value={t('rules.notes')}
            onChange={(v) => onChange('rules.notes', v)}
            multiline
          />
        </Section>
      )}

      {/* Equipamentos */}
      {property.devices?.length > 0 && (
        <Section title="Equipamentos">
          {property.devices.map((device: any) => (
            <div key={device.id} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{device.name}</p>
              <Field
                label="Nome"
                original={device.name}
                value={t(`devices.${device.id}.name`)}
                onChange={(v) => onChange(`devices.${device.id}.name`, v)}
              />
              <Field
                label="Instruções"
                original={device.instructions}
                value={t(`devices.${device.id}.instructions`)}
                onChange={(v) => onChange(`devices.${device.id}.instructions`, v)}
                multiline
              />
            </div>
          ))}
        </Section>
      )}

      {/* Contatos */}
      {property.contacts?.length > 0 && (
        <Section title="Contatos">
          {property.contacts.map((contact: any) => (
            <Field
              key={contact.id}
              label={contact.name}
              original={contact.name}
              value={t(`contacts.${contact.id}.name`)}
              onChange={(v) => onChange(`contacts.${contact.id}.name`, v)}
            />
          ))}
        </Section>
      )}

      {/* Recomendações */}
      {property.recommendations?.length > 0 && (
        <Section title="Recomendações">
          {property.recommendations.map((rec: any) => (
            <div key={rec.id} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{rec.name}</p>
              <Field
                label="Nome"
                original={rec.name}
                value={t(`recommendations.${rec.id}.name`)}
                onChange={(v) => onChange(`recommendations.${rec.id}.name`, v)}
              />
              <Field
                label="Descrição"
                original={rec.description}
                value={t(`recommendations.${rec.id}.description`)}
                onChange={(v) => onChange(`recommendations.${rec.id}.description`, v)}
                multiline
              />
            </div>
          ))}
        </Section>
      )}

      {/* Links */}
      {property.links?.length > 0 && (
        <Section title="Links">
          {property.links.map((link: any) => (
            <Field
              key={link.id}
              label={link.label}
              original={link.label}
              value={t(`links.${link.id}.label`)}
              onChange={(v) => onChange(`links.${link.id}.label`, v)}
            />
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {children}
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  original,
  value,
  onChange,
  multiline,
}: {
  label: string
  original: string | null
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  if (!original && !value) return null

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Português (original)</p>
          {multiline ? (
            <Textarea value={original || ''} readOnly className="bg-slate-50 text-sm min-h-[60px] resize-none" />
          ) : (
            <Input value={original || ''} readOnly className="bg-slate-50 text-sm" />
          )}
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Tradução</p>
          {multiline ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="text-sm min-h-[60px] resize-none"
              placeholder="Deixe em branco para usar o português"
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="text-sm"
              placeholder="Deixe em branco para usar o português"
            />
          )}
        </div>
      </div>
    </div>
  )
}

function getPath(obj: any, path: string): string | undefined {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return typeof current === 'string' ? current : undefined
}

function setPath(obj: any, path: string, value: string): any {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
  return obj
}
