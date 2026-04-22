'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  Loader2,
  Info,
  Building2,
  Clock,
  Wifi,
  Shield,
  Tv,
  Phone,
  CheckCircle2,
  Circle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/constants'
import { updateProperty } from '@/app/actions/update-property'
import { ImageUpload } from '@/components/shared/image-upload'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const steps = [
  { id: 'info', label: 'Informações', description: 'Dados principais do imóvel', icon: Building2 },
  { id: 'checkin', label: 'Check-in', description: 'Horário e instruções de chegada', icon: Clock },
  { id: 'checkout', label: 'Check-out', description: 'Horário e orientações de saída', icon: Clock },
  { id: 'wifi', label: 'Wi-Fi', description: 'Rede e senha para o hóspede', icon: Wifi },
  { id: 'rules', label: 'Regras', description: 'Normas e permissões da casa', icon: Shield },
  { id: 'devices', label: 'Equipamentos', description: 'Itens importantes e instruções de uso', icon: Tv },
  { id: 'contacts', label: 'Contatos', description: 'Pessoas de apoio da estadia', icon: Phone },
]

interface PropertyData {
  id: string
  name: string
  internalCode: string | null
  type: string
  address: string | null
  city: string | null
  state: string | null
  welcomeMessage: string | null
  shortDescription: string | null
  checkIn: { time: string | null; instructions: string | null; accessMethod: string | null } | null
  checkOut: { time: string | null; instructions: string | null } | null
  wifi: { networkName: string; password: string } | null
  rules: {
    silence: string | null
    visits: string | null
    pets: boolean
    smoking: boolean
    parties: boolean
  } | null
  devices: Array<{ name: string; type: string; instructions: string | null; brand: string | null }>
  contacts: Array<{
    name: string
    role: string
    phone: string | null
    email: string | null
    whatsapp: string | null
  }>
}

