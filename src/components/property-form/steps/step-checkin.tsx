'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Info } from 'lucide-react'
import { PropertyFormData } from '../types'

interface StepCheckinProps {
  formData: PropertyFormData
  updateField: (field: keyof PropertyFormData, value: unknown) => void
}

export function StepCheckin({ formData, updateField }: StepCheckinProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-800">Check-in</p>
            <p className="text-sm text-brand-700 mt-1">Informe o horário e as instruções de chegada para seus hóspedes.</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Horário de Check-in</Label>
        <Input
          type="time"
          value={formData.checkInTime}
          onChange={(e) => updateField('checkInTime', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Instruções de Chegada</Label>
        <Textarea
          value={formData.checkInInstructions}
          onChange={(e) => updateField('checkInInstructions', e.target.value)}
          placeholder="Como chegar ao imóvel, onde pegar a chave..."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>Método de Acesso</Label>
        <Input
          value={formData.checkInAccessMethod}
          onChange={(e) => updateField('checkInAccessMethod', e.target.value)}
          placeholder="Ex: Fechadura digital, recepção, lockbox"
        />
      </div>
    </div>
  )
}
