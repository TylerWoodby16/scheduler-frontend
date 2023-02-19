import axios from 'axios'

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
