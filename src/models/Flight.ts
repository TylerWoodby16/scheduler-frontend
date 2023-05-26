import { Aircraft } from './Aircraft'
import { User } from './User'

export interface Flight {
  _id: string
  groupId: string
  userStudent: User
  userInstructor: User
  aircraft: Aircraft
  time: number
  type: string
}
