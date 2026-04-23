'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Info } from 'lucide-react'
import { PropertyFormData } from '../types'

interface StepCheckoutProps {
  formData: PropertyFormData
  updateField: (field: keyof PropertyFormData, value: unknown) => void
}

export function StepCheckout({ formData, updateField }: StepCheckoutProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-800">Check-out</p>
            <p className="text-sm text-brand-700 mt-1">Defina o horário e as instruções de saída do imóvel.</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Horário de Check-out</Label>
        <Input
          type="time"
          value={formData.checkOutTime}
          onChange={(e) => updateField('checkOutTime', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Instruções de Saída</Label>
        <Textarea
          value={formData.checkOutInstructions}
          onChange={(e) => updateField('checkOutInstructions', e.target.value)}
          placeholder="Onde deixar as chaves, como proceder..."
          rows={4}
        />
      </div>
    </div>
  )
}
