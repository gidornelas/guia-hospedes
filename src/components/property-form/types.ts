export interface Device {
  name: string
  type: string
  instructions: string
  brand: string
}

export interface Contact {
  name: string
  role: string
  phone: string
  email: string
  whatsapp: string
}

export interface Recommendation {
  name: string
  category: string
  description: string
  address: string
  mapUrl: string
  instagram: string
  image: string
  distance: string
}

export interface PropertyFormData {
  name: string
  internalCode: string
  type: string
  address: string
  city: string
  state: string
  welcomeMessage: string
  shortDescription: string
  checkInTime: string
  checkInInstructions: string
  checkInAccessMethod: string
  checkOutTime: string
  checkOutInstructions: string
  wifiNetwork: string
  wifiPassword: string
  rulesSilence: string
  rulesVisits: string
  rulesPets: boolean
  rulesSmoking: boolean
  rulesParties: boolean
  devices: Device[]
  contacts: Contact[]
  recommendations: Recommendation[]
}
