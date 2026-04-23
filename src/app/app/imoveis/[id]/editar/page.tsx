'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Clock,
  LogOut,
  Wifi,
  Shield,
  Tv,
  Phone,
  MapPin,
  Loader2,
} from 'lucide-react'
import { updateProperty } from '@/app/actions/update-property'
import { ImageUpload } from '@/components/shared/image-upload'
import { toast } from 'sonner'
import {
  usePropertyForm,
  PropertyFormShell,
  StepInfo,
  StepCheckin,
  StepCheckout,
  StepWifi,
  StepRules,
  StepDevices,
  StepContacts,
  StepRegion,
} from '@/components/property-form'

const steps = [
  { id: 'info', label: 'Informações', description: 'Dados principais do imóvel', icon: Building2 },
  { id: 'checkin', label: 'Check-in', description: 'Horário e instruções de chegada', icon: Clock },
  { id: 'checkout', label: 'Check-out', description: 'Horário e orientações de saída', icon: LogOut },
  { id: 'wifi', label: 'Wi-Fi', description: 'Rede e senha para o hóspede', icon: Wifi },
  { id: 'rules', label: 'Regras', description: 'Normas e permissões da casa', icon: Shield },
  { id: 'devices', label: 'Equipamentos', description: 'Itens importantes e instruções de uso', icon: Tv },
  { id: 'contacts', label: 'Contatos', description: 'Pessoas de apoio da estadia', icon: Phone },
  { id: 'region', label: 'Região', description: 'Dicas locais e recomendações', icon: MapPin },
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
  recommendations: Array<{
    name: string
    category: string
    description: string | null
    address: string | null
    mapUrl: string | null
    instagram: string | null
    image: string | null
    distance: string | null
  }>
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [propertyId, setPropertyId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [initialDataReady, setInitialDataReady] = useState(false)

  const {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    addDevice,
    removeDevice,
    moveDevice,
    updateDevice,
    addContact,
    removeContact,
    moveContact,
    updateContact,
    addRecommendation,
    removeRecommendation,
    moveRecommendation,
    updateRecommendation,
    completionStatus,
    validateStep,
    setFormData,
  } = usePropertyForm({
    includeRegionInCompletion: true,
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
          recommendations: (data.recommendations || []).map((r) => ({
            name: r.name,
            category: r.category,
            description: r.description || '',
            address: r.address || '',
            mapUrl: r.mapUrl || '',
            instagram: r.instagram || '',
            image: r.image || '',
            distance: r.distance || '',
          })),
        })
        setInitialDataReady(true)
      } catch {
        toast.error('Erro ao carregar dados do imóvel')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [params, setFormData])

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
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
        recommendations: formData.recommendations,
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
          <StepInfo
            formData={formData}
            updateField={updateField}
            imageUpload={propertyId ? <ImageUpload propertyId={propertyId} /> : undefined}
          />
        )
      case 1:
        return <StepCheckin formData={formData} updateField={updateField} />
      case 2:
        return <StepCheckout formData={formData} updateField={updateField} />
      case 3:
        return <StepWifi formData={formData} updateField={updateField} />
      case 4:
        return <StepRules formData={formData} updateField={updateField} />
      case 5:
        return (
          <StepDevices
            devices={formData.devices}
            addDevice={addDevice}
            removeDevice={removeDevice}
            moveDevice={moveDevice}
            updateDevice={updateDevice}
          />
        )
      case 6:
        return (
          <StepContacts
            contacts={formData.contacts}
            addContact={addContact}
            removeContact={removeContact}
            moveContact={moveContact}
            updateContact={updateContact}
          />
        )
      case 7:
        return (
          <StepRegion
            recommendations={formData.recommendations}
            addRecommendation={addRecommendation}
            removeRecommendation={removeRecommendation}
            moveRecommendation={moveRecommendation}
            updateRecommendation={updateRecommendation}
          />
        )
      default:
        return null
    }
  }

  if (isLoading || !initialDataReady) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <PropertyFormShell
      steps={steps}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      completionStatus={completionStatus}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={handleSubmit}
      isLoading={isSaving}
      showPreview={false}
      setShowPreview={() => {}}
      lastSaved={null}
      submitLabel="Salvar alterações"
      pageTitle="Editar Imóvel"
      pageDescription="Ajuste as etapas do guia sem perder contexto do progresso atual."
      backHref={`/app/imoveis/${propertyId}`}
      summaryTitle="Resumo da edição"
      propertyName={formData.name}
      propertyCity={formData.city}
      propertyState={formData.state}
      welcomeMessage={formData.welcomeMessage}
      checkInTime={formData.checkInTime}
      checkOutTime={formData.checkOutTime}
      wifiNetwork={formData.wifiNetwork}
      contactsCount={formData.contacts.length}
      contacts={formData.contacts}
    >
      {renderStep()}
    </PropertyFormShell>
  )
}
