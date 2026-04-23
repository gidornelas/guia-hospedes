'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Info } from 'lucide-react'
import { PropertyFormData } from '../types'

interface StepRulesProps {
  formData: PropertyFormData
  updateField: (field: keyof PropertyFormData, value: unknown) => void
}

export function StepRules({ formData, updateField }: StepRulesProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-800">Regras da Casa</p>
            <p className="text-sm text-brand-700 mt-1">Defina as normas de convivência de forma clara e amigável.</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Regras de Silêncio</Label>
        <Input
          value={formData.rulesSilence}
          onChange={(e) => updateField('rulesSilence', e.target.value)}
          placeholder="Ex: Silêncio entre 22h e 8h"
        />
      </div>
      <div className="space-y-2">
        <Label>Regras de Visitas</Label>
        <Input
          value={formData.rulesVisits}
          onChange={(e) => updateField('rulesVisits', e.target.value)}
          placeholder="Ex: Visitas permitidas até 22h"
        />
      </div>
      <div className="space-y-4 rounded-lg border border-border p-4">
        <p className="text-sm font-medium">Permissões</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Pets</p>
              <p className="text-xs text-muted-foreground">Animais de estimação</p>
            </div>
            <Switch
              checked={formData.rulesPets}
              onCheckedChange={(v) => updateField('rulesPets', v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Fumar</p>
              <p className="text-xs text-muted-foreground">Permitido no imóvel</p>
            </div>
            <Switch
              checked={formData.rulesSmoking}
              onCheckedChange={(v) => updateField('rulesSmoking', v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Festas</p>
              <p className="text-xs text-muted-foreground">Eventos e reuniões</p>
            </div>
            <Switch
              checked={formData.rulesParties}
              onCheckedChange={(v) => updateField('rulesParties', v)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
