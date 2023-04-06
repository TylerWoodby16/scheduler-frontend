export interface Aircraft {
  _id: string
  groupId: string
  name: string
  year: number
  annualCheckDate: string
  vorCheckDate: string
  oneHundredHourCheck: number
  airworthinessDirectives?: AirworthinessDirective[]
  eltCheckDate: string
  transponderCheckDate: string
  altimeterCheckDate: string
}

export interface AirworthinessDirective {
  name: string
  dateOfCheck: string
  dateOfNextCheck: string
  hourCheck: number
  hourNextCheck: number
  isHour: boolean
}
