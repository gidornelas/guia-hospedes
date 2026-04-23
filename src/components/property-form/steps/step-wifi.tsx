'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'
import { PropertyFormData } from '../types'

interface StepWifiProps {
  formData: PropertyFormData
  updateField: (field: keyof PropertyFormData, value: unknown) => void
}

export function StepWifi({ formData, updateField }: StepWifiProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-800">Wi-Fi</p>
            <p className="text-sm text-brand-700 mt-1">Os hóspedes sempre perguntam isso. Tenha à mão o nome da rede e a senha.</p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome da Rede Wi-Fi</Label>
          <Input
            value={formData.wifiNetwork}
            onChange={(e) => updateField('wifiNetwork', e.target.value)}
            placeholder="Nome da rede"
          />
        </div>
        <div className="space-y-2">
          <Label>Senha do Wi-Fi</Label>
          <Input
            value={formData.wifiPassword}
            onChange={(e) => updateField('wifiPassword', e.target.value)}
            placeholder="Senha"
          />
        </div>
      </div>
    </div>
  )
}
