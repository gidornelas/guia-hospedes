'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, ChevronRight, ChevronLeft, Save, Plus, Trash2, Loader2 } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/constants'
import { updateProperty } from '@/app/actions/update-property'
import { ImageUpload } from '@/components/shared/image-upload'
import { toast } from 'sonner'

const steps = [
  { id: 'info', label: 'Informações' },
  { id: 'checkin', label: 'Check-in' },
  { id: 'checkout', label: 'Check-out' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'rules', label: 'Regras' },
  { id: 'devices', label: 'Equipamentos' },
  { id: 'contacts', label: 'Contatos' },
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
  rules: { silence: string | null; visits: string | null; pets: boolean; smoking: boolean; parties: boolean } | null
  devices: Array<{ name: string; type: string; instructions: string | null; brand: string | null }>
  contacts: Array<{ name: string; role: string; phone: string | null; email: string | null; whatsapp: string | null }>
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
    contacts: [] as Array<{ name: string; role: string; phone: string; email: string; whatsapp: string }>,
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
      } catch (e) {
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
    } catch (error) {
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
            <ImageUpload propertyId={propertyId} />
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
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pets"
                  checked={formData.rulesPets}
                  onChange={(e) => updateField('rulesPets', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="pets">Permitir Pets</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="smoking"
                  checked={formData.rulesSmoking}
                  onChange={(e) => updateField('rulesSmoking', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="smoking">Permitir Fumar</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parties"
                  checked={formData.rulesParties}
                  onChange={(e) => updateField('rulesParties', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="parties">Permitir Festas</Label>
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDevice(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContact(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
          </div>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href={`/app/imoveis/${propertyId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Editar Imóvel</h1>
          <p className="text-muted-foreground mt-1">
            Etapa {currentStep + 1} de {steps.length}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs hidden lg:block ${
                i <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  i < currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">{steps[currentStep].label}</h2>
          {renderStep()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
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
          <Button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
            className="gap-2"
          >
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
  )
}
