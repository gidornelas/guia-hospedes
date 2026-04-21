export interface PropertyWithRelations {
  id: string
  name: string
  internalCode: string | null
  type: string
  address: string | null
  city: string | null
  state: string | null
  country: string
  welcomeMessage: string | null
  shortDescription: string | null
  organizationId: string
  slug: string
  status: string
  coverImage: string | null
  createdAt: Date
  updatedAt: Date
  checkIn?: {
    time: string | null
    instructions: string | null
    accessMethod: string | null
    notes: string | null
  } | null
  checkOut?: {
    time: string | null
    instructions: string | null
    exitChecklist: string | null
  } | null
  wifi?: {
    networkName: string
    password: string
    notes: string | null
  } | null
  rules?: {
    silence: string | null
    visits: string | null
    pets: boolean
    smoking: boolean
    parties: boolean
    trash: string | null
    equipmentUse: string | null
    notes: string | null
  } | null
  devices: Array<{
    id: string
    name: string
    type: string
    instructions: string | null
    brand: string | null
  }>
  contacts: Array<{
    id: string
    name: string
    role: string
    phone: string | null
    email: string | null
    whatsapp: string | null
  }>
  recommendations: Array<{
    id: string
    name: string
    category: string
    description: string | null
    link: string | null
    distance: string | null
  }>
  links: Array<{
    id: string
    label: string
    url: string
    type: string
  }>
  guide?: {
    id: string
    status: string
    slug: string
    version: number
    publishedAt: Date | null
  } | null
}

export interface GuidePublicData {
  property: {
    name: string
    welcomeMessage: string | null
    shortDescription: string | null
    coverImage: string | null
    city: string | null
    state: string | null
  }
  checkIn: PropertyWithRelations['checkIn']
  checkOut: PropertyWithRelations['checkOut']
  wifi: PropertyWithRelations['wifi']
  rules: PropertyWithRelations['rules']
  devices: PropertyWithRelations['devices']
  contacts: PropertyWithRelations['contacts']
  recommendations: PropertyWithRelations['recommendations']
  links: PropertyWithRelations['links']
}
