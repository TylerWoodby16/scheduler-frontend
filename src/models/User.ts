import userEvent from '@testing-library/user-event'

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
  photoId?: PhotoId
  commercialLicense?: CommercialLicense
  medicalCertificate?: MedicalCertificate
  flightInstructorCertificate?: FlightInstructorCertifcate
  tsaCitizenship?: TSACitizenship
  tsaSecurity?: TSASecurity
  currency141?: Currency141
  endorsements?: Endorsements
  aircraftCheckout?: AircraftCheckOut

  roles: Role[]
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface PhotoId {
  number: number
  experationDate: string
  //TODO add Image s3 HELP ME OVER LORD BEZOS SELL ME A SHOVEL ON MY WAY TO MINE THE GOLD
  //Image Later
  //Image Later
}

export interface CommercialLicense {
  certificateType: string
  certification: number
  issuedDate: string
  noLongerCurrentDate: string
  // below  could possibly be an array
  categoryClass: string
  // below  could possibly be an array
  ratingsEndorsements: string
  // below  could possibly be an array
  restrictionsLimitations: string
}

export interface MedicalCertificate {
  class: string
  number: number
  dateOfBirth: string
  examDate: string
  firstClassPrivExp: string
  secondClassPrivExp: string
  thirdClassPrivExp: string
  restrictionsLimitations: string
}

export interface FlightInstructorCertifcate {
  number: number
  issuedDate: string
  expiration: string
  categoryClass: string
  ratingsEndorsements: string
  restrictionsLimitations: string
}

export interface TSACitizenship {
  type: string

  //TODO add Image s3 HELP ME OVER LORD BEZOS SELL ME A SHOVEL ON MY WAY TO MINE THE GOLD
  //Image Later
  //Image Later
}

export interface TSASecurity {
  date: number
  expiration: string
  employeId: number
  trainer: string
}

export interface Currency141 {
  expiration: string
  //Image Later
}

export interface Endorsements {
  date: string
  nameOfEndorsments: string
}

export interface AircraftCheckOut {
  makeModel: string
}

export type Role = 'Admin' | 'CFI' | 'Student'