function StepIntro({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
        <div>
          <p className="text-sm font-medium text-brand-800">{title}</p>
          <p className="mt-1 text-sm text-brand-700">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [propertyId, setPropertyId] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    internalCode: '',
    type: '',
    address: '',
    city: '',
    state: '',
    welcomeMessage: '',
    shortDescription: '',
    checkInTime: '',
    checkInInstructions: '',
    checkInAccessMethod: '',
    checkOutTime: '',
    checkOutInstructions: '',
    wifiNetwork: '',
    wifiPassword: '',
    rulesSilence: '',
    rulesVisits: '',
    rulesPets: false,
    rulesSmoking: false,
    rulesParties: false,
    devices: [] as Array<{ name: string; type: string; instructions: string; brand: string }>,
    contacts: [] as Array<{
      name: string
      role: string
      phone: string
      email: string
      whatsapp: string
    }>,
  })

  useEffect(() => {
    async function load() {
      const { id } = await params
      setPropertyId(id)
      setIsLoading(true)

      try {
        const res = await fetch(`/api/properties/${id}`)
        if (!res.ok) throw new Error('Erro ao carregar imóvel')
        const data: PropertyData = await res.json()

        setFormData({
          name: data.name || '',
          internalCode: data.internalCode || '',
          type: data.type || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          welcomeMessage: data.welcomeMessage || '',
          shortDescription: data.shortDescription || '',
          checkInTime: data.checkIn?.time || '',
          checkInInstructions: data.checkIn?.instructions || '',
          checkInAccessMethod: data.checkIn?.accessMethod || '',
          checkOutTime: data.checkOut?.time || '',
          checkOutInstructions: data.checkOut?.instructions || '',
          wifiNetwork: data.wifi?.networkName || '',
          wifiPassword: data.wifi?.password || '',
          rulesSilence: data.rules?.silence || '',
          rulesVisits: data.rules?.visits || '',
          rulesPets: data.rules?.pets ?? false,
          rulesSmoking: data.rules?.smoking ?? false,
          rulesParties: data.rules?.parties ?? false,
          devices: (data.devices || []).map((d) => ({
            name: d.name,
            type: d.type,
            instructions: d.instructions || '',
            brand: d.brand || '',
          })),
          contacts: (data.contacts || []).map((c) => ({
            name: c.name,
            role: c.role,
            phone: c.phone || '',
            email: c.email || '',
            whatsapp: c.whatsapp || '',
          })),
        })
      } catch {
        toast.error('Erro ao carregar dados do imóvel')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [params])

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addDevice = () => {
    setFormData((prev) => ({
      ...prev,
      devices: [...prev.devices, { name: '', type: 'OTHER', instructions: '', brand: '' }],
    }))
  }

  const removeDevice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      devices: prev.devices.filter((_, i) => i !== index),
    }))
  }

  const moveDevice = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const devices = [...prev.devices]
      const nextIndex = direction === 'up' ? index - 1 : index + 1
      if (nextIndex < 0 || nextIndex >= devices.length) return prev
      const [item] = devices.splice(index, 1)
      devices.splice(nextIndex, 0, item)
      return { ...prev, devices }
    })
  }

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { name: '', role: 'HOST', phone: '', email: '', whatsapp: '' },
      ],
    }))
  }

  const removeContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }))
  }

  const moveContact = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const contacts = [...prev.contacts]
      const nextIndex = direction === 'up' ? index - 1 : index + 1
      if (nextIndex < 0 || nextIndex >= contacts.length) return prev
      const [item] = contacts.splice(index, 1)
      contacts.splice(nextIndex, 0, item)
      return { ...prev, contacts }
    })
  }

  const completionStatus = useMemo(() => {
    const checks = [
      { label: 'Nome', filled: !!formData.name, step: 0 },
      { label: 'Tipo', filled: !!formData.type, step: 0 },
      { label: 'Endereço', filled: !!formData.address, step: 0 },
      { label: 'Check-in', filled: !!formData.checkInTime || !!formData.checkInInstructions, step: 1 },
      { label: 'Check-out', filled: !!formData.checkOutTime || !!formData.checkOutInstructions, step: 2 },
      { label: 'Wi-Fi', filled: !!formData.wifiNetwork, step: 3 },
      { label: 'Regras', filled: !!formData.rulesSilence || !!formData.rulesVisits, step: 4 },
      { label: 'Equipamentos', filled: formData.devices.length > 0, step: 5 },
      { label: 'Contatos', filled: formData.contacts.length > 0, step: 6 },
    ]
    const filledCount = checks.filter((c) => c.filled).length
    const progress = Math.round((filledCount / checks.length) * 100)
    return { checks, progress, filledCount, total: checks.length }
  }, [formData])

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.name.trim()) {
          toast.error('O nome do imóvel é obrigatório')
          return false
        }
        if (!formData.type) {
          toast.error('Selecione o tipo do imóvel')
          return false
        }
        return true
      case 1:
        if (!formData.checkInTime && !formData.checkInInstructions.trim()) {
          toast.error('Preencha pelo menos o horário ou as instruções de check-in')
          return false
        }
        return true
      case 2:
        if (!formData.checkOutTime && !formData.checkOutInstructions.trim()) {
          toast.error('Preencha pelo menos o horário ou as instruções de check-out')
          return false
        }
        return true
      case 3:
        if (!formData.wifiNetwork.trim()) {
          toast.error('O nome da rede Wi-Fi é obrigatório')
          return false
        }
        return true
      case 5:
        if (formData.devices.some((d) => !d.name.trim())) {
          toast.error('Todos os equipamentos precisam ter um nome')
          return false
        }
        return true
      case 6:
        if (formData.contacts.some((c) => !c.name.trim())) {
          toast.error('Todos os contatos precisam ter um nome')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
      toast.error('Nome e tipo do imóvel são obrigatórios')
      return
    }

    setIsSaving(true)

    try {
      const result = await updateProperty({
        id: propertyId,
        name: formData.name,
        internalCode: formData.internalCode,
        type: formData.type,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        welcomeMessage: formData.welcomeMessage,
        shortDescription: formData.shortDescription,
        checkInTime: formData.checkInTime,
        checkInInstructions: formData.checkInInstructions,
        checkInAccessMethod: formData.checkInAccessMethod,
        checkOutTime: formData.checkOutTime,
        checkOutInstructions: formData.checkOutInstructions,
        wifiNetwork: formData.wifiNetwork,
        wifiPassword: formData.wifiPassword,
        rulesSilence: formData.rulesSilence,
        rulesVisits: formData.rulesVisits,
        rulesPets: formData.rulesPets,
        rulesSmoking: formData.rulesSmoking,
        rulesParties: formData.rulesParties,
        devices: formData.devices,
        contacts: formData.contacts,
      })

      if (result.success) {
        toast.success('Imóvel atualizado com sucesso!')
        router.push(`/app/imoveis/${propertyId}`)
      } else {
        toast.error(result.error || 'Erro ao atualizar imóvel')
      }
    } catch {
      toast.error('Erro inesperado ao atualizar imóvel')
    } finally {
      setIsSaving(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <StepIntro
              title="Informações básicas"
              description="Atualize os dados principais do imóvel e revise como ele será apresentado no guia."
            />
            <ImageUpload propertyId={propertyId} />
            <div className="grid gap-4 md:grid-cols-2">
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
            <div className="grid gap-4 md:grid-cols-2">
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

      case 1:
        return (
          <div className="space-y-4">
            <StepIntro
              title="Check-in"
              description="Revise o horário e as orientações que ajudam o hóspede a chegar sem atrito."
            />
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

      case 2:
        return (
          <div className="space-y-4">
            <StepIntro
              title="Check-out"
              description="Deixe o processo de saída claro para reduzir mensagens e dúvidas de última hora."
            />
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

      case 3:
        return (
          <div className="space-y-4">
            <StepIntro
              title="Wi-Fi"
              description="Rede e senha precisam ser fáceis de localizar e copiar durante a estadia."
            />
            <div className="grid gap-4 md:grid-cols-2">
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

      case 4:
        return (
          <div className="space-y-4">
            <StepIntro
              title="Regras da casa"
              description="Mantenha as orientações claras e amigáveis para evitar interpretações confusas."
            />
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
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium">Permissões</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
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

      case 5:
        return (
          <div className="space-y-4">
            <StepIntro
              title="Equipamentos"
              description="Organize os itens por prioridade e deixe instruções curtas para facilitar a consulta do hóspede."
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-medium">Equipamentos</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDevice}
                className="gap-2 self-start"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>

            {formData.devices.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Tv className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Nenhum equipamento adicionado</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDevice}
                  className="mt-3 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar equipamento
                </Button>
              </div>
            )}

            {formData.devices.map((device, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h4 className="text-sm font-medium">Equipamento {index + 1}</h4>
                    <div className="flex items-center gap-1 self-end sm:self-start">
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
                        disabled={index === formData.devices.length - 1}
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
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Nome"
                      value={device.name}
                      onChange={(e) => {
                        const newDevices = [...formData.devices]
                        newDevices[index].name = e.target.value
                        setFormData((prev) => ({ ...prev, devices: newDevices }))
                      }}
                    />
                    <Input
                      placeholder="Marca/Modelo"
                      value={device.brand}
                      onChange={(e) => {
                        const newDevices = [...formData.devices]
                        newDevices[index].brand = e.target.value
                        setFormData((prev) => ({ ...prev, devices: newDevices }))
                      }}
                    />
                  </div>
                  <Textarea
                    placeholder="Instruções de uso"
                    value={device.instructions}
                    onChange={(e) => {
                      const newDevices = [...formData.devices]
                      newDevices[index].instructions = e.target.value
                      setFormData((prev) => ({ ...prev, devices: newDevices }))
                    }}
                    rows={2}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <StepIntro
              title="Contatos"
              description="Priorize quem realmente precisa aparecer no guia e mantenha os canais atualizados."
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-medium">Contatos</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContact}
                className="gap-2 self-start"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>

            {formData.contacts.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Phone className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Nenhum contato adicionado</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContact}
                  className="mt-3 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar contato
                </Button>
              </div>
            )}

            {formData.contacts.map((contact, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h4 className="text-sm font-medium">Contato {index + 1}</h4>
                    <div className="flex items-center gap-1 self-end sm:self-start">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={index === 0}
                        onClick={() => moveContact(index, 'up')}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={index === formData.contacts.length - 1}
                        onClick={() => moveContact(index, 'down')}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeContact(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Nome"
                      value={contact.name}
                      onChange={(e) => {
                        const newContacts = [...formData.contacts]
                        newContacts[index].name = e.target.value
                        setFormData((prev) => ({ ...prev, contacts: newContacts }))
                      }}
                    />
                    <Select
                      value={contact.role}
                      onValueChange={(v) => {
                        if (!v) return
                        const newContacts = [...formData.contacts]
                        newContacts[index].role = v
                        setFormData((prev) => ({ ...prev, contacts: newContacts }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOST">Anfitrião</SelectItem>
                        <SelectItem value="SUPPORT">Suporte</SelectItem>
                        <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                        <SelectItem value="CONCIERGE">Portaria</SelectItem>
                        <SelectItem value="EMERGENCY">Emergência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Telefone"
                      value={contact.phone}
                      onChange={(e) => {
                        const newContacts = [...formData.contacts]
                        newContacts[index].phone = e.target.value
                        setFormData((prev) => ({ ...prev, contacts: newContacts }))
                      }}
                    />
                    <Input
                      placeholder="WhatsApp"
                      value={contact.whatsapp}
                      onChange={(e) => {
                        const newContacts = [...formData.contacts]
                        newContacts[index].whatsapp = e.target.value
                        setFormData((prev) => ({ ...prev, contacts: newContacts }))
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/app/imoveis/${propertyId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight">Editar Imóvel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajuste as etapas do guia sem perder contexto do progresso atual.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">
            Etapa {currentStep + 1} de {steps.length}:{' '}
            <span className="font-medium text-foreground">{steps[currentStep].label}</span>
          </span>
          <span className="text-muted-foreground">{completionStatus.progress}% completo</span>
        </div>
        <Progress value={completionStatus.progress} className="h-2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  i === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : i < currentStep
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">
                  {i < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                {(() => {
                  const Icon = steps[currentStep].icon
                  return <Icon className="h-5 w-5 text-primary" />
                })()}
                <h2 className="text-lg font-semibold">{steps[currentStep].label}</h2>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
              {renderStep()}
            </CardContent>
          </Card>

          <div className="hidden items-center justify-between lg:flex">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="gap-2">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 shadow-card">
            <CardContent className="p-5">
              <h3 className="mb-4 text-sm font-semibold">Resumo da edição</h3>
              <div className="space-y-2">
                {completionStatus.checks.map((check) => (
                  <button
                    key={check.label}
                    onClick={() => setCurrentStep(check.step)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                      check.filled
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {check.filled ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={cn(!check.filled && 'opacity-70')}>{check.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completude</span>
                  <span className="font-semibold">{completionStatus.progress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background p-4 lg:hidden">
        <div className="mx-auto flex max-w-4xl gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex-1 gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="flex-1 gap-2">
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSaving} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  )
}
