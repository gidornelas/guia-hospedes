export type Locale = 'pt-BR' | 'en' | 'es'

export interface TranslationDictionary {
  common: {
    skipToContent: string
    backToHome: string
    host: string
    callHost: string
    whatsappHost: string
    emailHost: string
    copy: string
    copied: string
    available: string
    noInfo: string
    stepByStep: string
    note: string
    importantNote: string
    howToConnect: string
    openInMaps: string
    viewMore: string
    recommendations: string
    seeOnInstagram: string
    seeOnMaps: string
    call: string
    email: string
    link: string
    poweredBy: string
    guideSubtitle: string
  }
  hub: {
    officialGuide: string
    welcome: string
    welcomeFallback: string
    firstSteps: string
    allAboutProperty: string
    checkIn: string
    wifi: string
    contacts: string
    checkOut: string
    rules: string
    devices: string
    tips: string
    usefulLinks: string
  }
  checkIn: {
    title: string
    subtitle: string
    checkInTime: string
    timeToBeArranged: string
    contactHostIfLate: string
    beforeArrival: string
    beforeArrivalDesc: string
    onArrival: string
    onArrivalFallback: string
    duringStay: string
    duringStayDesc: string
    accessMethod: string
    arrivalInstructions: string
    address: string
  }
  checkOut: {
    title: string
    subtitle: string
    checkOutTime: string
    timeToBeArranged: string
    lateCheckoutNote: string
    onCheckoutDay: string
    beforeLeaving: string
    beforeLeavingDesc: string
    afterLeaving: string
    afterLeavingDesc: string
    exitChecklist: string
    checklistHint: string
    exitInstructions: string
  }
  wifi: {
    title: string
    subtitle: string
    networkName: string
    password: string
    connectionTip: string
    connectionTipDesc: string
    notes: string
  }
  rules: {
    title: string
    subtitle: string
    coexistenceRules: string
    coexistenceDesc: string
    silence: string
    silenceLabel: string
    visits: string
    visitsLabel: string
    petsWelcome: string
    petsWelcomeDesc: string
    noPets: string
    noPetsDesc: string
    smokingAllowed: string
    smokingAllowedDesc: string
    noSmoking: string
    noSmokingDesc: string
    eventsAllowed: string
    eventsAllowedDesc: string
    noEvents: string
    noEventsDesc: string
    equipmentCare: string
    notes: string
  }
  devices: {
    title: string
    subtitle: string
    intro: string
    brand: string
    instructions: string
  }
  contacts: {
    title: string
    subtitle: string
    yourHost: string
    emergency: string
    otherContacts: string
    call: string
    whatsapp: string
    email: string
  }
  tips: {
    title: string
    subtitle: string
    intro: string
    recommendation: string
    recommendations: string
  }
  links: {
    title: string
    subtitle: string
    typeLabels: Record<string, string>
  }
  pdf: {
    generalInfo: string
    type: string
    internalCode: string
    checkInCheckOut: string
    checkIn: string
    checkOut: string
    time: string
    instructions: string
    access: string
    wifi: string
    network: string
    password: string
    rules: string
    allowed: string
    notAllowed: string
    contacts: string
    phone: string
    devices: string
    tips: string
    distance: string
    usefulLinks: string
    footer: string
  }
}
