import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { decode } from 'punycode'

export interface UserToken {
  userId: string
  userRole: string
  groupId: string
  userName: string
  // whatever else is in the JWT.
}

export const authGet = async <T extends unknown>(url: string) => {
  // We will augment the request with our token in the header.
  const headers = {
    'x-access-token': localStorage.getItem('token'),
  }

  const { data } = await axios.get<T>(url, { headers })

  return data
}

export const authPost = async (url: string, data: any) => {
  // We will augment the request with our token in the header.
  const headers = {
    'x-access-token': localStorage.getItem('token'),
  }

  const response = await axios.post(url, data, { headers })

  return response.status
}

export const authUpdate = async (url: string, data: any) => {
  // We will augment the request with our token in the header.
  const headers = {
    'x-access-token': localStorage.getItem('token'),
  }

  const response = await axios.put(url, data, { headers })

  return response.status
}

export const authDelete = async (url: string) => {
  // We will augment the request with our token in the header.
  const headers = {
    'x-access-token': localStorage.getItem('token'),
  }

  const response = await axios.delete(url, { headers })

  return response.status
}

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error() // TODO: Do something softer than throwing an error.

  const decodedToken = jwt_decode<UserToken>(token)
  return decodedToken
}

export const hasToken = () => {
  const userToken = localStorage.getItem('token')
  return !!userToken
}
