'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Tv,
  Info,
} from 'lucide-react'
import { Device } from '../types'

interface StepDevicesProps {
  devices: Device[]
  addDevice: () => void
  removeDevice: (index: number) => void
  moveDevice: (index: number, direction: 'up' | 'down') => void
  updateDevice: (index: number, field: keyof Device, value: string) => void
}

export function StepDevices({ devices, addDevice, removeDevice, moveDevice, updateDevice }: StepDevicesProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-800">Equipamentos</p>
            <p className="text-sm text-brand-700 mt-1">Adicione os principais equipamentos e suas instruções de uso.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Equipamentos</h3>
        <Button type="button" variant="outline" size="sm" onClick={addDevice} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>
      {devices.map((device, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium">Equipamento {index + 1}</h4>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => moveDevice(index, 'up')}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === devices.length - 1}
                  onClick={() => moveDevice(index, 'down')}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeDevice(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Nome"
                value={device.name}
                onChange={(e) => updateDevice(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Marca/Modelo"
                value={device.brand}
                onChange={(e) => updateDevice(index, 'brand', e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Instruções de uso"
              value={device.instructions}
              onChange={(e) => updateDevice(index, 'instructions', e.target.value)}
              rows={2}
            />
          </CardContent>
        </Card>
      ))}
      {devices.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Tv className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhum equipamento adicionado</p>
          <Button type="button" variant="outline" size="sm" onClick={addDevice} className="mt-2 gap-2">
            <Plus className="h-4 w-4" />
            Adicionar equipamento
          </Button>
        </div>
      )}
    </div>
  )
}
