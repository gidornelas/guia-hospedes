'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { PropertyFormData } from './types'

const defaultFormData: PropertyFormData = {
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
  devices: [],
  contacts: [],
  recommendations: [],
}

interface UsePropertyFormOptions {
  initialData?: Partial<PropertyFormData>
  enableAutosave?: boolean
  includeRegionInCompletion?: boolean
  requireDevicesAndContacts?: boolean
}

export function usePropertyForm(options: UsePropertyFormOptions = {}) {
  const {
    initialData,
    enableAutosave = false,
    includeRegionInCompletion = false,
    requireDevicesAndContacts = false,
  } = options

  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const [formData, setFormData] = useState<PropertyFormData>({
    ...defaultFormData,
    ...initialData,
  })

  // Load autosave
  useEffect(() => {
    if (!enableAutosave) return
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
  }, [enableAutosave])

  // Autosave
  useEffect(() => {
    if (!enableAutosave) return
    const timer = setTimeout(() => {
      localStorage.setItem(
        'property_draft',
        JSON.stringify({ formData, currentStep, lastSaved: new Date().toISOString() })
      )
      setLastSaved(new Date())
    }, 2000)
    return () => clearTimeout(timer)
  }, [formData, currentStep, enableAutosave])

  const clearDraft = useCallback(() => {
    localStorage.removeItem('property_draft')
    setLastSaved(null)
    toast.success('Rascunho limpo')
  }, [])

  const updateField = useCallback((field: keyof PropertyFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const addDevice = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      devices: [...prev.devices, { name: '', type: 'OTHER', instructions: '', brand: '' }],
    }))
  }, [])

  const removeDevice = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      devices: prev.devices.filter((_, i) => i !== index),
    }))
  }, [])

  const moveDevice = useCallback((index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const devices = [...prev.devices]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= devices.length) return prev
      const [item] = devices.splice(index, 1)
      devices.splice(newIndex, 0, item)
      return { ...prev, devices }
    })
  }, [])

  const updateDevice = useCallback((index: number, field: keyof PropertyFormData['devices'][number], value: string) => {
    setFormData((prev) => {
      const devices = [...prev.devices]
      devices[index] = { ...devices[index], [field]: value }
      return { ...prev, devices }
    })
  }, [])

  const addContact = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', role: 'HOST', phone: '', email: '', whatsapp: '' }],
    }))
  }, [])

  const removeContact = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }))
  }, [])

  const moveContact = useCallback((index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const contacts = [...prev.contacts]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= contacts.length) return prev
      const [item] = contacts.splice(index, 1)
      contacts.splice(newIndex, 0, item)
      return { ...prev, contacts }
    })
  }, [])

  const updateContact = useCallback((index: number, field: keyof PropertyFormData['contacts'][number], value: string) => {
    setFormData((prev) => {
      const contacts = [...prev.contacts]
      contacts[index] = { ...contacts[index], [field]: value }
      return { ...prev, contacts }
    })
  }, [])

  const addRecommendation = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      recommendations: [
        ...prev.recommendations,
        { name: '', category: '', description: '', address: '', mapUrl: '', instagram: '', image: '', distance: '' },
      ],
    }))
  }, [])

  const removeRecommendation = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index),
    }))
  }, [])

  const moveRecommendation = useCallback((index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const recommendations = [...prev.recommendations]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= recommendations.length) return prev
      const [item] = recommendations.splice(index, 1)
      recommendations.splice(newIndex, 0, item)
      return { ...prev, recommendations }
    })
  }, [])

  const updateRecommendation = useCallback((index: number, field: keyof PropertyFormData['recommendations'][number], value: string) => {
    setFormData((prev) => {
      const recommendations = [...prev.recommendations]
      recommendations[index] = { ...recommendations[index], [field]: value }
      return { ...prev, recommendations }
    })
  }, [])

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
      ...(includeRegionInCompletion
        ? [{ label: 'Região', filled: formData.recommendations.length > 0, step: 7 }]
        : []),
    ]
    const filledCount = checks.filter((c) => c.filled).length
    const progress = Math.round((filledCount / checks.length) * 100)
    return { checks, progress, filledCount, total: checks.length }
  }, [formData, includeRegionInCompletion])

  const validateStep = useCallback(
    (step: number): boolean => {
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
          if (requireDevicesAndContacts && formData.devices.length === 0) {
            toast.error('Adicione pelo menos um equipamento')
            return false
          }
          if (formData.devices.some((d) => !d.name.trim())) {
            toast.error('Todos os equipamentos precisam ter um nome')
            return false
          }
          return true
        case 6:
          if (requireDevicesAndContacts && formData.contacts.length === 0) {
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
    },
    [formData, requireDevicesAndContacts]
  )

  return {
    formData,
    setFormData,
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
  }
}
