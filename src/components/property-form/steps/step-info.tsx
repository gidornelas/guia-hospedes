'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Info } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/constants'
import { PropertyFormData } from '../types'
import { ReactNode } from 'react'

interface StepInfoProps {
  formData: PropertyFormData
  updateField: (field: keyof PropertyFormData, value: unknown) => void
  imageUpload?: ReactNode
}

export function StepInfo({ formData, updateField, imageUpload }: StepInfoProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-800">Informações básicas</p>
            <p className="text-sm text-brand-700 mt-1">Preencha os dados principais do imóvel. Nome e tipo são obrigatórios.</p>
          </div>
        </div>
      </div>
      {imageUpload}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome do Imóvel *</Label>
          <Input
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Ex: Flat Elegance Paulista"
          />
        </div>
        <div className="space-y-2">
          <Label>Código Interno</Label>
          <Input
            value={formData.internalCode}
            onChange={(e) => updateField('internalCode', e.target.value)}
            placeholder="Ex: FEP-001"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tipo de Imóvel *</Label>
        <Select value={formData.type} onValueChange={(v) => updateField('type', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Endereço</Label>
        <Input
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="Rua, número, complemento"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Cidade</Label>
          <Input
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="São Paulo"
          />
        </div>
        <div className="space-y-2">
          <Label>Estado</Label>
          <Input
            value={formData.state}
            onChange={(e) => updateField('state', e.target.value)}
            placeholder="SP"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Mensagem de Boas-vindas</Label>
        <Textarea
          value={formData.welcomeMessage}
          onChange={(e) => updateField('welcomeMessage', e.target.value)}
          placeholder="Seja muito bem-vindo ao nosso espaço..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Descrição Curta</Label>
        <Textarea
          value={formData.shortDescription}
          onChange={(e) => updateField('shortDescription', e.target.value)}
          placeholder="Apartamento moderno na melhor localização..."
          rows={2}
        />
      </div>
    </div>
  )
}
