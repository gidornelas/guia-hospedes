'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Building2,
  Clock,
  Wifi,
  Shield,
  Tv,
  Phone,
  MapPin,
  Info,
  Eye,
  RotateCcw,
  Check,
} from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/constants'
import { createProperty } from '@/app/actions/create-property'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const steps = [
  { id: 'info', label: 'Informações', description: 'Dados básicos do imóvel', icon: Building2 },
  { id: 'checkin', label: 'Check-in', description: 'Horário e acesso', icon: Clock },
  { id: 'checkout', label: 'Check-out', description: 'Instruções de saída', icon: Clock },
  { id: 'wifi', label: 'Wi-Fi', description: 'Rede e senha', icon: Wifi },
  { id: 'rules', label: 'Regras', description: 'Normas da casa', icon: Shield },
  { id: 'devices', label: 'Equipamentos', description: 'Eletrodomésticos e instruções', icon: Tv },
  { id: 'contacts', label: 'Contatos', description: 'Pessoas de apoio', icon: Phone },
  { id: 'region', label: 'Região', description: 'Dicas locais', icon: MapPin },
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)
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
    contacts: [] as Array<{ name: string; role: string; phone: string; email: string; whatsapp: string }>,
    recommendations: [] as Array<{ name: string; category: string; description: string; distance: string }>,
  })

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

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', role: 'HOST', phone: '', email: '', whatsapp: '' }],
    }))
  }

  const removeContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }))
  }

  const moveDevice = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const devices = [...prev.devices]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= devices.length) return prev
      const [item] = devices.splice(index, 1)
      devices.splice(newIndex, 0, item)
      return { ...prev, devices }
    })
  }

  const moveContact = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const contacts = [...prev.contacts]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= contacts.length) return prev
      const [item] = contacts.splice(index, 1)
      contacts.splice(newIndex, 0, item)
      return { ...prev, contacts }
    })
  }

  // Autosave to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('property_draft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.formData) {
          setFormData((prev) => ({ ...prev, ...parsed.formData }))
        }
        if (parsed.currentStep) setCurrentStep(parsed.currentStep)
        if (parsed.lastSaved) setLastSaved(new Date(parsed.lastSaved))
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        'property_draft',
        JSON.stringify({ formData, currentStep, lastSaved: new Date().toISOString() })
      )
      setLastSaved(new Date())
    }, 2000)
    return () => clearTimeout(timer)
  }, [formData, currentStep])

  const clearDraft = () => {
    localStorage.removeItem('property_draft')
    setLastSaved(null)
    toast.success('Rascunho limpo')
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
      case 4:
        return true
      case 5:
        if (formData.devices.length === 0) {
          toast.error('Adicione pelo menos um equipamento')
          return false
        }
        if (formData.devices.some((d) => !d.name.trim())) {
          toast.error('Todos os equipamentos precisam ter um nome')
          return false
        }
        return true
      case 6:
        if (formData.contacts.length === 0) {
          toast.error('Adicione pelo menos um contato')
          return false
        }
        if (formData.contacts.some((c) => !c.name.trim())) {
          toast.error('Todos os contatos precisam ter um nome')
          return false
        }
        return true
      case 7:
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

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    try {
      const result = await createProperty({
        name: formData.name || 'Rascunho',
        internalCode: formData.internalCode,
        type: formData.type || 'APARTMENT',
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

      if (result.success && result.propertyId) {
        localStorage.removeItem('property_draft')
        toast.success('Rascunho salvo! Você pode continuar editando depois.')
        router.push(`/app/imoveis/${result.propertyId}`)
      } else {
        toast.error(result.error || 'Erro ao salvar rascunho')
      }
    } catch {
      toast.error('Erro inesperado ao salvar rascunho')
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
      toast.error('Nome e tipo do imóvel são obrigatórios')
      return
    }

    setIsLoading(true)

    try {
      const result = await createProperty({
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

      if (result.success && result.propertyId) {
        toast.success('Imóvel criado com sucesso!')
        router.push(`/app/imoveis/${result.propertyId}`)
      } else {
        toast.error(result.error || 'Erro ao criar imóvel')
        setIsLoading(false)
      }
    } catch (error) {
      toast.error('Erro inesperado ao criar imóvel')
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
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
      case 1:
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
      case 2:
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
      case 3:
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
      case 4:
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
      case 5:
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
            {formData.devices.map((device, index) => (
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
                  <div className="grid md:grid-cols-2 gap-3">
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
            {formData.devices.length === 0 && (
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
      case 6:
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brand-800">Contatos</p>
                  <p className="text-sm text-brand-700 mt-1">Adicione pessoas de apoio que o hóspede pode contatar.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Contatos</h3>
              <Button type="button" variant="outline" size="sm" onClick={addContact} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
            {formData.contacts.map((contact, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">Contato {index + 1}</h4>
                    <div className="flex items-center gap-1">
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
                  <div className="grid md:grid-cols-2 gap-3">
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
                  <div className="grid md:grid-cols-2 gap-3">
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
            {formData.contacts.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <Phone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum contato adicionado</p>
                <Button type="button" variant="outline" size="sm" onClick={addContact} className="mt-2 gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar contato
                </Button>
              </div>
            )}
          </div>
        )
      case 7:
        return (
          <div className="space-y-4">
            <div className="rounded-lg bg-brand-50 border border-brand-100 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brand-800">Dicas da Região</p>
                  <p className="text-sm text-brand-700 mt-1">Recomende restaurantes, mercados, farmácias e atrações próximas.</p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '🍽️', title: 'Restaurantes', desc: 'Indique os melhores lugares para comer nas proximidades' },
                { icon: '☕', title: 'Cafés', desc: 'Cafeterias e padarias próximas' },
                { icon: '🛒', title: 'Mercados', desc: 'Onde comprar o essencial' },
                { icon: '💊', title: 'Farmácias', desc: 'Farmácias 24h ou próximas' },
                { icon: '🎯', title: 'Atrações', desc: 'Pontos turísticos e atividades' },
                { icon: '🚇', title: 'Transporte', desc: 'Metrô, ônibus e estacionamentos' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Você poderá adicionar recomendações detalhadas após criar o imóvel
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Acesse a página do imóvel → aba Região
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/imoveis">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-2xl font-bold tracking-tight">Novo Imóvel</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-muted-foreground text-sm">
              Preencha as informações para criar o guia digital
            </p>
            {lastSaved && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-500" />
                Salvo às {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearDraft} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Limpar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPreview((v) => !v)} className="gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            {showPreview ? 'Ocultar preview' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Etapa {currentStep + 1} de {steps.length}: <span className="font-medium text-foreground">{steps[currentStep].label}</span>
          </span>
          <span className="text-muted-foreground">{completionStatus.progress}% completo</span>
        </div>
        <Progress value={completionStatus.progress} className="h-2" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stepper */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  'flex items-center gap-2 shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  i === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : i < currentStep
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <span className="h-5 w-5 rounded-full flex items-center justify-center text-xs shrink-0 bg-white/20">
                  {i < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {(() => {
                  const Icon = steps[currentStep].icon
                  return <Icon className="h-5 w-5 text-primary" />
                })()}
                <h2 className="font-semibold text-lg">{steps[currentStep].label}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{steps[currentStep].description}</p>
              {renderStep()}
            </CardContent>
          </Card>

          {/* Actions - Desktop */}
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSavingDraft || !formData.name}
                className="text-muted-foreground"
              >
                {isSavingDraft ? 'Salvando...' : 'Salvar rascunho'}
              </Button>
            </div>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="gap-2">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Criar Imóvel'}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="shadow-card sticky top-24">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-4">Resumo do Cadastro</h3>
              <div className="space-y-2">
                {completionStatus.checks.map((check) => (
                  <button
                    key={check.label}
                    onClick={() => setCurrentStep(check.step)}
                    className={cn(
                      'flex items-center gap-2 w-full text-left text-sm py-1.5 px-2 rounded-md transition-colors',
                      check.filled ? 'text-foreground' : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {check.filled ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn(!check.filled && 'line-through opacity-60')}>
                      {check.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completude</span>
                  <span className="font-semibold">{completionStatus.progress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {showPreview && (
            <Card className="shadow-card border-primary/20">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Preview do Guia</h3>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-4 space-y-3">
                  <div>
                    <p className="font-heading text-lg font-bold text-foreground">
                      {formData.name || 'Nome do Imóvel'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formData.city ? `${formData.city}${formData.state ? `, ${formData.state}` : ''}` : 'Cidade, Estado'}
                    </p>
                  </div>
                  {formData.welcomeMessage && (
                    <p className="text-sm text-muted-foreground italic line-clamp-3">
                      "{formData.welcomeMessage}"
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {formData.checkInTime && (
                      <div className="rounded-md bg-background/80 p-2 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-in</p>
                        <p className="text-sm font-semibold">{formData.checkInTime}</p>
                      </div>
                    )}
                    {formData.checkOutTime && (
                      <div className="rounded-md bg-background/80 p-2 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-out</p>
                        <p className="text-sm font-semibold">{formData.checkOutTime}</p>
                      </div>
                    )}
                    {formData.wifiNetwork && (
                      <div className="rounded-md bg-background/80 p-2 text-center col-span-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Wi-Fi</p>
                        <p className="text-sm font-semibold">{formData.wifiNetwork}</p>
                      </div>
                    )}
                  </div>
                  {formData.contacts.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Contatos</p>
                      {formData.contacts.slice(0, 2).map((c, i) => (
                        <p key={i} className="text-sm">{c.name} <span className="text-xs text-muted-foreground">({c.role})</span></p>
                      ))}
                      {formData.contacts.length > 2 && (
                        <p className="text-xs text-muted-foreground">+{formData.contacts.length - 2} mais</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sticky Actions - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex-1 gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || !formData.name}
            className="text-muted-foreground px-2"
          >
            Rascunho
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="flex-1 gap-2">
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? 'Salvando...' : 'Criar'}
            </Button>
          )}
        </div>
      </div>

      {/* Spacer for sticky mobile actions */}
      <div className="lg:hidden h-20" />
    </div>
  )
}
