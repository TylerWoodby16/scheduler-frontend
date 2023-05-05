export interface User {
  // TODO: find out if I need to get the user _id and groupId
  // if so what types do they need to be ??
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
  groupId: string

  role: 'Admin' | 'CFI' | 'User'
}
