import axios from 'axios'
// const jwt = require('jsonwebtoken')
// import * as jwt_decode from 'jwt-decode'
// import jwt_decode from 'jwt-decode'
// import jwt_decode, { JwtPayload } from 'jwt-decode'
// @ts-ignore
import jwt_decode from 'jwt-decode'

interface MyToken {
  userId: string
  userRole: string
  groupId: string
  userName: string
  // whatever else is in the JWT.
}
// type customJwtPayload = JwtPayload & { userId: string }
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

// TODO: SET UP A FUNCTION TO DECODE THE TOKEN. WILL NEED TO USE JWT-DECODE.
export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error()
  // const decodedToken = jwt_decode<customJwtPayload>(token)
  const decodedToken = jwt_decode<MyToken>(token)
  if (!decodedToken) throw new Error()

  const userName = decodedToken.userName

  return userName

  // TODO: make sure to delete the jose package!!
}
