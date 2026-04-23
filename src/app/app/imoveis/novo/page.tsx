'use client'

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
} from 'lucide-react'
import { createProperty } from '@/app/actions/create-property'
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
  { id: 'info', label: 'Informações', description: 'Dados básicos do imóvel', icon: Building2 },
  { id: 'checkin', label: 'Check-in', description: 'Horário e acesso', icon: Clock },
  { id: 'checkout', label: 'Check-out', description: 'Instruções de saída', icon: LogOut },
  { id: 'wifi', label: 'Wi-Fi', description: 'Rede e senha', icon: Wifi },
  { id: 'rules', label: 'Regras', description: 'Normas da casa', icon: Shield },
  { id: 'devices', label: 'Equipamentos', description: 'Eletrodomésticos e instruções', icon: Tv },
  { id: 'contacts', label: 'Contatos', description: 'Pessoas de apoio', icon: Phone },
  { id: 'region', label: 'Região', description: 'Dicas locais', icon: MapPin },
]

export default function NewPropertyPage() {
  const router = useRouter()
  const {
    formData,
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    isSavingDraft,
    setIsSavingDraft,
    lastSaved,
    showPreview,
    setShowPreview,
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
    clearDraft,
  } = usePropertyForm({
    enableAutosave: true,
    requireDevicesAndContacts: true,
  })

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
  }

  const buildPayload = () => ({
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

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    try {
      const result = await createProperty({
        ...buildPayload(),
        name: formData.name || 'Rascunho',
        type: formData.type || 'APARTMENT',
      })

      if (result.success && result.propertyId) {
        localStorage.removeItem('property_draft')
        toast.success('Rascunho salvo. Você pode continuar editando depois.')
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
      const result = await createProperty(buildPayload())

      if (result.success && result.propertyId) {
        toast.success('Imóvel criado com sucesso.')
        router.push(`/app/imoveis/${result.propertyId}`)
      } else {
        toast.error(result.error || 'Erro ao criar imóvel')
        setIsLoading(false)
      }
    } catch {
      toast.error('Erro inesperado ao criar imóvel')
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepInfo formData={formData} updateField={updateField} />
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

  return (
    <PropertyFormShell
      steps={steps}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      completionStatus={completionStatus}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      isLoading={isLoading}
      isSavingDraft={isSavingDraft}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      lastSaved={lastSaved}
      onClearDraft={clearDraft}
      submitLabel="Criar imóvel"
      pageTitle="Novo imóvel"
      pageDescription="Preencha as informações principais do imóvel, acompanhe a completude do guia e publique com mais segurança."
      backHref="/app/imoveis"
      summaryTitle="Resumo do cadastro"
      propertyName={formData.name}
      propertyCity={formData.city}
      propertyState={formData.state}
      welcomeMessage={formData.welcomeMessage}
      checkInTime={formData.checkInTime}
      checkOutTime={formData.checkOutTime}
      wifiNetwork={formData.wifiNetwork}
      contactsCount={formData.contacts.length}
      contacts={formData.contacts}
      showInfoCard
      showPreviewCard
    >
      {renderStep()}
    </PropertyFormShell>
  )
}
