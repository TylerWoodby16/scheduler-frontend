export interface User {
  // TODO: find out if I need to get the user _id and groupId
  // if so what types do they need to be ??
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
  groupId: string
  emergencyContact?: EmergencyContact
  photoId?: String | HTMLImageElement
  commercialLicense?: string
  medicalCertificate?: String | HTMLImageElement
  flightInstructorCertificate?: String | HTMLImageElement
  tsaCitizenship?: String | HTMLImageElement
  tsaSecurity?: String | HTMLImageElement
  currency141?: String | HTMLImageElement
  endorsements?: String | HTMLImageElement
  aircraftCheckout?: String | HTMLImageElement

  role?: 'Admin' | 'CFI' | 'User'
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}
